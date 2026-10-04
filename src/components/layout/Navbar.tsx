import React from 'react';
import { 
  Sprout, 
  LayoutDashboard, 
  Sliders, 
  GitCompare, 
  Layers, 
  History, 
  Info, 
  PlayCircle, 
  Award,
  Sparkles,
  ChevronDown,
  Globe
} from 'lucide-react';
import { DEMO_SCENARIOS } from '../../data/demoScenarios.js';
import { SimulationInput } from '../../types/index.js';
import { useLanguage } from '../../i18n/LanguageContext.js';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onLoadDemo: (input: SimulationInput) => void;
  onOpenPresentation: () => void;
  systemStatus: { status: string; gemini_enabled: boolean };
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onLoadDemo,
  onOpenPresentation,
  systemStatus,
}) => {
  const { language, setLanguage, t, supportedLanguages } = useLanguage();
  const [demoMenuOpen, setDemoMenuOpen] = React.useState(false);
  const [langMenuOpen, setLangMenuOpen] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'landing', label: t.home, icon: Sprout },
    { id: 'simulator', label: t.simulator, icon: Sliders, highlight: true },
    { id: 'compare', label: t.compare, icon: GitCompare },
    { id: 'what-if', label: t.whatIf, icon: Layers },
    { id: 'history', label: t.history, icon: History },
    { id: 'model-info', label: t.mlModel, icon: Info },
  ];

  const currentLangObj = supportedLanguages.find(l => l.code === language) || supportedLanguages[0];

  return (
    <header className="sticky top-0 z-40 bg-[#064e3b] text-white border-b border-[#065f46] shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & System Operational Indicator */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div 
              className="flex items-center space-x-2.5 cursor-pointer group" 
              onClick={() => onSelectTab('landing')}
              id="navbar-brand-logo"
            >
              <div className="w-8 h-8 bg-[#22c55e] rounded-lg flex items-center justify-center font-bold text-white shadow-xs group-hover:scale-105 transition-transform">
                A
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-white text-base sm:text-lg tracking-tight">{t.appName}</span>
                  <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/30 text-emerald-300 border border-emerald-400/40 hidden sm:inline-block">
                    {t.bentoLab}
                  </span>
                </div>
              </div>
            </div>

            {/* Operational Pulse Pill */}
            <div className="hidden xl:flex items-center space-x-2 px-2.5 py-1 rounded-full bg-[#065f46] border border-[#067355] text-emerald-200 text-xs">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="font-medium text-[11px]">{t.modelsOperational}</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1" id="main-navigation-menu">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => onSelectTab(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#065f46] text-white shadow-inner ring-1 ring-emerald-400/30'
                      : 'text-emerald-100 hover:text-white hover:bg-[#065f46]/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-300' : 'text-emerald-300/70'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Action CTAs & Language Switcher */}
          <div className="flex items-center space-x-2 sm:space-x-2.5">
            {/* Language Switcher Dropdown */}
            <div className="relative">
              <button
                id="btn-language-dropdown"
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border border-[#067355] bg-[#065f46] hover:bg-[#077053] text-xs font-bold text-white transition shadow-xs cursor-pointer"
                title={t.selectLanguage}
              >
                <Globe className="w-3.5 h-3.5 text-emerald-300" />
                <span>{currentLangObj.nativeLabel}</span>
                <ChevronDown className="w-3 h-3 text-emerald-200" />
              </button>

              {langMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setLangMenuOpen(false)} />
                  <div className="absolute right-0 mt-2 w-44 bg-white text-slate-900 rounded-xl shadow-xl border border-slate-200 py-1.5 z-20 overflow-hidden" id="language-dropdown-menu">
                    <div className="px-3 py-1 bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {t.selectLanguage}
                    </div>
                    {supportedLanguages.map(lang => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setLangMenuOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2 text-xs font-bold transition flex items-center justify-between ${
                          language === lang.code
                            ? 'bg-emerald-50 text-emerald-800'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <span>{lang.nativeLabel}</span>
                        <span className="text-[10px] font-medium text-slate-400 uppercase">{lang.label}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Demo Dropdown */}
            <div className="relative hidden sm:block">
              <button
                id="btn-demo-scenarios-dropdown"
                onClick={() => setDemoMenuOpen(!demoMenuOpen)}
                className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border border-[#067355] bg-[#065f46] hover:bg-[#077053] text-xs font-semibold text-white transition shadow-xs cursor-pointer"
              >
                <PlayCircle className="w-3.5 h-3.5 text-emerald-300" />
                <span>{t.loadDemo}</span>
                <ChevronDown className="w-3 h-3 text-emerald-200" />
              </button>

              {demoMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setDemoMenuOpen(false)} />
                  <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white text-slate-900 rounded-2xl shadow-xl border border-slate-200 py-2 z-20 overflow-hidden">
                    <div className="px-3.5 py-1.5 bg-slate-50 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Predefined Demos
                    </div>
                    {DEMO_SCENARIOS.map(demo => (
                      <button
                        key={demo.id}
                        id={`demo-option-${demo.id}`}
                        onClick={() => {
                          onLoadDemo(demo.input);
                          setDemoMenuOpen(false);
                        }}
                        className="w-full text-left px-3.5 py-2.5 hover:bg-emerald-50/70 transition flex flex-col border-b border-slate-50 last:border-0"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs sm:text-sm font-bold text-slate-900">{demo.title}</span>
                          <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                            {demo.badge}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500 mt-0.5 line-clamp-1">{demo.tagline}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Presentation Mode Button */}
            <button
              id="btn-presentation-mode"
              onClick={onOpenPresentation}
              className="hidden md:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-sm transition cursor-pointer"
              title="Open Presentation Mode"
            >
              <Award className="w-3.5 h-3.5" />
              <span>{t.presentationMode}</span>
            </button>

            {/* Primary Simulate CTA */}
            <button
              id="btn-primary-new-simulation"
              onClick={() => onSelectTab('simulator')}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold shadow-sm shadow-emerald-950/40 transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.simulate}</span>
            </button>

            {/* Mobile menu toggle */}
            <button
              id="btn-mobile-nav-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-emerald-200 hover:bg-[#065f46]"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-[#065f46] bg-[#064e3b]">
            <div className="grid grid-cols-2 gap-2 mb-3">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold ${
                      isActive ? 'bg-[#065f46] text-white' : 'text-emerald-100 hover:bg-[#065f46]/50'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-emerald-300" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Mobile Language Switcher */}
            <div className="pt-2 border-t border-emerald-700/60 flex items-center justify-between">
              <span className="text-xs text-emerald-200 font-bold">{t.selectLanguage}:</span>
              <div className="flex space-x-1.5">
                {supportedLanguages.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setMobileMenuOpen(false);
                    }}
                    className={`px-2 py-1 rounded text-xs font-bold ${
                      language === lang.code
                        ? 'bg-[#22c55e] text-white'
                        : 'bg-[#065f46] text-emerald-200'
                    }`}
                  >
                    {lang.nativeLabel}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
