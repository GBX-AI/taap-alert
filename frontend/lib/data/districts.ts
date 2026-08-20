import type { AreaClimate } from '../forecast/model';

/**
 * Rajasthan administrative units, seeded for the prototype.
 *
 * lon/lat are real district-headquarters coordinates so the map is a genuine
 * projection rather than a schematic. Boundaries are a hand-traced outline —
 * production must load LGD-coded polygons (FR-1.7).
 *
 * tmax / humidity / normalMax are SYNTHETIC and stand in for the downscaling
 * pipeline (FRD M2). Replace by pointing DataProvider at the real API.
 */

export type UnitKind = 'block' | 'ward';

export interface Block {
  id: string;
  en: string;
  hi: string;
  districtId: string;
  kind: UnitKind;
  climate: AreaClimate;
}

export interface District {
  id: string;
  en: string;
  hi: string;
  /** Three-letter code used on the map. */
  ab: string;
  lon: number;
  lat: number;
  kind: UnitKind;
  blocks: Block[];
}

/** State boundary, traced clockwise from the northern salient. */
export const RAJASTHAN_OUTLINE: ReadonlyArray<readonly [number, number]> = [[73.88,30.25],[74.7,29.95],[75.2,29.55],[75.95,28.55],[76.45,28.3],[76.98,28.12],[77.32,28.02],[77.62,27.45],[78.3,26.95],[77.88,26.42],[77.12,26.1],[76.92,25.55],[77.3,24.95],[76.62,24.08],[75.88,24.15],[75.02,23.72],[74.55,23.05],[73.92,23.28],[73.45,24.12],[72.88,24.34],[72.3,24.55],[71.62,24.66],[71.1,25.05],[70.55,25.7],[69.55,26.2],[69.88,27.1],[70.55,27.75],[71.15,28.15],[72.2,28.4],[72.92,29.1],[73.38,29.78]];

const STALE_BLOCKS = new Set(['shergarh']);

