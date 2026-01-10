// Station codes and city mappings for Indian Railways

// Major Indian Railway Station Codes
export const STATION_CODES: Record<string, { code: string; city: string; state: string }> = {
  // Delhi NCR
  'new delhi': { code: 'NDLS', city: 'New Delhi', state: 'Delhi' },
  'delhi': { code: 'DLI', city: 'Delhi', state: 'Delhi' },
  'delhi junction': { code: 'DLI', city: 'Delhi', state: 'Delhi' },
  'hazrat nizamuddin': { code: 'NZM', city: 'New Delhi', state: 'Delhi' },
  'anand vihar': { code: 'ANVT', city: 'New Delhi', state: 'Delhi' },

  // Mumbai
  'mumbai': { code: 'CSTM', city: 'Mumbai', state: 'Maharashtra' },
  'mumbai central': { code: 'BCT', city: 'Mumbai', state: 'Maharashtra' },
  'mumbai cst': { code: 'CSTM', city: 'Mumbai', state: 'Maharashtra' },
  'dadar': { code: 'DR', city: 'Mumbai', state: 'Maharashtra' },
  'lokmanya tilak': { code: 'LTT', city: 'Mumbai', state: 'Maharashtra' },

  // Kolkata
  'kolkata': { code: 'HWH', city: 'Kolkata', state: 'West Bengal' },
  'howrah': { code: 'HWH', city: 'Kolkata', state: 'West Bengal' },
  'sealdah': { code: 'SDAH', city: 'Kolkata', state: 'West Bengal' },

  // Chennai
  'chennai': { code: 'MAS', city: 'Chennai', state: 'Tamil Nadu' },
  'chennai central': { code: 'MAS', city: 'Chennai', state: 'Tamil Nadu' },
  'chennai egmore': { code: 'MS', city: 'Chennai', state: 'Tamil Nadu' },

  // Bangalore
  'bangalore': { code: 'SBC', city: 'Bangalore', state: 'Karnataka' },
  'bengaluru': { code: 'SBC', city: 'Bangalore', state: 'Karnataka' },
  'yesvantpur': { code: 'YPR', city: 'Bangalore', state: 'Karnataka' },
  'ksr bangalore': { code: 'SBC', city: 'Bangalore', state: 'Karnataka' },

  // Hyderabad
  'hyderabad': { code: 'HYB', city: 'Hyderabad', state: 'Telangana' },
  'secunderabad': { code: 'SC', city: 'Hyderabad', state: 'Telangana' },

  // Pune
  'pune': { code: 'PUNE', city: 'Pune', state: 'Maharashtra' },

  // Ahmedabad
  'ahmedabad': { code: 'ADI', city: 'Ahmedabad', state: 'Gujarat' },

  // Jaipur
  'jaipur': { code: 'JP', city: 'Jaipur', state: 'Rajasthan' },

  // Lucknow
  'lucknow': { code: 'LKO', city: 'Lucknow', state: 'Uttar Pradesh' },
  'lucknow junction': { code: 'LJN', city: 'Lucknow', state: 'Uttar Pradesh' },

  // Patna
  'patna': { code: 'PNBE', city: 'Patna', state: 'Bihar' },

  // Varanasi
  'varanasi': { code: 'BSB', city: 'Varanasi', state: 'Uttar Pradesh' },

  // Goa
  'goa': { code: 'MAO', city: 'Madgaon', state: 'Goa' },
  'madgaon': { code: 'MAO', city: 'Madgaon', state: 'Goa' },

  // Bhopal
  'bhopal': { code: 'BPL', city: 'Bhopal', state: 'Madhya Pradesh' },

  // Chandigarh
  'chandigarh': { code: 'CDG', city: 'Chandigarh', state: 'Chandigarh' },

  // Amritsar
  'amritsar': { code: 'ASR', city: 'Amritsar', state: 'Punjab' },

  // Guwahati
  'guwahati': { code: 'GHY', city: 'Guwahati', state: 'Assam' },

  // Thiruvananthapuram
  'thiruvananthapuram': { code: 'TVC', city: 'Thiruvananthapuram', state: 'Kerala' },
  'trivandrum': { code: 'TVC', city: 'Thiruvananthapuram', state: 'Kerala' },

  // Kochi
  'kochi': { code: 'ERS', city: 'Kochi', state: 'Kerala' },
  'ernakulam': { code: 'ERS', city: 'Kochi', state: 'Kerala' },

  // Coimbatore
  'coimbatore': { code: 'CBE', city: 'Coimbatore', state: 'Tamil Nadu' },

  // Mysore
  'mysore': { code: 'MYS', city: 'Mysore', state: 'Karnataka' },
  'mysuru': { code: 'MYS', city: 'Mysore', state: 'Karnataka' },

  // Nagpur
  'nagpur': { code: 'NGP', city: 'Nagpur', state: 'Maharashtra' },

  // Indore
  'indore': { code: 'INDB', city: 'Indore', state: 'Madhya Pradesh' },

  // Kanpur
  'kanpur': { code: 'CNB', city: 'Kanpur', state: 'Uttar Pradesh' },

  // Agra
  'agra': { code: 'AGC', city: 'Agra', state: 'Uttar Pradesh' },
  'agra cantt': { code: 'AGC', city: 'Agra', state: 'Uttar Pradesh' },

  // Jammu
  'jammu': { code: 'JAT', city: 'Jammu', state: 'Jammu & Kashmir' },

  // Dehradun
  'dehradun': { code: 'DDN', city: 'Dehradun', state: 'Uttarakhand' },

  // Haridwar
  'haridwar': { code: 'HW', city: 'Haridwar', state: 'Uttarakhand' },

  // Ranchi
  'ranchi': { code: 'RNC', city: 'Ranchi', state: 'Jharkhand' },

  // Visakhapatnam
  'visakhapatnam': { code: 'VSKP', city: 'Visakhapatnam', state: 'Andhra Pradesh' },
  'vizag': { code: 'VSKP', city: 'Visakhapatnam', state: 'Andhra Pradesh' },

  // Vijayawada
  'vijayawada': { code: 'BZA', city: 'Vijayawada', state: 'Andhra Pradesh' },

  // Surat
  'surat': { code: 'ST', city: 'Surat', state: 'Gujarat' },

  // Vadodara
  'vadodara': { code: 'BRC', city: 'Vadodara', state: 'Gujarat' },
  'baroda': { code: 'BRC', city: 'Vadodara', state: 'Gujarat' },
};

