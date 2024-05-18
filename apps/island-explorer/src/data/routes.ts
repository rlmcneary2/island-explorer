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
    notices: [
      "NTE_ROUTE_1_HADLEY",
      "NTE_ROUTE_1_OCEANARIUM",
      "NTE_SCHEDULED_STOPS"
    ],
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
    notices: ["NTE_SCHEDULED_STOPS"],
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
      stops.LMK_HULLS_COVE_VISITOR_CENTER,
      stops.POI_FRENCHMAN_BAY_OVERLOOK,
      stops.POI_BAR_HARBOR_OVERLOOK,
      stops.TRH_CADILLAC_NORTH_RIDGE,
      stops.TRL_GORGE_PATH,
      stops.TRL_KEBO_MOUNTAIN,
      stops.TRH_STRATHEDEN_PATH,
      stops.TRL_JESSUP_PATH,
      stops.LMK_SIEUR_DE_MONTS,
      stops.LMK_BEAVER_DAM_POND,
      stops.TRH_CHAMPLAIN_NORTH_RIDGE,
      stops.TRH_ORANGE_AND_BLACK,
      stops.TRH_PRECIPICE,
      stops.TRH_BOWL,
      stops.LMK_SAND_BEACH,
      stops.LMK_THUNDER_HOLE,
      stops.TRH_GORHAM,
      stops.LMK_OTTER_CLIFFS_2ND,
      stops.LMK_OTTER_POINT_2ND,
      stops.LMK_FABBRI_MONUMENT,
      stops.TRH_BLACK_WOODS_2ND,
      stops.LMK_LITTLE_HUNTERS_BEACH_2ND,
      stops.TRH_HUNTERS_BROOK_TRAIL,
      stops.TRH_TRIAD_TRAIL,
      stops.LMK_JORDAN_POND_GATEHOUSE,
      stops.LMK_WILDWOOD_STABLES,
      stops.LMK_JORDAN_POND,
      stops.TRL_JORDAN_BUBBLE_PONDS_TRAIL,
      stops.TRH_JORDAN_POND_CARRY_ACCESS_TRAIL,
      stops.TRH_BUBBLE_ROCK,
      stops.LMK_BUBBLE_POND_2ND,
      stops.TRH_CADILLAC_NORTH_RIDGE_2ND
    ],
    notices: ["NTE_SCHEDULED_STOPS", "NTE_ROUTE_4_LITTLE_HUNTERS_STORM_DAMAGE"],
    tips: ["RTE_LOOP_ROAD_TIP", "RTE_LOOP_ROAD_TIP2"],
    trace: "LoopRoad.kml"
  },
  {
    color: "5C54A7",
    description: "RTE_JORDAN_POND_DESC",
    displayName: "Jordan Pond",
    id: 5,
    landmarks: [
      stops.LMK_HULLS_COVE_VISITOR_CENTER,
      stops.POI_FRENCHMAN_BAY_OVERLOOK,
      stops.TRH_CADILLAC_NORTH_RIDGE,
      stops.LMK_BUBBLE_POND,
      stops.TRH_BUBBLE_ROCK,
      stops.TRH_JORDAN_POND_CARRY_ACCESS_TRAIL,
      stops.TRL_JORDAN_BUBBLE_PONDS_TRAIL,
      stops.LMK_JORDAN_POND,
      stops.LMK_BUBBLE_POND,
      stops.TRH_CADILLAC_NORTH_RIDGE,
      stops.POI_FRENCHMAN_BAY_OVERLOOK
    ],
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
      stops.LMK_VILLAGE_GREEN,
      stops.LMK_EAGLE_LAKE,
      stops.LMK_MDI_HIGH_SCHOOL,
      stops.TRH_GIANT_SLIDE,
      stops.LMK_PARKMAN_MOUNTAIN_2ND,
      stops.LMK_BROWN_MOUNTAIN_GATEHOUSE,
      stops.TRH_HADLOCK_BROOK_TRAIL,
      stops.LMK_ASTICOU_AZALEA_GARDEN,
      stops.TRH_ASTICOU_TERRACES_PATH,
      stops.TRL_HADLOCK_PONDS,
      stops.LMK_NORTHEAST_HARBOR_PIER,
      stops.LMK_SEAL_HARBOR,
      stops.LMK_JORDAN_POND,
      stops.LMK_JORDAN_POND_GATEHOUSE,
      stops.LMK_NORTHEAST_HARBOR_PIER,
      stops.LMK_BROWN_MOUNTAIN_GATEHOUSE,
      stops.LMK_MDI_HIGH_SCHOOL
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
      stops.LMK_VILLAGE_GREEN,
      stops.LMK_EAGLE_LAKE_2ND,
      stops.LMK_MDI_HIGH_SCHOOL,
      stops.LMK_MOUNT_DESERT_CAMPGROUND,
      stops.POI_SOMESVILLE_BRIDGE,
      stops.LMK_SOMESVILLE,
      stops.TRH_ST_SAUVEUR_TRAIL,
      stops.LMK_ECHO_LAKE,
      stops.LMK_SMUGGLERS_DEN_CAMPGROUND,
      stops.LMK_SOUTHWEST_HARBOR,
      stops.LMK_BASS_HARBOR_POST_OFFICE,
      stops.LMK_BASS_HARBOR_CAMPGROUND,
      stops.TRH_SHIP_HARBOR_TRAIL,
      stops.TRH_WONDERLAND_TRAIL,
      stops.LMK_SEAWALL_CAMPGROUND,
      stops.LMK_SEAWALL,
      stops.LMK_BASS_HARBOR_CAMPGROUND,
      stops.LMK_BASS_HARBOR_POST_OFFICE,
      stops.LMK_SOUTHWEST_HARBOR,
      stops.LMK_SMUGGLERS_DEN_CAMPGROUND,
      stops.LMK_ECHO_LAKE,
      stops.LMK_SOMESVILLE,
      stops.LMK_MOUNT_DESERT_CAMPGROUND,
      stops.LMK_MDI_HIGH_SCHOOL
    ],
    notices: ["NTE_SCHEDULED_STOPS", "NTE_ROUTE_7_STORM_DAMAGE"],
    tips: [],
    trace: "SWH.kml"
  },
  {
    color: "8F3597",
    description: "RTE_SCHOODIC_DESC",
    id: 8,
    displayName: "Schoodic",
    landmarks: [
      stops.LMK_WH_FERRY_TERMINAL,
      stops.LMK_WINTER_HARBOR,
      stops.LMK_SCHOODIC_WOODS_CAMPGROUND,
      stops.LMK_FRAZER_POINT,
      stops.LMK_SCHOODIC_POINT,
      stops.TRH_SCHOODIC_HEAD_ANVIL_TRAIL,
      stops.TRH_SCHOODIC_HEAD_EAST_TRAIL,
      stops.LMK_BIRCH_HARBOR,
      stops.LMK_PROSPECT_HARBOR,
      stops.LMK_SCHOODIC_WOODS_CAMPGROUND,
      stops.LMK_WINTER_HARBOR,
      stops.LMK_WH_FERRY_TERMINAL
    ],
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
      stops.LMK_ACADIA_GATEWAY_CENTER,
      stops.LMK_BAR_HARBOR_AIRPORT,
      stops.LMK_NARROWS_TOO_CAMPGROUND,
      stops.LMK_BAR_HARBOR_KOA_CAMPGROUND,
      stops.LMK_TERAMOR_RESORT,
      stops.LMK_TOWN_HILL,
      stops.LMK_MDI_HIGH_SCHOOL,
      stops.LMK_EAGLE_LAKE_2ND,
      stops.LMK_VILLAGE_GREEN,
      stops.LMK_EAGLE_LAKE_2ND,
      stops.LMK_MDI_HIGH_SCHOOL,
      stops.LMK_TOWN_HILL,
      stops.LMK_TERAMOR_RESORT,
      stops.LMK_BAR_HARBOR_KOA_CAMPGROUND,
      stops.LMK_NARROWS_TOO_CAMPGROUND,
      stops.LMK_BAR_HARBOR_AIRPORT
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
      stops.LMK_VILLAGE_GREEN,
      stops.TRH_CADILLAC_NORTH_RIDGE_3RD,
      stops.TRL_GORGE_PATH,
      stops.TRL_KEBO_MOUNTAIN,
      stops.TRH_STRATHEDEN_PATH,
      stops.TRL_JESSUP_PATH,
      stops.LMK_SIEUR_DE_MONTS,
      stops.TRL_BEACHCROFT_PATH,
      stops.TRH_LADDER_TRAIL,
      stops.TRH_CANON_BROOK,
      stops.LMK_BLACKWOODS_CAMPGROUND,
      stops.LMK_SIEUR_DE_MONTS,
      stops.TRH_SCHOONER_HEAD_PATH
    ],
    notices: ["NTE_SCHEDULED_STOPS"],
    tips: ["RTE_BLACKWOODS_TIP"],
    trace: "blackwoods.kml"
  },
  {
    color: "0487D9",
    description: "RTE_TREMONT_DESC",
    id: 11,
    displayName: "Manset / Bernard",
    landmarks: [
      stops.LMK_SOUTHWEST_HARBOR,
      stops.LMK_MANSET_DOCK,
      stops.LMK_SOUTHWEST_HARBOR,
      stops.LMK_CLARK_POINT,
      stops.LMK_SOUTHWEST_HARBOR,
      stops.LMK_TREMONT_SCHOOL,
      stops.LMK_BERNARD,
      stops.LMK_TREMONT_SCHOOL,
      stops.LMK_SOUTHWEST_HARBOR
    ],
    notices: ["NTE_SCHEDULED_STOPS"],
    tips: [],
    trace: "trace-11.json"
  }
];

export default routes;
