/**
 * ChainSa — Myanmar Earth Intelligence Platform
 * Bilingual Engine & Interactive Workspace Controller
 */

// Application State
const state = {
  lang: 'en', // 'en' | 'my'
  soundVolume: 75, // 0 - 100
  selectedPersona: 'farmers',
  selectedDomain: 'agriculture',
  selectedIndicator: {
    id: 'ndvi',
    domain: 'agriculture',
    nameEn: 'Vegetation Health (NDVI)',
    nameMy: 'သီးနှံပင် ကျန်းမာရေး ညွှန်းကိန်း (NDVI)',
    code: 'MODIS_MOD13Q1_NDVI',
    unit: 'Index [-1.0 to 1.0]',
    currentVal: '0.68',
    status: 'Optimal'
  },
  selectedRegion: {
    id: 'kunlong',
    nameEn: 'Kunlong',
    nameMy: 'ကွမ်းလုံ',
    divisionEn: 'Shan State (North)',
    divisionMy: 'ရှမ်းပြည်နယ် (မြောက်ပိုင်း)',
    lat: '23.4167',
    lon: '98.6500',
    meanTemp: '21.4 °C',
    rainfall: '1,420 mm',
    soilMoisture: '34.2 %',
    population: '68,400'
  },
  startDate: '2020-01-01',
  endDate: '2025-12-31',
  activeMapLayer: 'temp', // 'temp' | 'drought' | 'ndvi' | 'rain'
  mapZoom: 1,
  mapPan: { x: 0, y: 0 },
  isDraggingMap: false,
  dragStart: { x: 0, y: 0 }
};

// Web Audio API Sound Engine
let audioCtx = null;
function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playSound(type) {
  if (state.soundVolume <= 0) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime((state.soundVolume / 100) * 0.18, ctx.currentTime);
    masterGain.connect(ctx.destination);

    if (type === 'click') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } else if (type === 'switch') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(680, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.8, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } else if (type === 'apply') {
      // Dual harmonic chime
      [587.33, 880].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.04);
        gain.gain.setValueAtTime(0.6, ctx.currentTime + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.18);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(ctx.currentTime + idx * 0.04);
        osc.stop(ctx.currentTime + 0.18);
      });
    }
  } catch (e) {
    // Audio context may be restricted before interaction
  }
}

