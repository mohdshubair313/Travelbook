// app/api/scrape-olx/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/auth'; // Prisma client import

// ✅ TypeScript Interface - Scraped data ka structure
interface ScrapedItem {
  olxId: string;           // OLX listing ID (unique identifier)
  title: string;           // Listing title
  description: string;     // Full description
  category: string;        // Category name ("PG & Guest Houses")
  price: string;           // Display price "₹ 5,000"
  priceRaw: number;        // Numeric price for filtering
  location: string;        // Full location string
  city: string;            // City name for filtering
  state: string;           // State name
  bedrooms: number | null; // Number of bedrooms (null if not applicable)
  bathrooms: number | null; // Number of bathrooms
  furnishing: string | null; // Furnishing status
  images: string[];        // Array of image URLs
  mainImage: string | null; // Primary image URL
  sellerName: string;      // Seller's name
  sellerVerified: boolean; // Is seller verified
  publishedAt: string;     // Publication date
  url: string;             // OLX listing URL
}

// ✅ Location codes - OLX internal location IDs with coordinates
const LOCATION_CODES: Record<string, { code: string; lat: number; lon: number }> = {
  'all-india': { code: '1000001', lat: 20.5937, lon: 78.9629 },
  'delhi': { code: '2001152', lat: 28.7041, lon: 77.1025 },
  'mumbai': { code: '4058877', lat: 19.0760, lon: 72.8777 },
  'bangalore': { code: '4058404', lat: 12.9716, lon: 77.5946 },
  'hyderabad': { code: '4029711', lat: 17.3850, lon: 78.4867 },
  'pune': { code: '4058900', lat: 18.5204, lon: 73.8567 },
  'chennai': { code: '4058461', lat: 13.0827, lon: 80.2707 },
  'kolkata': { code: '4058742', lat: 22.5726, lon: 88.3639 },
};

// ✅ Category IDs - OLX internal category codes
const CATEGORY_IDS: Record<string, string> = {
  'pg': '1449',              // PG & Guest Houses
  'rent-house': '1723',      // Houses for Rent
  'flats': '1725',           // Flats for Sale
  'furniture': '239',        // Furniture
};

// ✅ Subtype filters - For PG category subcategories
const SUBTYPE_FILTERS: Record<string, string> = {
  'pg': 'pg,roommate',       // Both PG and Roommate listings
  'pg-only': 'pg',           // Only PG listings
  'roommate': 'roommate',    // Only Roommate listings
};