const raw = [
  {
    "id": "ganganagar",
    "en": "Sri Ganganagar",
    "hi": "श्रीगंगानगर",
    "ab": "SGN",
    "lon": 73.88,
    "lat": 29.92,
    "tmax": 44.5,
    "humidity": 34,
    "kind": "block",
    "normalMax": 39,
    "blocks": [
      {
        "id": "suratgarh",
        "en": "Suratgarh",
        "hi": "Suratgarh"
      },
      {
        "id": "anupgarh",
        "en": "Anupgarh",
        "hi": "Anupgarh"
      },
      {
        "id": "karanpur",
        "en": "Karanpur",
        "hi": "Karanpur"
      },
      {
        "id": "padampur",
        "en": "Padampur",
        "hi": "Padampur"
      }
    ]
  },
  {
    "id": "hanumangarh",
    "en": "Hanumangarh",
    "hi": "हनुमानगढ़",
    "ab": "HNM",
    "lon": 74.32,
    "lat": 29.58,
    "tmax": 44,
    "humidity": 35,
    "kind": "block",
    "normalMax": 38.5,
    "blocks": [
      {
        "id": "nohar",
        "en": "Nohar",
        "hi": "Nohar"
      },
      {
        "id": "bhadra",
        "en": "Bhadra",
        "hi": "Bhadra"
      },
      {
        "id": "pilibanga",
        "en": "Pilibanga",
        "hi": "Pilibanga"
      },
      {
        "id": "sangaria",
        "en": "Sangaria",
        "hi": "Sangaria"
      }
    ]
  },
  {
    "id": "bikaner",
    "en": "Bikaner",
    "hi": "बीकानेर",
    "ab": "BKN",
    "lon": 73.31,
    "lat": 28.02,
    "tmax": 46.5,
    "humidity": 28,
    "kind": "block",
    "normalMax": 43.5,
    "blocks": [
      {
        "id": "nokha",
        "en": "Nokha",
        "hi": "Nokha"
      },
      {
        "id": "lunkaransar",
        "en": "Lunkaransar",
        "hi": "Lunkaransar"
      },
      {
        "id": "kolayat",
        "en": "Kolayat",
        "hi": "Kolayat"
      },
      {
        "id": "dungargarh",
        "en": "Dungargarh",
        "hi": "Dungargarh"
      }
    ]
  },
  {
    "id": "churu",
    "en": "Churu",
    "hi": "चूरू",
    "ab": "CRU",
    "lon": 74.97,
    "lat": 28.3,
    "tmax": 46,
    "humidity": 30,
    "kind": "block",
    "normalMax": 42.5,
    "blocks": [
      {
        "id": "ratangarh",
        "en": "Ratangarh",
        "hi": "Ratangarh"
      },
      {
        "id": "sardarshahar",
        "en": "Sardarshahar",
        "hi": "Sardarshahar"
      },
      {
        "id": "taranagar",
        "en": "Taranagar",
        "hi": "Taranagar"
      },
      {
        "id": "sujangarh",
        "en": "Sujangarh",
        "hi": "Sujangarh"
      }
    ]
  },
  {
    "id": "jhunjhunu",
    "en": "Jhunjhunu",
    "hi": "झुंझुनूं",
    "ab": "JHJ",
    "lon": 75.4,
    "lat": 28.13,
    "tmax": 43.5,
    "humidity": 34,
    "kind": "block",
    "normalMax": 37,
    "blocks": [
      {
        "id": "chirawa",
        "en": "Chirawa",
        "hi": "Chirawa"
      },
      {
        "id": "khetri",
        "en": "Khetri",
        "hi": "Khetri"
      },
      {
        "id": "udaipurwati",
        "en": "Udaipurwati",
        "hi": "Udaipurwati"
      },
      {
        "id": "nawalgarh",
        "en": "Nawalgarh",
        "hi": "Nawalgarh"
      }
    ]
  },
  {
    "id": "alwar",
    "en": "Alwar",
    "hi": "अलवर",
    "ab": "ALW",
    "lon": 76.63,
    "lat": 27.55,
    "tmax": 42,
    "humidity": 40,
    "kind": "block",
    "normalMax": 36,
    "blocks": [
      {
        "id": "behror",
        "en": "Behror",
        "hi": "Behror"
      },
      {
        "id": "rajgarh",
        "en": "Rajgarh",
        "hi": "Rajgarh"
      },
      {
        "id": "tijara",
        "en": "Tijara",
        "hi": "Tijara"
      },
      {
        "id": "bansur",
        "en": "Bansur",
        "hi": "Bansur"
      }
    ]
  },
  {
    "id": "jaisalmer",
    "en": "Jaisalmer",
    "hi": "जैसलमेर",
    "ab": "JSM",
    "lon": 70.92,
    "lat": 26.92,
    "tmax": 47,
    "humidity": 24,
    "kind": "block",
    "normalMax": 44,
    "blocks": [
      {
        "id": "pokhran",
        "en": "Pokhran",
        "hi": "Pokhran"
      },
      {
        "id": "sam",
        "en": "Sam",
        "hi": "Sam"
      },
      {
        "id": "fatehgarh",
        "en": "Fatehgarh",
        "hi": "Fatehgarh"
      },
      {
        "id": "ramgarh",
        "en": "Ramgarh",
        "hi": "Ramgarh"
      }
    ]
  },
  {
    "id": "nagaur",
    "en": "Nagaur",
    "hi": "नागौर",
    "ab": "NGR",
    "lon": 73.73,
    "lat": 27.2,
    "tmax": 45,
    "humidity": 32,
    "kind": "block",
    "normalMax": 42,
    "blocks": [
      {
        "id": "merta",
        "en": "Merta",
        "hi": "Merta"
      },
      {
        "id": "didwana",
        "en": "Didwana",
        "hi": "Didwana"
      },
      {
        "id": "makrana",
        "en": "Makrana",
        "hi": "Makrana"
      },
      {
        "id": "parbatsar",
        "en": "Parbatsar",
        "hi": "Parbatsar"
      }
    ]
  },
  {
    "id": "sikar",
    "en": "Sikar",
    "hi": "सीकर",
    "ab": "SKR",
    "lon": 75.14,
    "lat": 27.61,
    "tmax": 43,
    "humidity": 35,
    "kind": "block",
    "normalMax": 36.5,
    "blocks": [
      {
        "id": "fatehpur",
        "en": "Fatehpur",
        "hi": "Fatehpur"
      },
      {
        "id": "lachhmangarh",
        "en": "Lachhmangarh",
        "hi": "Lachhmangarh"
      },
      {
        "id": "neemkathana",
        "en": "Neem Ka Thana",
        "hi": "Neem Ka Thana"
      },
      {
        "id": "srimadhopur",
        "en": "Sri Madhopur",
        "hi": "Sri Madhopur"
      }
    ]
  },
  {
    "id": "jaipur",
    "en": "Jaipur",
    "hi": "जयपुर",
    "ab": "JPR",
    "lon": 75.79,
    "lat": 26.92,
    "tmax": 42.5,
    "humidity": 39,
    "kind": "ward",
    "normalMax": 36.5,
    "blocks": [
      {
        "id": "sanganer",
        "en": "Ward 41 Sanganer",
        "hi": "Ward 41 Sanganer"
      },
      {
        "id": "amber",
        "en": "Ward 12 Amber",
        "hi": "Ward 12 Amber"
      },
      {
        "id": "chomu",
        "en": "Chomu",
        "hi": "Chomu"
      },
      {
        "id": "bassi",
        "en": "Bassi",
        "hi": "Bassi"
      }
    ]
  },
  {
    "id": "dausa",
    "en": "Dausa",
    "hi": "दौसा",
    "ab": "DSA",
    "lon": 76.34,
    "lat": 26.89,
    "tmax": 42,
    "humidity": 39,
    "kind": "block",
    "normalMax": 36,
    "blocks": [
      {
        "id": "bandikui",
        "en": "Bandikui",
        "hi": "Bandikui"
      },
      {
        "id": "lalsot",
        "en": "Lalsot",
        "hi": "Lalsot"
      },
      {
        "id": "sikrai",
        "en": "Sikrai",
        "hi": "Sikrai"
      },
      {
        "id": "mahwa",
        "en": "Mahwa",
        "hi": "Mahwa"
      }
    ]
  },
  {
    "id": "bharatpur",
    "en": "Bharatpur",
    "hi": "भरतपुर",
    "ab": "BTP",
    "lon": 77.49,
    "lat": 27.22,
    "tmax": 43,
    "humidity": 43,
    "kind": "block",
    "normalMax": 36.5,
    "blocks": [
      {
        "id": "deeg",
        "en": "Deeg",
        "hi": "Deeg"
      },
      {
        "id": "nadbai",
        "en": "Nadbai",
        "hi": "Nadbai"
      },
      {
        "id": "kaman",
        "en": "Kaman",
        "hi": "Kaman"
      },
      {
        "id": "bayana",
        "en": "Bayana",
        "hi": "Bayana"
      }
    ]
  },
  {
    "id": "jodhpur",
    "en": "Jodhpur",
    "hi": "जोधपुर",
    "ab": "JDH",
    "lon": 73.02,
    "lat": 26.24,
    "tmax": 47.5,
    "humidity": 28,
    "kind": "block",
    "normalMax": 43,
    "blocks": [
      {
        "id": "phalodi",
        "en": "Phalodi",
        "hi": "फलौदी"
      },
      {
        "id": "bap",
        "en": "Bap",
        "hi": "बाप"
      },
      {
        "id": "shergarh",
        "en": "Shergarh",
        "hi": "शेरगढ़"
      },
      {
        "id": "osian",
        "en": "Osian",
        "hi": "ओसियाँ"
      },
      {
        "id": "balesar",
        "en": "Balesar",
        "hi": "बालेसर"
      },
      {
        "id": "luni",
        "en": "Luni",
        "hi": "लूणी"
      },
      {
        "id": "bhopalgarh",
        "en": "Bhopalgarh",
        "hi": "भोपालगढ़"
      },
      {
        "id": "bilara",
        "en": "Bilara",
        "hi": "बिलाड़ा"
      }
    ]
  },
  {
    "id": "ajmer",
    "en": "Ajmer",
    "hi": "अजमेर",
    "ab": "AJM",
    "lon": 74.64,
    "lat": 26.45,
    "tmax": 42,
    "humidity": 37,
    "kind": "block",
    "normalMax": 36,
    "blocks": [
      {
        "id": "kishangarh",
        "en": "Kishangarh",
        "hi": "Kishangarh"
      },
      {
        "id": "beawar",
        "en": "Beawar",
        "hi": "Beawar"
      },
      {
        "id": "nasirabad",
        "en": "Nasirabad",
        "hi": "Nasirabad"
      },
      {
        "id": "pushkar",
        "en": "Pushkar",
        "hi": "Pushkar"
      }
    ]
  },
  {
    "id": "tonk",
    "en": "Tonk",
    "hi": "टोंक",
    "ab": "TNK",
    "lon": 75.79,
    "lat": 26.17,
    "tmax": 42.5,
    "humidity": 38,
    "kind": "block",
    "normalMax": 36.5,
    "blocks": [
      {
        "id": "malpura",
        "en": "Malpura",
        "hi": "Malpura"
      },
      {
        "id": "niwai",
        "en": "Niwai",
        "hi": "Niwai"
      },
      {
        "id": "deoli",
        "en": "Deoli",
        "hi": "Deoli"
      },
      {
        "id": "uniara",
        "en": "Uniara",
        "hi": "Uniara"
      }
    ]
  },
  {
    "id": "karauli",
    "en": "Karauli",
    "hi": "करौली",
    "ab": "KRL",
    "lon": 77.02,
    "lat": 26.5,
    "tmax": 43,
    "humidity": 41,
    "kind": "block",
    "normalMax": 36.5,
    "blocks": [
      {
        "id": "hindaun",
        "en": "Hindaun",
        "hi": "Hindaun"
      },
      {
        "id": "todabhim",
        "en": "Todabhim",
        "hi": "Todabhim"
      },
      {
        "id": "sapotra",
        "en": "Sapotra",
        "hi": "Sapotra"
      },
      {
        "id": "mandrayal",
        "en": "Mandrayal",
        "hi": "Mandrayal"
      }
    ]
  },
  {
    "id": "dholpur",
    "en": "Dholpur",
    "hi": "धौलपुर",
    "ab": "DHL",
    "lon": 77.89,
    "lat": 26.7,
    "tmax": 43.5,
    "humidity": 43,
    "kind": "block",
    "normalMax": 37,
    "blocks": [
      {
        "id": "bari",
        "en": "Bari",
        "hi": "Bari"
      },
      {
        "id": "baseri",
        "en": "Baseri",
        "hi": "Baseri"
      },
      {
        "id": "rajakhera",
        "en": "Rajakhera",
        "hi": "Rajakhera"
      },
      {
        "id": "saipau",
        "en": "Saipau",
        "hi": "Saipau"
      }
    ]
  },
  {
    "id": "barmer",
    "en": "Barmer",
    "hi": "बाड़मेर",
    "ab": "BMR",
    "lon": 71.39,
    "lat": 25.75,
    "tmax": 46.5,
    "humidity": 26,
    "kind": "block",
    "normalMax": 44,
    "blocks": [
      {
        "id": "baytu",
        "en": "Baytu",
        "hi": "Baytu"
      },
      {
        "id": "chohtan",
        "en": "Chohtan",
        "hi": "Chohtan"
      },
      {
        "id": "siwana",
        "en": "Siwana",
        "hi": "Siwana"
      },
      {
        "id": "balotra",
        "en": "Balotra",
        "hi": "Balotra"
      }
    ]
  },
  {
    "id": "pali",
    "en": "Pali",
    "hi": "पाली",
    "ab": "PAL",
    "lon": 73.33,
    "lat": 25.77,
    "tmax": 43.5,
    "humidity": 34,
    "kind": "block",
    "normalMax": 37.5,
    "blocks": [
      {
        "id": "sojat",
        "en": "Sojat",
        "hi": "Sojat"
      },
      {
        "id": "marwar",
        "en": "Marwar Jn",
        "hi": "Marwar Jn"
      },
      {
        "id": "bali",
        "en": "Bali",
        "hi": "Bali"
      },
      {
        "id": "desuri",
        "en": "Desuri",
        "hi": "Desuri"
      }
    ]
  },
  {
    "id": "bhilwara",
    "en": "Bhilwara",
    "hi": "भीलवाड़ा",
    "ab": "BHL",
    "lon": 74.63,
    "lat": 25.35,
    "tmax": 41,
    "humidity": 40,
    "kind": "block",
    "normalMax": 38,
    "blocks": [
      {
        "id": "shahpura",
        "en": "Shahpura",
        "hi": "Shahpura"
      },
      {
        "id": "gangapur",
        "en": "Gangapur",
        "hi": "Gangapur"
      },
      {
        "id": "mandalgarh",
        "en": "Mandalgarh",
        "hi": "Mandalgarh"
      },
      {
        "id": "jahazpur",
        "en": "Jahazpur",
        "hi": "Jahazpur"
      }
    ]
  },
  {
    "id": "sawaimadhopur",
    "en": "Sawai Madhopur",
    "hi": "सवाई माधोपुर",
    "ab": "SWM",
    "lon": 76.35,
    "lat": 26.02,
    "tmax": 42.5,
    "humidity": 41,
    "kind": "block",
    "normalMax": 36.5,
    "blocks": [
      {
        "id": "gangapurcity",
        "en": "Gangapur City",
        "hi": "Gangapur City"
      },
      {
        "id": "bamanwas",
        "en": "Bamanwas",
        "hi": "Bamanwas"
      },
      {
        "id": "bonli",
        "en": "Bonli",
        "hi": "Bonli"
      },
      {
        "id": "khandar",
        "en": "Khandar",
        "hi": "Khandar"
      }
    ]
  },
  {
    "id": "jalore",
    "en": "Jalore",
    "hi": "जालोर",
    "ab": "JLR",
    "lon": 72.62,
    "lat": 25.35,
    "tmax": 45,
    "humidity": 30,
    "kind": "block",
    "normalMax": 42.5,
    "blocks": [
      {
        "id": "sanchore",
        "en": "Sanchore",
        "hi": "Sanchore"
      },
      {
        "id": "bhinmal",
        "en": "Bhinmal",
        "hi": "Bhinmal"
      },
      {
        "id": "ahore",
        "en": "Ahore",
        "hi": "Ahore"
      },
      {
        "id": "raniwara",
        "en": "Raniwara",
        "hi": "Raniwara"
      }
    ]
  },
  {
    "id": "rajsamand",
    "en": "Rajsamand",
    "hi": "राजसमंद",
    "ab": "RJS",
    "lon": 73.88,
    "lat": 25.07,
    "tmax": 39.5,
    "humidity": 42,
    "kind": "block",
    "normalMax": 36,
    "blocks": [
      {
        "id": "nathdwara",
        "en": "Nathdwara",
        "hi": "Nathdwara"
      },
      {
        "id": "deogarh",
        "en": "Deogarh",
        "hi": "Deogarh"
      },
      {
        "id": "amet",
        "en": "Amet",
        "hi": "Amet"
      },
      {
        "id": "bhim",
        "en": "Bhim",
        "hi": "Bhim"
      }
    ]
  },
  {
    "id": "chittorgarh",
    "en": "Chittorgarh",
    "hi": "चित्तौड़गढ़",
    "ab": "CTG",
    "lon": 74.63,
    "lat": 24.88,
    "tmax": 40.5,
    "humidity": 43,
    "kind": "block",
    "normalMax": 37,
    "blocks": [
      {
        "id": "nimbahera",
        "en": "Nimbahera",
        "hi": "Nimbahera"
      },
      {
        "id": "begun",
        "en": "Begun",
        "hi": "Begun"
      },
      {
        "id": "kapasan",
        "en": "Kapasan",
        "hi": "Kapasan"
      },
      {
        "id": "rashmi",
        "en": "Rashmi",
        "hi": "Rashmi"
      }
    ]
  },
  {
    "id": "bundi",
    "en": "Bundi",
    "hi": "बूंदी",
    "ab": "BND",
    "lon": 75.64,
    "lat": 25.44,
    "tmax": 42,
    "humidity": 42,
    "kind": "block",
    "normalMax": 36,
    "blocks": [
      {
        "id": "hindoli",
        "en": "Hindoli",
        "hi": "Hindoli"
      },
      {
        "id": "keshoraipatan",
        "en": "Keshoraipatan",
        "hi": "Keshoraipatan"
      },
      {
        "id": "nainwa",
        "en": "Nainwa",
        "hi": "Nainwa"
      },
      {
        "id": "talera",
        "en": "Talera",
        "hi": "Talera"
      }
    ]
  },
  {
    "id": "kota",
    "en": "Kota",
    "hi": "कोटा",
    "ab": "KOT",
    "lon": 75.83,
    "lat": 25.18,
    "tmax": 43.5,
    "humidity": 44,
    "kind": "ward",
    "normalMax": 36.5,
    "blocks": [
      {
        "id": "ladpura",
        "en": "Ward 28 Ladpura",
        "hi": "Ward 28 Ladpura"
      },
      {
        "id": "ramganjmandi",
        "en": "Ramganjmandi",
        "hi": "Ramganjmandi"
      },
      {
        "id": "sangod",
        "en": "Sangod",
        "hi": "Sangod"
      },
      {
        "id": "digod",
        "en": "Digod",
        "hi": "Digod"
      }
    ]
  },
  {
    "id": "baran",
    "en": "Baran",
    "hi": "बारां",
    "ab": "BRN",
    "lon": 76.51,
    "lat": 25.1,
    "tmax": 42.5,
    "humidity": 45,
    "kind": "block",
    "normalMax": 36,
    "blocks": [
      {
        "id": "anta",
        "en": "Anta",
        "hi": "Anta"
      },
      {
        "id": "chhabra",
        "en": "Chhabra",
        "hi": "Chhabra"
      },
      {
        "id": "mangrol",
        "en": "Mangrol",
        "hi": "Mangrol"
      },
      {
        "id": "shahabad",
        "en": "Shahabad",
        "hi": "Shahabad"
      }
    ]
  },
  {
    "id": "sirohi",
    "en": "Sirohi",
    "hi": "सिरोही",
    "ab": "SRH",
    "lon": 72.86,
    "lat": 24.88,
    "tmax": 39,
    "humidity": 44,
    "kind": "block",
    "normalMax": 35.5,
    "blocks": [
      {
        "id": "abroad",
        "en": "Abu Road",
        "hi": "Abu Road"
      },
      {
        "id": "pindwara",
        "en": "Pindwara",
        "hi": "Pindwara"
      },
      {
        "id": "sheoganj",
        "en": "Sheoganj",
        "hi": "Sheoganj"
      },
      {
        "id": "reodar",
        "en": "Reodar",
        "hi": "Reodar"
      }
    ]
  },
  {
    "id": "udaipur",
    "en": "Udaipur",
    "hi": "उदयपुर",
    "ab": "UDR",
    "lon": 73.68,
    "lat": 24.58,
    "tmax": 39.5,
    "humidity": 45,
    "kind": "ward",
    "normalMax": 35,
    "blocks": [
      {
        "id": "girwa",
        "en": "Ward 9 Girwa",
        "hi": "Ward 9 Girwa"
      },
      {
        "id": "mavli",
        "en": "Mavli",
        "hi": "Mavli"
      },
      {
        "id": "gogunda",
        "en": "Gogunda",
        "hi": "Gogunda"
      },
      {
        "id": "salumber",
        "en": "Salumber",
        "hi": "Salumber"
      }
    ]
  },
  {
    "id": "pratapgarh",
    "en": "Pratapgarh",
    "hi": "प्रतापगढ़",
    "ab": "PTG",
    "lon": 74.78,
    "lat": 24.03,
    "tmax": 38.5,
    "humidity": 47,
    "kind": "block",
    "normalMax": 34.5,
    "blocks": [
      {
        "id": "chhotisadri",
        "en": "Chhoti Sadri",
        "hi": "Chhoti Sadri"
      },
      {
        "id": "arnod",
        "en": "Arnod",
        "hi": "Arnod"
      },
      {
        "id": "dhariawad",
        "en": "Dhariawad",
        "hi": "Dhariawad"
      },
      {
        "id": "peepalkhoont",
        "en": "Peepalkhoont",
        "hi": "Peepalkhoont"
      }
    ]
  },
  {
    "id": "jhalawar",
    "en": "Jhalawar",
    "hi": "झालावाड़",
    "ab": "JHL",
    "lon": 76.16,
    "lat": 24.6,
    "tmax": 41.5,
    "humidity": 46,
    "kind": "block",
    "normalMax": 38,
    "blocks": [
      {
        "id": "bhawanimandi",
        "en": "Bhawanimandi",
        "hi": "Bhawanimandi"
      },
      {
        "id": "aklera",
        "en": "Aklera",
        "hi": "Aklera"
      },
      {
        "id": "khanpur",
        "en": "Khanpur",
        "hi": "Khanpur"
      },
      {
        "id": "pirawa",
        "en": "Pirawa",
        "hi": "Pirawa"
      }
    ]
  },
  {
    "id": "dungarpur",
    "en": "Dungarpur",
    "hi": "डूंगरपुर",
    "ab": "DGP",
    "lon": 73.71,
    "lat": 23.84,
    "tmax": 39.5,
    "humidity": 48,
    "kind": "block",
    "normalMax": 35.5,
    "blocks": [
      {
        "id": "sagwara",
        "en": "Sagwara",
        "hi": "Sagwara"
      },
      {
        "id": "aspur",
        "en": "Aspur",
        "hi": "Aspur"
      },
      {
        "id": "bichhiwara",
        "en": "Bichhiwara",
        "hi": "Bichhiwara"
      },
      {
        "id": "simalwara",
        "en": "Simalwara",
        "hi": "Simalwara"
      }
    ]
  },
  {
    "id": "banswara",
    "en": "Banswara",
    "hi": "बांसवाड़ा",
    "ab": "BNS",
    "lon": 74.44,
    "lat": 23.55,
    "tmax": 39.5,
    "humidity": 48,
    "kind": "block",
    "normalMax": 35.5,
    "blocks": [
      {
        "id": "ghatol",
        "en": "Ghatol",
        "hi": "Ghatol"
      },
      {
        "id": "bagidora",
        "en": "Bagidora",
        "hi": "Bagidora"
      },
      {
        "id": "kushalgarh",
        "en": "Kushalgarh",
        "hi": "Kushalgarh"
      },
      {
        "id": "garhi",
        "en": "Garhi",
        "hi": "Garhi"
      }
    ]
  }
] as const;

export const DISTRICTS: District[] = raw.map((r) => {
  const blocks: Block[] = r.blocks.map((b, i) => ({
    id: b.id,
    en: b.en,
    hi: b.hi,
    districtId: r.id,
    kind: r.kind as UnitKind,
    climate: {
      tmax: +(r.tmax - i * 0.85).toFixed(1),
      tmin: +(r.tmax - 15 - i * 0.35).toFixed(1),
      humidity: r.humidity + i * 1.5,
      normalMax: +(r.normalMax - i * 0.5).toFixed(1),
      stale: STALE_BLOCKS.has(b.id),
    },
  }));
  return { id: r.id, en: r.en, hi: r.hi, ab: r.ab, lon: r.lon, lat: r.lat, kind: r.kind as UnitKind, blocks };
});

export const ALL_BLOCKS: Block[] = DISTRICTS.flatMap((d) => d.blocks);
export const districtById = (id: string) => DISTRICTS.find((d) => d.id === id);
export const blockById = (id: string) => ALL_BLOCKS.find((b) => b.id === id);
