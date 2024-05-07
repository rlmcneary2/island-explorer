import type { Landmark } from "../types/types";
import stops from "./stops";

const landmarks: Landmark[] = [
  {
    description: "LMK_VILLAGE_GREEN_DESC",
    features: [
      "restroom",
      "dine",
      "snack",
      "gift",
      "inn",
      "attraction",
      "park",
      "walk"
    ],
    landmarkType: "point-of-interest",
    displayName: "Bar Harbor Village Green",
    id: stops.LMK_VILLAGE_GREEN,
    location: {
      latitude: 44.387919499573265,
      longitude: -68.20558682662836
    },
    stopName: "Village Green"
  },
  {
    description: "LMK_BAR_HARBOR_FERRY_DESC",
    displayName: "Bar Harbor Ferry Terminal",
    features: ["ferry"],
    id: stops.LMK_BAR_HARBOR_FERRY,
    landmarkType: "ferry-transport",
    location: {
      latitude: 44.39800644,
      longitude: -68.22785187
    },
    stopName: "Ferry Terminal"
  },
  {
    description: "LMK_HULLS_COVE_VISITOR_CENTER_DESC",
    features: ["restroom", "water", "station", "park", "walk", "bike"],
    landmarkType: "visitor-center",
    displayName: "Hulls Cove Visitor Center",
    id: stops.LMK_HULLS_COVE_VISITOR_CENTER,
    location: {
      latitude: 44.40928458102677,
      longitude: -68.24799728470641
    },
    stopName: "Visitor Center"
  },
  {
    features: ["camp"],
    landmarkType: "campground",
    displayName: "Bar Harbor Campground",
    id: stops.LMK_BAR_HARBOR_CAMPGROUND,
    location: {
      latitude: 44.43102264,
      longitude: -68.27126312
    },
    stopName: "Bar Habor Campground"
  },
  {
    features: ["camp"],
    landmarkType: "campground",
    displayName: "Hadley's Point Campground",
    id: stops.LMK_HADLEYS_POINT_CAMPGROUND,
    location: {
      latitude: 44.43872833,
      longitude: -68.31433105
    },
    stopName: "Hadly Point"
  },
  {
    features: ["camp"],
    landmarkType: "campground",
    displayName: "Mount Desert Narrows Campground",
    id: stops.LMK_MOUNT_DESERT_NARROWS_CAMPGROUND,
    location: {
      latitude: 44.4199295,
      longitude: -68.33718109
    },
    stopName: "Mt Desert Narrows"
  },
  {
    // description: "LMK_OCEANARIUM_DESC",
    features: ["attraction"],
    landmarkType: "attraction",
    displayName: "Oceanarium",
    id: stops.LMK_OCEANARIUM,
    location: {
      latitude: 44.419361,
      longitude: -68.349579
    },
    stopName: "Oceanarium"
  },
  {
    description: "LMK_WOODLANDS_KOA_DESC",
    features: ["camp"],
    landmarkType: "campground",
    displayName: "Woodlands KOA Campground",
    id: stops.LMK_WOODLANDS_KOA_CAMPGROUND,
    location: {
      latitude: 44.4050827,
      longitude: -68.34212494
    },
    stopName: "Woodlands KOA"
  },
  {
    features: ["camp"],
    landmarkType: "campground",
    displayName: "Bar Harbor KOA Campground",
    id: stops.LMK_BAR_HARBOR_KOA_CAMPGROUND,
    location: {
      latitude: 44.42137909,
      longitude: -68.36430359
    },
    stopName: "Bar Habor KOA"
  },
  {
    description: "LMK_BAR_HARBOR_AIRPORT_DESC",
    features: ["airport"],
    landmarkType: "airport",
    displayName: "Bar Harbor Airport",
    id: stops.LMK_BAR_HARBOR_AIRPORT,
    location: {
      latitude: 44.44600296,
      longitude: -68.3615036
    },
    stopName: "Airport"
  },
  {
    features: ["camp"],
    landmarkType: "campground",
    displayName: "Narrows Too Campground",
    id: stops.LMK_NARROWS_TOO_CAMPGROUND,
    location: {
      latitude: 44.43856812,
      longitude: -68.36693573
    },
    stopName: "Narrows Too"
  },
  {
    displayName: "College of the Atlantic",
    id: stops.LMK_COLLEGE_OF_THE_ATLANTIC,
    landmarkType: "point-of-interest",
    location: {
      latitude: 44.394515,
      longitude: -68.222758
    },
    stopName: "College of the Atlantic"
  },
  {
    features: ["inn"],
    landmarkType: "lodging",
    displayName: "Atlantic Oceanside Hotel",
    id: stops.LMK_ATLANTIC_OCEANSIDE_HOTEL,
    location: {
      latitude: 44.3971138,
      longitude: -68.22524261
    },
    stopName: "Atlantic Oceanside"
  },
  {
    features: ["inn"],
    landmarkType: "lodging",
    displayName: "Bar Harbor Regency",
    id: stops.LMK_BAR_HARBOR_REGENCY_HOTEL,
    location: {
      latitude: 44.39929581,
      longitude: -68.22899628
    },
    stopName: "Regency"
  },
  {
    features: ["inn"],
    landmarkType: "lodging",
    displayName: "Bar Harbor Motel",
    id: stops.LMK_BAR_HARBOR_MOTEL,
    location: {
      latitude: 44.39624405,
      longitude: -68.22585297
    },
    stopName: "Bar Habor Motel"
  },
  {
    features: ["inn"],
    landmarkType: "lodging",
    displayName: "Acadia Inn",
    id: stops.LMK_ACADIA_INN,
    location: {
      latitude: 44.39526749,
      longitude: -68.22457123
    },
    stopName: "Acadia Inn"
  },
  {
    description: "LMK_EYRIE_HAMPTON_DESC",
    displayName: "Eyrie / Hampton",
    features: ["inn"],
    id: stops.LMK_EYRIE_HAMPTON,
    landmarkType: "lodging",
    location: {
      latitude: 44.39187622,
      longitude: -68.22277832
    },
    stopName: "Eryrie Lodge"
  },
  {
    features: ["inn"],
    landmarkType: "lodging",
    displayName: "Wonder View Inn",
    id: stops.LMK_WONDER_VIEW_INN,
    location: {
      latitude: 44.39022446,
      longitude: -68.21959686
    },
    stopName: "Wonder View"
  },
  {
    description: "TRH_CADILLAC_NORTH_RIDGE_DESC",
    features: ["hike"],
    landmarkType: "trail-head",
    displayName: "Cadillac North Ridge",
    id: stops.TRH_CADILLAC_NORTH_RIDGE,
    location: {
      latitude: 44.37951550727959,
      longitude: -68.23234479389386
    },
    stopName: "Cadillac N Ridge"
  },
  {
    description: "LMK_SIEUR_DE_MONTS_DESC",
    features: [
      "accessible",
      "restroom",
      "water",
      "station",
      "attraction",
      "park",
      "walk",
      "hike"
    ],
    landmarkType: "visitor-center",
    displayName: "Sieur de Monts",
    id: stops.LMK_SIEUR_DE_MONTS,
    location: {
      latitude: 44.36243439,
      longitude: -68.20748138
    },
    stopName: "Sieur De Monts"
  },
  {
    description: "LMK_SAND_BEACH_DESC",
    features: [
      "restroom",
      "water",
      "wonder",
      "beach",
      "swim",
      "park",
      "walk",
      "hike"
    ],
    landmarkType: "point-of-interest",
    displayName: "Sand Beach",
    id: stops.LMK_SAND_BEACH,
    location: {
      latitude: 44.32995987,
      longitude: -68.184021
    },
    stopName: "Sand Beach"
  },
  {
    description: "LMK_THUNDER_HOLE_DESC",
    features: ["accessible", "restroom", "snack", "wonder", "walk"],
    landmarkType: "point-of-interest",
    displayName: "Thunder Hole",
    id: stops.LMK_THUNDER_HOLE,
    location: {
      latitude: 44.32134247,
      longitude: -68.18928528
    },
    stopName: "Thunder Hole"
  },
  {
    description: "LMK_OTTER_CLIFFS_DESC",
    features: ["wonder", "walk", "hike", "technical"],
    landmarkType: "point-of-interest",
    displayName: "Otter Cliffs",
    id: stops.LMK_OTTER_CLIFFS,
    location: {
      latitude: 44.31101227,
      longitude: -68.18968201
    },
    stopName: "Otter Cliff"
  },
  {
    description: "LMK_BLACKWOODS_CAMPGROUND_DESC",
    features: ["camp"],
    landmarkType: "campground",
    displayName: "Blackwoods Campground",
    id: stops.LMK_BLACKWOODS_CAMPGROUND,
    location: {
      latitude: 44.30889511,
      longitude: -68.20349121
    },
    stopName: "BlackWoods"
  },
  {
    description: "LMK_BUBBLE_POND_DESC",
    features: ["restroom", "walk", "hike", "climb", "bike"],
    landmarkType: "point-of-interest",
    displayName: "Bubble Pond",
    id: stops.LMK_BUBBLE_POND,
    location: {
      latitude: 44.35030746,
      longitude: -68.24166107
    },
    stopName: "Bubble Pond"
  },
  {
    description: "LMK_JORDAN_POND_DESC",
    features: [
      "accessible",
      "restroom",
      "water",
      "dine",
      "gift",
      "wonder",
      "park",
      "walk",
      "hike",
      "climb",
      "bike"
    ],
    landmarkType: "point-of-interest",
    displayName: "Jordan Pond",
    id: stops.LMK_JORDAN_POND,
    location: {
      latitude: 44.32052201288366,
      longitude: -68.25315534463009
    },
    stopName: "Jordan Pond"
  },
  {
    description: "LMK_WILDWOOD_STABLES_DESC",
    features: ["accessible", "restroom", "walk", "hike", "bike"],
    landmarkType: "point-of-interest",
    displayName: "Wildwood Stables",
    id: stops.LMK_WILDWOOD_STABLES,
    location: {
      latitude: 44.31469219087836,
      longitude: -68.2368990907938
    },
    stopName: "WildWood"
  },
  {
    description: "LMK_SEAL_HARBOR_DESC",
    features: ["dine", "beach", "swim"],
    landmarkType: "point-of-interest",
    displayName: "Seal Harbor",
    id: stops.LMK_SEAL_HARBOR,
    location: {
      latitude: 44.29630661,
      longitude: -68.2411499
    },
    stopName: "Seal Harbor"
  },
  {
    description: "LMK_EAGLE_LAKE_DESC",
    displayName: "Eagle Lake",
    features: [
      "accessible",
      "restroom",
      "water",
      "park",
      "walk",
      "hike",
      "bike",
      "fish",
      "boat"
    ],
    id: stops.LMK_EAGLE_LAKE,
    landmarkType: "point-of-interest",
    location: {
      latitude: 44.37762833,
      longitude: -68.24991608
    },
    stopName: "Eagle Lake"
  },
  {
    displayName: "MDI High School",
    features: ["park"],
    id: stops.LMK_MDI_HIGH_SCHOOL,
    landmarkType: "point-of-interest",
    location: {
      latitude: 44.37173843,
      longitude: -68.30102539
    },
    stopName: "MDI High School"
  },
  {
    description: "LMK_NORTHEAST_HARBOR_PIER_DESC",
    features: ["ferry"],
    landmarkType: "ferry-transport",
    displayName: "Northeast Harbor Pier",
    id: stops.LMK_NORTHEAST_HARBOR_PIER,
    location: {
      latitude: 44.29471588,
      longitude: -68.284935
    },
    stopName: "NEH Pier"
  },
  {
    description: "LMK_SOMESVILLE_DESC",
    displayName: "Somesville",
    features: ["park", "walk", "gift"],
    id: stops.LMK_SOMESVILLE,
    landmarkType: "point-of-interest",
    location: {
      latitude: 44.3613205,
      longitude: -68.33518219
    },
    stopName: "Somesville"
  },
  {
    description: "LMK_ECHO_LAKE_DESC",
    displayName: "Echo Lake",
    features: ["restroom", "water", "beach", "swim", "hike", "climb", "tower"],
    id: stops.LMK_ECHO_LAKE,
    landmarkType: "point-of-interest",
    location: {
      latitude: 44.31499481,
      longitude: -68.33670044
    },
    stopName: "Echo Lake"
  },
  {
    displayName: "Smugglers' Den Campground",
    features: ["camp"],
    id: stops.LMK_SMUGGLERS_DEN_CAMPGROUND,
    landmarkType: "campground",
    location: {
      latitude: 44.30040359,
      longitude: -68.33153534
    },
    stopName: "Smugglers Den"
  },
  {
    displayName: "Clark Point",
    features: ["inn", "dine"],
    id: stops.LMK_CLARK_POINT,
    landmarkType: "village",
    location: {
      latitude: 44.27684784,
      longitude: -68.31338501
    },
    stopName: "Clark Point"
  },
  {
    description: "LMK_SOUTHWEST_HARBOR_DESC",
    displayName: "Southwest Harbor",
    features: ["dine", "gift", "inn"],
    id: stops.LMK_SOUTHWEST_HARBOR,
    landmarkType: "village",
    location: {
      latitude: 44.2801857,
      longitude: -68.32499695
    },
    stopName: "SW Harbor Main St"
  },
  {
    description: "LMK_CRANBERRY_COVE_DESC",
    displayName: "Cranberry Cove",
    features: ["inn", "dine", "boat"],
    id: stops.LMK_CRANBERRY_COVE,
    landmarkType: "village",
    location: {
      latitude: 44.26898575,
      longitude: -68.31143188
    },
    stopName: "Cranberry Cove"
  },
  {
    description: "LMK_SEAWALL_CAMPGROUND_DESC",
    features: ["camp", "wonder"],
    landmarkType: "campground",
    displayName: "Seawall Campground",
    id: stops.LMK_SEAWALL_CAMPGROUND,
    location: {
      latitude: 44.23894882,
      longitude: -68.30301666
    },
    stopName: "Seawall Campground"
  },
  {
    features: ["camp"],
    landmarkType: "campground",
    displayName: "Bass Harbor Campground",
    id: stops.LMK_BASS_HARBOR_CAMPGROUND,
    location: {
      latitude: 44.23036194,
      longitude: -68.33906555
    },
    stopName: "Bass Harbor Campground"
  },
  {
    displayName: "Tremont School",
    id: stops.LMK_TREMONT_SCHOOL,
    landmarkType: "village",
    location: {
      latitude: 44.25374985,
      longitude: -68.35064697
    },
    stopName: "Tremont School"
  },
  {
    description: "LMK_BERNARD_DESC",
    features: ["dine"],
    landmarkType: "point-of-interest",
    displayName: "Bernard",
    id: stops.LMK_BERNARD,
    location: {
      latitude: 44.23987198,
      longitude: -68.35358429
    },
    stopName: "Bernard"
  },
  {
    description: "LMK_NORTH_EAST_HARBOR_SEA_STREET_DESC",
    displayName: "NEH Sea St",
    features: ["dine", "snack", "gift", "inn", "attraction", "park", "walk"],
    landmarkType: "point-of-interest",
    id: stops.LMK_NORTH_EAST_HARBOR_SEA_STREET,
    location: {
      latitude: 44.29478073,
      longitude: -68.28958893
    },
    stopName: "NEH Sea St"
  },
  {
    description: "LMK_BROWN_MOUNTAIN_GATEHOUSE_DESC",
    features: ["restroom", "walk", "hike", "bike"],
    landmarkType: "point-of-interest",
    displayName: "Brown Mountain Gatehouse",
    id: stops.LMK_BROWN_MOUNTAIN_GATEHOUSE,
    location: {
      latitude: 44.31218338,
      longitude: -68.28541565
    },
    stopName: "Gate House"
  },
  {
    description: "LMK_BASS_HARBOR_FERRY_DESC",
    features: ["ferry"],
    landmarkType: "ferry-transport",
    displayName: "Bass Harbor Ferry Terminal",
    id: stops.LMK_BASS_HARBOR_FERRY,
    location: {
      latitude: 44.23500061,
      longitude: 34738159
    },
    stopName: "Bass Harbor"
  },
  {
    description: "LMK_WH_FERRY_TERMINAL_DESC",
    features: ["ferry"],
    landmarkType: "ferry-transport",
    displayName: "Winter Harbor Ferry Terminal",
    id: stops.LMK_WH_FERRY_TERMINAL,
    location: {
      latitude: 44.39276123,
      longitude: -68.07952881
    },
    stopName: "Winter Harbor Ferry"
  },
  {
    features: ["dine"],
    landmarkType: "point-of-interest",
    displayName: "Winter Harbor",
    id: stops.LMK_WINTER_HARBOR,
    location: {
      latitude: 44.39128876,
      longitude: -68.08921051
    },
    stopName: "Winter Harbor"
  },
  {
    description: "LMK_SCHOODIC_POINT_DESC",
    features: ["restroom", "wonder", "park"],
    landmarkType: "point-of-interest",
    displayName: "Schoodic Point",
    id: stops.LMK_SCHOODIC_POINT,
    location: {
      latitude: 44.33314896,
      longitude: -68.06096649
    },
    stopName: "Schoodic Point"
  },
  {
    features: ["dine"],
    landmarkType: "point-of-interest",
    displayName: "Birch Harbor",
    id: stops.LMK_BIRCH_HARBOR,
    location: {
      latitude: 44.38780212,
      longitude: -68.03931427
    },
    stopName: "Birch Harbor"
  },
  {
    displayName: "Prospect Harbor",
    features: ["inn"],
    id: stops.LMK_PROSPECT_HARBOR,
    landmarkType: "point-of-interest",
    location: {
      latitude: 44.40686798,
      longitude: -68.02690125
    },
    stopName: "Prospect Harbor"
  },
  {
    features: ["camp"],
    landmarkType: "campground",
    displayName: "Mount Desert Campground",
    id: stops.LMK_MOUNT_DESERT_CAMPGROUND,
    location: {
      latitude: 44.36645889,
      longitude: -68.31780243
    },
    stopName: "Mount Dessert Campground"
  },
  {
    description: "TRH_BLACK_WOODS_DESC",
    features: ["walk"],
    landmarkType: "trail-crossing",
    displayName: "Black Woods Trail",
    id: stops.TRH_BLACK_WOODS,
    location: {
      latitude: 44.30659866,
      longitude: -68.20140076
    },
    stopName: "Black Woods Trail"
  },
  {
    description: "LMK_LITTLE_HUNTERS_BEACH_DESC",
    features: ["wonder"],
    id: stops.LMK_LITTLE_HUNTERS_BEACH,
    landmarkType: "point-of-interest",
    displayName: "Little Hunters Beach",
    location: {
      latitude: 44.298611124889234,
      longitude: -68.21121526429744
    },
    stopName: "Hunters Beach"
  },
  {
    features: ["inn"],
    landmarkType: "lodging",
    displayName: "Edenbrook Motel",
    id: stops.LMK_EDENBROOK_MOTEL,
    location: {
      latitude: 44.39410019,
      longitude: -68.22350311
    },
    stopName: "Edenbrook Motel"
  },
  {
    description: "LMK_TOWN_HILL_DESC",
    features: ["dine"],
    landmarkType: "point-of-interest",
    displayName: "Town Hill",
    id: stops.LMK_TOWN_HILL,
    location: {
      latitude: 44.39901733,
      longitude: -68.33446503
    },
    stopName: "Town Hill"
  },
  {
    features: ["inn"],
    landmarkType: "lodging",
    displayName: "Hampton Inn Bar Harbor",
    id: stops.LMK_HAMPTON_INN_BAR_HARBOR,
    location: {
      latitude: 44.390103,
      longitude: -68.22244
    },
    stopName: "Hampton Inn"
  },
  {
    features: ["park"],
    description: "LMK_ACADIA_GATEWAY_CENTER_DESC",
    landmarkType: "ground-transport",
    displayName: "Acadia Gateway Center",
    id: stops.LMK_ACADIA_GATEWAY_CENTER,
    location: {
      latitude: 44.470624,
      longitude: -68.371438
    },
    stopName: "Acadia Gateway Center"
  },
  {
    description: "LMK_PARKMAN_MOUNTAIN_DESC",
    features: ["restroom", "walk", "hike", "climb", "bike"],
    landmarkType: "trail-head",
    displayName: "Parkman Mountain",
    id: stops.LMK_PARKMAN_MOUNTAIN,
    location: {
      latitude: 44.329011,
      longitude: -68.293192
    },
    stopName: "Parkman  Mountain"
  },
  {
    features: ["camp"],
    landmarkType: "campground",
    displayName: "Schoodic Woods Campground",
    id: stops.LMK_SCHOODIC_WOODS_CAMPGROUND,
    location: {
      latitude: 44.380588,
      longitude: -68.067864
    },
    stopName: "Schoodic Woods Campground"
  },
  {
    description: "LMK_ACADIA_NATIONAL_PARK_HQ_DESC",
    landmarkType: "point-of-interest",
    displayName: "Acadia National Park Headquarters",
    id: stops.LMK_ACADIA_NATIONAL_PARK_HQ,
    location: {
      latitude: 44.37443,
      longitude: -68.25934
    },
    stopName: "Acadia National Park Headquarters"
  },
  {
    description: "TRH_CADILLAC_NORTH_RIDGE_DESC",
    id: stops.TRH_CADILLAC_NORTH_RIDGE_2ND,
    refId: 20,
    stopName: "Cadillac North Ridge Inbound"
  },
  {
    description: "LMK_FABBRI_DESC",
    features: ["restroom", "water", "picnic", "walk", "hike"],
    id: stops.LMK_FABBRI,
    landmarkType: "point-of-interest",
    displayName: "Fabbri",
    location: {
      latitude: 44.31440877420992,
      longitude: -68.19509798015814
    },
    stopName: "Fabbri Picnic Area"
  },
  {
    description: "LMK_MANSET_DOCK_DESC",
    displayName: "Manset Dock",
    features: ["ferry", "fishing-pier", "boat-launch"],
    id: stops.LMK_MANSET_DOCK,
    landmarkType: "ferry-transport",
    location: {
      latitude: 44.268904,
      longitude: -68.309941
    },
    stopName: "Manset Dock"
  },
  {
    features: ["park"],
    description: "LMK_MCKINLEYS_STORE_DESC",
    landmarkType: "point-of-interest",
    displayName: "McKinley's Store",
    id: stops.LMK_MCKINLEYS_STORE,
    location: {
      latitude: 44.251246,
      longitude: -68.343666
    },
    stopName: "McKinleys Store"
  },
  {
    id: stops.LMK_SCHOODIC_WOODS_2,
    refId: 79,
    stopName: "Schoodic Woods2"
  },
  {
    description: "LMK_OTTER_POINT_DESC",
    displayName: "Otter Point",
    features: ["wonder"],
    id: stops.LMK_OTTER_POINT,
    landmarkType: "point-of-interest",
    location: {
      latitude: 44.307236,
      longitude: -68.191312
    },
    stopName: "Otter Point"
  },
  {
    description: "LMK_ACADIA_MOUNTAIN_DESC",
    displayName: "Acadia Mountain",
    features: ["hike"],
    id: stops.LMK_ACADIA_MOUNTAIN,
    landmarkType: "trail-head",
    location: {
      latitude: 44.322398,
      longitude: -68.332654
    },
    stopName: "Acadia Mountain"
  },
  {
    id: stops.LMK_WINTER_HARBOR_2,
    refId: 57,
    stopName: "Winter Harbor 2"
  },
  {
    description: "LMK_OTTER_CLIFFS_DESC",
    id: stops.LMK_OTTER_CLIFFS_2ND,
    refId: 24
  },
  {
    description: "LMK_SEAL_HARBOR_DESC",
    id: stops.LMK_SEAL_HARBOR_2ND,
    refId: 31
  },
  {
    description: "LMK_EAGLE_LAKE_DESC",
    id: stops.LMK_EAGLE_LAKE_2ND,
    refId: 34
  },
  {
    description: "LMK_PARKMAN_MOUNTAIN_DESC",
    id: stops.LMK_PARKMAN_MOUNTAIN_2ND,
    refId: 77
  },
  {
    description: "TRH_CADILLAC_NORTH_RIDGE_DESC",
    id: stops.TRH_CADILLAC_NORTH_RIDGE_3RD,
    refId: 20
  },
  {
    description: "LMK_OTTER_POINT_DESC",
    id: stops.LMK_OTTER_POINT_2ND,
    refId: 92
  },
  {
    id: stops.LMK_TERAMOR_RESORT,
    features: ["camp"],
    landmarkType: "campground",
    displayName: "Teramor Resort",
    location: {
      latitude: 44.40440036730379,
      longitude: -68.34294606630657
    }
  },
  {
    description: "TRH_BUBBLE_ROCK_DESC",
    features: ["hike"],
    id: stops.TRH_BUBBLE_ROCK,
    landmarkType: "trail-head",
    displayName: "Bubble Rock",
    location: {
      latitude: 44.34119439548791,
      longitude: -68.25039989627989
    },
    stopName: "Bubble Rock"
  },
  {
    description: "LMK_FABBRI_MONUMENT_DESC",
    features: ["restroom", "water", "picnic", "walk", "hike"],
    id: stops.LMK_FABBRI_MONUMENT,
    landmarkType: "point-of-interest",
    displayName: "Fabbri Monument",
    location: {
      latitude: 44.314157664169166,
      longitude: -68.19603738042137
    },
    stopName: "Fabbri Tower Site"
  },
  {
    description: "TRH_CHAMPLAIN_NORTH_RIDGE_DESC",
    features: ["hike"],
    id: stops.TRH_CHAMPLAIN_NORTH_RIDGE,
    landmarkType: "trail-head",
    displayName: "Champlain North Ridge Trailhead",
    location: {
      latitude: 44.3629374,
      longitude: -68.1933965
    }
  },
  {
    description: "TRH_BLACK_WOODS_DESC",
    id: stops.TRH_BLACK_WOODS_2ND,
    refId: 65
  },
  {
    description: "TRH_ORANGE_AND_BLACK_DESC",
    features: ["hike"],
    id: stops.TRH_ORANGE_AND_BLACK,
    landmarkType: "trail-head",
    displayName: "Orange and Black Path",
    location: {
      latitude: 44.3567838,
      longitude: -68.1888969
    }
  },
  {
    description: "TRH_PRECIPICE_DESC",
    features: ["walk", "hike", "climb"],
    id: stops.TRH_PRECIPICE,
    landmarkType: "trail-head",
    displayName: "Precipice Trailhead",
    location: {
      latitude: 44.3494761423687,
      longitude: -68.18807842390841
    },
    stopName: "Precipice Trail"
  },
  {
    description: "TRH_BOWL_DESC",
    features: ["hike", "climb"],
    id: stops.TRH_BOWL,
    landmarkType: "trail-head",
    displayName: "Bowl Trailhead",
    location: {
      latitude: 44.3317138,
      longitude: -68.1856059
    }
  },
  {
    description: "TRH_GORHAM_DESC",
    features: ["hike"],
    id: stops.TRH_GORHAM,
    landmarkType: "trail-head",
    displayName: "Gorham Mountain Trailhead",
    location: {
      latitude: 44.316489,
      longitude: -68.1918483
    }
  },
  {
    description: "TRL_OTTER_COVE_DESC",
    features: ["hike"],
    id: stops.TRL_OTTER_COVE,
    landmarkType: "trail-crossing",
    displayName: "Otter Cove Trail",
    location: {
      latitude: 44.31733275927135,
      longitude: -68.1962493345326
    }
  },
  {
    description: "TRH_CANON_BROOK_DESC",
    features: ["hike"],
    id: stops.TRH_CANON_BROOK,
    landmarkType: "trail-head",
    displayName: "Cañon Brook Trailhead",
    location: {
      latitude: 44.34816545694036,
      longitude: -68.20226354782417
    }
  },
  {
    description: "TRH_LADDER_TRAIL_DESC",
    features: ["hike", "climb"],
    id: stops.TRH_LADDER_TRAIL,
    landmarkType: "trail-head",
    displayName: "Ladder Trail Trailhead",
    location: {
      latitude: 44.35189343674089,
      longitude: -68.20449126814941
    }
  },
  {
    description: "TRL_BEACHCROFT_PATH_DESC",
    features: ["hike", "climb"],
    id: stops.TRL_BEACHCROFT_PATH,
    landmarkType: "trail-crossing",
    displayName: "Beachcroft Path",
    location: {
      latitude: 44.35841380191816,
      longitude: -68.20541024561048
    }
  },
  {
    description: "TRL_GORGE_PATH_DESC",
    features: ["hike"],
    id: stops.TRL_GORGE_PATH,
    landmarkType: "trail-crossing",
    displayName: "Gorge Path",
    location: {
      latitude: 44.37262620397349,
      longitude: -68.22193907439807
    }
  },
  {
    description: "TRL_KEBO_MOUNTAIN_DESC",
    features: ["hike"],
    id: stops.TRL_KEBO_MOUNTAIN,
    landmarkType: "trail-crossing",
    displayName: "Kebo Mountain Trail",
    location: {
      latitude: 44.37693791110443,
      longitude: -68.21903042526775
    }
  },
  {
    description: "TRH_STRATHEDEN_PATH_DESC",
    features: ["hike"],
    id: stops.TRH_STRATHEDEN_PATH,
    landmarkType: "trail-head",
    displayName: "Stratheden Path Trailhead",
    location: {
      latitude: 44.37578062864385,
      longitude: -68.21725877688762
    }
  },
  {
    description: "LMK_THUNDER_HOLE_DESC",
    id: stops.LMK_THUNDER_HOLE_2ND,
    refId: 23
  },
  {
    description: "LMK_BUBBLE_POND_DESC",
    id: stops.LMK_BUBBLE_POND_2ND,
    refId: 28
  },
  {
    description: "LMK_LITTLE_HUNTERS_BEACH_DESC",
    id: stops.LMK_LITTLE_HUNTERS_BEACH_2ND,
    refId: 66
  },
  {
    description: "TRL_JESSUP_PATH_DESC",
    features: ["walk"],
    id: stops.TRL_JESSUP_PATH,
    landmarkType: "trail-crossing",
    displayName: "Jessup Path",
    location: {
      latitude: 44.37147285820582,
      longitude: -68.21197164015284
    }
  },
  {
    description: "LMK_BEAVER_DAM_POND_DESC",
    features: ["wonder"],
    id: stops.LMK_BEAVER_DAM_POND,
    landmarkType: "point-of-interest",
    displayName: "Beaver Dam Pond",
    location: {
      latitude: 44.36248156454828,
      longitude: -68.19549011673008
    }
  },
  {
    description: "TRH_HUNTERS_BROOK_TRAIL_DESC",
    features: ["hike"],
    id: stops.TRH_HUNTERS_BROOK_TRAIL,
    landmarkType: "trail-head",
    displayName: "Hunters Brook Trail",
    location: {
      latitude: 44.30983510606855,
      longitude: -68.22264482851874
    }
  },
  {
    description: "TRH_TRIAD_TRAIL_DESC",
    features: ["hike"],
    id: stops.TRH_TRIAD_TRAIL,
    landmarkType: "trail-head",
    displayName: "Triad Trail",
    location: {
      latitude: 44.31595017090449,
      longitude: -68.23409670111407
    }
  },
  {
    description: "LMK_JORDAN_POND_GATEHOUSE_DESC",
    features: ["bike", "walk"],
    id: stops.LMK_JORDAN_POND_GATEHOUSE,
    landmarkType: "point-of-interest",
    displayName: "Jordan Pond Gatehouse",
    location: {
      latitude: 44.31915676131903,
      longitude: -68.25240951525198
    }
  },
  {
    description: "TRL_JORDAN_BUBBLE_PONDS_TRAIL_DESC",
    features: ["hike"],
    id: stops.TRL_JORDAN_BUBBLE_PONDS_TRAIL,
    landmarkType: "trail-crossing",
    displayName: "Jordan Pond-Bubble Pond Trail",
    location: {
      latitude: 44.32368440026856,
      longitude: -68.24845341308759
    }
  },
  {
    description: "TRH_JORDAN_POND_CARRY_ACCESS_TRAIL_DESC",
    features: ["hike"],
    id: stops.TRH_JORDAN_POND_CARRY_ACCESS_TRAIL,
    landmarkType: "trail-crossing",
    displayName: "Jordan Pond North",
    location: {
      latitude: 44.33821367016567,
      longitude: -68.25056431160856
    }
  },
  {
    description: "TRH_BUBBLES_TRAIL_DESC",
    features: ["hike"],
    id: stops.TRH_BUBBLES_TRAIL,
    landmarkType: "trail-head",
    displayName: "Bubbles Trail",
    location: {
      latitude: 44.34119439548791,
      longitude: -68.25039989627989
    }
  },
  {
    description: "TRH_GIANT_SLIDE_DESC",
    features: ["hike"],
    id: stops.TRH_GIANT_SLIDE,
    landmarkType: "trail-head",
    displayName: "Giant Slide Trail",
    location: {
      latitude: 44.35021597609928,
      longitude: -68.30184365726595
    }
  },
  {
    description: "LMK_ASTICOU_AZALEA_GARDEN_DESC",
    features: ["accessible", "walk"],
    id: stops.LMK_ASTICOU_AZALEA_GARDEN,
    landmarkType: "point-of-interest",
    displayName: "Asticou Azalea Garden",
    location: {
      latitude: 44.305556,
      longitude: -68.2840012
    }
  },
  {
    description: "TRH_ASTICOU_TERRACES_PATH_DESC",
    features: ["hike"],
    id: stops.TRH_ASTICOU_TERRACES_PATH,
    landmarkType: "trail-head",
    displayName: "Asticou Terraces",
    location: {
      latitude: 44.30016659928465,
      longitude: -68.27966687290977
    }
  },
  {
    description: "TRL_HADLOCK_PONDS_DESC",
    features: ["hike"],
    id: stops.TRL_HADLOCK_PONDS,
    landmarkType: "trail-crossing",
    displayName: "Hadlock Ponds Trail",
    location: {
      latitude: 44.31784586583491,
      longitude: -68.28774498334826
    }
  },
  {
    description: "LMK_SEAWALL_DESC",
    features: ["accessible", "wonder", "picnic"],
    id: stops.LMK_SEAWALL,
    landmarkType: "point-of-interest",
    displayName: "Seawall",
    location: {
      latitude: 44.2415699,
      longitude: -68.3009923
    }
  },
  {
    description: "TRH_ST_SAUVEUR_TRAIL_DESC",
    features: ["hike"],
    id: stops.TRH_ST_SAUVEUR_TRAIL,
    landmarkType: "trail-head",
    displayName: "St. Sauveur Mountain Trail",
    location: {
      latitude: 44.32168180267373,
      longitude: -68.33276638656265
    }
  },
  {
    features: ["picnic", "restroom"],
    id: stops.LMK_FRAZER_POINT,
    landmarkType: "point-of-interest",
    displayName: "Frazer Point",
    location: {
      latitude: 44.37565341073958,
      longitude: -68.0752401749348
    }
  },
  {
    description: "TRH_SCHOODIC_HEAD_ANVIL_TRAIL_DESC",
    features: ["hike"],
    id: stops.TRH_SCHOODIC_HEAD_ANVIL_TRAIL,
    landmarkType: "trail-head",
    displayName: "Anvil Trail",
    location: {
      latitude: 44.3403817731503,
      longitude: -68.04474835305578
    }
  },
  {
    description: "TRH_SCHOODIC_HEAD_EAST_TRAIL_DESC",
    features: ["hike"],
    id: stops.TRH_SCHOODIC_HEAD_EAST_TRAIL,
    landmarkType: "trail-head",
    displayName: "East Trail",
    location: {
      latitude: 44.352105588360374,
      longitude: -68.04719000014778
    }
  },
  {
    description: "TRH_SCHOONER_HEAD_PATH_DESC",
    features: ["hike", "walk"],
    id: stops.TRH_SCHOONER_HEAD_PATH,
    landmarkType: "trail-head",
    displayName: "Schooner Head Path",
    location: {
      latitude: 44.373738229176,
      longitude: -68.19767768244493
    }
  },
  {
    description: "TRH_HADLOCK_BROOK_TRAIL_DESC",
    features: ["hike", "climb"],
    id: stops.TRH_HADLOCK_BROOK_TRAIL,
    landmarkType: "trail-head",
    displayName: "Hadlock Brook Trail",
    location: {
      latitude: 44.32588169359566,
      longitude: -68.29122890429686
    }
  },
  {
    description: "POI_FRENCHMAN_BAY_OVERLOOK_DESC",
    features: ["wonder"],
    id: stops.POI_FRENCHMAN_BAY_OVERLOOK,
    landmarkType: "point-of-interest",
    displayName: "Frenchman Bay Overlook",
    location: {
      latitude: 44.405356249540176,
      longitude: -68.23711089683502
    }
  },
  {
    description: "POI_BAR_HARBOR_OVERLOOK_DESC",
    features: ["wonder"],
    id: stops.POI_BAR_HARBOR_OVERLOOK,
    landmarkType: "point-of-interest",
    displayName: "Bar Harbor Overlook",
    location: {
      latitude: 44.37850634045994,
      longitude: -68.22913313908144
    }
  },
  {
    description: "POI_SOMESVILLE_BRIDGE_DESC",
    features: ["wonder"],
    id: stops.POI_SOMESVILLE_BRIDGE,
    landmarkType: "point-of-interest",
    displayName: "Somesville Bridge",
    location: {
      latitude: 44.361806963932594,
      longitude: -68.3349187719791
    }
  }
];

export default landmarks;