// Popular city pairs for initial scraping
export const POPULAR_ROUTES: Array<{ from: string; to: string }> = [
  { from: 'new delhi', to: 'mumbai' },
  { from: 'new delhi', to: 'kolkata' },
  { from: 'new delhi', to: 'bangalore' },
  { from: 'new delhi', to: 'chennai' },
  { from: 'mumbai', to: 'bangalore' },
  { from: 'mumbai', to: 'chennai' },
  { from: 'mumbai', to: 'kolkata' },
  { from: 'chennai', to: 'bangalore' },
  { from: 'hyderabad', to: 'bangalore' },
  { from: 'new delhi', to: 'jaipur' },
  { from: 'new delhi', to: 'lucknow' },
  { from: 'new delhi', to: 'varanasi' },
  { from: 'new delhi', to: 'ahmedabad' },
  { from: 'pune', to: 'mumbai' },
  { from: 'hyderabad', to: 'chennai' },
];

// Train types classification
export const TRAIN_TYPES: Record<string, string[]> = {
  'Rajdhani': ['Rajdhani', 'rajdhani'],
  'Shatabdi': ['Shatabdi', 'shatabdi'],
  'Duronto': ['Duronto', 'duronto'],
  'Vande Bharat': ['Vande Bharat', 'vande bharat', 'Vandebharat'],
  'Garib Rath': ['Garib Rath', 'garib rath'],
  'Humsafar': ['Humsafar', 'humsafar'],
  'Tejas': ['Tejas', 'tejas'],
  'Superfast': ['SF', 'Superfast', 'superfast', 'S.F.'],
  'Express': ['Exp', 'Express', 'express', 'Mail'],
  'Passenger': ['Passenger', 'passenger', 'Pass'],
};

