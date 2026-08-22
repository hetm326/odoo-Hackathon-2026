export const cities = [
  { id: 1, name: "Paris", country: "France", region: "Europe", costIndex: "Medium", popularity: 98, image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=80" },
  { id: 2, name: "Rome", country: "Italy", region: "Europe", costIndex: "Medium", popularity: 96, image: "https://images.unsplash.com/photo-1529260830199-42c24126f198?auto=format&fit=crop&w=900&q=80" },
  { id: 3, name: "Venice", country: "Italy", region: "Europe", costIndex: "High", popularity: 94, image: "https://images.unsplash.com/photo-1514890547357-a9ee288728e0?auto=format&fit=crop&w=900&q=80" },
  { id: 4, name: "Dubai", country: "UAE", region: "Middle East", costIndex: "High", popularity: 92, image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=80" },
  { id: 5, name: "Tokyo", country: "Japan", region: "Asia", costIndex: "High", popularity: 95, image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=900&q=80" },
  { id: 6, name: "Goa", country: "India", region: "Asia", costIndex: "Low", popularity: 90, image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=900&q=80" }
];

export const activities = [
  { id: 1, city: "Paris", name: "Eiffel Tower", type: "Sightseeing", duration: "2 hours", cost: 2500, rating: 4.9, image: "https://images.unsplash.com/photo-1543349689-9a4d426bee8e?auto=format&fit=crop&w=900&q=80" },
  { id: 2, city: "Paris", name: "Louvre Museum", type: "Culture", duration: "3 hours", cost: 1800, rating: 4.8, image: "https://images.unsplash.com/photo-1564399579883-451a5d44ec08?auto=format&fit=crop&w=900&q=80" },
  { id: 3, city: "Rome", name: "Colosseum", type: "Sightseeing", duration: "2 hours", cost: 2000, rating: 4.9, image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=900&q=80" },
  { id: 4, city: "Rome", name: "Vatican Museum", type: "Culture", duration: "3 hours", cost: 1500, rating: 4.8, image: "https://images.unsplash.com/photo-1531572753322-ad063cecc140?auto=format&fit=crop&w=900&q=80" },
  { id: 5, city: "Venice", name: "Grand Canal Cruise", type: "Adventure", duration: "1.5 hours", cost: 2200, rating: 4.7, image: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=900&q=80" },
  { id: 6, city: "Dubai", name: "Burj Khalifa", type: "Sightseeing", duration: "2 hours", cost: 3500, rating: 4.9, image: "https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?auto=format&fit=crop&w=900&q=80" }
];

export const initialTrips = [
  {
    id: "demo-1",
    name: "Europe Adventure",
    description: "A beautiful multi-city European getaway.",
    startDate: "2026-09-10",
    endDate: "2026-09-20",
    status: "planning",
    cover: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1200&q=80",
    budget: { transport: 25000, accommodation: 40000, activities: 7500, meals: 10000 },
    stops: [
      {
        id: "stop-paris",
        cityId: 1,
        city: "Paris",
        country: "France",
        startDate: "2026-09-10",
        endDate: "2026-09-13",
        activities: [
          { instanceId: 101, id: 1, city: "Paris", name: "Eiffel Tower", type: "Sightseeing", duration: "2 hours", cost: 2500, rating: 4.9 },
          { instanceId: 102, id: 2, city: "Paris", name: "Louvre Museum", type: "Culture", duration: "3 hours", cost: 1800, rating: 4.8 }
        ]
      },
      {
        id: "stop-rome",
        cityId: 2,
        city: "Rome",
        country: "Italy",
        startDate: "2026-09-13",
        endDate: "2026-09-17",
        activities: [
          { instanceId: 103, id: 3, city: "Rome", name: "Colosseum", type: "Sightseeing", duration: "2 hours", cost: 2000, rating: 4.9 }
        ]
      }
    ]
  }
];