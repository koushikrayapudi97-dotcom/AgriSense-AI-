export type Language = 'en' | 'te' | 'hi' | 'ta';

export interface LanguageOption {
  code: Language;
  label: string;
  nativeLabel: string;
  flagEmoji?: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'te', label: 'Telugu', nativeLabel: 'తెలుగు' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिंदी' },
  { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்' },
];

export interface Translations {
  // Navigation & Common
  appName: string;
  tagline: string;
  bentoLab: string;
  modelsOperational: string;
  loadDemo: string;
  presentationMode: string;
  simulate: string;
  home: string;
  simulator: string;
  compare: string;
  whatIf: string;
  history: string;
  mlModel: string;
  selectLanguage: string;
  allRightsReserved: string;
  offlineReady: string;

  // Hero / Home Page
  heroBadge: string;
  heroTitle1: string;
  heroTitle2: string;
  heroSubtitle: string;
  startSimulation: string;
  exploreDemo: string;
  demoWaterScarcity: string;
  cropsSupported: string;
  cropsSupportedVal: string;
  mlArchitecture: string;
  mlArchitectureVal: string;
  decisionSupport: string;
  decisionSupportVal: string;
  reliability: string;
  reliabilityVal: string;

  // Simulator Page
  activeSimulation: string;
  testTradeoffs: string;
  compareCrops: string;
  resetDefaults: string;
  runDecisionSimulation: string;
  analyzingConditions: string;
  
  // Farm Input Form
  farmConditionsTitle: string;
  farmConditionsSubtitle: string;
  cropSelection: string;
  farmArea: string;
  acres: string;
  seasonalRainfall: string;
  avgTemperature: string;
  waterAvailability: string;
  fertilizerUsage: string;
  soilType: string;
  season: string;
  productionCost: string;
  expectedPrice: string;
  waterLow: string;
  waterMedium: string;
  waterHigh: string;
  fertLow: string;
  fertMedium: string;
  fertHigh: string;

  // Results & KPIs
  predictedYield: string;
  totalHarvest: string;
  estimatedRevenue: string;
  estimatedCost: string;
  expectedProfit: string;
  roi: string;
  riskLevel: string;
  riskScore: string;
  selectedInputs: string;
  grossRevenue: string;
  totalProductionCost: string;
  kgPerAcre: string;
  lowRisk: string;
  modRisk: string;
  highRisk: string;
  veryHighRisk: string;

  // AI Recommendation
  aiStrategyBadge: string;
  aiStrategyTitle: string;
  strategyDrivers: string;
  riskVulnerabilities: string;
  recommendedActions: string;
  climateAlternative: string;
  testAlternative: string;
  explainPrediction: string;
  explainingWithAi: string;

  // Scenarios
  scenarioTitle: string;
  scenarioSubtitle: string;
  scenarioCol: string;
  yieldCol: string;
  costCol: string;
  revenueCol: string;
  profitCol: string;
  roiCol: string;
  riskCol: string;
  favorableScenario: string;
  expectedScenario: string;
  unfavorableScenario: string;

  // Factor Importance
  yieldInfluencers: string;
  whatInfluencesTitle: string;
  randomForestSplits: string;
  confidence: string;

  // Risk Breakdown
  riskDiagnostics: string;
  multiFactorAnalysis: string;
  factorDecomposition: string;

  // Crops
  cropRice: string;
  cropWheat: string;
  cropCotton: string;
  cropMaize: string;
  cropSugarcane: string;
  cropGroundnut: string;
  cropChickpea: string;
  cropMustard: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    appName: 'AgriSense AI',
    tagline: 'Agricultural Decision Simulator',
    bentoLab: 'Bento Lab',
    modelsOperational: 'Models Operational',
    loadDemo: 'Load Demo',
    presentationMode: 'Presentation Mode',
    simulate: 'Simulate',
    home: 'Home',
    simulator: 'Simulator',
    compare: 'Compare',
    whatIf: 'What-If Lab',
    history: 'History',
    mlModel: 'ML Model',
    selectLanguage: 'Language',
    allRightsReserved: 'All rights reserved.',
    offlineReady: '100% Offline-Resilient Agronomic ML Simulator',