// Indicator Directory Catalog (36 Indicators)
const indicatorCatalog = [
  // Agriculture (5)
  { id: 'ndvi', domain: 'agriculture', nameEn: 'Vegetation Health (NDVI)', nameMy: 'သီးနှံပင် ကျန်းမာရေး ညွှန်းကိန်း (NDVI)', count: '5', code: 'MODIS_MOD13Q1_NDVI', unit: 'Index [-1.0 to 1.0]', defaultVal: '0.68' },
  { id: 'soil_moist', domain: 'agriculture', nameEn: 'Root-Zone Soil Moisture', nameMy: 'အမြစ်ဇုန် မြေဆီလွှာ စိုထိုင်းဆ', code: 'SMAP_L4_SM_GPH', unit: 'm³/m³', defaultVal: '0.34' },
  { id: 'crop_stress', domain: 'agriculture', nameEn: 'Crop Water Stress Anomaly', nameMy: 'သီးနှံ ရေငတ်မွတ်မှု ပုံမှန်မဟုတ်မှု', code: 'ECOSTRESS_ESI', unit: 'Standard Deviation', defaultVal: '-0.24' },
  { id: 'evapo', domain: 'agriculture', nameEn: 'Actual Evapotranspiration', nameMy: 'အမှန်တကယ် ရေငွေ့ပျံထွက်နှုန်း', code: 'MOD16A2_ET', unit: 'mm / 8-day', defaultVal: '28.4 mm' },
  { id: 'crop_stage', domain: 'agriculture', nameEn: 'Crop Phenology & Harvest Stage', nameMy: 'သီးနှံဖွံ့ဖြိုးမှုနှင့် ရိတ်သိမ်းချိန် အဆင့်', code: 'S2_PHENOLOGY', unit: 'Calendar Phase', defaultVal: 'Grain Filling' },

  // Infrastructure & Urban (7)
  { id: 'viirs_lights', domain: 'infrastructure', nameEn: 'Nighttime Lights Radiance', nameMy: 'ညအချိန် မီးရောင်ခြည်ထွက်မှု (VIIRS)', count: '7', code: 'VIIRS_DNB_MONTHLY', unit: 'nW/cm²/sr', defaultVal: '14.2' },
  { id: 'impervious', domain: 'infrastructure', nameEn: 'Impervious Surface Density', nameMy: 'ရေမစိမ့်ဝင်နိုင်သော မြေမျက်နှာပြင် သိပ်သည်းဆ', code: 'LANDSAT_IMPERVIOUS', unit: '% area', defaultVal: '48.6 %' },
  { id: 'urban_rate', domain: 'infrastructure', nameEn: 'Annual Urban Expansion Rate', nameMy: 'နှစ်စဉ် မြို့ပြတိုးချဲ့မှုနှုန်း', code: 'GHSL_BUILT_S', unit: '% / year', defaultVal: '+3.8 %' },
  { id: 'settlement', domain: 'infrastructure', nameEn: 'Settlement Footprint Footprint', nameMy: 'လူနေအခြေချမှု နယ်နိမိတ် ခြေရာ', code: 'WSF_EVOLUTION', unit: 'km²', defaultVal: '124 km²' },
  { id: 'road_net', domain: 'infrastructure', nameEn: 'Road Network Connectivity Index', nameMy: 'လမ်းကွန်ရက် ဆက်သွယ်မှု ညွှန်းကိန်း', code: 'OSM_DENSITY_INDEX', unit: 'km/km²', defaultVal: '1.82' },
  { id: 'built_density', domain: 'infrastructure', nameEn: 'Built-up Volume Index', nameMy: 'အဆောက်အအုံ ထုထည်ညွှန်းကိန်း', code: 'GHSL_BUILT_V', unit: 'm³/m²', defaultVal: '4.1' },
  { id: 'uhii', domain: 'infrastructure', nameEn: 'Urban Heat Island Intensity', nameMy: 'မြို့ပြအပူကျွန်း ပြင်းအား (UHII)', code: 'MODIS_UHI_LST', unit: 'Δ °C', defaultVal: '+2.8 °C' },

  // Water (6)
  { id: 'surface_water', domain: 'water', nameEn: 'Surface Water Extent Dynamics', nameMy: 'မျက်နှာပြင် ရေပြင်ကျယ် ပြောင်းလဲမှု', count: '6', code: 'JRC_GSW_MONTHLY', unit: 'km²', defaultVal: '312 km²' },
  { id: 'river_flow', domain: 'water', nameEn: 'Ayeyarwady River Discharge', nameMy: 'ဧရာဝတီမြစ် ရေစီးဆင်းမှု ပမာဏ', code: 'SWOT_RIVER_Q', unit: 'm³/s', defaultVal: '4,280 m³/s' },
  { id: 'reservoir', domain: 'water', nameEn: 'Reservoir Storage Capacity Ratio', nameMy: 'ဆည်ကန် ရေသိုလှောင်မှု အချိုး', code: 'ICESAT2_RESERVOIR', unit: '% capacity', defaultVal: '72.4 %' },
  { id: 'flood_inundation', domain: 'water', nameEn: 'Flood Inundation Risk Map', nameMy: 'ရေလွှမ်းမိုးမှု အန္တရာယ် မြေပုံ', code: 'SENTINEL1_SAR_WATER', unit: 'Hazard Class [1-5]', defaultVal: 'Class 2' },
  { id: 'wetland', domain: 'water', nameEn: 'Wetland Saturation Index', nameMy: 'စိုစွတ်မြေ စိုထိုင်းမှု ညွှန်းကိန်း', code: 'CYGNSS_SOIL_WET', unit: 'Index [0-100]', defaultVal: '68' },
  { id: 'turbidity', domain: 'water', nameEn: 'Water Quality Turbidity (TSS)', nameMy: 'ရေအရည်အသွေး နောက်ကျိမှု (TSS)', code: 'S2_NECHAD_TURB', unit: 'FNU', defaultVal: '18.4' },

  // Energy & Electricity (5)
  { id: 'solar_ghi', domain: 'energy', nameEn: 'Global Horizontal Solar Irradiance', nameMy: 'ကမ္ဘာမြေပြင် နေရောင်ခြည် ဖြာထွက်မှု (GHI)', count: '5', code: 'HIMAWARI8_GHI', unit: 'kWh/m²/day', defaultVal: '5.42' },
  { id: 'wind_density', domain: 'energy', nameEn: 'Wind Power Density at 100m', nameMy: 'မီတာ ၁၀၀ အမြင့် လေစွမ်းအင် သိပ်သည်းဆ', code: 'ERA5_WIND_100M', unit: 'W/m²', defaultVal: '280 W/m²' },
  { id: 'microgrid', domain: 'energy', nameEn: 'Microgrid Solar-Storage Feasibility', nameMy: 'ဆိုလာ မိုက်ခရိုဂရစ် ဖြစ်နိုင်ခြေ', code: 'SOLAR_BESS_INDEX', unit: 'Score [0-10]', defaultVal: '8.4' },
  { id: 'grid_proximity', domain: 'energy', nameEn: 'National Grid Proximity', nameMy: 'အမျိုးသား ဓာတ်အားလိုင်း အကွာအဝေး', code: 'MIMU_GRID_DISTANCE', unit: 'km distance', defaultVal: '14.8 km' },
  { id: 'biomass', domain: 'energy', nameEn: 'Agricultural Biomass Yield', nameMy: 'စိုက်ပျိုးရေး ဇီဝဒြပ်ထု စွမ်းအင် အထွက်နှုန်း', code: 'RESIDUE_ENERGY_MAP', unit: 'tons/ha/yr', defaultVal: '3.6' },

  // Environmental Change (7)
  { id: 'tree_loss', domain: 'environment', nameEn: 'Tree Canopy Cover Loss', nameMy: 'သစ်တော အုပ်ဆိုင်းမှု ဆုံးရှုံးမှု', count: '7', code: 'HANSEN_GFC_LOSS', unit: 'Hectares / yr', defaultVal: '-420 ha' },
  { id: 'mangrove', domain: 'environment', nameEn: 'Coastal Mangrove Ecosystem Health', nameMy: 'ကမ်းရိုးတန်း လမုတော ဂေဟစနစ် ကျန်းမာရေး', code: 'GMW_MANGROVE_V3', unit: 'Canopy Density %', defaultVal: '82 %' },
  { id: 'fire_frp', domain: 'environment', nameEn: 'Fire Radiative Power (FRP)', nameMy: 'တောမီး အပူစွမ်းအင် ပြင်းအား (FRP)', code: 'VIIRS_NPP_FRP', unit: 'MW', defaultVal: '0.0 MW' },
  { id: 'carbon_density', domain: 'environment', nameEn: 'Aboveground Biomass Carbon', nameMy: 'မြေပေါ် ဇီဝဒြပ်ထု ကာဗွန် သိပ်သည်းဆ', code: 'GEDI_L4B_BIOMASS', unit: 'Mg C / ha', defaultVal: '142 Mg' },
  { id: 'degradation', domain: 'environment', nameEn: 'Land Degradation Neutrality (LDN)', nameMy: 'မြေဆီလွှာ ပျက်စီးယိုယွင်းမှု ညွှန်းကိန်း', code: 'PRAIS4_LDN_METRIC', unit: 'Status Tier', defaultVal: 'Stable' },
  { id: 'protected_pressure', domain: 'environment', nameEn: 'Protected Area Human Pressure', nameMy: 'ဘေးမဲ့တော လူသားသက်ရောက်မှု ဖိအား', code: 'WDPA_HUMAN_FOOTPRINT', unit: 'Pressure Index', defaultVal: 'Low (1.4)' },
  { id: 'biodiversity', domain: 'environment', nameEn: 'Biodiversity Intactness Index', nameMy: 'ဇီဝမျိုးစုံမျိုးကွဲ မပျက်မစီးမှု ညွှန်းကိန်း', code: 'PREDICTS_BII', unit: '% intactness', defaultVal: '76.8 %' },

  // Disaster Intelligence (6)
  { id: 'cyclone_track', domain: 'disaster', nameEn: 'Bay of Bengal Cyclone Trajectory', nameMy: 'ဘင်္ဂလားပင်လယ်အော် မုန်တိုင်း လမ်းကြောင်း', count: '6', code: 'JTWC_CYCLONE_WATCH', unit: 'Knots / Saffir-Simp', defaultVal: 'Tropical Dep' },
  { id: 'flash_flood', domain: 'disaster', nameEn: 'Flash Flood Guidance (FFG)', nameMy: 'ရုတ်တရက် မိုးကြီးရေလျှံမှု လမ်းညွှန်', code: 'MRMS_FLASH_FLOOD', unit: 'mm threshold', defaultVal: '65 mm / 6hr' },
  { id: 'earthquake_pga', domain: 'disaster', nameEn: 'Sagaing Fault Peak Acceleration', nameMy: 'စစ်ကိုင်းပြတ်ရွေ့ မြေငလျင် အမြင့်ဆုံးအလျင်', code: 'USGS_SHAKEMAP_PGA', unit: '% g (gravity)', defaultVal: '0.04 g' },
  { id: 'drought_spei', domain: 'disaster', nameEn: 'Standardized Drought Index (SPEI-3)', nameMy: 'စံပြု မိုးခေါင်ရေရှားမှု ညွှန်းကိန်း (SPEI-3)', code: 'CSIC_SPEI_GLOBAL', unit: 'Z-score', defaultVal: '-1.42 (Moderate)' },
  { id: 'landslide', domain: 'disaster', nameEn: 'Rain-Triggered Landslide Hazard', nameMy: 'မိုးကြောင့် မြေပြိုနိုင်ခြေ အန္တရာယ်', code: 'LHASA2_GLOBAL', unit: 'Probability %', defaultVal: '12 %' },
  { id: 'extreme_heat', domain: 'disaster', nameEn: 'Heat Index Wet-Bulb Warning', nameMy: 'အပူဒဏ်ပြင်းထန်မှု သတိပေးချက် (WBGT)', code: 'NOAA_WBGT_FORECAST', unit: '°C Wet Bulb', defaultVal: '29.2 °C' }
];

