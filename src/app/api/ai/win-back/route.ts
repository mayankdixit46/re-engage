import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { AiWinBackRequest, AiWinBackResponse } from '@/types/subscriber';

export async function POST(req: NextRequest) {
  try {
    const body: AiWinBackRequest = await req.json();
    const {
      brandName = 'Our Brand',
      industry = 'General',
      tone = 'Friendly',
      atRiskCount = 150,
      topInactivityPeriodDays = 120,
      specialOffer = '20% off your next purchase or exclusive VIP content access',
    } = body;

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `You are a world-class email deliverability and copywriting expert.
Create an irresistible 3-part Win-Back email campaign for ${atRiskCount} subscribers who haven't opened an email in ~${topInactivityPeriodDays} days.

Brand Name: ${brandName}
Industry/Niche: ${industry}
Desired Tone: ${tone}
Re-engagement Incentive/Value: ${specialOffer}

Return ONLY a valid JSON object matching this exact interface:
{
  "subjectLines": ["Subject Line 1", "Subject Line 2", "Subject Line 3"],
  "previewText": "Single preview snippet text",
  "emailBody": "Full email copy with linebreaks, warm greeting, value reminder, clear incentive, and polite opting out option if they prefer",
  "callToAction": "Primary button text",
  "reengagementStrategyNotes": "Brief 2-sentence rationale on why this copy will reactivate at-risk subscribers without causing spam complaints"
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        if (response.text) {
          const parsed: AiWinBackResponse = JSON.parse(response.text);
          return NextResponse.json(parsed);
        }
      } catch (err) {
        console.warn('Gemini API call failed, falling back to curated AI template:', err);
      }
    }

    // Fallback template when API key is not present or API call fails
    const fallbackResponse: AiWinBackResponse = generateFallbackWinBack(brandName, tone, specialOffer, topInactivityPeriodDays);
    return NextResponse.json(fallbackResponse);

  } catch (error) {
    console.error('Error generating win-back email:', error);
    return NextResponse.json(
      { error: 'Failed to generate win-back email sequence.' },
      { status: 500 }
    );
  }
}

function generateFallbackWinBack(
  brandName: string,
  tone: string,
  specialOffer: string,
  inactivityDays: number
): AiWinBackResponse {
  if (tone === 'Urgent') {
    return {
      subjectLines: [
        `Should we say goodbye? (Action required for ${brandName})`,
        `We're cleaning house — still want our emails?`,
        `Is this goodbye, {{first_name}}?`,
      ],
      previewText: `Confirm your subscription in 1-click or we'll stop bothering you.`,
      emailBody: `Hey {{first_name|there}},\n\nWe noticed you haven't opened our recent emails over the last ${inactivityDays} days. We respect your inbox space and hate spam as much as you do!\n\nIf you'd like to remain on the ${brandName} list and receive ${specialOffer}, click the button below to confirm.\n\nOtherwise, no action is needed — we will automatically remove you in 48 hours so your inbox stays clean.`,
      callToAction: `Yes, Keep Me Subscribed!`,
      reengagementStrategyNotes: `Urgency paired with an explicit zero-friction opt-out reduces spam complaints while instantly isolating high-intent subscribers.`,
    };
  }

  if (tone === 'Incentive' || tone === 'Value-First') {
    return {
      subjectLines: [
        `We missed you! Here's ${specialOffer}`,
        `A quick gift before we update our list...`,
        `{{first_name}}, here is your exclusive pass back to ${brandName}`,
      ],
      previewText: `Claim your exclusive gift inside — limited time re-engagement offer.`,
      emailBody: `Hi {{first_name|there}},\n\nIt's been a little while since we last connected at ${brandName}. We've published some of our best resources recently and didn't want you to miss out.\n\nTo welcome you back, we've put together a special offer: ${specialOffer}.\n\nClick below to claim your gift and confirm you want to stay in the loop!`,
      callToAction: `Claim My Offer & Stay Connected`,
      reengagementStrategyNotes: `Value-first framing converts passive subscribers by giving immediate tangible incentive before list sunsetting.`,
    };
  }

  // Friendly default
  return {
    subjectLines: [
      `Are we still on your radar? - ${brandName}`,
      `We noticed it's been a while, {{first_name}}`,
      `Quick question from the ${brandName} team`,
    ],
    previewText: `Let us know if you still want to receive updates, tips, and special offers.`,
    emailBody: `Hey {{first_name|there}},\n\nWe noticed you haven't had a chance to check out our updates recently. We know inboxes get crowded, and we only want to send content you actually look forward to.\n\nIf you still want to hear from us (plus get access to ${specialOffer}), just click below to confirm your interest.\n\nIf not, no worries at all! You can stay unsubscribed and we won't email you again.`,
    callToAction: `Yes! Keep Sending Updates`,
    reengagementStrategyNotes: `A friendly check-in creates low friction and protects deliverability by inviting non-responders to self-segment.`,
  };
}