export async function POST(request: Request) {
  try {
    // ✅ Extract request parameters from POST body
    const { 
      location = 'all-india',  // Default to all India if not specified
      maxPages = 3,            // Number of pages to scrape (default 3)
      category,                // Category filter (pg, rent-house, etc.)
      minPrice,                // Minimum price filter
      maxPrice,                // Maximum price filter
      subtype = 'pg',          // Subtype for PG category
    } = await request.json();
    
    console.log('📥 Scraping Request:', { location, maxPages, category, minPrice, maxPrice });
    
    // ✅ Get location data (code and coordinates) from LOCATION_CODES
    const locationData = LOCATION_CODES[location] || LOCATION_CODES['all-india'];
    
    // ✅ Array to store all scraped items before saving to DB
    const allItems: ScrapedItem[] = [];
    
    // ✅ Loop through multiple pages for scraping
    for (let page = 1; page <= maxPages; page++) {
      // ✅ OLX API endpoint (POST request, not GET)
      const apiUrl = 'https://www.olx.in/api/relevance/v2/search';
      
      // ✅ Build POST request payload (not URL parameters!)
      const payload: any = {
        lang: 'en-IN',                    // Language: English-India
        location: locationData.code,       // Location code (e.g., "2001152" for Delhi)
        page: page,                        // Current page number
        platform: 'web-mobile',            // Platform identifier
        size: 40,                          // Results per page (40 items)
        facet_limit: 1000,                 // Facet limit for filters
        location_facet_limit: 40,          // Location facet limit
        relaxedFilters: true,              // Enable relaxed filtering
        pttEnabled: true,                  // Enable PTT feature
      };
      
      // ✅ Add category filter if selected
      if (category && CATEGORY_IDS[category]) {
        payload.category = CATEGORY_IDS[category];
        console.log(`🏷️ Category: ${category} (ID: ${CATEGORY_IDS[category]})`);
      }
      
      // ✅ Add price filters as direct parameters
      if (minPrice) {
        payload.price_min = minPrice;  // Minimum price filter
      }
      if (maxPrice) {
        payload.price_max = maxPrice;  // Maximum price filter
      }
      
      // ✅ Add subtype filter for PG category
      if (category === 'pg' && SUBTYPE_FILTERS[subtype]) {
        payload.subtype = SUBTYPE_FILTERS[subtype];
        // ✅ Nested filters for advanced PG filtering
        payload['nested-filters'] = JSON.stringify({
          subtype: [{ pg: {} }, { roommate: {} }]
        });
      }
      
      console.log(`\n🔍 Page ${page} Payload:`, JSON.stringify(payload, null, 2));
      
      // ✅ Make POST request to OLX API (NOT GET!)
      const response = await fetch(apiUrl, {
        method: 'POST',  // IMPORTANT: POST method, not GET
        headers: {
          'Content-Type': 'application/json',  // JSON content type
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', // Browser user agent
          'Accept': 'application/json',  // Accept JSON response
          'Accept-Language': 'en-IN,en;q=0.9',  // Language preference
          'Referer': 'https://www.olx.in/',  // Referer header
          'Origin': 'https://www.olx.in',  // Origin header
        },
        body: JSON.stringify(payload)  // ✅ Send payload as JSON body
      });
      
      console.log(`✅ Response Status: ${response.status}`);
      
      // ✅ Check if response is successful
      if (!response.ok) {
        console.error(`❌ API Error: ${response.status} ${response.statusText}`);
        throw new Error(`API returned status ${response.status}`);
      }
      
      // ✅ Parse JSON response
      const jsonData = await response.json();
      console.log(`📦 Items received: ${jsonData.data?.length || 0}`);
      
      // ✅ Process response data
      if (jsonData.data && Array.isArray(jsonData.data)) {
        let addedCount = 0;
        
        // ✅ Loop through each item in response
        for (const item of jsonData.data) {
          // ✅ Skip ads and inactive listings
          if (!item.ad_id || item.status?.status !== 'active') {
            console.log(`⏭️ Skipping: ${item.title || 'Unknown'} (not active)`);
            continue;  // Skip to next item
          }
          
          // ✅ Extract price as number for filtering
          const itemPriceRaw = item.price?.value?.raw || 0;
          
          // ✅ Client-side price filtering (if needed)
          if (minPrice && itemPriceRaw < minPrice) {
            console.log(`💰 Too cheap (₹${itemPriceRaw} < ₹${minPrice}): ${item.title}`);
            continue;  // Skip this item
          }
          
          if (maxPrice && itemPriceRaw > maxPrice) {
            console.log(`💰 Too expensive (₹${itemPriceRaw} > ₹${maxPrice}): ${item.title}`);
            continue;  // Skip this item
          }
          
          // ✅ Extract city and state from location data
          const cityName = item.locations_resolved?.ADMIN_LEVEL_3_name || 'Unknown';
          const stateName = item.locations_resolved?.ADMIN_LEVEL_1_name || '';
          
          // ✅ Build image URLs (OLX uses Apollo CDN)
          const images = item.images?.map((img: any) => 
            `https://apollo.olx.in/v1/files/${img.external_id}/image`
          ) || [];
          
          const mainImage = item.images?.[0]
            ? `https://apollo.olx.in/v1/files/${item.images[0].external_id}/image`
            : null;
          
          // ✅ Extract structured item data matching Prisma schema
          const extractedItem: ScrapedItem = {
            olxId: item.id || item.ad_id,  // Unique OLX ID
            title: item.title || '',  // Listing title
            description: item.description || '',  // Full description
            category: item.category?.name || category || '',  // Category name
            
            // ✅ Price data (both display and raw)
            price: item.price?.value?.display || 'Contact for Price',  // Display format
            priceRaw: itemPriceRaw,  // Numeric value for filtering
            
            // ✅ Location data
            location: `${cityName}, ${stateName}`.trim(),  // Combined location string
            city: cityName,  // City for filtering
            state: stateName,  // State name
            
            // ✅ Property details (from parameters array)
            bedrooms: item.parameters?.find((p: any) => p.key === 'rooms')?.value || null,
            bathrooms: item.parameters?.find((p: any) => p.key === 'bathrooms')?.value || null,
            furnishing: item.parameters?.find((p: any) => p.key === 'furnishing')?.value_name || null,
            
            // ✅ Images array
            images: images,
            mainImage: mainImage,
            
            // ✅ Seller information (from flat structure, not nested)
            sellerName: item.user_name || 'Unknown',
            sellerVerified: item.is_kyc_verified_user || false,
            
            // ✅ Metadata
            publishedAt: item.created_at_first || item.display_date || new Date().toISOString(),
            url: `https://www.olx.in/item/${item.id}`,  // Direct link to listing
          };
          
          allItems.push(extractedItem);
          addedCount++;
          
          console.log(`✅ ${addedCount}. ${item.title} - ${item.price?.value?.display}`);
        }
        
        console.log(`\n📊 Page ${page} Complete: ${addedCount} items added\n`);
      }
      
      // ✅ Respectful delay between pages to avoid rate limiting
      if (page < maxPages) {
        console.log('⏳ Waiting 1.5s before next page...');
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
    }
    
    console.log(`\n🎉 Scraping Complete! Total: ${allItems.length} items`);
    
    // ✅ SAVE TO DATABASE using Prisma
    let savedCount = 0;
    let updatedCount = 0;
    
    for (const item of allItems) {
      try {
        // ✅ Check if listing already exists in DB
        const existing = await prisma.listing.findUnique({
          where: { olxId: item.olxId }
        });
        
        // ✅ If price changed, record in PriceHistory
        if (existing && existing.priceRaw !== item.priceRaw) {
          await prisma.priceHistory.create({
            data: {
              olxId: item.olxId,
              price: item.priceRaw,
              currency: 'INR',
            }
          });
          console.log(`📊 Price change: ${item.olxId} - ₹${existing.priceRaw} → ₹${item.priceRaw}`);
        }
        
        // ✅ Upsert listing (update if exists, create if not)
        const saved = await prisma.listing.upsert({
          where: { olxId: item.olxId },
          update: {
            // ✅ Update existing listing with new data
            title: item.title,
            description: item.description,
            price: item.price,
            priceRaw: item.priceRaw,
            images: item.images,
            mainImage: item.mainImage,
            isActive: true,  // Mark as active (since we just scraped it)
            updatedAt: new Date(),
          },
          create: {
            // ✅ Create new listing with all data
            olxId: item.olxId,
            olxUrl: item.url,
            title: item.title,
            description: item.description,
            category: item.category,
            price: item.price,
            priceRaw: item.priceRaw,
            location: item.location,
            city: item.city,
            state: item.state,
            bedrooms: item.bedrooms,
            bathrooms: item.bathrooms,
            furnishing: item.furnishing,
            images: item.images,
            mainImage: item.mainImage,
            sellerName: item.sellerName,
            sellerVerified: item.sellerVerified,
            publishedAt: new Date(item.publishedAt),
            // ✅ Auto-calculate expiry (30 days from publish date)
            expiresAt: new Date(new Date(item.publishedAt).getTime() + 30 * 24 * 60 * 60 * 1000),
          }
        });
        
        if (existing) {
          updatedCount++;
        } else {
          savedCount++;
        }
        
      } catch (dbError: any) {
        console.error(`❌ DB Error for ${item.olxId}:`, dbError.message);
      }
    }
    
    console.log(`\n💾 Database: ${savedCount} new, ${updatedCount} updated`);
    
    // ✅ Return success response
    return NextResponse.json({
      success: true,
      data: allItems,  // Return scraped items
      count: allItems.length,  // Total count
      saved: savedCount,  // New listings saved
      updated: updatedCount,  // Existing listings updated
      timestamp: new Date().toISOString()  // Current timestamp
    });
    
  } catch (error: unknown) {
    // ✅ Error handling with proper type checking
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('❌ Scraping Error:', message);
    
    return NextResponse.json({
      success: false,
      error: message
    }, { status: 500 });
  }
}