// Myanmar Regions & Sample Townships
const regionsCatalog = [
  { id: 'kunlong', nameEn: 'Kunlong', nameMy: 'ကွမ်းလုံ', divisionEn: 'Shan State (North)', divisionMy: 'ရှမ်းပြည်နယ် (မြောက်ပိုင်း)', meanTemp: '21.4 °C', tempNum: 21.37, dateRange: '2025-01-01 — 2025-12-31', statusEn: 'Observed summary • significance not established', statusMy: 'လေ့လာတွေ့ရှိချက် အကျဉ်းချုပ် • သိသာထင်ရှားမှု မသတ်မှတ်ရသေးပါ', x: 380, y: 190 },
  { id: 'yangon', nameEn: 'Yangon', nameMy: 'ရန်ကုန်', divisionEn: 'Yangon Region', divisionMy: 'ရန်ကုန်တိုင်းဒေသကြီး', meanTemp: '27.47 °C', tempNum: 27.47, dateRange: '2025-01-01 — 2025-12-31', statusEn: 'Observed summary • significance not established', statusMy: 'လေ့လာတွေ့ရှိချက် အကျဉ်းချုပ် • သိသာထင်ရှားမှု မသတ်မှတ်ရသေးပါ', x: 260, y: 440 },
  { id: 'mandalay', nameEn: 'Mandalay', nameMy: 'မန္တလေး', divisionEn: 'Mandalay Region', divisionMy: 'မန္တလေးတိုင်းဒေသကြီး', meanTemp: '27.57 °C', tempNum: 27.57, dateRange: '2025-01-01 — 2025-12-31', statusEn: 'Observed summary • significance not established', statusMy: 'လေ့လာတွေ့ရှိချက် အကျဉ်းချုပ် • သိသာထင်ရှားမှု မသတ်မှတ်ရသေးပါ', x: 280, y: 245 },
  { id: 'magway', nameEn: 'Magway', nameMy: 'မကွေး', divisionEn: 'Magway Region', divisionMy: 'မကွေးတိုင်းဒေသကြီး', meanTemp: '27.76 °C', tempNum: 27.76, dateRange: '2025-01-01 — 2025-12-31', statusEn: 'Observed summary • significance not established', statusMy: 'လေ့လာတွေ့ရှိချက် အကျဉ်းချုပ် • သိသာထင်ရှားမှု မသတ်မှတ်ရသေးပါ', x: 230, y: 310 },
  { id: 'shan', nameEn: 'Shan', nameMy: 'ရှမ်း', divisionEn: 'Shan State', divisionMy: 'ရှမ်းပြည်နယ်', meanTemp: '21.37 °C', tempNum: 21.37, dateRange: '2025-01-01 — 2025-12-31', statusEn: 'Observed summary • significance not established', statusMy: 'လေ့လာတွေ့ရှိချက် အကျဉ်းချုပ် • သိသာထင်ရှားမှု မသတ်မှတ်ရသေးပါ', x: 360, y: 250 },
  { id: 'ayeyarwady', nameEn: 'Ayeyarwady', nameMy: 'ဧရာဝတီ', divisionEn: 'Ayeyarwady Region', divisionMy: 'ဧရာဝတီတိုင်းဒေသကြီး', meanTemp: '27.87 °C', tempNum: 27.87, dateRange: '2025-01-01 — 2025-12-31', statusEn: 'Observed summary • significance not established', statusMy: 'လေ့လာတွေ့ရှိချက် အကျဉ်းချုပ် • သိသာထင်ရှားမှု မသတ်မှတ်ရသေးပါ', x: 210, y: 450 }
];

// Persona Data for AI Decision Support
const personaData = {
  farmers: {
    questionEn: 'Based on these trends, what should farmers in Yangon consider?',
    questionMy: 'ဤလားရာများအပေါ် အခြေခံ၍ ရန်ကုန်ရှိ တောင်သူများအနေဖြင့် မည်သည်တို့ကို ထည့်သွင်းစဉ်းစားသင့်သနည်း။',
    actionsEn: [
      'Consider drought-resistant crop varieties.',
      'Adjust planting schedule with updated seasonal rainfall forecasts.',
      'Monitor soil moisture and adopt efficient irrigation (e.g., drip irrigation).'
    ],
    actionsMy: [
      'မိုးခေါင်ဒဏ်ခံ သီးနှံမျိုးစိတ်များကို စဉ်းစားစိုက်ပျိုးရန်။',
      'နောက်ဆုံးရ ရာသီဥတု မိုးလေဝသခန့်မှန်းချက်များနှင့်အညီ စိုက်ပျိုးချိန်ဇယားကို ချိန်ညှိရန်။',
      'မြေဆီလွှာစိုထိုင်းဆကို စောင့်ကြည့်ပြီး ရေခြွေတာနိုင်သော ရေသွင်းနည်းစနစ်များ (ဥပမာ- အစက်ချရေသွင်းစနစ်) ကျင့်သုံးရန်။'
    ]
  },
  planners: {
    questionEn: 'How should Yangon infrastructure planners respond to surface heat anomalies?',
    questionMy: 'ရန်ကုန်မြို့ပြ အခြေခံအဆောက်အအုံ စီမံကိန်းရေးဆွဲသူများ မြေမျက်နှာပြင် အပူချိန်လွန်ကဲမှုကို မည်သို့တုံ့ပြန်သင့်သနည်း။',
    actionsEn: [
      'Mandate high-albedo cool roofs and permeable pavements in high-density development zones.',
      'Prioritize urban green corridor expansion in northern and eastern industrial expansions.',
      'Audit storm drainage network capacity against 50-year rainfall surge projections.'
    ],
    actionsMy: [
      'လူနေထူထပ်သော ဖွံ့ဖြိုးရေးဇုန်များတွင် အပူပြန်ဟပ်သည့် အမိုးများနှင့် ရေစိမ့်ဝင်လွယ်သော လမ်းခင်းပစ္စည်းများကို သတ်မှတ်အသုံးပြုရန်။',
      'မြောက်ပိုင်းနှင့် အရှေ့ပိုင်း စက်မှုဇုန်များတွင် မြို့ပြစိမ်းလန်းစိုပြေရေး သစ်ပင်စင်္ကြံများ တိုးချဲ့ခြင်းကို ဦးစားပေးရန်။',
      'နှစ် ၅၀ အတွင်း ဖြစ်ပေါ်နိုင်သော မိုးသည်းထန်မှု ခန့်မှန်းချက်များနှင့် ချိန်ညှိ၍ မိုးရေနုတ်မြောင်းကွန်ရက် စွမ်းရည်ကို စစ်ဆေးရန်။'
    ]
  },
  disaster: {
    questionEn: 'What early warning protocols are indicated for southern Ayeyarwady basin?',
    questionMy: 'ဧရာဝတီမြစ်ဝကျွန်းပေါ် တောင်ပိုင်းဒေသအတွက် မည်သည့် ကြိုတင်သတိပေး စနစ်များကို ညွှန်ပြထားသနည်း။',
    actionsEn: [
      'Pre-position satellite-linked emergency communications in river mouth townships.',
      'Track 72-hour soil saturation indices to anticipate rapid localized embankment failures.',
      'Verify evacuation shelter solar battery reserves and clean water filtration caches.'
    ],
    actionsMy: [
      'မြစ်ဝကျွန်းပေါ် မြို့နယ်များတွင် ဂြိုဟ်တုဆက်သွယ်ရေး အရေးပေါ် စက်ကိရိယာများကို ကြိုတင်နေရာချထားရန်။',
      'တာတမံများ ရုတ်တရက် ကျိုးပေါက်နိုင်ခြေကို သိရှိနိုင်ရန် ၇၂ နာရီအတွင်း မြေဆီလွှာ ရေစိုထိုင်းမှု ညွှန်းကိန်းကို စောင့်ကြည့်ရန်။',
      'ဘေးလွတ်ရာ ကယ်ဆယ်ရေးစခန်းများရှိ ဆိုလာဘက်ထရီ အရန်အင်အားနှင့် သန့်ရှင်းသော သောက်သုံးရေ စစ်စနစ်များကို စစ်ဆေးရန်။'
    ]
  }
};

