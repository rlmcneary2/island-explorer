import { INFORMATION, MAP } from "../constants/routes";

export interface Landmark {
  description: string;
  displayName: string;
  features?: string[];
  id: number;
  location: { latitude: number; longitude: number };
}

export type RoutePage = keyof { [INFORMATION]: null; [MAP]: null };

export interface RoutesAssetItem {
  color: string;
  description: string;
  displayName: string;
  id: number;
  landmarks: number[];
  notices: string[];
  tips: string[];
  trace: string;
}