    heroBadge: 'AI/ML Agricultural Decision Support System',
    heroTitle1: 'Make Smarter Farming Decisions',
    heroTitle2: 'Before You Plant',
    heroSubtitle: 'Simulate weather, water availability, fertilizer, costs, and market conditions to forecast yield, profit, and composite risk before making a real-world farming decision.',
    startSimulation: 'Start Simulation',
    exploreDemo: 'Explore Demo (Water Scarcity)',
    demoWaterScarcity: 'Water Scarcity Demo',
    cropsSupported: 'CROPS SUPPORTED',
    cropsSupportedVal: '8 Agronomic Crops',
    mlArchitecture: 'ML ARCHITECTURE',
    mlArchitectureVal: 'Random Forest Regressor',
    decisionSupport: 'DECISION SUPPORT',
    decisionSupportVal: 'What-If Lab & Risk',
    reliability: 'RELIABILITY',
    reliabilityVal: '100% Offline-Safe',

    activeSimulation: 'Active Simulation',
    testTradeoffs: 'Test agronomic, environmental, and market trade-offs with immediate risk & yield modeling.',
    compareCrops: 'Compare Crops',
    resetDefaults: 'Reset Defaults',
    runDecisionSimulation: 'Run Decision Simulation',
    analyzingConditions: 'Analyzing agronomic trade-offs...',

    farmConditionsTitle: 'Farm & Climate Conditions',
    farmConditionsSubtitle: 'Tune environmental & agronomic inputs',
    cropSelection: 'Crop Selection',
    farmArea: 'Farm Land Area',
    acres: 'Acres',
    seasonalRainfall: 'Seasonal Rainfall',
    avgTemperature: 'Avg Temperature (°C)',
    waterAvailability: 'Water Availability',
    fertilizerUsage: 'Fertilizer Input',
    soilType: 'Soil Type',
    season: 'Sowing Season',
    productionCost: 'Production Cost (₹/Acre)',
    expectedPrice: 'Expected Price (₹/kg)',
    waterLow: 'Low / Deficit',
    waterMedium: 'Medium / Adequate',
    waterHigh: 'High / Surplus',
    fertLow: 'Low / Minimal',
    fertMedium: 'Recommended',
    fertHigh: 'High / Intensive',

    predictedYield: 'Predicted Yield',
    totalHarvest: 'Total Harvest',
    estimatedRevenue: 'Estimated Revenue',
    estimatedCost: 'Estimated Cost',
    expectedProfit: 'Estimated Profit',
    roi: 'ROI',
    riskLevel: 'Risk Level',
    riskScore: 'Risk Score',
    selectedInputs: 'Selected Inputs',
    grossRevenue: 'Gross Revenue',
    totalProductionCost: 'Total Production Cost',
    kgPerAcre: 'kg/acre',
    lowRisk: 'Low',
    modRisk: 'Moderate',
    highRisk: 'High',
    veryHighRisk: 'Very High',

    aiStrategyBadge: 'AI Strategy',
    aiStrategyTitle: 'AI Recommended Strategy',
    strategyDrivers: 'Strategy Drivers',
    riskVulnerabilities: 'Risk Vulnerabilities',
    recommendedActions: 'Recommended Actions',
    climateAlternative: 'Climate-Smart Alternative',
    testAlternative: 'Test Alternative',
    explainPrediction: 'Explain This Prediction (ML Rationale)',
    explainingWithAi: 'Synthesizing agronomic calculation rationale with AI...',

    scenarioTitle: 'Dynamic Scenario Simulation',
    scenarioSubtitle: 'Compare harvest outcomes across favorable, baseline, and unfavorable climate & market shocks.',
    scenarioCol: 'Scenario',
    yieldCol: 'Yield (kg/ac)',
    costCol: 'Total Cost',
    revenueCol: 'Gross Revenue',
    profitCol: 'Net Profit',
    roiCol: 'ROI %',
    riskCol: 'Risk Factor',
    favorableScenario: 'Favorable Weather',
    expectedScenario: 'Baseline / Expected',
    unfavorableScenario: 'Adverse Drought / Shock',