// Bilingual Strings
const i18n = {
  en: {
    brandSubtitle: 'MYANMAR EARTH INTELLIGENCE',
    heroEyebrow: 'Satellite intelligence for every township',
    heroDetect: 'Detect',
    heroDetectSub: 'the Change.',
    heroUnderstand: 'Understand',
    heroUnderstandSub: 'the Trend.',
    heroMakeBetter: 'Make Better',
    heroDecisions: 'Decisions.',
    heroDescription: 'NASA Earth observation data for Myanmar, turned into clear trends and AI guidance you can act on.',
    exploreLiveTrends: 'Explore Live Trends',
    openWorkspace: 'Open Map Workspace',
    
    // Bento Domain Titles & Descriptions
    domainAgriTitle: 'Agriculture',
    domainAgriDesc: 'Crop health, rainfall, soil, temperature',
    domainInfraTitle: 'Infrastructure & Urban Change',
    domainInfraDesc: 'Land use, urban growth, construction',
    domainWaterTitle: 'Water',
    domainWaterDesc: 'Water resources, river, water supply',
    domainEnergyTitle: 'Energy & Electricity',
    domainEnergyDesc: 'Solar potential, electricity access, demand',
    domainEnvTitle: 'Environmental Change',
    domainEnvDesc: 'Forest, biodiversity, land cover',
    domainDisasterTitle: 'Disaster Intelligence',
    domainDisasterDesc: 'Flood, storm, earthquake, drought',

    // AI Decision Support
    aiAssistantEyebrow: 'EARTH SYSTEM ASSISTANT',
    aiAssistantTitle: 'AI Decision Support',
    aiAssistantSubtitle: 'Pick who you are. The assistant reads the same data and answers for your decision.',
    personaFarmers: 'Farmers',
    personaPlanners: 'Urban planners',
    personaDisaster: 'Disaster teams',
    sampleBadge: 'Sample',
    recommendedActionsTitle: 'Recommended Actions',

    // Observed Trends
    observedKicker: 'OBSERVED CHANGE',
    observedTitle: 'Observed Trends',
    observedSubtitle: 'Explore changes over time and check whether the available observations support a statistically significant trend.',
    viewObservations: 'View observations →',
    meanTempLabel: 'Mean air temperature',

    // Workspace
    workspaceTitle: 'Township Earth Observation Workspace',
    workspaceSubtitle: '3-Pane interactive analytics engine powered by NASA Earth observations',
    indicatorsHeader: 'Indicators',
    searchPlaceholder: 'Search indicators...',
    filterAll: 'All Domains',
    step1Badge: '1 Selected Indicator',
    step2Badge: '2 Selected Region',
    step3Badge: '3 Date range',
    step4Badge: '4 Apply selection',
    startDateLabel: 'Start Date',
    endDateLabel: 'End Date',
    utcNote: 'Earth observations are processed in UTC at 00:00 and 12:00 daily.',
    viewDataBtn: 'View Data',
    analyzingData: 'Analyzing NASA Feed...',
    activeLayer: 'Active Map Layer:',
    layerTemp: 'Temperature',
    layerDrought: 'Drought Index',
    layerNDVI: 'Vegetation Health',
    layerRain: 'Rainfall Anomaly',

    // Settings Popover
    settingsHeading: 'Platform Settings',
    settingsSub: 'ChainSa workspace preferences',
    langLabel: 'Language',
    themeLabel: 'Theme',
    themeDark: 'Dark view',
    soundLabel: 'Sound Volume',
    closeBtn: 'Close',

    // AI Floating Chat
    aiChatBtn: 'AI chat',
    aiChatTitle: 'ChainSa Earth Intelligence AI',
    aiChatSubtitle: 'Ask climate, crop, and geospatial queries for any township',
    aiChatPlaceholder: 'Ask a question about Myanmar satellite data...',
    aiChatSend: 'Send Query',
    suggestedQueries: 'Suggested Queries:'
  },
  my: {
    brandSubtitle: 'မြန်မာနိုင်ငံ ကမ္ဘာမြေလေ့လာရေး ထောက်လှမ်းမှု',
    heroEyebrow: 'မြို့နယ်တိုင်းအတွက် ဂြိုဟ်တုအချက်အလက် ထောက်လှမ်းမှု',
    heroDetect: 'ရှာဖွေပါ',
    heroDetectSub: 'အပြောင်းအလဲကို။',
    heroUnderstand: 'နားလည်ပါ',
    heroUnderstandSub: 'လားရာလမ်းကြောင်းကို။',
    heroMakeBetter: 'ပိုမိုကောင်းမွန်သော',
    heroDecisions: 'ဆုံးဖြတ်ချက်များ ချမှတ်ပါ။',
    heroDescription: 'မြန်မာနိုင်ငံအတွက် NASA ဂြိုဟ်တုလေ့လာရေး အချက်အလက်များကို ရှင်းလင်းသော လားရာများနှင့် သင်အသုံးချနိုင်မည့် AI လမ်းညွှန်မှုများအဖြစ် ပြောင်းလဲပေးထားသည်။',
    exploreLiveTrends: 'လက်ရှိလားရာများကို စူးစမ်းရန်',
    openWorkspace: 'မြေပုံလုပ်ငန်းခွင် ဖွင့်ရန်',

    // Bento Domain Titles & Descriptions
    domainAgriTitle: 'စိုက်ပျိုးရေး',
    domainAgriDesc: 'သီးနှံကျန်းမာရေး၊ မိုးရေချိန်၊ မြေဆီလွှာ၊ အပူချိန်',
    domainInfraTitle: 'အခြေခံအဆောက်အအုံနှင့် မြို့ပြအပြောင်းအလဲ',
    domainInfraDesc: 'မြေအသုံးချမှု၊ မြို့ပြကြီးထွားမှု၊ ဆောက်လုပ်ရေး',
    domainWaterTitle: 'ရေအရင်းအမြစ်',
    domainWaterDesc: 'ရေအရင်းအမြစ်၊ မြစ်ချောင်းများ၊ ရေပေးဝေမှု',
    domainEnergyTitle: 'စွမ်းအင်နှင့် လျှပ်စစ်',
    domainEnergyDesc: 'နေရောင်ခြည်စွမ်းအင်အလားအလာ၊ လျှပ်စစ်ရရှိမှု၊ ဝယ်လိုအား',
    domainEnvTitle: 'သဘာဝပတ်ဝန်းကျင် အပြောင်းအလဲ',
    domainEnvDesc: 'သစ်တော၊ ဇီဝမျိုးစုံမျိုးကွဲ၊ မြေမျက်နှာပြင်ဖုံးလွှမ်းမှု',
    domainDisasterTitle: 'သဘာဝဘေးအန္တရာယ် ထောက်လှမ်းရေး',
    domainDisasterDesc: 'ရေကြီးမှု၊ မုန်တိုင်း၊ ငလျင်၊ မိုးခေါင်မှု',

    // AI Decision Support
    aiAssistantEyebrow: 'ကမ္ဘာမြေစနစ် အထောက်အကူပြု AI',
    aiAssistantTitle: 'AI ဆုံးဖြတ်ချက် အထောက်အကူပြုစနစ်',
    aiAssistantSubtitle: 'သင့်အခန်းကဏ္ဍကို ရွေးချယ်ပါ။ AI လက်ထောက်သည် တူညီသောအချက်အလက်များကိုဖတ်ရှုပြီး သင့်ဆုံးဖြတ်ချက်အတွက် အဖြေပေးပါမည်။',
    personaFarmers: 'တောင်သူများ',
    personaPlanners: 'မြို့ပြစီမံကိန်းရေးဆွဲသူများ',
    personaDisaster: 'သဘာဝဘေးတုံ့ပြန်ရေးအဖွဲ့များ',
    sampleBadge: 'နမူနာ',
    recommendedActionsTitle: 'အကြံပြုထားသော လုပ်ဆောင်ချက်များ',

    // Observed Trends
    observedKicker: 'လေ့လာတွေ့ရှိချက် အပြောင်းအလဲများ',
    observedTitle: 'တွေ့ရှိရသော လားရာများ',
    observedSubtitle: 'အချိန်နှင့်အမျှ ပြောင်းလဲမှုများကို စူးစမ်းပြီး ရရှိနိုင်သော လေ့လာတွေ့ရှိချက်များက စာရင်းအင်းအရ သိသာထင်ရှားသော လားရာကို ထောက်ခံမှုရှိမရှိ စစ်ဆေးပါ။',
    viewObservations: 'လေ့လာတွေ့ရှိချက်များကို ကြည့်ရန် →',
    meanTempLabel: 'ပျမ်းမျှ လေထုအပူချိန်',

    // Workspace
    workspaceTitle: 'မြို့နယ်အဆင့် ကမ္ဘာမြေလေ့လာရေး လုပ်ငန်းခွင်',
    workspaceSubtitle: 'NASA ဂြိုဟ်တုအချက်အလက်များဖြင့် မောင်းနှင်ထားသော အပြန်အလှန်အသုံးချ ၃ ပိုင်းပါ စနစ်',
    indicatorsHeader: 'ညွှန်ကိန်းများ',
    searchPlaceholder: 'ညွှန်ကိန်းများကို ရှာဖွေပါ...',
    filterAll: 'ကဏ္ဍအားလုံး',
    step1Badge: '၁ ရွေးချယ်ထားသော ညွှန်ကိန်း',
    step2Badge: '၂ ရွေးချယ်ထားသော ဒေသ',
    step3Badge: '၃ ရက်စွဲကာလ',
    step4Badge: '၄ ရွေးချယ်မှုကို အသုံးပြုရန်',
    startDateLabel: 'စတင်ရက်',
    endDateLabel: 'ပြီးဆုံးရက်',
    utcNote: 'မှတ်ချက်- ကမ္ဘာမြေလေ့လာရေး အချက်အလက်များကို နေ့စဉ် UTC ၀၀:၀၀ နှင့် ၁၂:၀၀ နာရီတို့တွင် စီမံဆောင်ရွက်သည်။',
    viewDataBtn: 'အချက်အလက်များကို ကြည့်ရန်',
    analyzingData: 'NASA ဒေတာကို ဆန်းစစ်နေပါသည်...',
    activeLayer: 'လက်ရှိ မြေပုံလွှာ-',
    layerTemp: 'အပူချိန်',
    layerDrought: 'မိုးခေါင်မှု ညွှန်းကိန်း',
    layerNDVI: 'သီးနှံကျန်းမာရေး',
    layerRain: 'မိုးရေချိန် လားရာ',

    // Settings Popover
    settingsHeading: 'စနစ်ဆက်တင်များ',
    settingsSub: 'ChainSa လုပ်ငန်းခွင် ရွေးချယ်မှုများ',
    langLabel: 'ဘာသာစကား',
    themeLabel: 'အသွင်အပြင်',
    themeDark: 'အမှောင်မြင်ကွင်း',
    soundLabel: 'အသံအတိုးအကျယ်',
    closeBtn: 'ပိတ်ရန်',

    // AI Floating Chat
    aiChatBtn: 'AI စကားပြော',
    aiChatTitle: 'ChainSa ကမ္ဘာမြေထောက်လှမ်းရေး AI',
    aiChatSubtitle: 'မည်သည့်မြို့နယ်အတွက်မဆို ရာသီဥတု၊ သီးနှံနှင့် ပထဝီဆိုင်ရာများကို မေးမြန်းပါ',
    aiChatPlaceholder: 'မြန်မာ့ဂြိုဟ်တုဒေတာနှင့်ပတ်သက်၍ မေးမြန်းလိုသည်ကို ရိုက်ထည့်ပါ...',
    aiChatSend: 'မေးခွန်းပို့ရန်',
    suggestedQueries: 'အကြံပြုထားသော မေးခွန်းများ-'
  }
};

