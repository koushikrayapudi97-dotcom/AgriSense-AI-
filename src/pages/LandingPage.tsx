import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  PlayCircle,
  Globe
} from 'lucide-react';
import { DEMO_SCENARIOS } from '../data/demoScenarios.js';
import { SimulationInput } from '../types/index.js';
import { useLanguage } from '../i18n/LanguageContext.js';

interface LandingPageProps {
  onStartSimulation: () => void;
  onLoadDemo: (input: SimulationInput) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartSimulation,
  onLoadDemo,
}) => {
  const { language, setLanguage, t, supportedLanguages } = useLanguage();

  return (
    <div className="min-h-[calc(100vh-140px)] flex flex-col justify-center items-center py-6 sm:py-10" id="landing-page-container">
      {/* Centered Main Hero Card */}
      <section className="relative w-full max-w-5xl overflow-hidden bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-12 lg:p-14">
        {/* Ambient background glows */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-blue-100/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
          
          {/* Top Badge & Language Quick Switcher */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t.heroBadge}</span>
            </div>

            {/* In-Card Language Pills */}
            <div className="inline-flex items-center space-x-1 p-1 bg-slate-100/90 rounded-full border border-slate-200 text-xs" id="landing-language-selector">
              <Globe className="w-3.5 h-3.5 text-slate-500 ml-1.5 mr-1 shrink-0" />
              {supportedLanguages.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                    language === lang.code
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  {lang.nativeLabel}
                </button>
              ))}
            </div>
          </div>

          {/* Headline with wavy green underline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.18] sm:leading-[1.15]">
            {t.heroTitle1}{' '}
            <span className="text-emerald-600 inline-block relative">
              <span className="underline decoration-emerald-400 decoration-wavy decoration-2 sm:decoration-3 underline-offset-8">
                {t.heroTitle2}
              </span>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            {t.heroSubtitle}
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2">
            <button
              id="btn-hero-start-simulation"
              onClick={onStartSimulation}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-bold text-sm sm:text-base shadow-md shadow-emerald-700/20 transition flex items-center justify-center space-x-2 active:scale-[0.99] cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{t.startSimulation}</span>
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </button>

            <button
              id="btn-hero-explore-demo"
              onClick={() => onLoadDemo(DEMO_SCENARIOS[0].input)}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-sm sm:text-base transition flex items-center justify-center space-x-2 shadow-xs cursor-pointer"
            >
              <PlayCircle className="w-5 h-5 text-emerald-600" />
              <span>{t.exploreDemo}</span>
            </button>
          </div>

          {/* 4 Bottom Metric Bento Cards */}
          <div className="pt-6 sm:pt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-left" id="hero-bento-cards">
            <div className="bg-slate-50/90 hover:bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs transition">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                {t.cropsSupported}
              </span>
              <span className="text-lg font-black text-slate-900 mt-1 block">
                {t.cropsSupportedVal}
              </span>
            </div>

            <div className="bg-slate-50/90 hover:bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs transition">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                {t.mlArchitecture}
              </span>
              <span className="text-lg font-black text-emerald-700 mt-1 block">
                {t.mlArchitectureVal}
              </span>
            </div>

            <div className="bg-slate-50/90 hover:bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs transition">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                {t.decisionSupport}
              </span>
              <span className="text-lg font-black text-slate-900 mt-1 block">
                {t.decisionSupportVal}
              </span>
            </div>

            <div className="bg-slate-50/90 hover:bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs transition">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                {t.reliability}
              </span>
              <span className="text-lg font-black text-blue-700 mt-1 block">
                {t.reliabilityVal}
              </span>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};
