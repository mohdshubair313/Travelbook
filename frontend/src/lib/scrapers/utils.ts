// Shared utilities for web scraping

import { getRandomUserAgent } from './constants';

// Random delay between requests (2-4 seconds)
export async function randomDelay(minMs: number = 2000, maxMs: number = 4000): Promise<void> {
  const delay = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  console.log(`⏳ Waiting ${delay}ms before next request...`);
  await new Promise(resolve => setTimeout(resolve, delay));
}

// Parse duration string to minutes
export function parseDuration(durationStr: string): number {
  // Examples: "17h 00m", "8h 30m", "5h", "45m"
  let totalMinutes = 0;

  const hourMatch = durationStr.match(/(\d+)\s*h/i);
  const minMatch = durationStr.match(/(\d+)\s*m/i);

  if (hourMatch) {
    totalMinutes += parseInt(hourMatch[1]) * 60;
  }
  if (minMatch) {
    totalMinutes += parseInt(minMatch[1]);
  }

  return totalMinutes;
}

// Format duration from minutes
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins.toString().padStart(2, '0')}m`;
}

// Parse price string to number
export function parsePrice(priceStr: string): number | null {
  if (!priceStr || priceStr === '-' || priceStr === 'N/A') {
    return null;
  }

  // Remove currency symbols, commas, and spaces
  const cleaned = priceStr.replace(/[₹,\s]/g, '').trim();
  const parsed = parseInt(cleaned);

  return isNaN(parsed) ? null : parsed;
}

// Format price for display
export function formatPrice(price: number | null | undefined): string {
  if (price === null || price === undefined) {
    return 'N/A';
  }
  return `₹${price.toLocaleString('en-IN')}`;
}

// Clean and normalize train name
export function normalizeTrainName(name: string): string {
  return name
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s-]/g, '')
    .trim();
}

// Parse running days from various formats
export function parseRunningDays(daysStr: string): string[] {
  const allDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  if (!daysStr || daysStr.toLowerCase() === 'daily') {
    return allDays;
  }

  const days: string[] = [];
  const daysLower = daysStr.toLowerCase();

  // Check for abbreviated day names
  const dayPatterns = [
    { pattern: /mon|m(?![aot])/i, day: 'Mon' },
    { pattern: /tue|tu/i, day: 'Tue' },
    { pattern: /wed|w(?!ed)/i, day: 'Wed' },
    { pattern: /thu|th/i, day: 'Thu' },
    { pattern: /fri|f/i, day: 'Fri' },
    { pattern: /sat|sa/i, day: 'Sat' },
    { pattern: /sun|su/i, day: 'Sun' },
  ];

  dayPatterns.forEach(({ pattern, day }) => {
    if (pattern.test(daysLower) && !days.includes(day)) {
      days.push(day);
    }
  });

  // Sort days in correct order
  return days.sort((a, b) => allDays.indexOf(a) - allDays.indexOf(b));
}

// Extract train number from string
export function extractTrainNumber(str: string): string {
  const match = str.match(/\d{4,5}/);
  return match ? match[0] : '';
}

// Retry wrapper for flaky operations
export async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 2000
): Promise<T> {
  let lastError: Error | null = null;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      console.warn(`Attempt ${i + 1} failed:`, lastError.message);

      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }

  throw lastError;
}

// Get browser launch options for Playwright
export function getBrowserOptions() {
  return {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
      '--window-size=1920,1080',
    ],
  };
}

// Get page context options
export function getContextOptions() {
  return {
    userAgent: getRandomUserAgent(),
    viewport: { width: 1920, height: 1080 },
    locale: 'en-IN',
    timezoneId: 'Asia/Kolkata',
  };
}

// Log scraping progress
export function logProgress(current: number, total: number, message: string): void {
  const percentage = Math.round((current / total) * 100);
  console.log(`[${percentage}%] ${message}`);
}

// Validate scraped data
export function validateTrainData(data: {
  trainNumber?: string;
  trainName?: string;
  fromStation?: string;
  toStation?: string;
}): boolean {
  return !!(
    data.trainNumber &&
    data.trainName &&
    data.fromStation &&
    data.toStation
  );
}