// Update entire UI according to language
function applyLanguage(lang) {
  state.lang = lang;
  document.documentElement.lang = lang;
  document.body.setAttribute('lang', lang);

  const dict = i18n[lang];

  // Update text by data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });

  // Update placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (dict[key]) {
      el.setAttribute('placeholder', dict[key]);
    }
  });

  // Update language toggle buttons in popover
  const enBtn = document.getElementById('lang-en-btn');
  const myBtn = document.getElementById('lang-my-btn');
  if (enBtn && myBtn) {
    if (lang === 'en') {
      enBtn.className = 'flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold bg-[#F5C242] text-[#080C17] transition-all shadow-sm';
      myBtn.className = 'flex-1 py-1.5 px-3 rounded-lg text-xs font-medium text-slate-400 hover:text-white transition-all';
    } else {
      myBtn.className = 'flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold bg-[#F5C242] text-[#080C17] transition-all shadow-sm';
      enBtn.className = 'flex-1 py-1.5 px-3 rounded-lg text-xs font-medium text-slate-400 hover:text-white transition-all';
    }
  }

  // Update persona card
  renderPersona();

  // Update observed trends cards
  renderTrendsCards();

  // Update Indicator sidebar and panel
  renderIndicatorsList();
  renderSelectedSummary();
}

