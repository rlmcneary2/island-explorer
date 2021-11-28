import { INFORMATION, MAP } from "../constants/routes";

export interface Landmark {
  description: string;
  displayName: string;
  features?: string[];
  id: number;
  location: { latitude: number; longitude: number };
}

export type RoutePage = keyof { [INFORMATION]: null; [MAP]: null };