// Days of week mapping
export const DAYS_MAP: Record<string, string> = {
  'M': 'Mon',
  'T': 'Tue',
  'W': 'Wed',
  'Th': 'Thu',
  'F': 'Fri',
  'S': 'Sat',
  'Su': 'Sun',
  'Mon': 'Mon',
  'Tue': 'Tue',
  'Wed': 'Wed',
  'Thu': 'Thu',
  'Fri': 'Fri',
  'Sat': 'Sat',
  'Sun': 'Sun',
};

// User agents rotation for scraping
export const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15',
];

// Helper function to get station code from city name
export function getStationCode(cityName: string): { code: string; city: string; state: string } | null {
  const normalized = cityName.toLowerCase().trim();
  return STATION_CODES[normalized] || null;
}

// Helper function to get random user agent
export function getRandomUserAgent(): string {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

// Helper function to classify train type from train name
export function classifyTrainType(trainName: string): string {
  const nameLower = trainName.toLowerCase();

  for (const [type, keywords] of Object.entries(TRAIN_TYPES)) {
    if (keywords.some(keyword => nameLower.includes(keyword.toLowerCase()))) {
      return type;
    }
  }

  return 'Express'; // Default
}

// ==================== FLIGHT DATA ====================

// Major Indian Airport Codes
export const AIRPORT_CODES: Record<string, { code: string; name: string; city: string }> = {
  'new delhi': { code: 'DEL', name: 'Indira Gandhi International Airport', city: 'New Delhi' },
  'delhi': { code: 'DEL', name: 'Indira Gandhi International Airport', city: 'New Delhi' },
  'mumbai': { code: 'BOM', name: 'Chhatrapati Shivaji International Airport', city: 'Mumbai' },
  'bangalore': { code: 'BLR', name: 'Kempegowda International Airport', city: 'Bangalore' },
  'bengaluru': { code: 'BLR', name: 'Kempegowda International Airport', city: 'Bangalore' },
  'chennai': { code: 'MAA', name: 'Chennai International Airport', city: 'Chennai' },
  'kolkata': { code: 'CCU', name: 'Netaji Subhas Chandra Bose International Airport', city: 'Kolkata' },
  'hyderabad': { code: 'HYD', name: 'Rajiv Gandhi International Airport', city: 'Hyderabad' },
  'pune': { code: 'PNQ', name: 'Pune Airport', city: 'Pune' },
  'ahmedabad': { code: 'AMD', name: 'Sardar Vallabhbhai Patel International Airport', city: 'Ahmedabad' },
  'goa': { code: 'GOI', name: 'Goa International Airport', city: 'Goa' },
  'jaipur': { code: 'JAI', name: 'Jaipur International Airport', city: 'Jaipur' },
  'lucknow': { code: 'LKO', name: 'Chaudhary Charan Singh International Airport', city: 'Lucknow' },
  'kochi': { code: 'COK', name: 'Cochin International Airport', city: 'Kochi' },
  'thiruvananthapuram': { code: 'TRV', name: 'Trivandrum International Airport', city: 'Thiruvananthapuram' },
  'trivandrum': { code: 'TRV', name: 'Trivandrum International Airport', city: 'Thiruvananthapuram' },
  'guwahati': { code: 'GAU', name: 'Lokpriya Gopinath Bordoloi International Airport', city: 'Guwahati' },
  'patna': { code: 'PAT', name: 'Jay Prakash Narayan Airport', city: 'Patna' },
  'varanasi': { code: 'VNS', name: 'Lal Bahadur Shastri Airport', city: 'Varanasi' },
  'chandigarh': { code: 'IXC', name: 'Chandigarh International Airport', city: 'Chandigarh' },
  'amritsar': { code: 'ATQ', name: 'Sri Guru Ram Dass Jee International Airport', city: 'Amritsar' },
  'bhopal': { code: 'BHO', name: 'Raja Bhoj Airport', city: 'Bhopal' },
  'indore': { code: 'IDR', name: 'Devi Ahilyabai Holkar Airport', city: 'Indore' },
  'nagpur': { code: 'NAG', name: 'Dr. Babasaheb Ambedkar International Airport', city: 'Nagpur' },
  'coimbatore': { code: 'CJB', name: 'Coimbatore International Airport', city: 'Coimbatore' },
  'visakhapatnam': { code: 'VTZ', name: 'Visakhapatnam Airport', city: 'Visakhapatnam' },
  'vizag': { code: 'VTZ', name: 'Visakhapatnam Airport', city: 'Visakhapatnam' },
  'srinagar': { code: 'SXR', name: 'Sheikh ul-Alam International Airport', city: 'Srinagar' },
  'dehradun': { code: 'DED', name: 'Jolly Grant Airport', city: 'Dehradun' },
  'ranchi': { code: 'IXR', name: 'Birsa Munda Airport', city: 'Ranchi' },
  'raipur': { code: 'RPR', name: 'Swami Vivekananda Airport', city: 'Raipur' },
  'surat': { code: 'STV', name: 'Surat Airport', city: 'Surat' },
  'vadodara': { code: 'BDQ', name: 'Vadodara Airport', city: 'Vadodara' },
  'mangalore': { code: 'IXE', name: 'Mangalore International Airport', city: 'Mangalore' },
  'madurai': { code: 'IXM', name: 'Madurai Airport', city: 'Madurai' },
  'tiruchirappalli': { code: 'TRZ', name: 'Tiruchirappalli International Airport', city: 'Tiruchirappalli' },
  'udaipur': { code: 'UDR', name: 'Maharana Pratap Airport', city: 'Udaipur' },
  'jodhpur': { code: 'JDH', name: 'Jodhpur Airport', city: 'Jodhpur' },
};

// Indian Airlines
export const AIRLINES: Record<string, { name: string; code: string; logo?: string }> = {
  'indigo': { name: 'IndiGo', code: '6E', logo: 'indigo.png' },
  'air india': { name: 'Air India', code: 'AI', logo: 'airindia.png' },
  'spicejet': { name: 'SpiceJet', code: 'SG', logo: 'spicejet.png' },
  'vistara': { name: 'Vistara', code: 'UK', logo: 'vistara.png' },
  'akasa': { name: 'Akasa Air', code: 'QP', logo: 'akasa.png' },
  'air india express': { name: 'Air India Express', code: 'IX', logo: 'airindia-express.png' },
  'go first': { name: 'Go First', code: 'G8', logo: 'gofirst.png' },
  'alliance air': { name: 'Alliance Air', code: '9I', logo: 'allianceair.png' },
  'star air': { name: 'Star Air', code: 'S5', logo: 'starair.png' },
};

// Popular flight routes
export const POPULAR_FLIGHT_ROUTES: Array<{ from: string; to: string }> = [
  { from: 'new delhi', to: 'mumbai' },
  { from: 'new delhi', to: 'bangalore' },
  { from: 'mumbai', to: 'bangalore' },
  { from: 'new delhi', to: 'goa' },
  { from: 'mumbai', to: 'goa' },
  { from: 'bangalore', to: 'goa' },
  { from: 'new delhi', to: 'chennai' },
  { from: 'mumbai', to: 'chennai' },
  { from: 'new delhi', to: 'kolkata' },
  { from: 'mumbai', to: 'kolkata' },
  { from: 'bangalore', to: 'chennai' },
  { from: 'hyderabad', to: 'bangalore' },
  { from: 'new delhi', to: 'hyderabad' },
  { from: 'mumbai', to: 'hyderabad' },
  { from: 'new delhi', to: 'jaipur' },
];

// Helper function to get airport code from city name
export function getAirportCode(cityName: string): { code: string; name: string; city: string } | null {
  const normalized = cityName.toLowerCase().trim();
  return AIRPORT_CODES[normalized] || null;
}

// Helper function to get airline info
export function getAirlineInfo(airlineName: string): { name: string; code: string; logo?: string } | null {
  const normalized = airlineName.toLowerCase().trim();
  return AIRLINES[normalized] || null;
}
