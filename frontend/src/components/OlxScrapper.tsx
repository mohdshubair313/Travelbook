'use client';

import Image from 'next/image';
import { useState } from 'react';

// TypeScript interface - scraped item ka structure define karta hai
interface ScrapedItem {
  id: string;
  title: string;
  description: string;
  price: string;
  priceRaw: number;
  location: string;
  bedrooms?: string;
  bathrooms?: string;
  category: string;
  publishedAt: string;
  url: string;
  mainImage: string | null;
  seller: {
    name: string;
    isVerified: boolean;
  };
}

export default function OLXScraper() {
  // ========== STATE MANAGEMENT ==========
  // Step 1: Location state - user kaun sa city select karega
  const [location, setLocation] = useState('all-india');
  
  // Step 2: Category state - user kaun sa category filter karega (hotels, pg, etc.)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Step 3: Price range state - user kaun sa price range select karega
  const [priceRange, setPriceRange] = useState<string>('all');
  
  // Step 4: Max pages state - kitne pages scrape karne hain
  const [maxPages, setMaxPages] = useState(3);
  
  // Step 5: Loading state - jab scraping chal rahi ho tab true hoga
  const [loading, setLoading] = useState(false);
  
  // Step 6: Data state - scraped items yaha store honge
  const [data, setData] = useState<ScrapedItem[]>([]);
  
  // Step 7: Error state - agar koi error aaye
  const [error, setError] = useState('');

  // ========== CATEGORIES ARRAY ==========
  // Step 8: Categories array - ye sare filter buttons ke liye
  const categories = [
    { id: 'hotels', label: '🏨 Hotels', icon: '🏨' },
    { id: 'pg', label: '🏠 PG & Hostel', icon: '🏠' },
    { id: 'rent-house', label: '🏘️ Rent House', icon: '🏘️ ' },
    { id: 'flats', label: '🏢 Flats for Sale', icon: '🏢' },
    { id: 'cars', label: '🚗 Cars', icon: '🚗' },
    { id: 'bikes', label: '🏍️ Bikes', icon: '🏍️' },
  ];

  // ========== PRICE RANGES ARRAY ==========
  // Step 9: Price ranges array - dropdown ke options
  const priceRanges = [
    { id: 'all', label: 'All Prices', min: undefined, max: undefined },
    { id: '0-5000', label: '₹0 - ₹5,000', min: 0, max: 5000 },
    { id: '5000-10000', label: '₹5,000 - ₹10,000', min: 5000, max: 10000 },
    { id: '10000-20000', label: '₹10,000 - ₹20,000', min: 10000, max: 20000 },
    { id: '20000-50000', label: '₹20,000 - ₹50,000', min: 20000, max: 50000 },
    { id: '50000+', label: '₹50,000+', min: 50000, max: undefined },
  ];

  // ========== SCRAPING FUNCTION ==========
  // Step 10: Main scraping function - jab user "Start Scraping" click kare
  const handleScrape = async () => {
    // Step 11: Loading true karo, errors clear karo, previous data clear karo
    setLoading(true);
    setError('');
    setData([]);

    try {
      // Step 12: Selected price range ka min/max nikalo
      const selectedPriceRange = priceRanges.find(range => range.id === priceRange);
      
      // Step 13: API ko call karo POST method se
      const response = await fetch('/api/scrape-olx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: selectedCategory,  // Selected category bhejo
          location: location,          // Selected location bhejo
          maxPages: maxPages,          // Kitne pages scrape karne hain
          minPrice: selectedPriceRange?.min,  // Minimum price filter
          maxPrice: selectedPriceRange?.max   // Maximum price filter
        })
      });

      // Step 14: Response ko JSON mein convert karo
      const result = await response.json();

      // Step 15: Agar success hai to data set karo, nahi to error set karo
      if (result.success) {
        setData(result.data);
      } else {
        setError(result.error);
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Json me convert nahi hua...');
    } finally {
      // Step 17: Loading false karo (success ho ya fail)
      setLoading(false);
    }
  };

  // ========== JSX RETURN ==========
  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Step 25: Page heading */}
      <h1 className="text-3xl font-bold mb-6">OLX Scraper with Filters</h1>
      
      {/* ========== CATEGORY FILTER BUTTONS ========== */}
      {/* Step 26: Category buttons container */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Select Category:</h2>
        
        {/* Step 27: Buttons grid layout */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Step 28: Har category ke liye button render karo */}
          {categories.map((cat) => (
            <button
              key={cat.id}  // Unique key for React
              
              // Step 29: Click handler - category select karo ya deselect karo
              onClick={() => setSelectedCategory(
                selectedCategory === cat.id ? null : cat.id  // Toggle logic
              )}
              
              // Step 30: Dynamic className - selected button ka alag color
              className={`
                p-4 rounded-lg border-2 transition-all
                ${selectedCategory === cat.id  // Agar ye category selected hai
                  ? 'border-blue-600 bg-blue-50 text-blue-700'  // Selected style
                  : 'border-gray-300 hover:border-blue-400'     // Default style
                }
              `}
            >
              {/* Step 31: Button text with icon */}
              <div className="text-2xl mb-1">{cat.icon}</div>
              <div className="text-sm font-medium">{cat.label}</div>
            </button>
          ))}
        </div>
        
        {/* Step 32: Selected category display */}
        {selectedCategory && (
          <div className="mt-3 text-sm text-gray-600">
            Selected: <span className="font-semibold">
              {categories.find(c => c.id === selectedCategory)?.label}
            </span>
          </div>
        )}
      </div>

      {/* ========== LOCATION & PRICE FILTERS ========== */}
      {/* Step 33: Filters container */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        
        {/* Step 34: Location dropdown */}
        <div>
          <label className="block mb-2 font-medium text-sm">Location</label>
          <select 
            value={location}  // Current selected location
            onChange={(e) => setLocation(e.target.value)}  // Update on change
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all-india">All India</option>
            <option value="delhi">Delhi</option>
            <option value="mumbai">Mumbai</option>
            <option value="bangalore">Bangalore</option>
            <option value="hyderabad">Hyderabad</option>
            <option value="pune">Pune</option>
          </select>
        </div>
        
        {/* Step 35: Price range dropdown */}
        <div>
          <label className="block mb-2 font-medium text-sm">Price Range</label>
          <select 
            value={priceRange}  // Current selected price range
            onChange={(e) => setPriceRange(e.target.value)}  // Update on change
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {/* Step 36: Har price range option render karo */}
            {priceRanges.map((range) => (
              <option key={range.id} value={range.id}>
                {range.label}
              </option>
            ))}
          </select>
        </div>
        
        {/* Step 37: Max pages input */}
        <div>
          <label className="block mb-2 font-medium text-sm">Max Pages</label>
          <input 
            type="number"
            value={maxPages}  // Current value
            onChange={(e) => setMaxPages(Number(e.target.value))}  // Update on change
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            min="1"
            max="10"
          />
        </div>
      </div>
      
      {/* ========== SCRAPE BUTTON ========== */}
      {/* Step 38: Start scraping button */}
      <button
        onClick={handleScrape}  // Click pe handleScrape function call hoga
        disabled={loading}  // Loading time disable rahega
        className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
      >
        {/* Step 39: Button text - loading state based */}
        {loading ? '⏳ Scraping...' : '🚀 Start Scraping'}
      </button>
      
      {/* ========== ERROR DISPLAY ========== */}
      {/* Step 40: Error message display (agar error hai to) */}
      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {/* ========== RESULTS DISPLAY ========== */}
      {/* Step 41: Results section (agar data hai to) */}
      {data.length > 0 && (
        <div className="mt-8">
          {/* Step 42: Results header with count and download button */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">
              Found {data.length} items
              {/* Step 43: Show applied filters */}
              {selectedCategory && (
                <span className="text-sm text-gray-600 ml-2">
                  in {categories.find(c => c.id === selectedCategory)?.label}
                </span>
              )}
            </h2>
            
          </div>
          
          {/* Step 45: Items grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Step 46: Har item ke liye card render karo */}
            {data.map((item) => (
              <div 
                key={item.id}  // Unique key
                className="border rounded-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Step 47: Main image (agar hai to) */}
                {item.mainImage && (
                  <Image 
                    src={item.mainImage} 
                    alt={item.title}
                    className="w-full h-48 object-cover"
                    width={500}
                    height={300}
                  />
                )}
                
                {/* Step 48: Card content */}
                <div className="p-4">
                  {/* Step 49: Category badge */}
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {item.category}
                  </span>
                  
                  {/* Step 50: Title */}
                  <h3 className="font-bold text-lg mt-2 mb-2 line-clamp-2">
                    {item.title}
                  </h3>
                  
                  {/* Step 51: Price - highlighted */}
                  <p className="text-2xl font-bold text-green-600 mb-2">
                    {item.price}
                  </p>
                  
                  {/* Step 52: Location */}
                  <p className="text-gray-600 text-sm mb-2">
                    📍 {item.location}
                  </p>
                  
                  {/* Step 53: Bedrooms/bathrooms (agar available hai) */}
                  {(item.bedrooms || item.bathrooms) && (
                    <div className="flex gap-3 text-sm text-gray-600 mb-2">
                      {item.bedrooms && <span>🛏️ {item.bedrooms} BHK</span>}
                      {item.bathrooms && <span>🚿 {item.bathrooms} Bath</span>}
                    </div>
                  )}
                  
                  {/* Step 54: Seller info */}
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <span>👤 {item.seller.name}</span>
                    {item.seller.isVerified && (
                      <span className="text-green-600">✓ Verified</span>
                    )}
                  </div>
                  
                  {/* Step 55: View on OLX button */}
                  <a 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block text-center bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
                  >
                    View on OLX →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
