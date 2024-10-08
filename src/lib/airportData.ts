// airportData.ts

interface Airport {
    iataCode: string;
    name: string;
    city: string;
    country: string;
  }
  
  const airports: Airport[] = [
    { iataCode: 'ATL', name: 'Hartsfield-Jackson Atlanta International Airport', city: 'Atlanta', country: 'USA' },
    { iataCode: 'PEK', name: 'Beijing Capital International Airport', city: 'Beijing', country: 'China' },
    { iataCode: 'HND', name: 'Tokyo Haneda Airport', city: 'Tokyo', country: 'Japan' },
    { iataCode: 'LAX', name: 'Los Angeles International Airport', city: 'Los Angeles', country: 'USA' },
    { iataCode: 'ORD', name: "O'Hare International Airport", city: 'Chicago', country: 'USA' },
    { iataCode: 'LHR', name: 'London Heathrow Airport', city: 'London', country: 'UK' },
    { iataCode: 'HKG', name: 'Hong Kong International Airport', city: 'Hong Kong', country: 'China' },
    { iataCode: 'PVG', name: 'Shanghai Pudong International Airport', city: 'Shanghai', country: 'China' },
    { iataCode: 'CDG', name: 'Charles de Gaulle Airport', city: 'Paris', country: 'France' },
    { iataCode: 'AMS', name: 'Amsterdam Airport Schiphol', city: 'Amsterdam', country: 'Netherlands' },
    { iataCode: 'DEL', name: 'Indira Gandhi International Airport', city: 'New Delhi', country: 'India' },
    { iataCode: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany' },
    { iataCode: 'DFW', name: 'Dallas/Fort Worth International Airport', city: 'Dallas', country: 'USA' },
    { iataCode: 'ICN', name: 'Incheon International Airport', city: 'Seoul', country: 'South Korea' },
    { iataCode: 'IST', name: 'Istanbul Airport', city: 'Istanbul', country: 'Turkey' },
    { iataCode: 'CGK', name: 'Soekarno-Hatta International Airport', city: 'Jakarta', country: 'Indonesia' },
    { iataCode: 'SIN', name: 'Singapore Changi Airport', city: 'Singapore', country: 'Singapore' },
    { iataCode: 'DEN', name: 'Denver International Airport', city: 'Denver', country: 'USA' },
    { iataCode: 'BKK', name: 'Suvarnabhumi Airport', city: 'Bangkok', country: 'Thailand' },
    { iataCode: 'JFK', name: 'John F. Kennedy International Airport', city: 'New York', country: 'USA' },
    { iataCode: 'KUL', name: 'Kuala Lumpur International Airport', city: 'Kuala Lumpur', country: 'Malaysia' },
    { iataCode: 'MAD', name: 'Adolfo Suárez Madrid–Barajas Airport', city: 'Madrid', country: 'Spain' },
    { iataCode: 'SFO', name: 'San Francisco International Airport', city: 'San Francisco', country: 'USA' },
    { iataCode: 'LGW', name: 'London Gatwick Airport', city: 'London', country: 'UK' },
    { iataCode: 'BCN', name: 'Barcelona–El Prat Airport', city: 'Barcelona', country: 'Spain' },
    { iataCode: 'MUC', name: 'Munich Airport', city: 'Munich', country: 'Germany' },
    { iataCode: 'ZRH', name: 'Zurich Airport', city: 'Zurich', country: 'Switzerland' },
    { iataCode: 'SYD', name: 'Sydney Airport', city: 'Sydney', country: 'Australia' },
    { iataCode: 'YYZ', name: 'Toronto Pearson International Airport', city: 'Toronto', country: 'Canada' },
    { iataCode: 'FCO', name: 'Leonardo da Vinci International Airport', city: 'Rome', country: 'Italy' },
    { iataCode: 'LAS', name: 'McCarran International Airport', city: 'Las Vegas', country: 'USA' },
    { iataCode: 'SEA', name: 'Seattle-Tacoma International Airport', city: 'Seattle', country: 'USA' },
    { iataCode: 'MCO', name: 'Orlando International Airport', city: 'Orlando', country: 'USA' },
    { iataCode: 'MEX', name: 'Mexico City International Airport', city: 'Mexico City', country: 'Mexico' },
    { iataCode: 'MIA', name: 'Miami International Airport', city: 'Miami', country: 'USA' },
    { iataCode: 'YVR', name: 'Vancouver International Airport', city: 'Vancouver', country: 'Canada' },
    { iataCode: 'JNB', name: 'O. R. Tambo International Airport', city: 'Johannesburg', country: 'South Africa' },
    { iataCode: 'VIE', name: 'Vienna International Airport', city: 'Vienna', country: 'Austria' },
    { iataCode: 'BNE', name: 'Brisbane Airport', city: 'Brisbane', country: 'Australia' },
    { iataCode: 'CPH', name: 'Copenhagen Airport', city: 'Copenhagen', country: 'Denmark' },
    { iataCode: 'DOH', name: 'Hamad International Airport', city: 'Doha', country: 'Qatar' },
    { iataCode: 'DUB', name: 'Dublin Airport', city: 'Dublin', country: 'Ireland' },
    { iataCode: 'GRU', name: 'São Paulo/Guarulhos International Airport', city: 'São Paulo', country: 'Brazil' },
    { iataCode: 'HEL', name: 'Helsinki-Vantaa Airport', city: 'Helsinki', country: 'Finland' },
    { iataCode: 'LIS', name: 'Lisbon Airport', city: 'Lisbon', country: 'Portugal' },
    { iataCode: 'MNL', name: 'Ninoy Aquino International Airport', city: 'Manila', country: 'Philippines' },
    { iataCode: 'OSL', name: 'Oslo Airport, Gardermoen', city: 'Oslo', country: 'Norway' },
    { iataCode: 'TPE', name: 'Taiwan Taoyuan International Airport', city: 'Taipei', country: 'Taiwan' },
    { iataCode: 'ARN', name: 'Stockholm Arlanda Airport', city: 'Stockholm', country: 'Sweden' },
    { iataCode: 'MXP', name: 'Milan Malpensa Airport', city: 'Milan', country: 'Italy' },
    { iataCode: 'MAN', name: 'Manchester Airport', city: 'Manchester', country: 'UK' },
    { iataCode: 'DME', name: 'Moscow Domodedovo Airport', city: 'Moscow', country: 'Russia' },
    { iataCode: 'AKL', name: 'Auckland Airport', city: 'Auckland', country: 'New Zealand' },
    { iataCode: 'CAI', name: 'Cairo International Airport', city: 'Cairo', country: 'Egypt' },
    { iataCode: 'BRU', name: 'Brussels Airport', city: 'Brussels', country: 'Belgium' },
    { iataCode: 'GVA', name: 'Geneva Airport', city: 'Geneva', country: 'Switzerland' },
    { iataCode: 'IAH', name: 'George Bush Intercontinental Airport', city: 'Houston', country: 'USA' },
    { iataCode: 'SVO', name: 'Sheremetyevo International Airport', city: 'Moscow', country: 'Russia' },
    { iataCode: 'MEL', name: 'Melbourne Airport', city: 'Melbourne', country: 'Australia' },
    { iataCode: 'BOS', name: 'Logan International Airport', city: 'Boston', country: 'USA' },
    { iataCode: 'PHX', name: 'Phoenix Sky Harbor International Airport', city: 'Phoenix', country: 'USA' },
    { iataCode: 'CTU', name: 'Chengdu Shuangliu International Airport', city: 'Chengdu', country: 'China' },
    { iataCode: 'SZX', name: "Shenzhen Bao'an International Airport", city: 'Shenzhen', country: 'China' },
    { iataCode: 'KIX', name: 'Kansai International Airport', city: 'Osaka', country: 'Japan' },
    { iataCode: 'PMI', name: 'Palma de Mallorca Airport', city: 'Palma de Mallorca', country: 'Spain' },
    { iataCode: 'BOM', name: 'Chhatrapati Shivaji Maharaj International Airport', city: 'Mumbai', country: 'India' },
    { iataCode: 'HAN', name: 'Noi Bai International Airport', city: 'Hanoi', country: 'Vietnam' },
    { iataCode: 'WAW', name: 'Warsaw Chopin Airport', city: 'Warsaw', country: 'Poland' },
    { iataCode: 'HAM', name: 'Hamburg Airport', city: 'Hamburg', country: 'Germany' },
    { iataCode: 'PHL', name: 'Philadelphia International Airport', city: 'Philadelphia', country: 'USA' },
    { iataCode: 'FLL', name: 'Fort Lauderdale–Hollywood International Airport', city: 'Fort Lauderdale', country: 'USA' },
    { iataCode: 'IAD', name: 'Washington Dulles International Airport', city: 'Washington D.C.', country: 'USA' },
    { iataCode: 'YUL', name: 'Montréal–Pierre Elliott Trudeau International Airport', city: 'Montreal', country: 'Canada' },
    { iataCode: 'BWI', name: 'Baltimore/Washington International Airport', city: 'Baltimore', country: 'USA' },
    { iataCode: 'SAN', name: 'San Diego International Airport', city: 'San Diego', country: 'USA' },
    { iataCode: 'TPA', name: 'Tampa International Airport', city: 'Tampa', country: 'USA' },
    { iataCode: 'PDX', name: 'Portland International Airport', city: 'Portland', country: 'USA' },
    { iataCode: 'STL', name: 'St. Louis Lambert International Airport', city: 'St. Louis', country: 'USA' },
    { iataCode: 'OAK', name: 'Oakland International Airport', city: 'Oakland', country: 'USA' },
    { iataCode: 'CLE', name: 'Cleveland Hopkins International Airport', city: 'Cleveland', country: 'USA' },
    { iataCode: 'MSY', name: 'Louis Armstrong New Orleans International Airport', city: 'New Orleans', country: 'USA' },
    { iataCode: 'RSW', name: 'Southwest Florida International Airport', city: 'Fort Myers', country: 'USA' },
    { iataCode: 'SMF', name: 'Sacramento International Airport', city: 'Sacramento', country: 'USA' },
    { iataCode: 'BDL', name: 'Bradley International Airport', city: 'Hartford', country: 'USA' },
    { iataCode: 'AUS', name: 'Austin–Bergstrom International Airport', city: 'Austin', country: 'USA' },
    { iataCode: 'CVG', name: 'Cincinnati/Northern Kentucky International Airport', city: 'Cincinnati', country: 'USA' },
    { iataCode: 'BHM', name: 'Birmingham-Shuttlesworth International Airport', city: 'Birmingham', country: 'USA' },
    { iataCode: 'DAL', name: 'Dallas Love Field', city: 'Dallas', country: 'USA' },
    { iataCode: 'SJC', name: 'Norman Y. Mineta San Jose International Airport', city: 'San Jose', country: 'USA' },
    { iataCode: 'ABQ', name: 'Albuquerque International Sunport', city: 'Albuquerque', country: 'USA' },
    { iataCode: 'IND', name: 'Indianapolis International Airport', city: 'Indianapolis', country: 'USA' },
    { iataCode: 'SNA', name: 'John Wayne Airport', city: 'Santa Ana', country: 'USA' },
    { iataCode: 'RDU', name: 'Raleigh-Durham International Airport', city: 'Raleigh', country: 'USA' },
    { iataCode: 'BUR', name: 'Hollywood Burbank Airport', city: 'Burbank', country: 'USA' },
    { iataCode: 'PBI', name: 'Palm Beach International Airport', city: 'West Palm Beach', country: 'USA' },
    { iataCode: 'ORF', name: 'Norfolk International Airport', city: 'Norfolk', country: 'USA' },
    { iataCode: 'OMA', name: 'Eppley Airfield', city: 'Omaha', country: 'USA' },
    { iataCode: 'YEG', name: 'Edmonton International Airport', city: 'Edmonton', country: 'Canada' },
    { iataCode: 'BHX', name: 'Birmingham Airport', city: 'Birmingham', country: 'UK' },
    { iataCode: 'ADL', name: 'Adelaide Airport', city: 'Adelaide', country: 'Australia' },
    { iataCode: 'DXB', name: 'Dubai International Airport', city: 'Dubai', country: 'United Arab Emirates' },
    { iataCode: 'RUH', name: 'King Khalid International Airport', city: 'Riyadh', country: 'Saudi Arabia' },
    { iataCode: 'JED', name: 'King Abdulaziz International Airport', city: 'Jeddah', country: 'Saudi Arabia' },
    {
        iataCode: 'BLR',
        name: 'Kempegowda International Airport',
        city: 'Bangalore',
        country: 'India'
      }
  ];
  
  export function searchAirports(keyword: string): Airport[] {
    const lowercasedKeyword = keyword.toLowerCase();
    return airports.filter(airport => 
      airport.iataCode.toLowerCase().includes(lowercasedKeyword) ||
      airport.name.toLowerCase().includes(lowercasedKeyword) ||
      airport.city.toLowerCase().includes(lowercasedKeyword) ||
      airport.country.toLowerCase().includes(lowercasedKeyword)
    );
  }
  
export { airports };
export type { Airport };
