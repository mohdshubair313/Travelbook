// Train Scraper using Playwright
// Scrapes train data from ConfirmTkt

import { chromium, Browser, Page } from 'playwright';
import { TrainResult } from '@/types/train';
import {
  getStationCode,
  classifyTrainType,
  getRandomUserAgent,
} from './constants';
import {
  randomDelay,
  parsePrice,
  parseRunningDays,
  getBrowserOptions,
  retryOperation,
} from './utils';

// ConfirmTkt URL pattern
const CONFIRMTKT_BASE_URL = 'https://www.confirmtkt.com';

interface ScrapeOptions {
  maxTrains?: number;
  includeAvailability?: boolean;
}

// Main scraper class
export class TrainScraper {
  private browser: Browser | null = null;
  private page: Page | null = null;

  async init(): Promise<void> {
    console.log('🚀 Initializing browser...');
    this.browser = await chromium.launch(getBrowserOptions());
    const context = await this.browser.newContext({
      userAgent: getRandomUserAgent(),
      viewport: { width: 1920, height: 1080 },
      locale: 'en-IN',
      timezoneId: 'Asia/Kolkata',
    });
    this.page = await context.newPage();

    // Block unnecessary resources to speed up scraping
    await this.page.route('**/*', (route) => {
      const resourceType = route.request().resourceType();
      if (['image', 'stylesheet', 'font', 'media'].includes(resourceType)) {
        route.abort();
      } else {
        route.continue();
      }
    });

    console.log('✅ Browser initialized');
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
      console.log('🔒 Browser closed');
    }
  }

  // Scrape trains between two cities
  async scrapeTrains(
    fromCity: string,
    toCity: string,
    options: ScrapeOptions = {}
  ): Promise<TrainResult[]> {
    if (!this.page) {
      throw new Error('Browser not initialized. Call init() first.');
    }

    const { maxTrains = 50 } = options;

    // Get station codes
    const fromStation = getStationCode(fromCity);
    const toStation = getStationCode(toCity);

    if (!fromStation || !toStation) {
      throw new Error(
        `Invalid station: ${!fromStation ? fromCity : toCity}`
      );
    }

    console.log(
      `🔍 Scraping trains from ${fromStation.city} (${fromStation.code}) to ${toStation.city} (${toStation.code})`
    );

    const trains: TrainResult[] = [];

    try {
      // Build URL for ConfirmTkt
      const url = `${CONFIRMTKT_BASE_URL}/trains/${fromStation.code.toLowerCase()}-to-${toStation.code.toLowerCase()}`;
      console.log(`📡 Fetching: ${url}`);

      // Navigate to the page
      await this.page.goto(url, {
        waitUntil: 'domcontentloaded',
        timeout: 30000,
      });

      // Wait for train list to load
      await this.page.waitForSelector('.train-list, .train-item, [class*="train"]', {
        timeout: 15000,
      }).catch(() => {
        console.log('⚠️ Train list selector not found, trying alternative...');
      });

      // Additional wait for dynamic content
      await this.page.waitForTimeout(2000);

      // Try multiple selectors for train items
      const trainSelectors = [
        '.train-item',
        '.train-list-item',
        '[class*="trainItem"]',
        '[class*="train-card"]',
        'div[data-train]',
        '.search-result-item',
      ];

      let trainElements: any[] = [];
      for (const selector of trainSelectors) {
        trainElements = await this.page.$$(selector);
        if (trainElements.length > 0) {
          console.log(`✅ Found ${trainElements.length} trains using selector: ${selector}`);
          break;
        }
      }

      if (trainElements.length === 0) {
        // Try to extract from page content directly
        console.log('⚠️ No train elements found with standard selectors, trying content extraction...');
        const pageContent = await this.page.content();
        return this.extractTrainsFromHTML(pageContent, fromStation, toStation);
      }

      // Extract data from each train element
      for (let i = 0; i < Math.min(trainElements.length, maxTrains); i++) {
        try {
          const element = trainElements[i];
          const trainData = await this.extractTrainData(element, fromStation, toStation);

          if (trainData) {
            trains.push(trainData);
            console.log(`✅ ${i + 1}. ${trainData.trainNumber} - ${trainData.trainName}`);
          }
        } catch (error) {
          console.warn(`⚠️ Failed to extract train ${i + 1}:`, error);
        }
      }

      console.log(`\n📊 Scraped ${trains.length} trains successfully`);

    } catch (error) {
      console.error('❌ Scraping error:', error);
      throw error;
    }

    return trains;
  }

  // Extract train data from a single element
  private async extractTrainData(
    element: any,
    fromStation: { code: string; city: string; state: string },
    toStation: { code: string; city: string; state: string }
  ): Promise<TrainResult | null> {
    try {
      // Extract train number
      const trainNumberEl = await element.$('[class*="train-number"], [class*="trainNumber"], .train-no');
      const trainNumber = trainNumberEl
        ? (await trainNumberEl.textContent())?.trim().replace(/[^\d]/g, '')
        : await this.extractTextByPattern(element, /\d{5}/);

      if (!trainNumber) {
        return null;
      }

      // Extract train name
      const trainNameEl = await element.$('[class*="train-name"], [class*="trainName"], .train-name');
      const trainName = trainNameEl
        ? (await trainNameEl.textContent())?.trim()
        : `Train ${trainNumber}`;

      // Extract times
      const departureEl = await element.$('[class*="departure"], [class*="depart"], .dep-time');
      const arrivalEl = await element.$('[class*="arrival"], [class*="arrive"], .arr-time');
      const durationEl = await element.$('[class*="duration"], [class*="travel-time"], .duration');

      const departureTime = departureEl
        ? (await departureEl.textContent())?.trim() || ''
        : '';
      const arrivalTime = arrivalEl
        ? (await arrivalEl.textContent())?.trim() || ''
        : '';
      const duration = durationEl
        ? (await durationEl.textContent())?.trim() || ''
        : '';

      // Extract running days
      const daysEl = await element.$('[class*="running-days"], [class*="runs-on"], .days');
      const daysText = daysEl
        ? (await daysEl.textContent())?.trim() || 'Daily'
        : 'Daily';
      const runningDays = parseRunningDays(daysText);

      // Extract prices (multiple classes)
      const prices = await this.extractPrices(element);

      return {
        trainNumber: trainNumber || '',
        trainName: trainName || `Train ${trainNumber}`,
        trainType: classifyTrainType(trainName || ''),
        fromStation: fromStation.code,
        fromCity: fromStation.city,
        toStation: toStation.code,
        toCity: toStation.city,
        departureTime: this.cleanTime(departureTime),
        arrivalTime: this.cleanTime(arrivalTime),
        duration: duration || 'N/A',
        runningDays,
        ...prices,
        source: 'confirmtkt',
        sourceUrl: `${CONFIRMTKT_BASE_URL}/train/${trainNumber}`,
      };
    } catch (error) {
      console.error('Error extracting train data:', error);
      return null;
    }
  }

  // Extract prices from element
  private async extractPrices(element: any): Promise<{
    priceSleeper?: number;
    priceAC3?: number;
    priceAC2?: number;
    priceAC1?: number;
    priceGeneral?: number;
  }> {
    const prices: any = {};

    const priceSelectors = [
      { selector: '[class*="sleeper"], [class*="SL"]', key: 'priceSleeper' },
      { selector: '[class*="3ac"], [class*="3A"], [class*="ac3"]', key: 'priceAC3' },
      { selector: '[class*="2ac"], [class*="2A"], [class*="ac2"]', key: 'priceAC2' },
      { selector: '[class*="1ac"], [class*="1A"], [class*="ac1"]', key: 'priceAC1' },
      { selector: '[class*="general"], [class*="GN"]', key: 'priceGeneral' },
    ];

    for (const { selector, key } of priceSelectors) {
      try {
        const priceEl = await element.$(selector);
        if (priceEl) {
          const priceText = await priceEl.textContent();
          const price = parsePrice(priceText || '');
          if (price !== null) {
            prices[key] = price;
          }
        }
      } catch {
        // Price not found for this class
      }
    }

    return prices;
  }

  // Extract text by regex pattern
  private async extractTextByPattern(element: any, pattern: RegExp): Promise<string> {
    const text = await element.textContent();
    const match = text?.match(pattern);
    return match ? match[0] : '';
  }

  // Clean time string
  private cleanTime(time: string): string {
    // Extract HH:MM format
    const match = time.match(/\d{1,2}:\d{2}/);
    return match ? match[0] : time;
  }

  // Fallback: Extract trains from raw HTML
  private extractTrainsFromHTML(
    html: string,
    fromStation: { code: string; city: string; state: string },
    toStation: { code: string; city: string; state: string }
  ): TrainResult[] {
    const trains: TrainResult[] = [];

    // Extract train numbers (5-digit patterns)
    const trainNumberMatches = html.match(/\b\d{5}\b/g) || [];
    const uniqueNumbers = [...new Set(trainNumberMatches)];

    console.log(`📝 Found ${uniqueNumbers.length} potential train numbers in HTML`);

    // For each train number, try to find associated data
    uniqueNumbers.slice(0, 20).forEach((trainNumber, index) => {
      // Create basic train entry
      trains.push({
        trainNumber,
        trainName: `Train ${trainNumber}`,
        trainType: 'Express',
        fromStation: fromStation.code,
        fromCity: fromStation.city,
        toStation: toStation.code,
        toCity: toStation.city,
        departureTime: '',
        arrivalTime: '',
        duration: '',
        runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        source: 'confirmtkt',
      });
    });

    return trains;
  }
}

// Convenience function for one-time scraping
export async function scrapeTrains(
  fromCity: string,
  toCity: string,
  options?: ScrapeOptions
): Promise<TrainResult[]> {
  const scraper = new TrainScraper();

  try {
    await scraper.init();
    const trains = await scraper.scrapeTrains(fromCity, toCity, options);
    return trains;
  } finally {
    await scraper.close();
  }
}

// Scrape multiple routes
export async function scrapeMultipleRoutes(
  routes: Array<{ from: string; to: string }>,
  options?: ScrapeOptions
): Promise<Map<string, TrainResult[]>> {
  const scraper = new TrainScraper();
  const results = new Map<string, TrainResult[]>();

  try {
    await scraper.init();

    for (const route of routes) {
      const key = `${route.from}-${route.to}`;
      console.log(`\n🚂 Scraping route: ${route.from} → ${route.to}`);

      try {
        const trains = await scraper.scrapeTrains(route.from, route.to, options);
        results.set(key, trains);
      } catch (error) {
        console.error(`❌ Failed to scrape ${key}:`, error);
        results.set(key, []);
      }

      // Delay between routes
      await randomDelay(3000, 5000);
    }
  } finally {
    await scraper.close();
  }

  return results;
}
