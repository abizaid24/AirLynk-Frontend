import type { AirportOption } from "@/store/search-store";

// Mirrors SEED_AIRPORTS in app/database/init_db.py exactly.
// If the backend seed list changes, update this file to match.
export const AIRPORTS: AirportOption[] = [
  { iata: "LHE", city: "Lahore", country: "Pakistan", name: "Allama Iqbal International", lat: 31.5216, lng: 74.4036 },
  { iata: "KHI", city: "Karachi", country: "Pakistan", name: "Jinnah International", lat: 24.9065, lng: 67.1608 },
  { iata: "ISB", city: "Islamabad", country: "Pakistan", name: "Islamabad International", lat: 33.5607, lng: 72.8516 },
  { iata: "DXB", city: "Dubai", country: "UAE", name: "Dubai International", lat: 25.2532, lng: 55.3657 },
  { iata: "DOH", city: "Doha", country: "Qatar", name: "Hamad International", lat: 25.2731, lng: 51.6081 },
  { iata: "IST", city: "Istanbul", country: "Turkey", name: "Istanbul Airport", lat: 41.2753, lng: 28.7519 },
  { iata: "LHR", city: "London", country: "United Kingdom", name: "London Heathrow", lat: 51.4700, lng: -0.4543 },
  { iata: "JFK", city: "New York", country: "USA", name: "John F. Kennedy International", lat: 40.6413, lng: -73.7781 },
  { iata: "CDG", city: "Paris", country: "France", name: "Charles de Gaulle", lat: 49.0097, lng: 2.5479 },
  { iata: "FRA", city: "Frankfurt", country: "Germany", name: "Frankfurt Airport", lat: 50.0379, lng: 8.5622 },
  { iata: "SIN", city: "Singapore", country: "Singapore", name: "Changi Airport", lat: 1.3644, lng: 103.9915 },
  { iata: "BKK", city: "Bangkok", country: "Thailand", name: "Suvarnabhumi", lat: 13.6900, lng: 100.7501 },
];

export function findAirport(iata: string): AirportOption | undefined {
  return AIRPORTS.find((a) => a.iata === iata.toUpperCase());
}

export function searchAirports(query: string): AirportOption[] {
  const q = query.trim().toLowerCase();
  if (!q) return AIRPORTS;
  return AIRPORTS.filter(
    (a) =>
      a.iata.toLowerCase().includes(q) ||
      a.city.toLowerCase().includes(q) ||
      a.country.toLowerCase().includes(q) ||
      a.name.toLowerCase().includes(q)
  );
}