// Switch Persona in AI Decision Support
function selectPersona(persona) {
  state.selectedPersona = persona;
  playSound('switch');

  document.querySelectorAll('.persona-tab-btn').forEach(btn => {
    const p = btn.getAttribute('data-persona');
    if (p === persona) {
      btn.className = 'persona-tab-btn px-6 py-2.5 rounded-full text-sm font-semibold bg-white text-[#080C17] shadow-md transition-all';
    } else {
      btn.className = 'persona-tab-btn px-6 py-2.5 rounded-full text-sm font-medium text-slate-300 hover:text-white border border-white/10 hover:border-white/20 transition-all';
    }
  });

  renderPersona();
}

function renderPersona() {
  const pData = personaData[state.selectedPersona];
  if (!pData) return;

  const qEl = document.getElementById('persona-question');
  const actionsList = document.getElementById('persona-actions');

  if (qEl) {
    qEl.textContent = state.lang === 'my' ? pData.questionMy : pData.questionEn;
  }

  if (actionsList) {
    const items = state.lang === 'my' ? pData.actionsMy : pData.actionsEn;
    actionsList.innerHTML = items.map(item => `
      <li class="flex items-start space-x-3 text-slate-300 text-sm leading-relaxed">
        <span class="text-[#52C46B] font-bold mt-0.5 text-base flex-shrink-0">✓</span>
        <span>${item}</span>
      </li>
    `).join('');
  }
}

// Render 5 Observed Trends Cards
function renderTrendsCards() {
  const container = document.getElementById('trends-container');
  if (!container) return;

  const dict = i18n[state.lang];

  container.innerHTML = regionsCatalog.map(reg => {
    const regionName = state.lang === 'my' ? reg.nameMy : reg.nameEn;
    const statusText = state.lang === 'my' ? reg.statusMy : reg.statusEn;
    const viewText = dict.viewObservations;
    const meanLabel = dict.meanTempLabel;

    return `
      <div onclick="selectRegionAndOpen('${reg.id}')" class="glass-panel glass-panel-hover rounded-2xl p-6 cursor-pointer flex flex-col justify-between border border-white/8 hover:border-indigo-500/30 group">
        <div>
          <h4 class="text-xl font-bold text-white group-hover:text-[#F5C242] transition-colors">${regionName}</h4>
          <p class="text-sm text-slate-300 mt-2 font-medium">
            ${meanLabel} <span class="tabular-numbers text-white font-semibold">${reg.meanTemp}</span>
          </p>
          <p class="text-xs text-slate-400 mt-1 tabular-numbers">${reg.dateRange}</p>
        </div>
        <div class="mt-6 pt-4 border-t border-white/5 flex flex-col space-y-3">
          <p class="text-xs text-slate-400 leading-snug">${statusText}</p>
          <span class="inline-flex items-center text-xs font-semibold text-slate-300 group-hover:text-[#52C46B] transition-colors">
            ${viewText}
          </span>
        </div>
      </div>
    `;
  }).join('');
}

// Render Indicators in Left Sidebar (3-Pane Workspace)
function renderIndicatorsList(filterQuery = '') {
  const listContainer = document.getElementById('indicators-accordion');
  if (!listContainer) return;

  const domains = [
    { key: 'agriculture', nameEn: 'Agriculture', nameMy: 'စိုက်ပျိုးရေး', icon: '🌱', color: '#52C46B', img: 'assets/domain-agriculture.jpg' },
    { key: 'infrastructure', nameEn: 'Infrastructure & Urban', nameMy: 'အခြေခံအဆောက်အအုံနှင့် မြို့ပြ', icon: '🏙️', color: '#818CF8', img: 'assets/domain-infrastructure.jpg' },
    { key: 'water', nameEn: 'Water', nameMy: 'ရေအရင်းအမြစ်', icon: '💧', color: '#1982C4', img: 'assets/domain-water.jpg' },
    { key: 'energy', nameEn: 'Energy & Electricity', nameMy: 'စွမ်းအင်နှင့် လျှပ်စစ်', icon: '⚡', color: '#F5C242', img: 'assets/domain-energy.jpg' },
    { key: 'environment', nameEn: 'Environmental Change', nameMy: 'သဘာဝပတ်ဝန်းကျင်', icon: '🌲', color: '#10B981', img: 'assets/domain-environment.jpg' },
    { key: 'disaster', nameEn: 'Disaster Intelligence', nameMy: 'သဘာဝဘေးအန္တရာယ်', icon: '⚠️', color: '#EF4444', img: 'assets/domain-disaster.jpg' }
  ];

  let html = '';

  domains.forEach(domain => {
    let indicators = indicatorCatalog.filter(ind => ind.domain === domain.key);
    if (filterQuery) {
      const q = filterQuery.toLowerCase();
      indicators = indicators.filter(ind => 
        ind.nameEn.toLowerCase().includes(q) || 
        ind.nameMy.includes(q) || 
        ind.code.toLowerCase().includes(q)
      );
    }
    if (indicators.length === 0) return;

    const domainName = state.lang === 'my' ? domain.nameMy : domain.nameEn;
    const isDomainActive = state.selectedDomain === domain.key;

    html += `
      <div class="mb-3 rounded-xl overflow-hidden border border-white/8 bg-[#0F1626]">
        <button onclick="toggleDomainAccordion('${domain.key}')" class="w-full flex items-center justify-between p-3 bg-[#131C2E] hover:bg-[#18233A] transition-colors text-left">
          <div class="flex items-center space-x-2.5">
            <span class="text-base">${domain.icon}</span>
            <span class="text-xs font-bold text-white uppercase tracking-wider">${domainName}</span>
          </div>
          <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/10 text-slate-300">${indicators.length}</span>
        </button>
        <div class="p-2 space-y-1 ${isDomainActive ? 'block' : 'hidden'}" id="domain-sub-${domain.key}">
          ${indicators.map(ind => {
            const isSelected = state.selectedIndicator.id === ind.id;
            const indName = state.lang === 'my' ? ind.nameMy : ind.nameEn;
            return `
              <div onclick="selectIndicator('${ind.id}')" class="p-2 rounded-lg cursor-pointer transition-all flex items-center justify-between ${isSelected ? 'bg-amber-400/15 border border-[#F5C242]/40 text-[#F5C242]' : 'hover:bg-white/5 text-slate-300 border border-transparent'}">
                <div class="truncate pr-2">
                  <div class="text-xs font-semibold truncate ${isSelected ? 'text-[#F5C242]' : 'text-slate-200'}">${indName}</div>
                  <div class="text-[10px] text-slate-500 font-mono mt-0.5">${ind.code}</div>
                </div>
                <span class="text-[10px] font-mono tabular-numbers text-slate-400 bg-black/30 px-1.5 py-0.5 rounded">${ind.defaultVal}</span>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  });

  listContainer.innerHTML = html;
}

