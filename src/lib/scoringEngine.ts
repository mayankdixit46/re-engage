import {
  Subscriber,
  ColumnMapping,
  ThresholdConfig,
  BucketStats,
  DeliverabilityMetrics,
  BucketType,
} from '@/types/subscriber';

export const DEFAULT_THRESHOLDS: ThresholdConfig = {
  activeDays: 90,
  atRiskDays: 180,
  minOpensForActive: 1,
};

export function processSubscribers(
  rawRows: Record<string, string>[],
  mapping: ColumnMapping,
  thresholds: ThresholdConfig = DEFAULT_THRESHOLDS,
  referenceDate: Date = new Date()
): Subscriber[] {
  return rawRows.map((row, index) => {
    const email = (row[mapping.email] || '').trim();
    const firstName = mapping.firstName ? row[mapping.firstName]?.trim() : undefined;
    const lastName = mapping.lastName ? row[mapping.lastName]?.trim() : undefined;
    const signupDate = mapping.signupDate ? row[mapping.signupDate]?.trim() : undefined;
    const lastOpenedDate = mapping.lastOpenedDate ? row[mapping.lastOpenedDate]?.trim() : undefined;
    const lastClickedDate = mapping.lastClickedDate ? row[mapping.lastClickedDate]?.trim() : undefined;

    const openCount = mapping.openCount ? parseInt(row[mapping.openCount] || '0', 10) : 0;
    const clickCount = mapping.clickCount ? parseInt(row[mapping.clickCount] || '0', 10) : 0;
    const totalEmailsSent = mapping.totalEmailsSent ? parseInt(row[mapping.totalEmailsSent] || '0', 10) : 10;

    // Parse dates to find most recent engagement date
    const openDateObj = parseFlexibleDate(lastOpenedDate);
    const clickDateObj = parseFlexibleDate(lastClickedDate);
    
    let latestEngagementDate: Date | null = null;
    if (openDateObj && clickDateObj) {
      latestEngagementDate = openDateObj > clickDateObj ? openDateObj : clickDateObj;
    } else {
      latestEngagementDate = openDateObj || clickDateObj;
    }

    let daysSinceLastActivity: number | null = null;
    if (latestEngagementDate) {
      const diffMs = referenceDate.getTime() - latestEngagementDate.getTime();
      daysSinceLastActivity = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
    }

    // Engagement Score Calculation (0 - 100)
    let score = 0;
    if (daysSinceLastActivity !== null) {
      // Recency component (0-60 points)
      if (daysSinceLastActivity <= 14) score += 60;
      else if (daysSinceLastActivity <= 30) score += 50;
      else if (daysSinceLastActivity <= 60) score += 40;
      else if (daysSinceLastActivity <= 90) score += 30;
      else if (daysSinceLastActivity <= 180) score += 15;
      else score += 5;
    }

    // Frequency / Action component (0-40 points)
    const openRate = totalEmailsSent > 0 ? (openCount || (daysSinceLastActivity !== null && daysSinceLastActivity <= 90 ? 3 : 0)) / totalEmailsSent : 0;
    const clickBonus = Math.min(20, (clickCount || 0) * 5);
    score += Math.min(20, Math.round(openRate * 20)) + clickBonus;
    score = Math.min(100, Math.max(0, score));

    // Determine Bucket
    let bucket: BucketType = 'inactive';
    const hasEngagedEver = (daysSinceLastActivity !== null) || openCount > 0 || clickCount > 0;

    if (hasEngagedEver && daysSinceLastActivity !== null) {
      if (daysSinceLastActivity <= thresholds.activeDays) {
        bucket = 'active';
      } else if (daysSinceLastActivity <= thresholds.atRiskDays) {
        bucket = 'at-risk';
      } else {
        bucket = 'inactive';
      }
    } else {
      // Never opened/clicked or no date recorded
      bucket = 'inactive';
    }

    return {
      id: `sub_${index}_${Date.now()}`,
      email: email || `subscriber_${index + 1}@example.com`,
      firstName,
      lastName,
      signupDate,
      lastOpenedDate,
      lastClickedDate,
      openCount: isNaN(openCount) ? 0 : openCount,
      clickCount: isNaN(clickCount) ? 0 : clickCount,
      totalEmailsSent: isNaN(totalEmailsSent) ? 10 : totalEmailsSent,
      daysSinceLastActivity,
      engagementScore: score,
      bucket,
      originalData: row,
    };
  });
}

export function calculateBucketStats(subscribers: Subscriber[]): BucketStats {
  const total = subscribers.length;
  if (total === 0) {
    return {
      total: 0,
      activeCount: 0,
      atRiskCount: 0,
      inactiveCount: 0,
      activePct: 0,
      atRiskPct: 0,
      inactivePct: 0,
    };
  }

  let activeCount = 0;
  let atRiskCount = 0;
  let inactiveCount = 0;

  subscribers.forEach((s) => {
    const effectiveBucket = s.manualOverrideBucket || s.bucket;
    if (effectiveBucket === 'active') activeCount++;
    else if (effectiveBucket === 'at-risk') atRiskCount++;
    else inactiveCount++;
  });

  return {
    total,
    activeCount,
    atRiskCount,
    inactiveCount,
    activePct: Math.round((activeCount / total) * 100),
    atRiskPct: Math.round((atRiskCount / total) * 100),
    inactivePct: Math.round((inactiveCount / total) * 100),
  };
}