    yieldInfluencers: 'Yield Influencers',
    whatInfluencesTitle: 'What Influences Your Result?',
    randomForestSplits: 'Random Forest Splits',
    confidence: 'Confidence',

    riskDiagnostics: 'Risk Diagnostics',
    multiFactorAnalysis: 'Multi-Factor Risk Analysis',
    factorDecomposition: 'Factor Stress Decomposition',

    cropRice: 'Rice (Paddy)',
    cropWheat: 'Wheat',
    cropCotton: 'Cotton',
    cropMaize: 'Maize (Corn)',
    cropSugarcane: 'Sugarcane',
    cropGroundnut: 'Groundnut (Peanut)',
    cropChickpea: 'Chickpea (Gram)',
    cropMustard: 'Mustard (Rapeseed)',
  },

  te: {
    appName: 'అగ్రిసెన్స్ AI',
    tagline: 'వ్యవసాయ నిర్ణయ సిమ్యులేటర్',
    bentoLab: 'బెంటో ల్యాబ్',
    modelsOperational: 'మోడల్స్ సిద్ధంగా ఉన్నాయి',
    loadDemo: 'డెమో లోడ్ చేయండి',
    presentationMode: 'ప్రదర్శన మోడ్',
    simulate: 'సిమ్యులేట్',
    home: 'హోమ్',
    simulator: 'సిమ్యులేటర్',
    compare: 'పోలిక',
    whatIf: 'వాట్-ఇఫ్ ల్యాబ్',
    history: 'చరిత్ర',
    mlModel: 'ML మోడల్',
    selectLanguage: 'భాష',
    allRightsReserved: 'అన్ని హక్కులు ప్రత్యేకించబడ్డాయి.',
    offlineReady: '100% ఆఫ్‌లైన్-సురక్షిత వ్యవసాయ ML సిమ్యులేటర్',

    heroBadge: 'AI/ML వ్యవసాయ నిర్ణయ సహాయక వ్యవస్థ',
    heroTitle1: 'పంట వేయడానికి ముందే',
    heroTitle2: 'తెలివైన వ్యవసాయ నిర్ణయాలు తీసుకోండి',
    heroSubtitle: 'వాతావరణం, నీటి లభ్యత, ఎరువులు, ఖర్చులు మరియు మార్కెట్ ధరలను అనుకరించి పంట వేయడానికి ముందే దిగుబడి, లాభం మరియు నష్ట భయాన్ని అంచనా వేయండి.',
    startSimulation: 'సిమ్యులేషన్ ప్రారంభించండి',
    exploreDemo: 'డెమో చూడండి (నీటి కొరత)',
    demoWaterScarcity: 'నీటి కొరత డెమో',
    cropsSupported: 'మద్దతు ఉన్న పంటలు',
    cropsSupportedVal: '8 వ్యవసాయ పంటలు',
    mlArchitecture: 'ML నిర్మాణం',
    mlArchitectureVal: 'రాండమ్ ఫారెస్ట్ రిగ్రెసర్',
    decisionSupport: 'నిర్ణయ మద్దతు',
    decisionSupportVal: 'వాట్-ఇఫ్ ల్యాబ్ & రిస్క్',
    reliability: 'విశ్వసనీయత',
    reliabilityVal: '100% ఆఫ్‌లైన్-సురక్షితం',

    activeSimulation: 'ప్రస్తుత సిమ్యులేషన్',
    testTradeoffs: 'తక్షణ రిస్క్ మరియు దిగుబడి మోడలింగ్‌తో వాతావరణ మరియు మార్కెట్ పరిస్థితులను పరీక్షించండి.',
    compareCrops: 'పంటలను పోల్చండి',
    resetDefaults: 'రీసెట్ చేయండి',
    runDecisionSimulation: 'నిర్ణయ సిమ్యులేషన్ ప్రారంభించండి',
    analyzingConditions: 'వ్యవసాయ పరిస్థితులను విశ్లేషిస్తోంది...',

    farmConditionsTitle: 'వ్యవసాయ & వాతావరణ పరిస్థితులు',
    farmConditionsSubtitle: 'భూమి మరియు పర్యావరణ వివరాలను నమోదు చేయండి',
    cropSelection: 'పంట ఎంపిక',
    farmArea: 'వ్యవసాయ విస్తీర్ణం',
    acres: 'ఎకరాలు',
    seasonalRainfall: 'సీజన్ వర్షపాతం',
    avgTemperature: 'సగటు ఉష్ణోగ్రత (°C)',
    waterAvailability: 'నీటి లభ్యత',
    fertilizerUsage: 'ఎరువుల వాడకం',
    soilType: 'నేల రకం',
    season: 'సాగు సీజన్',
    productionCost: 'ఉత్పత్తి వ్యయం (₹/ఎకరాకి)',
    expectedPrice: 'ఆశించిన మార్కెట్ ధర (₹/కేజీ)',
    waterLow: 'తక్కువ / కొరత',
    waterMedium: 'మధ్యస్థం / సరిపడా',
    waterHigh: 'ఎక్కువ / సమృద్ధిగా',
    fertLow: 'తక్కువ / స్వల్పం',
    fertMedium: 'సిఫార్సు చేసిన మోతాదు',
    fertHigh: 'అధిక మోతాదు',

    predictedYield: 'అంచనా దిగుబడి',
    totalHarvest: 'మొత్తం దిగుబడి',
    estimatedRevenue: 'అంచనా ఆదాయం',
    estimatedCost: 'మొత్తం ఖర్చు',
    expectedProfit: 'అంచనా లాభం',
    roi: 'పెట్టుబడిపై లాభం (ROI)',
    riskLevel: 'రిస్క్ స్థాయి',
    riskScore: 'రిస్క్ స్కోరు',
    selectedInputs: 'ఎంచుకున్న వివరాలు',
    grossRevenue: 'స్థూల ఆదాయం',
    totalProductionCost: 'మొత్తం ఉత్పత్తి ఖర్చు',
    kgPerAcre: 'కేజీ/ఎకరా',
    lowRisk: 'తక్కువ',
    modRisk: 'మధ్యస్థం',
    highRisk: 'ఎక్కువ',
    veryHighRisk: 'చాలా ఎక్కువ',

    aiStrategyBadge: 'AI వ్యూహం',
    aiStrategyTitle: 'AI సిఫార్సు చేసిన వ్యూహం',
    strategyDrivers: 'వ్యూహాత్మక కారణాలు',
    riskVulnerabilities: 'రిస్క్ హెచ్చరికలు',
    recommendedActions: 'సూచించిన చర్యలు',
    climateAlternative: 'వాతావరణ అనుకూల ప్రత్యామ్నాయ పంట',
    testAlternative: 'ఈ పంటను పరీక్షించండి',
    explainPrediction: 'ఈ అంచనాను వివరించండి (ML వివరణ)',
    explainingWithAi: 'AI తో వ్యవసాయ విశ్లేషణను లెక్కిస్తోంది...',

    scenarioTitle: 'డైనమిక్ పరిస్థితుల సిమ్యులేషన్',
    scenarioSubtitle: 'అనుకూల, సాధారణ మరియు కరువు పరిస్థితులలో దిగుబడి ఫలితాలను సరిపోల్చండి.',
    scenarioCol: 'పరిస్థితి',
    yieldCol: 'దిగుబడి (కేజీ/ఎకరా)',
    costCol: 'మొత్తం ఖర్చు',
    revenueCol: 'స్థూల ఆదాయం',
    profitCol: 'నికర లాభం',
    roiCol: 'ROI %',
    riskCol: 'రిస్క్ శాతం',
    favorableScenario: 'అనుకూల వాతావరణం',
    expectedScenario: 'సాధారణ అంచనా',
    unfavorableScenario: 'ప్రతికూల / కరువు పరిస్థితి',

    yieldInfluencers: 'దిగుబడిని ప్రభావితం చేసే అంశాలు',
    whatInfluencesTitle: 'మీ దిగుబడి ఫలితాన్ని ఏవి నిర్ధారిస్తాయి?',
    randomForestSplits: 'రాండమ్ ఫారెస్ట్ మోడల్ విభజన',
    confidence: 'విశ్వసనీయత',

    riskDiagnostics: 'రిస్క్ విశ్లేషణ',
    multiFactorAnalysis: 'బహుళ-కారక రిస్క్ విశ్లేషణ',
    factorDecomposition: 'కారకాల ఒత్తిడి విభజన',

    cropRice: 'వరి (వరి ధాన్యం)',
    cropWheat: 'గోధుమ',
    cropCotton: 'పత్తి',
    cropMaize: 'మొక్కజొన్న',
    cropSugarcane: 'చెరకు',
    cropGroundnut: 'వేరుశనగ',
    cropChickpea: 'శనగలు',
    cropMustard: 'ఆవాలు',
  },

