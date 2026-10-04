import React, { useState, useEffect } from 'react';
import { 
  SimulationInput, 
  SimulationResult, 
  SimulationRecord, 
  CropProfile, 
  ModelInfo, 
  CropName 
} from './types/index.js';
import { AgriSenseApiService } from './services/api.js';
import { Navbar } from './components/layout/Navbar.js';
import { Footer } from './components/layout/Footer.js';
import { LandingPage } from './pages/LandingPage.js';
import { DashboardPage } from './pages/DashboardPage.js';
import { SimulatorPage } from './pages/SimulatorPage.js';
import { ComparisonPage } from './pages/ComparisonPage.js';
import { WhatIfPage } from './pages/WhatIfPage.js';
import { HistoryPage } from './pages/HistoryPage.js';
import { ModelInfoPage } from './pages/ModelInfoPage.js';
import { PresentationModeModal } from './components/modals/PresentationModeModal.js';
import { CROPS_DATA } from '../server/data/crops.js';
import { getModelInfo } from '../server/ml/model.js';
import { LanguageProvider } from './i18n/LanguageContext.js';

export default function App() {
  return (
    <LanguageProvider>
      <MainApp />
    </LanguageProvider>
  );
}

function MainApp() {
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [systemStatus, setSystemStatus] = useState<{ status: string; gemini_enabled: boolean }>({
    status: 'online',
    gemini_enabled: false,
  });

  // Default Farm Input
  const [farmInput, setFarmInput] = useState<SimulationInput>({
    crop: 'Rice',
    farmArea: 5,
    rainfall: 750,
    temperature: 30,
    waterAvailability: 'Medium',
    fertilizerUsage: 'Medium',
    productionCost: 35000,
    expectedMarketPrice: 25,
    autoPredictYield: true,
    notes: 'Baseline Simulation',
  });

  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [simulationsHistory, setSimulationsHistory] = useState<SimulationRecord[]>([]);
  const [cropsCatalog, setCropsCatalog] = useState<Record<string, CropProfile>>(CROPS_DATA);
  const [modelMetadata, setModelMetadata] = useState<ModelInfo>(getModelInfo());
  const [presentationOpen, setPresentationOpen] = useState<boolean>(false);

  // Initial Data & Simulation
  useEffect(() => {
    async function init() {
      // Check health
      const health = await AgriSenseApiService.checkHealth();
      setSystemStatus(health);

      // Load crops & model info
      const [crops, info, history] = await Promise.all([
        AgriSenseApiService.getCrops(),
        AgriSenseApiService.getModelInfo(),
        AgriSenseApiService.getSimulations(),
      ]);

      if (crops) setCropsCatalog(crops);
      if (info) setModelMetadata(info);
      if (history) setSimulationsHistory(history);

      // Run baseline simulation
      executeSimulation(farmInput);
    }
    init();
  }, []);

  const executeSimulation = async (inputToRun: SimulationInput) => {
    setIsLoading(true);
    try {
      const res = await AgriSenseApiService.runSimulation(inputToRun, true);
      setSimulationResult(res);

      // Refresh history list in background
      AgriSenseApiService.getSimulations().then(list => {
        if (list && list.length > 0) setSimulationsHistory(list);
      });
    } catch (err) {
      console.error('Simulation execution failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadDemo = (demoInput: SimulationInput) => {
    setFarmInput(demoInput);
    setCurrentTab('simulator');
    executeSimulation(demoInput);
  };

  const handleResetForm = () => {
    const defaultProfile = cropsCatalog[farmInput.crop] || CROPS_DATA.Rice;
    const resetInput: SimulationInput = {
      crop: farmInput.crop,
      farmArea: 5,
      rainfall: defaultProfile.optimalRainfallMin,
      temperature: Math.round((defaultProfile.optimalTempMin + defaultProfile.optimalTempMax) / 2),
      waterAvailability: 'Medium',
      fertilizerUsage: 'Medium',
      productionCost: defaultProfile.defaultCostPerAcre,
      expectedMarketPrice: defaultProfile.defaultMarketPricePerKg,
      autoPredictYield: true,
      notes: `${farmInput.crop} Default Baseline`,
    };
    setFarmInput(resetInput);
    executeSimulation(resetInput);
  };

  const handleViewHistoricalRecord = (record: SimulationRecord) => {
    setFarmInput(record.input);
    setSimulationResult(record);
    setCurrentTab('simulator');
  };

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-900">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onLoadDemo={handleLoadDemo}
        onOpenPresentation={() => setPresentationOpen(true)}
        systemStatus={systemStatus}
      />

      {/* Main Page Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        {currentTab === 'landing' && (
          <LandingPage
            onStartSimulation={() => setCurrentTab('simulator')}
            onLoadDemo={handleLoadDemo}
          />
        )}

        {currentTab === 'dashboard' && (
          <DashboardPage
            simulations={simulationsHistory}
            onStartNewSimulation={() => setCurrentTab('simulator')}
            onViewSimulation={handleViewHistoricalRecord}
            onLoadDemo={handleLoadDemo}
          />
        )}

        {currentTab === 'simulator' && (
          <SimulatorPage
            input={farmInput}
            result={simulationResult}
            isLoading={isLoading}
            onInputChange={setFarmInput}
            onRunSimulation={() => executeSimulation(farmInput)}
            onReset={handleResetForm}
            onCompareWithOthers={() => setCurrentTab('compare')}
            cropsData={cropsCatalog}
          />
        )}

        {currentTab === 'compare' && (
          <ComparisonPage
            baseInput={farmInput}
            cropsData={cropsCatalog}
            onSelectCropToSimulate={(crop: CropName) => {
              const profile = cropsCatalog[crop] || CROPS_DATA[crop];
              const updated: SimulationInput = {
                ...farmInput,
                crop,
                productionCost: profile ? profile.defaultCostPerAcre : farmInput.productionCost,
                expectedMarketPrice: profile ? profile.defaultMarketPricePerKg : farmInput.expectedMarketPrice,
              };
              setFarmInput(updated);
              setCurrentTab('simulator');
              executeSimulation(updated);
            }}
          />
        )}

        {currentTab === 'what-if' && simulationResult && (
          <WhatIfPage
            input={farmInput}
            result={simulationResult}
            onApplyModifiedInput={(modified) => {
              setFarmInput(modified);
              setCurrentTab('simulator');
              executeSimulation(modified);
            }}
            onNavigateToSimulator={() => setCurrentTab('simulator')}
          />
        )}

        {currentTab === 'history' && (
          <HistoryPage
            simulations={simulationsHistory}
            onViewSimulation={handleViewHistoricalRecord}
            onRefreshHistory={() => {
              AgriSenseApiService.getSimulations().then(setSimulationsHistory);
            }}
            onNavigateToSimulator={() => setCurrentTab('simulator')}
          />
        )}

        {currentTab === 'model-info' && (
          <ModelInfoPage modelInfo={modelMetadata} />
        )}
      </main>

      {/* Presentation Mode Modal for Hackathon Judges */}
      {simulationResult && (
        <PresentationModeModal
          isOpen={presentationOpen}
          onClose={() => setPresentationOpen(false)}
          result={simulationResult}
        />
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
