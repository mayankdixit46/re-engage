import Papa from 'papaparse';
import { ColumnMapping } from '@/types/subscriber';

export interface CSVParseResult {
  headers: string[];
  rows: Record<string, string>[];
  suggestedMapping: ColumnMapping;
}

export function parseCSVFile(file: File): Promise<CSVParseResult> {
  return new Promise((resolve, reject) => {
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: 'greedy',
      transformHeader: (h) => h.trim(),
      complete: (results) => {
        const headers = results.meta.fields || [];
        const rows = results.data || [];        const suggestedMapping = detectColumnMapping(headers);
        resolve({ headers, rows, suggestedMapping });
      },
      error: (error) => {
        reject(error);
      },
    });
  });
}

export function parseCSVText(csvText: string): CSVParseResult {
  const results = Papa.parse<Record<string, string>>(csvText, {
    header: true,
    skipEmptyLines: 'greedy',
    transformHeader: (h) => h.trim(),
  });
  const headers = results.meta.fields || [];
  const rows = results.data || [];
  const suggestedMapping = detectColumnMapping(headers);
  return { headers, rows, suggestedMapping };
}

export function detectColumnMapping(headers: string[]): ColumnMapping {
  const mapping: ColumnMapping = {
    email: '',
  };

  const findMatch = (keywords: string[]): string => {
    for (const kw of keywords) {
      const match = headers.find((h) => h.toLowerCase().includes(kw));
      if (match) return match;
    }
    return '';
  };

  mapping.email = findMatch(['email', 'e-mail', 'mail_address', 'recipient']);
  mapping.firstName = findMatch(['first_name', 'firstname', 'first name', 'given name', 'fname']);
  mapping.lastName = findMatch(['last_name', 'lastname', 'last name', 'family name', 'lname']);
  mapping.signupDate = findMatch(['created', 'signup', 'sign_up', 'subscribed', 'added', 'joined']);
  mapping.lastOpenedDate = findMatch(['last_open', 'last open', 'last_opened', 'opened_at', 'last_activity']);
  mapping.lastClickedDate = findMatch(['last_click', 'last click', 'last_clicked', 'clicked_at']);
  mapping.openCount = findMatch(['open_count', 'opens', 'total_opens', 'number_of_opens']);
  mapping.clickCount = findMatch(['click_count', 'clicks', 'total_clicks', 'number_of_clicks']);
  mapping.totalEmailsSent = findMatch(['emails_sent', 'sent_count', 'total_sent', 'sends']);

  // Fallbacks if no exact match found
  if (!mapping.email && headers.length > 0) {
    mapping.email = headers[0];
  }

  return mapping;
}
