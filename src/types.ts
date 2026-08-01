export type WeatherCondition = 'rain' | 'mist' | 'sunny' | 'twilight';

export interface WeatherInfo {
  condition: WeatherCondition;
  temp: string;
  label: string;
  subtitle: string;
  bannerText: string;
}

export type TabType = 'discover' | 'reserve' | 'orders' | 'club';

export interface MoodSpot {
  id: string;
  spotNumber: string;
  name: string;
  subtitle: string;
  description: string;
  image: string;
  capacity: string;
  vibe: string;
}

export interface MenuItem {
  id: string;
  name: string;
  category: 'rainy' | 'coffee' | 'tea' | 'bakes';
  price: number;
  tag?: string;
  description: string;
  image: string;
  flavorNotes: string[];
  temperature?: 'Hot' | 'Cold' | 'Both';
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
  temperature: 'Hot' | 'Cold';
  milkChoice?: string;
  notes?: string;
}

export interface Reservation {
  id: string;
  spot: MoodSpot;
  date: string;
  time: string;
  guests: number;
  status: 'Confirmed' | 'Active' | 'Completed';
  specialNotes?: string;
  qrCode: string;
}