function toggleDomainAccordion(domainKey) {
  state.selectedDomain = state.selectedDomain === domainKey ? '' : domainKey;
  playSound('click');
  renderIndicatorsList();
}

function selectIndicator(indId) {
  const ind = indicatorCatalog.find(i => i.id === indId);
  if (!ind) return;
  state.selectedIndicator = ind;
  state.selectedDomain = ind.domain;
  playSound('switch');
  renderIndicatorsList();
  renderSelectedSummary();
}

function selectRegion(regionId) {
  const reg = regionsCatalog.find(r => r.id === regionId);
  if (!reg) return;
  state.selectedRegion = reg;
  playSound('switch');

  // Update SVG highlight
  document.querySelectorAll('.region-path').forEach(p => {
    if (p.getAttribute('data-region') === regionId) {
      p.classList.add('active');
    } else {
      p.classList.remove('active');
    }
  });

  document.querySelectorAll('.township-marker').forEach(marker => {
    if (marker.getAttribute('data-region') === regionId) {
      marker.setAttribute('fill', '#F5C242');
      marker.setAttribute('r', '8');
      marker.classList.add('pulse-amber');
    } else {
      marker.setAttribute('fill', '#60A5FA');
      marker.setAttribute('r', '5');
      marker.classList.remove('pulse-amber');
    }
  });

  renderSelectedSummary();
}

function selectRegionAndOpen(regionId) {
  selectRegion(regionId);
  const ws = document.getElementById('map-workspace-section');
  if (ws) {
    ws.scrollIntoView({ behavior: 'smooth' });
  }
}

// Render Right Query & Action Panel Summary
function renderSelectedSummary() {
  const indNameEl = document.getElementById('selected-indicator-name');
  const indCodeEl = document.getElementById('selected-indicator-code');
  const regNameEl = document.getElementById('selected-region-name');
  const regDivEl = document.getElementById('selected-region-division');

  if (indNameEl) {
    indNameEl.textContent = state.lang === 'my' ? state.selectedIndicator.nameMy : state.selectedIndicator.nameEn;
  }
  if (indCodeEl) {
    indCodeEl.textContent = state.selectedIndicator.code;
  }
  if (regNameEl) {
    regNameEl.textContent = state.lang === 'my' ? state.selectedRegion.nameMy : state.selectedRegion.nameEn;
  }
  if (regDivEl) {
    regDivEl.textContent = state.lang === 'my' ? state.selectedRegion.divisionMy : state.selectedRegion.divisionEn;
  }
}

// Apply Query and Show Data Modal
function applyDataQuery() {
  playSound('apply');
  const btn = document.getElementById('view-data-btn');
  const dict = i18n[state.lang];

  if (btn) {
    btn.innerHTML = `<span class="inline-block animate-spin mr-2">⟳</span> ${dict.analyzingData}`;
    btn.disabled = true;
  }

  setTimeout(() => {
    if (btn) {
      btn.innerHTML = dict.viewDataBtn;
      btn.disabled = false;
    }
    openDataObservationModal();
  }, 600);
}