export function calculateDeliverabilityMetrics(subscribers: Subscriber[]): DeliverabilityMetrics {
  const stats = calculateBucketStats(subscribers);
  const total = stats.total;

  if (total === 0) {
    return {
      before: {
        listSize: 0,
        projectedOpenRate: 0,
        projectedClickRate: 0,
        spamRiskLevel: 'Low',
        inboxPlacementPct: 98,
        monthlyEspCost: 0,
      },
      after: {
        listSize: 0,
        projectedOpenRate: 0,
        projectedClickRate: 0,
        spamRiskLevel: 'Low',
        inboxPlacementPct: 98,
        monthlyEspCost: 0,
        costSavingsMonthly: 0,
        openRateBoostPct: 0,
        deliverabilityBoostPct: 0,
      },
    };
  }

  // Active + At-Risk = Cleaned list
  const cleanedListSize = stats.activeCount + stats.atRiskCount;

  // Compute baseline engagement
  // Inactive subscribers have ~0% open rate. Active ~42% open rate. At-Risk ~18% open rate.
  const activeOpensEstimate = stats.activeCount * 0.42;
  const atRiskOpensEstimate = stats.atRiskCount * 0.18;
  const totalOpensEstimate = activeOpensEstimate + atRiskOpensEstimate;

  const beforeOpenRate = Math.round((totalOpensEstimate / total) * 100);
  const afterOpenRate = cleanedListSize > 0 ? Math.round((totalOpensEstimate / cleanedListSize) * 100) : 0;

  const beforeClickRate = Math.round((beforeOpenRate * 0.18) * 10) / 10;
  const afterClickRate = Math.round((afterOpenRate * 0.22) * 10) / 10;

  // Spam Risk Assessment based on inactive subscriber percentage
  let beforeSpamRisk: 'Low' | 'Medium' | 'High' | 'Critical' = 'Low';
  let beforeInboxPlacement = 94;

  if (stats.inactivePct >= 40) {
    beforeSpamRisk = 'Critical';
    beforeInboxPlacement = 62;
  } else if (stats.inactivePct >= 25) {
    beforeSpamRisk = 'High';
    beforeInboxPlacement = 74;
  } else if (stats.inactivePct >= 15) {
    beforeSpamRisk = 'Medium';
    beforeInboxPlacement = 85;
  }

  const afterSpamRisk: 'Low' | 'Medium' | 'High' | 'Critical' = 'Low';
  const afterInboxPlacement = 97;

  // ESP Cost estimation ($0.012 per contact / month average)
  const costPerContact = 0.012;
  const beforeMonthlyCost = Math.round(total * costPerContact);
  const afterMonthlyCost = Math.round(cleanedListSize * costPerContact);
  const costSavingsMonthly = Math.max(0, beforeMonthlyCost - afterMonthlyCost);

  const openRateBoostPct = Math.max(0, afterOpenRate - beforeOpenRate);
  const deliverabilityBoostPct = afterInboxPlacement - beforeInboxPlacement;

  return {
    before: {
      listSize: total,
      projectedOpenRate: beforeOpenRate,
      projectedClickRate: beforeClickRate,
      spamRiskLevel: beforeSpamRisk,
      inboxPlacementPct: beforeInboxPlacement,
      monthlyEspCost: beforeMonthlyCost,
    },
    after: {
      listSize: cleanedListSize,
      projectedOpenRate: afterOpenRate,
      projectedClickRate: afterClickRate,
      spamRiskLevel: afterSpamRisk,
      inboxPlacementPct: afterInboxPlacement,
      monthlyEspCost: afterMonthlyCost,
      costSavingsMonthly,
      openRateBoostPct,
      deliverabilityBoostPct,
    },
  };
}

function parseFlexibleDate(dateStr?: string): Date | null {
  if (!dateStr || !dateStr.trim()) return null;

  const cleaned = dateStr.trim();
  const dateObj = new Date(cleaned);
  if (!isNaN(dateObj.getTime())) {
    return dateObj;
  }

  // Try parsing YYYY-MM-DD or MM/DD/YYYY formats
  const parts = cleaned.split(/[-/.]/);
  if (parts.length === 3) {
    if (parts[0].length === 4) {
      // YYYY-MM-DD
      return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    } else if (parts[2].length === 4) {
      // MM/DD/YYYY
      return new Date(parseInt(parts[2]), parseInt(parts[0]) - 1, parseInt(parts[1]));
    }
  }

  return null;
}
