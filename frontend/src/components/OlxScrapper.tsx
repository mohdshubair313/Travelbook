'use client';

import Image from 'next/image';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Filter, Loader2, ExternalLink, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

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
  const [location, setLocation] = useState('all-india');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<string>('all');
  const [maxPages, setMaxPages] = useState(3);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ScrapedItem[]>([]);
  const [error, setError] = useState('');

  const categories = [
    { id: 'hotels', label: 'Hotels', icon: '🏨' },
    { id: 'pg', label: 'PG & Hostel', icon: '🏠' },
    { id: 'rent-house', label: 'Rent House', icon: '🏘️' },
    { id: 'flats', label: 'Flats', icon: '🏢' },
    { id: 'cars', label: 'Cars', icon: '🚗' },
    { id: 'bikes', label: 'Bikes', icon: '🏍️' },
  ];

  const priceRanges = [
    { id: 'all', label: 'All Prices', min: undefined, max: undefined },
    { id: '0-5000', label: '₹0 - ₹5,000', min: 0, max: 5000 },
    { id: '5000-10000', label: '₹5,000 - ₹10,000', min: 5000, max: 10000 },
    { id: '10000-20000', label: '₹10,000 - ₹20,000', min: 10000, max: 20000 },
    { id: '20000-50000', label: '₹20,000 - ₹50,000', min: 20000, max: 50000 },
    { id: '50000+', label: '₹50,000+', min: 50000, max: undefined },
  ];

  const handleScrape = async () => {
    if (!selectedCategory) {
      toast.error("Please select a category first");
      return;
    }

    setLoading(true);
    setError('');
    setData([]);
    toast.loading("Scraping OLX...", { id: "scrape-toast" });

    try {
      const selectedPriceRange = priceRanges.find(range => range.id === priceRange);

      const response = await fetch('/api/scrape-olx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: selectedCategory,
          location: location,
          maxPages: maxPages,
          minPrice: selectedPriceRange?.min,
          maxPrice: selectedPriceRange?.max
        })
      });

      const result = await response.json();

      if (result.success) {
        setData(result.data);
        toast.success(`Found ${result.data.length} items!`, { id: "scrape-toast" });
      } else {
        setError(result.error);
        toast.error(result.error, { id: "scrape-toast" });
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Failed to scrape';
      setError(msg);
      toast.error(msg, { id: "scrape-toast" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Filters Section */}
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-medium text-zinc-300 mb-4 flex items-center gap-2">
            <Filter size={20} className="text-indigo-400" />
            Select Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {categories.map((cat) => (
              <motion.button
                key={cat.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                className={`
                  p-4 rounded-xl border transition-all duration-200 flex flex-col items-center justify-center gap-2
                  ${selectedCategory === cat.id
                    ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                    : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-800/50'
                  }
                `}
              >
                <span className="text-2xl">{cat.icon}</span>
                <span className="text-sm font-medium">{cat.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
              <MapPin size={16} /> Location
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
            >
              <option value="all-india">All India</option>
              <option value="delhi">Delhi</option>
              <option value="mumbai">Mumbai</option>
              <option value="bangalore">Bangalore</option>
              <option value="hyderabad">Hyderabad</option>
              <option value="pune">Pune</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">Price Range</label>
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="w-full p-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
            >
              {priceRanges.map((range) => (
                <option key={range.id} value={range.id}>{range.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">Max Pages</label>
            <input
              type="number"
              value={maxPages}
              onChange={(e) => setMaxPages(Number(e.target.value))}
              className="w-full p-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
              min="1"
              max="10"
            />
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={handleScrape}
          disabled={loading}
          className={`
            w-full py-4 rounded-xl font-semibold text-white shadow-lg flex items-center justify-center gap-2 transition-all
            ${loading
              ? 'bg-zinc-800 cursor-not-allowed'
              : 'bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 shadow-indigo-500/20'
            }
          `}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" /> Scraping in progress...
            </>
          ) : (
            <>
              <Search size={20} /> Start Scraping
            </>
          )}
        </motion.button>
      </div>

      {/* Error State */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl flex items-center gap-3"
          >
            <AlertCircle size={20} />
            <p>{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Section */}
      <AnimatePresence>
        {data.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Results Found
                <span className="bg-indigo-500/20 text-indigo-300 text-sm px-2 py-0.5 rounded-full">
                  {data.length}
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-indigo-500/30 hover:shadow-[0_0_20px_rgba(99,102,241,0.1)] transition-all duration-300"
                >
                  <div className="relative h-48 overflow-hidden">
                    {item.mainImage ? (
                      <Image
                        src={item.mainImage}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-zinc-600">
                        No Image
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs px-2 py-1 rounded-full">
                      {item.category}
                    </div>
                  </div>

                  <div className="p-5 space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg text-white line-clamp-1 group-hover:text-indigo-400 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-zinc-500 text-sm flex items-center gap-1 mt-1">
                        <MapPin size={12} /> {item.location}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-xl font-bold text-emerald-400">
                        {item.price}
                      </p>
                      {(item.bedrooms || item.bathrooms) && (
                        <div className="text-xs text-zinc-500 flex gap-2">
                          {item.bedrooms && <span>{item.bedrooms} BHK</span>}
                          {item.bathrooms && <span>• {item.bathrooms} Bath</span>}
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-xs text-zinc-400">
                          {item.seller.name.charAt(0)}
                        </div>
                        <span className="text-sm text-zinc-400 truncate max-w-[100px]">
                          {item.seller.name}
                        </span>
                      </div>

                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                      >
                        View <ExternalLink size={14} />
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
