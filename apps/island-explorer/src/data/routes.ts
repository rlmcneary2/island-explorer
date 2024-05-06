import type { RoutesAssetItem } from "../types/types";
import stops from "./stops";

const routes: RoutesAssetItem[] = [
  {
    color: "E03A22",
    description: "RTE_OCEANARIUM_DESC",
    displayName: "Bar Harbor Road",
    id: 1,
    landmarks: [
      stops.LMK_HADLEYS_POINT_CAMPGROUND,
      stops.LMK_MOUNT_DESERT_NARROWS_CAMPGROUND,
      stops.LMK_OCEANARIUM,
      stops.LMK_BAR_HARBOR_CAMPGROUND,
      stops.LMK_HULLS_COVE_VISITOR_CENTER,
      stops.LMK_VILLAGE_GREEN,
      stops.LMK_HULLS_COVE_VISITOR_CENTER,
      stops.LMK_BAR_HARBOR_CAMPGROUND,
      stops.LMK_HADLEYS_POINT_CAMPGROUND,
      stops.LMK_MOUNT_DESERT_NARROWS_CAMPGROUND,
      stops.LMK_OCEANARIUM
    ],
    notices: ["NTE_SCHEDULED_STOPS"],
    tips: [],
    trace: "Oceanarium.kml"
  },
  {
    color: "5D241C",
    description: "RTE_VISITOR_CENTER_DESC",
    displayName: "Eden Street",
    id: 2,
    landmarks: [
      stops.LMK_VILLAGE_GREEN,
      stops.LMK_COLLEGE_OF_THE_ATLANTIC,
      stops.LMK_ATLANTIC_OCEANSIDE_HOTEL,
      stops.LMK_BAR_HARBOR_FERRY,
      stops.LMK_BAR_HARBOR_REGENCY_HOTEL,
      stops.LMK_BAR_HARBOR_MOTEL,
      stops.LMK_ACADIA_INN,
      stops.LMK_EYRIE_HAMPTON,
      stops.LMK_WONDER_VIEW_INN
    ],
    notices: ["NTE_ROUTE_2_2023", "NTE_SCHEDULED_STOPS"],
    tips: [],
    trace: "EdenStreet.kml"
  },
  {
    color: "3A9844",
    description: "RTE_SAND_BEACH_DESC",
    displayName: "Sand Beach",
    id: 3,
    landmarks: [
      stops.LMK_VILLAGE_GREEN,
      stops.TRH_CADILLAC_NORTH_RIDGE,
      stops.POI_BAR_HARBOR_OVERLOOK,
      stops.TRL_GORGE_PATH,
      stops.TRL_KEBO_MOUNTAIN,
      stops.TRH_STRATHEDEN_PATH,
      stops.TRL_JESSUP_PATH,
      stops.LMK_BEAVER_DAM_POND,
      stops.TRH_CHAMPLAIN_NORTH_RIDGE,
      stops.TRH_ORANGE_AND_BLACK,
      stops.TRH_PRECIPICE,
      stops.TRH_BOWL,
      stops.LMK_SAND_BEACH,
      stops.LMK_THUNDER_HOLE,
      stops.TRH_GORHAM,
      stops.LMK_OTTER_CLIFFS,
      stops.LMK_OTTER_POINT_2ND,
      stops.LMK_FABBRI_MONUMENT,
      stops.LMK_FABBRI,
      stops.TRL_OTTER_COVE,
      stops.TRH_CANON_BROOK,
      stops.TRH_LADDER_TRAIL,
      stops.TRL_BEACHCROFT_PATH,
      stops.TRH_SCHOONER_HEAD_PATH
    ],
    notices: ["NTE_SCHEDULED_STOPS"],
    tips: ["RTE_SAND_BEACH_TIP", "RTE_SAND_BEACH_TIP2"],
    trace: "SandyBeach.kml"
  },
  {
    color: "FF9D30",
    description: "RTE_LOOP_ROAD_DESC",
    displayName: "Loop Road",
    id: 4,
    landmarks: [
      3, 47000, 48000, 20, 28000, 29000, 30000, 31000, 21, 32000, 20000, 21000,
      22000, 23000, 22, 30023, 24000, 10024, 10092, 11064, 20065, 30066, 34000,
      34300, 34600, 30, 29, 35000, 36000, 11051, 30028, 83
    ],
    notices: ["NTE_SCHEDULED_STOPS"],
    tips: ["RTE_LOOP_ROAD_TIP", "RTE_LOOP_ROAD_TIP2"],
    trace: "LoopRoad.kml"
  },
  {
    color: "5C54A7",
    description: "RTE_JORDAN_POND_DESC",
    displayName: "Jordan Pond",
    id: 5,
    landmarks: [3, 47000, 20, 28, 11051, 36000, 35000, 29, 28, 20, 47000],
    notices: ["NTE_ROUTE_5_2023", "NTE_SCHEDULED_STOPS"],
    tips: ["RTE_JORDAN_POND_TIP", "RTE_JORDAN_POND_TIP2"],
    trace: "JordanPond.kml"
  },
  {
    color: "068AD4",
    description: "RTE_BROWN_MOUNTAIN_DESC",
    displayName: "Northeast Harbor",
    id: 6,
    landmarks: [
      1, 10034, 35, 38000, 10077, 53, 46000, 39000, 39500, 39510, 38, 10031, 29,
      34600, 38, 53, 35
    ],
    notices: ["NTE_SCHEDULED_STOPS"],
    tips: ["RTE_NORTHEAST_HARBOR_TIP"],
    trace: "BrownMountain.kml"
  },
  {
    color: "BE2077",
    description: "RTE_SOUTHWEST_HARBOR_DESC",
    id: 7,
    displayName: "Southwest Harbor",
    landmarks: [
      1, 10034, 35, 62, 49000, 39, 41000, 40, 41, 44, 40000, 46, 88, 44, 39, 62,
      1
    ],
    notices: ["NTE_SCHEDULED_STOPS"],
    tips: [],
    trace: "SWH.kml"
  },
  {
    color: "8F3597",
    description: "RTE_SCHOODIC_DESC",
    id: 8,
    displayName: "Schoodic",
    landmarks: [56, 57, 79, 42000, 59, 43000, 44000, 60, 61, 94, 90, 57],
    notices: ["NTE_SCHEDULED_STOPS", "NTE_SCHOODIC"],
    tips: [],
    trace: "Schoodic.kml"
  },
  {
    color: "816E5D",
    description: "RTE_TRENTON_DESC",
    id: 9,
    displayName: "Trenton",
    landmarks: [
      74, 10, 11, 9, 11000, 69, 35, 10034, 1, 10034, 35, 69, 11000, 9, 11, 10
    ],
    notices: ["NTE_SCHEDULED_STOPS"],
    tips: [],
    trace: "Trenton.kml"
  },
  {
    color: "F00190",
    description: "RTE_BLACKWOODS_DESC",
    id: 10,
    displayName: "Blackwoods",
    landmarks: [
      1, 10083, 28000, 29000, 30000, 31000, 21, 27500, 27000, 26000, 27, 21,
      45000
    ],
    notices: ["NTE_SCHEDULED_STOPS"],
    tips: ["RTE_BLACKWOODS_TIP"],
    trace: "blackwoods.kml"
  },
  {
    color: "0487D9",
    description: "RTE_TREMONT_DESC",
    id: 11,
    displayName: "Tremont",
    landmarks: [44, 88, 40000, 46, 47, 55, 48, 50, 48, 43],
    notices: ["NTE_SCHEDULED_STOPS"],
    tips: [],
    trace: "trace-11.json"
  }
];

export default routes;
