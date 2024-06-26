export default {
  // These are all stop IDs defined by availtec
  LMK_VILLAGE_GREEN: 1,
  LMK_BAR_HARBOR_FERRY: 2,
  LMK_HULLS_COVE_VISITOR_CENTER: 3,
  LMK_BAR_HARBOR_CAMPGROUND: 4,
  LMK_HADLEYS_POINT_CAMPGROUND: 5,
  LMK_MOUNT_DESERT_NARROWS_CAMPGROUND: 6,
  LMK_OCEANARIUM: 7,
  LMK_WOODLANDS_KOA_CAMPGROUND: 8,
  LMK_BAR_HARBOR_KOA_CAMPGROUND: 9,
  LMK_BAR_HARBOR_AIRPORT: 10,
  LMK_NARROWS_TOO_CAMPGROUND: 11,
  LMK_COLLEGE_OF_THE_ATLANTIC: 13,
  LMK_ATLANTIC_OCEANSIDE_HOTEL: 14,
  LMK_BAR_HARBOR_REGENCY_HOTEL: 15,
  LMK_BAR_HARBOR_MOTEL: 16,
  LMK_ACADIA_INN: 17,
  LMK_EYRIE_HAMPTON: 18,
  LMK_WONDER_VIEW_INN: 19,
  TRH_CADILLAC_NORTH_RIDGE: 20,
  LMK_SIEUR_DE_MONTS: 21,
  LMK_SAND_BEACH: 22,
  LMK_THUNDER_HOLE: 23,
  LMK_OTTER_CLIFFS: 24,
  LMK_BLACKWOODS_CAMPGROUND: 27,
  LMK_BUBBLE_POND: 28,
  LMK_JORDAN_POND: 29,
  LMK_WILDWOOD_STABLES: 30,
  LMK_SEAL_HARBOR: 31,
  LMK_EAGLE_LAKE: 34,
  LMK_MDI_HIGH_SCHOOL: 35,
  LMK_NORTHEAST_HARBOR_PIER: 38,
  LMK_SOMESVILLE: 39,
  LMK_ECHO_LAKE: 40,
  LMK_SMUGGLERS_DEN_CAMPGROUND: 41,
  LMK_CLARK_POINT: 43,
  LMK_SOUTHWEST_HARBOR: 44,
  LMK_CRANBERRY_COVE: 45,
  LMK_SEAWALL_CAMPGROUND: 46,
  LMK_BASS_HARBOR_CAMPGROUND: 47,
  LMK_TREMONT_SCHOOL: 48,
  LMK_BERNARD: 50,
  LMK_NORTH_EAST_HARBOR_SEA_STREET: 52,
  LMK_BROWN_MOUNTAIN_GATEHOUSE: 53,
  LMK_BASS_HARBOR_FERRY: 55,
  LMK_WH_FERRY_TERMINAL: 56,
  LMK_WINTER_HARBOR: 57,
  LMK_SCHOODIC_POINT: 59,
  LMK_BIRCH_HARBOR: 60,
  LMK_PROSPECT_HARBOR: 61,
  LMK_MOUNT_DESERT_CAMPGROUND: 62,
  TRH_BLACK_WOODS: 65,
  LMK_LITTLE_HUNTERS_BEACH: 66,
  LMK_EDENBROOK_MOTEL: 68,
  LMK_TOWN_HILL: 69,
  LMK_HAMPTON_INN_BAR_HARBOR: 71,
  LMK_ACADIA_GATEWAY_CENTER: 74,
  LMK_PARKMAN_MOUNTAIN: 77,
  LMK_SCHOODIC_WOODS_CAMPGROUND: 79,
  LMK_ACADIA_NATIONAL_PARK_HQ: 82,
  TRH_CADILLAC_NORTH_RIDGE_2ND: 83, // ref : 20 | availtec has two IDs for the same stop
  LMK_FABBRI: 87,
  LMK_MANSET_DOCK: 88,
  LMK_MCKINLEYS_STORE: 89,
  LMK_SCHOODIC_WOODS_2: 90,
  LMK_OTTER_POINT: 92,
  LMK_ACADIA_MOUNTAIN: 93,
  LMK_WINTER_HARBOR_2: 94,
  LMK_BASS_HARBOR_POST_OFFICE: 999, // TODO: new stop, get the availtec ID
  LMK_TERAMOR_RESORT: 998, // TODO: new stop, get the availtec ID

  // These are "stops" along a route where they are not stops. The last two digits are the same as
  // their availtec stop ID.
  LMK_OTTER_CLIFFS_2ND: 10024,
  LMK_SEAL_HARBOR_2ND: 10031,
  LMK_EAGLE_LAKE_2ND: 10034,
  LMK_PARKMAN_MOUNTAIN_2ND: 10077,
  TRH_CADILLAC_NORTH_RIDGE_3RD: 10083, // ref : 20
  LMK_OTTER_POINT_2ND: 10092,

  // These are landmarks, POIs, trailheads, etc. that may, or may not, exist in availtec (the
  // numbering got confused here...).
  TRH_BUBBLE_ROCK: 11051,
  LMK_FABBRI_MONUMENT: 11064,
  TRH_CHAMPLAIN_NORTH_RIDGE: 20000,
  TRH_BLACK_WOODS_2ND: 20065, // ref : 65

  // These are trailheads or trail crossings.
  TRH_ORANGE_AND_BLACK: 21000,
  TRH_PRECIPICE: 22000,
  TRH_BOWL: 23000,
  TRH_GORHAM: 24000,
  TRL_OTTER_COVE: 25000,
  TRH_CANON_BROOK: 26000,
  TRH_LADDER_TRAIL: 27000,
  TRL_BEACHCROFT_PATH: 27500,
  TRL_GORGE_PATH: 28000,
  TRL_KEBO_MOUNTAIN: 29000,
  TRH_STRATHEDEN_PATH: 30000,

  // Umm...
  LMK_THUNDER_HOLE_2ND: 30023, // ref : 23
  LMK_BUBBLE_POND_2ND: 30028, // ref : 28
  LMK_LITTLE_HUNTERS_BEACH_2ND: 30066, // ref : 66

  // Back to things that don't already exist.
  TRL_JESSUP_PATH: 31000,
  LMK_BEAVER_DAM_POND: 32000,
  TRH_HUNTERS_BROOK_TRAIL: 34000,
  TRH_TRIAD_TRAIL: 34300,
  LMK_JORDAN_POND_GATEHOUSE: 34600,
  TRL_JORDAN_BUBBLE_PONDS_TRAIL: 35000,
  TRH_JORDAN_POND_CARRY_ACCESS_TRAIL: 36000,
  TRH_BUBBLES_TRAIL: 37000,
  TRH_GIANT_SLIDE: 38000,
  LMK_ASTICOU_AZALEA_GARDEN: 39000,
  TRH_ASTICOU_TERRACES_PATH: 39500,
  TRL_HADLOCK_PONDS: 39510,
  LMK_SEAWALL: 40000,
  TRH_ST_SAUVEUR_TRAIL: 41000,
  LMK_FRAZER_POINT: 42000,
  TRH_SCHOODIC_HEAD_ANVIL_TRAIL: 43000,
  TRH_SCHOODIC_HEAD_EAST_TRAIL: 44000,
  TRH_SCHOONER_HEAD_PATH: 45000,
  TRH_HADLOCK_BROOK_TRAIL: 46000,
  POI_FRENCHMAN_BAY_OVERLOOK: 47000,
  POI_BAR_HARBOR_OVERLOOK: 48000,
  POI_SOMESVILLE_BRIDGE: 49000,
  TRH_SHIP_HARBOR_TRAIL: 50000,
  TRH_WONDERLAND_TRAIL: 51000
};