  hi: {
    appName: 'एग्रीसेंस AI',
    tagline: 'कृषि निर्णय सिमुलेटर',
    bentoLab: 'बेंटो लैब',
    modelsOperational: 'मॉडल सक्रिय हैं',
    loadDemo: 'डेमो लोड करें',
    presentationMode: 'प्रस्तुति मोड',
    simulate: 'सिमुलेट',
    home: 'होम',
    simulator: 'सिमुलेटर',
    compare: 'तुलना',
    whatIf: 'व्हाट-इफ लैब',
    history: 'इतिहास',
    mlModel: 'ML मॉडल',
    selectLanguage: 'भाषा',
    allRightsReserved: 'सर्वाधिकार सुरक्षित।',
    offlineReady: '100% ऑफ़लाइन-सुरक्षित कृषि ML सिमुलेटर',

    heroBadge: 'AI/ML कृषि निर्णय समर्थन प्रणाली',
    heroTitle1: 'बुवाई करने से पहले ही',
    heroTitle2: 'स्मार्ट कृषि निर्णय लें',
    heroSubtitle: 'मौसम, पानी की उपलब्धता, उर्वरक, लागत और बाजार स्थितियों का अनुकरण करके वास्तविक खेती से पहले उपज, लाभ और समग्र जोखिम का सटीक पूर्वानुमान लगाएं।',
    startSimulation: 'सिमुलेशन शुरू करें',
    exploreDemo: 'डेमो देखें (पानी की कमी)',
    demoWaterScarcity: 'जल संकट डेमो',
    cropsSupported: 'समर्थित फसलें',
    cropsSupportedVal: '8 कृषि फसलें',
    mlArchitecture: 'ML आर्किटेक्चर',
    mlArchitectureVal: 'रैंडम फ़ॉरेस्ट रिग्रेसर',
    decisionSupport: 'निर्णय सहायता',
    decisionSupportVal: 'व्हाट-इफ लैब और जोखिम',
    reliability: 'विश्वसनीयता',
    reliabilityVal: '100% ऑफ़लाइन-सुरक्षित',

    activeSimulation: 'सक्रिय सिमुलेशन',
    testTradeoffs: 'सटीक जोखिम और उपज मॉडलिंग के साथ पर्यावरणीय और बाजार स्थितियों का परीक्षण करें।',
    compareCrops: 'फसलों की तुलना करें',
    resetDefaults: 'रीसेट करें',
    runDecisionSimulation: 'निर्णय सिमुलेशन चलाएं',
    analyzingConditions: 'कृषि स्थितियों का विश्लेषण हो रहा है...',

    farmConditionsTitle: 'खेत एवं मौसम की स्थिति',
    farmConditionsSubtitle: 'पर्यावरणीय एवं कृषि इनपुट दर्ज करें',
    cropSelection: 'फसल का चयन',
    farmArea: 'खेत का क्षेत्रफल',
    acres: 'एकड़',
    seasonalRainfall: 'मौसमी वर्षा',
    avgTemperature: 'औसत तापमान (°C)',
    waterAvailability: 'पानी की उपलब्धता',
    fertilizerUsage: 'उर्वरक उपयोग',
    soilType: 'मिट्टी का प्रकार',
    season: 'बुवाई का मौसम',
    productionCost: 'उत्पादन लागत (₹/एकड़)',
    expectedPrice: 'अपेक्षित बाजार मूल्य (₹/किग्रा)',
    waterLow: 'कम / कमी',
    waterMedium: 'मध्यम / पर्याप्त',
    waterHigh: 'अधिक / प्रचुर',
    fertLow: 'कम / न्यूनतम',
    fertMedium: 'अनुशंसित मात्रा',
    fertHigh: 'अधिक / गहन',

    predictedYield: 'अनुमानित उपज',
    totalHarvest: 'कुल पैदावार',
    estimatedRevenue: 'अनुमानित आय',
    estimatedCost: 'कुल लागत',
    expectedProfit: 'अनुमानित लाभ',
    roi: 'निवेश पर लाभ (ROI)',
    riskLevel: 'जोखिम स्तर',
    riskScore: 'जोखिम स्कोर',
    selectedInputs: 'चयनित इनपुट',
    grossRevenue: 'सकल आय',
    totalProductionCost: 'कुल उत्पादन लागत',
    kgPerAcre: 'किग्रा/एकड़',
    lowRisk: 'कम',
    modRisk: 'मध्यम',
    highRisk: 'उच्च',
    veryHighRisk: 'अत्यधिक',

    aiStrategyBadge: 'AI रणनीति',
    aiStrategyTitle: 'AI अनुशंसित रणनीति',
    strategyDrivers: 'रणनीतिक मुख्य कारक',
    riskVulnerabilities: 'जोखिम चेतावनियां',
    recommendedActions: 'सुझाए गए कदम',
    climateAlternative: 'जलवायु-स्मार्ट वैकल्पिक फसल',
    testAlternative: 'वैकल्पिक फसल परखें',
    explainPrediction: 'इस भविष्यवाणी को समझें (ML विश्लेषण)',
    explainingWithAi: 'AI द्वारा गणना का विश्लेषण किया जा रहा है...',

    scenarioTitle: 'गतिशील परिदृश्य सिमुलेशन',
    scenarioSubtitle: 'अनुकूल, सामान्य और सूखे जैसी प्रतिकूल स्थितियों में परिणामों की तुलना करें।',
    scenarioCol: 'परिदृश्य',
    yieldCol: 'उपज (किग्रा/एकड़)',
    costCol: 'कुल लागत',
    revenueCol: 'सकल आय',
    profitCol: 'शुद्ध लाभ',
    roiCol: 'ROI %',
    riskCol: 'जोखिम कारक',
    favorableScenario: 'अनुकूल मौसम',
    expectedScenario: 'सामान्य / अपेक्षित',
    unfavorableScenario: 'प्रतिकूल / सूखा संकट',

    yieldInfluencers: 'उपज को प्रभावित करने वाले कारक',
    whatInfluencesTitle: 'आपकी उपज को क्या प्रभावित करता है?',
    randomForestSplits: 'रैंडम फ़ॉरेस्ट मॉडल विभाजन',
    confidence: 'विश्वसनीयता',

    riskDiagnostics: 'जोखिम विश्लेषण',
    multiFactorAnalysis: 'बहु-कारक जोखिम विश्लेषण',
    factorDecomposition: 'कारक तनाव विश्लेषण',

    cropRice: 'चावल (धान)',
    cropWheat: 'गेहूं',
    cropCotton: 'कपास',
    cropMaize: 'मक्का',
    cropSugarcane: 'गन्ना',
    cropGroundnut: 'मूंगफली',
    cropChickpea: 'चना',
    cropMustard: 'सरसों',
  },

