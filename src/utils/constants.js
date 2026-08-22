/**
 * GlobeTrotter Constants & Mock Database
 */

export const POPULAR_DESTINATIONS = [
  {
    id: 'dest-1',
    name: 'Paris',
    country: 'France',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    description: 'The City of Light, famed for the Eiffel Tower, Louvre Museum, and romantic cafes.',
    rating: 4.9,
    tag: 'Romantic & Cultural',
    avgCostPerDay: 180,
    weather: '22°C Mild',
  },
  {
    id: 'dest-2',
    name: 'Tokyo',
    country: 'Japan',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80',
    description: 'Futuristic skyscrapers mixed with historic temples, world-class food, and vibrant street life.',
    rating: 4.95,
    tag: 'Tech & Culinary',
    avgCostPerDay: 160,
    weather: '19°C Pleasant',
  },
  {
    id: 'dest-3',
    name: 'Bali',
    country: 'Indonesia',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    description: 'Tropical paradise known for iconic rice terraces, ancient temples, and pristine beaches.',
    rating: 4.85,
    tag: 'Island & Resort',
    avgCostPerDay: 85,
    weather: '29°C Sunny',
  },
  {
    id: 'dest-4',
    name: 'New York City',
    country: 'USA',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80',
    description: 'The Big Apple with Broadway shows, Central Park, Statue of Liberty, and vibrant nightlife.',
    rating: 4.88,
    tag: 'Urban Adventure',
    avgCostPerDay: 220,
    weather: '18°C Clear',
  },
  {
    id: 'dest-5',
    name: 'Rome',
    country: 'Italy',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80',
    description: 'Historic city featuring the Colosseum, Roman Forum, Vatican Museums, and authentic pasta.',
    rating: 4.91,
    tag: 'History & Gastronomy',
    avgCostPerDay: 150,
    weather: '25°C Warm',
  },
  {
    id: 'dest-6',
    name: 'Goa',
    country: 'India',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    description: 'Golden beaches, vibrant shacks, Portuguese architecture, and laid-back coastal vibes.',
    rating: 4.75,
    tag: 'Beach & Nightlife',
    avgCostPerDay: 60,
    weather: '30°C Tropical',
  }
];

export const SAMPLE_ACTIVITIES = [
  { id: 'act-1', city: 'Paris', title: 'Louvre Museum Guided Tour', category: 'sightseeing', cost: 45, duration: '3 hrs', time: '10:00 AM' },
  { id: 'act-2', city: 'Paris', title: 'Seine River Evening Cruise', category: 'activity', cost: 35, duration: '2 hrs', time: '06:30 PM' },
  { id: 'act-3', city: 'Paris', title: 'Dinner at Le Petit Retro', category: 'food', cost: 65, duration: '2 hrs', time: '08:30 PM' },
  { id: 'act-4', city: 'Tokyo', title: 'TeamLab Planets Digital Art', category: 'activity', cost: 38, duration: '2.5 hrs', time: '11:00 AM' },
  { id: 'act-5', city: 'Tokyo', title: 'Shinjuku Ramen Tasting Walk', category: 'food', cost: 40, duration: '2 hrs', time: '07:00 PM' },
  { id: 'act-6', city: 'Bali', title: 'Ubud Rice Terrace & Swing', category: 'activity', cost: 25, duration: '4 hrs', time: '09:00 AM' },
  { id: 'act-7', city: 'Bali', title: 'Sunset Seafood Dinner at Jimbaran', category: 'food', cost: 45, duration: '2 hrs', time: '06:00 PM' },
];

export const INITIAL_TRIPS = [
  {
    id: 'trip-101',
    title: 'European Gateway & Culture Tour',
    destination: 'Paris, France',
    startDate: '2026-09-10',
    endDate: '2026-09-17',
    totalBudget: 2500,
    spentBudget: 1420,
    status: 'Upcoming',
    coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    description: 'Exploring iconic museums, cafes, and historic monuments across Paris.',
    itineraryDays: [
      {
        day: 1,
        date: '2026-09-10',
        title: 'Arrival & Eiffel Tower Walk',
        stops: [
          { id: 's1', time: '02:00 PM', title: 'Hotel Check-in at Le Marais', category: 'accommodation', cost: 300 },
          { id: 's2', time: '05:30 PM', title: 'Eiffel Tower Sunset View', category: 'sightseeing', cost: 30 },
          { id: 's3', time: '08:00 PM', title: 'Welcome Bistro Dinner', category: 'food', cost: 70 },
        ]
      },
      {
        day: 2,
        date: '2026-09-11',
        title: 'Art, Louvre & Montmartre',
        stops: [
          { id: 's4', time: '09:30 AM', title: 'Louvre Museum Tour', category: 'sightseeing', cost: 45 },
          { id: 's5', time: '01:30 PM', title: 'Lunch at Cafe de Flore', category: 'food', cost: 40 },
          { id: 's6', time: '04:00 PM', title: 'Montmartre Artists Square', category: 'activity', cost: 15 },
        ]
      }
    ],
    expenses: [
      { id: 'e1', title: 'Roundtrip Flight Tickets', amount: 680, category: 'transport', date: '2026-08-01' },
      { id: 'e2', title: 'Hotel Le Marais (3 Nights)', amount: 550, category: 'accommodation', date: '2026-08-05' },
      { id: 'e3', title: 'Museum Pass & Tickets', amount: 110, category: 'activity', date: '2026-08-10' },
      { id: 'e4', title: 'Pre-booked Dining Deposit', amount: 80, category: 'food', date: '2026-08-12' },
    ]
  },
  {
    id: 'trip-102',
    title: 'Tokyo & Kyoto Tech & Temple Escape',
    destination: 'Tokyo, Japan',
    startDate: '2026-11-05',
    endDate: '2026-11-15',
    totalBudget: 3200,
    spentBudget: 980,
    status: 'Upcoming',
    coverImage: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80',
    description: 'High tech districts, ramen sampling, bullet train journey, and quiet zen gardens.',
    itineraryDays: [],
    expenses: [
      { id: 'e5', title: 'Flight Deposit', amount: 750, category: 'transport', date: '2026-08-02' },
      { id: 'e6', title: 'JR Shinkansen Rail Pass', amount: 230, category: 'transport', date: '2026-08-15' },
    ]
  }
];

export const EXPENSE_CATEGORIES = [
  { id: 'transport', name: 'Transportation', color: '#14b8a6' },
  { id: 'accommodation', name: 'Hotel & Stay', color: '#0ea5e9' },
  { id: 'food', name: 'Food & Dining', color: '#f97316' },
  { id: 'activity', name: 'Activities & Sightseeing', color: '#a855f7' },
  { id: 'shopping', name: 'Shopping', color: '#ec4899' },
  { id: 'misc', name: 'Miscellaneous', color: '#64748b' }
];
