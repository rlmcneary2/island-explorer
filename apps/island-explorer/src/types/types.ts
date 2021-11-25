export interface Landmark {
  description: string;
  displayName: string;
  features?: string[];
  id: number;
  location: { latitude: number; longitude: number };
}