  ta: {
    appName: 'அக்ரிசென்ஸ் AI',
    tagline: 'விவசாய முடிவு சிமுலேட்டர்',
    bentoLab: 'பென்டோ ஆய்வகம்',
    modelsOperational: 'மாதிரிகள் செயல்பாட்டில் உள்ளன',
    loadDemo: 'டெமோ ஏற்றுக',
    presentationMode: 'வழங்கல் முறை',
    simulate: 'மாதிரி',
    home: 'முகப்பு',
    simulator: 'சிமுலேட்டர்',
    compare: 'ஒப்பீடு',
    whatIf: 'வாட்-இஃப் ஆய்வகம்',
    history: 'வரலாறு',
    mlModel: 'ML மாதிரி',
    selectLanguage: 'மொழி',
    allRightsReserved: 'அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.',
    offlineReady: '100% ஆஃப்லைன்-பாதுகாப்பான விவசாய ML சிமுலேட்டர்',

    heroBadge: 'AI/ML விவசாய முடிவு ஆதரவு அமைப்பு',
    heroTitle1: 'பயிர் நடுவதற்கு முன்பே',
    heroTitle2: 'புத்திசாலித்தனமான விவசாய முடிவுகளை எடுங்கள்',
    heroSubtitle: 'வானிலை, நீர் இருப்பு, உரம், செலவு மற்றும் சந்தை நிலவரங்களை உருவகப்படுத்தி மகசூல், லாபம் மற்றும் அபாயத்தை முன்கூட்டியே கணிக்கவும்.',
    startSimulation: 'மாதிரியைத் தொடங்குக',
    exploreDemo: 'டெமோவை ஆராய்க (நீர் பற்றாக்குறை)',
    demoWaterScarcity: 'நீர் பற்றாக்குறை டெமோ',
    cropsSupported: 'ஆதரிக்கப்படும் பயிர்கள்',
    cropsSupportedVal: '8 முக்கிய பயிர்கள்',
    mlArchitecture: 'ML கட்டமைப்பு',
    mlArchitectureVal: 'ரேண்டம் ஃபாரஸ்ட் ரிக்ரெஸர்',
    decisionSupport: 'முடிவு ஆதரவு',
    decisionSupportVal: 'வாட்-இஃப் ஆய்வகம் & அபாயம்',
    reliability: 'நம்பகத்தன்மை',
    reliabilityVal: '100% ஆஃப்லைன்-பாதுகாப்பானது',

    activeSimulation: 'செயலில் உள்ள மாதிரி',
    testTradeoffs: 'உடனடி அபாயம் மற்றும் மகசூல் மாதிரியாக்கத்துடன் வானிலை மற்றும் சந்தை நிலவரங்களை சோதிக்கவும்.',
    compareCrops: 'பயிர்களை ஒப்பிடுக',
    resetDefaults: 'மீட்டமைக்க',
    runDecisionSimulation: 'முடிவு மாதிரியை இயக்கு',
    analyzingConditions: 'விவசாய சூழலை பகுப்பாய்வு செய்கிறது...',

    farmConditionsTitle: 'பண்ணை மற்றும் காலநிலை சூழல்',
    farmConditionsSubtitle: 'சுற்றுச்சூழல் மற்றும் வேளாண் உள்ளீடுகளை அமைக்கவும்',
    cropSelection: 'பயிர் தேர்வு',
    farmArea: 'நிலப்பரப்பு அளவு',
    acres: 'ஏக்கர்',
    seasonalRainfall: 'பருவமழை அளவு',
    avgTemperature: 'சராசரி வெப்பநிலை (°C)',
    waterAvailability: 'நீர் இருப்பு',
    fertilizerUsage: 'உரப் பயன்பாடு',
    soilType: 'மண் வகை',
    season: 'பருவம்',
    productionCost: 'உற்பத்தி செலவு (₹/ஏக்கர்)',
    expectedPrice: 'எதிர்பார்க்கப்படும் சந்தை விலை (₹/கிலோ)',
    waterLow: 'குறைவு / பற்றாக்குறை',
    waterMedium: 'நடுத்தரமானது / போதுமானது',
    waterHigh: 'அதிகம் / உபரி',
    fertLow: 'குறைவு / குறைந்தபட்சம்',
    fertMedium: 'பரிந்துரைக்கப்பட்ட அளவு',
    fertHigh: 'அதிகம் / தீவிர பயன்பாடு',

    predictedYield: 'கணிக்கப்பட்ட மகசூல்',
    totalHarvest: 'மொத்த மகசூல்',
    estimatedRevenue: 'மதிப்பிடப்பட்ட வருவாய்',
    estimatedCost: 'மதிப்பிடப்பட்ட செலவு',
    expectedProfit: 'எதிர்பார்க்கப்படும் லாபம்',
    roi: 'முதலீட்டு லாபம் (ROI)',
    riskLevel: 'அபாய அளவு',
    riskScore: 'அபாய மதிப்பெண்',
    selectedInputs: 'தேர்ந்தெடுக்கப்பட்ட உள்ளீடுகள்',
    grossRevenue: 'மொத்த வருமானம்',
    totalProductionCost: 'மொத்த உற்பத்தி செலவு',
    kgPerAcre: 'கிலோ/ஏக்கர்',
    lowRisk: 'குறைவு',
    modRisk: 'நடுத்தரமானது',
    highRisk: 'அதிகம்',
    veryHighRisk: 'மிக அதிகம்',

    aiStrategyBadge: 'AI உத்தி',
    aiStrategyTitle: 'AI பரிந்துரைக்கும் உத்தி',
    strategyDrivers: 'உத்தி இயக்கிகள்',
    riskVulnerabilities: 'முக்கிய அபாய எச்சரிக்கைகள்',
    recommendedActions: 'பரிந்துரைக்கப்பட்ட நடவடிக்கைகள்',
    climateAlternative: 'காலநிலை-தகவமைப்பு மாற்றுப் பயிர்',
    testAlternative: 'மாற்றுப் பயிரை சோதிக்கவும்',
    explainPrediction: 'இந்த கணிப்பை விளக்குங்கள் (ML பகுப்பாய்வு)',
    explainingWithAi: 'AI கொண்டு வேளாண் பகுப்பாய்வை கணக்கிடுகிறது...',

    scenarioTitle: 'இயக்கவியல் சூழ்நிலை மாதிரி',
    scenarioSubtitle: 'சாதகமான, இயல்பான மற்றும் வறட்சி காலங்களில் முடிவுகளை ஒப்பிடுங்கள்.',
    scenarioCol: 'சூழ்நிலை',
    yieldCol: 'மகசூல் (கிலோ/ஏக்)',
    costCol: 'மொத்த செலவு',
    revenueCol: 'மொத்த வருவாய்',
    profitCol: 'நிகர லாபம்',
    roiCol: 'ROI %',
    riskCol: 'அபாய காரணி',
    favorableScenario: 'சாதகமான வானிலை',
    expectedScenario: 'இயல்பான / எதிர்பார்க்கப்படும் நிலை',
    unfavorableScenario: 'பாதகமான / வறட்சி நிலை',

    yieldInfluencers: 'மகசூல் காரணிகள்',
    whatInfluencesTitle: 'உங்கள் மகசூலை எது தீர்மானிக்கிறது?',
    randomForestSplits: 'ரேண்டம் ஃபாரஸ்ட் மாதிரி பிரிவுகள்',
    confidence: 'நம்பகத்தன்மை',

    riskDiagnostics: 'அபாய பகுப்பாய்வு',
    multiFactorAnalysis: 'பல்வேறு காரணி அபாய பகுப்பாய்வு',
    factorDecomposition: 'காரணி அழுத்தப் பகுப்பாய்வு',

    cropRice: 'நெல் (பயிறு)',
    cropWheat: 'கோதுமை',
    cropCotton: 'பருத்தி',
    cropMaize: 'மக்காச்சோளம்',
    cropSugarcane: 'கரும்பு',
    cropGroundnut: 'நிலக்கடலை',
    cropChickpea: 'கொண்டைக்கடலை',
    cropMustard: 'கடுகு',
  },
};
