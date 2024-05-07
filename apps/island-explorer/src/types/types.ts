import { INFORMATION, MAP } from "../constants/routes";

export interface Landmark {
  description?: string;
  displayName?: string;
  features?: string[];
  id: number;
  landmarkType?:
    | "airport"
    | "attraction"
    | "campground"
    | "ferry-transport"
    | "ground-transport"
    | "lodging"
    | "point-of-interest"
    | "trail-crossing"
    | "trail-head"
    | "village"
    | "visitor-center";
  location?: { latitude: number; longitude: number };
  refId?: number;
  /** This is the availtec Stop `Name` property; any are misspelled. `stopName`
   * won't exist in landmarks that are not bus stops. Used when determining a
   * bus's next stop.
   * */
  stopName?: string;
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