// Open Observation Modal
function openDataObservationModal() {
  const modal = document.getElementById('observation-modal');
  if (!modal) return;

  const reg = state.selectedRegion;
  const ind = state.selectedIndicator;
  const regName = state.lang === 'my' ? reg.nameMy : reg.nameEn;
  const divName = state.lang === 'my' ? reg.divisionMy : reg.divisionEn;
  const indName = state.lang === 'my' ? ind.nameMy : ind.nameEn;

  document.getElementById('modal-region-title').textContent = `${regName} (${divName})`;
  document.getElementById('modal-indicator-title').textContent = `${indName} [${ind.code}]`;

  // Draw chart inside canvas
  drawTrendChart();

  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeDataObservationModal() {
  playSound('click');
  const modal = document.getElementById('observation-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

// Canvas Data Visualizer
function drawTrendChart() {
  const canvas = document.getElementById('trend-chart-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);

  // Background subtle grid
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.lineWidth = 1;
  for (let y = 30; y < h - 30; y += 35) {
    ctx.beginPath();
    ctx.moveTo(40, y);
    ctx.lineTo(w - 20, y);
    ctx.stroke();
  }

  // Generate 12 months simulated points
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const values = [22.4, 24.8, 28.5, 31.2, 30.6, 28.1, 27.4, 27.6, 27.8, 27.2, 25.1, 22.8];

  const minV = 20;
  const maxV = 35;
  const stepX = (w - 70) / (months.length - 1);

  // Gradient area
  const grad = ctx.createLinearGradient(0, 30, 0, h - 30);
  grad.addColorStop(0, 'rgba(245, 194, 66, 0.35)');
  grad.addColorStop(1, 'rgba(245, 194, 66, 0.0)');

  ctx.beginPath();
  months.forEach((m, i) => {
    const x = 50 + i * stepX;
    const y = h - 30 - ((values[i] - minV) / (maxV - minV)) * (h - 70);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.lineTo(50 + (months.length - 1) * stepX, h - 30);
  ctx.lineTo(50, h - 30);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  // Line stroke
  ctx.beginPath();
  months.forEach((m, i) => {
    const x = 50 + i * stepX;
    const y = h - 30 - ((values[i] - minV) / (maxV - minV)) * (h - 70);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.strokeStyle = '#F5C242';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Dots
  months.forEach((m, i) => {
    const x = 50 + i * stepX;
    const y = h - 30 - ((values[i] - minV) / (maxV - minV)) * (h - 70);
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#080C17';
    ctx.fill();
    ctx.strokeStyle = '#52C46B';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Label month
    ctx.fillStyle = '#94A3B8';
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(m, x, h - 12);
  });
}

// Map Zoom and Reset Controls
function zoomMap(delta) {
  playSound('click');
  state.mapZoom = Math.max(0.7, Math.min(2.5, state.mapZoom + delta));
  applyMapTransform();
}

function resetMap() {
  playSound('click');
  state.mapZoom = 1;
  state.mapPan = { x: 0, y: 0 };
  applyMapTransform();
}

function applyMapTransform() {
  const g = document.getElementById('myanmar-map-group');
  if (g) {
    g.setAttribute('transform', `translate(${state.mapPan.x}, ${state.mapPan.y}) scale(${state.mapZoom})`);
  }
}

// Layer Switcher
function setMapLayer(layer) {
  state.activeMapLayer = layer;
  playSound('switch');
  document.querySelectorAll('.map-layer-btn').forEach(btn => {
    if (btn.getAttribute('data-layer') === layer) {
      btn.className = 'map-layer-btn px-3 py-1 rounded-full text-xs font-semibold bg-[#1982C4] text-white shadow transition-all';
    } else {
      btn.className = 'map-layer-btn px-3 py-1 rounded-full text-xs font-medium text-slate-400 hover:text-white bg-white/5 transition-all';
    }
  });

  // Alter map colors slightly according to active layer
  const paths = document.querySelectorAll('.region-path');
  paths.forEach(p => {
    if (!p.classList.contains('active')) {
      if (layer === 'temp') p.style.fill = '#191830';
      else if (layer === 'drought') p.style.fill = '#281c19';
      else if (layer === 'ndvi') p.style.fill = '#12251d';
      else if (layer === 'rain') p.style.fill = '#102336';
    }
  });
}

// Settings Popover Toggle
function toggleSettingsPopover() {
  playSound('click');
  const popover = document.getElementById('settings-popover');
  if (!popover) return;
  popover.classList.toggle('hidden');
}

function changeSoundVolume(delta) {
  state.soundVolume = Math.max(0, Math.min(100, state.soundVolume + delta));
  const slider = document.getElementById('sound-slider');
  const valDisplay = document.getElementById('sound-val-display');
  if (slider) slider.value = state.soundVolume;
  if (valDisplay) valDisplay.textContent = `${state.soundVolume}%`;
  playSound('click');
}

// AI Floating Chat Drawer
function toggleAiChatDrawer() {
  playSound('switch');
  const drawer = document.getElementById('ai-chat-drawer');
  if (!drawer) return;
  drawer.classList.toggle('hidden');
}

function sendAiMessage(customPrompt = '') {
  const input = document.getElementById('ai-chat-input');
  const query = customPrompt || (input ? input.value.trim() : '');
  if (!query) return;

  playSound('apply');
  if (input) input.value = '';

  const messagesContainer = document.getElementById('ai-chat-messages');
  if (!messagesContainer) return;

  // Append user message
  messagesContainer.innerHTML += `
    <div class="flex justify-end mb-3">
      <div class="bg-[#1982C4] text-white text-xs rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[85%] leading-relaxed shadow">
        ${query}
      </div>
    </div>
  `;

  // Simulate typing indicator
  const typingId = 'typing-' + Date.now();
  messagesContainer.innerHTML += `
    <div id="${typingId}" class="flex items-center space-x-2 mb-3 text-slate-400 text-xs">
      <div class="w-2 h-2 rounded-full bg-[#F5C242] animate-ping"></div>
      <span>${state.lang === 'my' ? 'ဂြိုဟ်တုဒေတာ ဆန်းစစ်နေပါသည်...' : 'Querying Earth observation model...'}</span>
    </div>
  `;
  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  setTimeout(() => {
    const typingEl = document.getElementById(typingId);
    if (typingEl) typingEl.remove();

    let botResponse = '';
    if (state.lang === 'my') {
      botResponse = `ChainSa ဂြိုဟ်တုအချက်အလက်အရ <strong>${state.selectedRegion.nameMy}</strong> ဒေသတွင် လက်ရှိ ပျမ်းမျှအပူချိန်သည် <strong>${state.selectedRegion.meanTemp}</strong> ရှိပြီး၊ သီးနှံကျန်းမာရေးညွှန်းကိန်း (NDVI) သည် ပုံမှန်အဆင့် <strong>0.68</strong> တွင် တည်ငြိမ်လျက်ရှိပါသည်။ လာမည့် ၃ ပတ်အတွင်း မိုးရွာသွန်းမှု အနည်းငယ် လျော့နည်းနိုင်သဖြင့် ရေစီမံခန့်ခွဲမှုကို အလေးထားဆောင်ရွက်ရန် အကြံပြုအပ်ပါသည်။`;
    } else {
      botResponse = `According to NASA Earth observation feeds for <strong>${state.selectedRegion.nameEn}</strong>, current mean temperature is <strong>${state.selectedRegion.meanTemp}</strong> with an NDVI vegetation health metric of <strong>0.68 (Optimal)</strong>. A 14% soil moisture dip is forecasted across the central corridor over the next 14 days. Pre-emptive drip irrigation and heat-shield mulch are recommended.`;
    }

    messagesContainer.innerHTML += `
      <div class="flex items-start space-x-2.5 mb-3">
        <div class="w-6 h-6 rounded-lg bg-[#F5C242] text-[#080C17] flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
          CS
        </div>
        <div class="bg-[#161F33] border border-white/10 text-slate-200 text-xs rounded-2xl rounded-tl-sm px-4 py-3 max-w-[88%] leading-relaxed shadow">
          ${botResponse}
        </div>
      </div>
    `;
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }, 750);
}

// Initial Setup on DOM Load
document.addEventListener('DOMContentLoaded', () => {
  // Sound volume input
  const slider = document.getElementById('sound-slider');
  if (slider) {
    slider.addEventListener('input', (e) => {
      state.soundVolume = parseInt(e.target.value, 10);
      const valDisplay = document.getElementById('sound-val-display');
      if (valDisplay) valDisplay.textContent = `${state.soundVolume}%`;
    });
  }

  // Indicator Search
  const searchInput = document.getElementById('indicator-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      renderIndicatorsList(e.target.value);
    });
  }

  // Close Popover on Outside Click
  document.addEventListener('click', (e) => {
    const popover = document.getElementById('settings-popover');
    const gearBtn = document.getElementById('settings-btn');
    if (popover && !popover.classList.contains('hidden')) {
      if (!popover.contains(e.target) && !gearBtn.contains(e.target)) {
        popover.classList.add('hidden');
      }
    }
  });

  // Date inputs
  const startInput = document.getElementById('query-start-date');
  const endInput = document.getElementById('query-end-date');
  if (startInput) {
    startInput.value = state.startDate;
    startInput.addEventListener('change', (e) => state.startDate = e.target.value);
  }
  if (endInput) {
    endInput.value = state.endDate;
    endInput.addEventListener('change', (e) => state.endDate = e.target.value);
  }

  // Initial UI Render
  applyLanguage('en');
  selectRegion('kunlong');
});
