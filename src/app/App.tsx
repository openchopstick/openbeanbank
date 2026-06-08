import React, { useState, useEffect } from "react";
import { ChevronRight, X, Lock, Globe, Menu, Settings, Home, TrendingUp, User, Plus, ArrowRight } from "lucide-react";

type Language = "en" | "zh";
type Screen =
  | "bean-home"
  | "bean-consent"
  | "bean-settings"
  | "bx-welcome"
  | "bx-exchange"
  | "bx-profile"
  | "bx-kyc-verify-simple"
  | "bx-kyc-verify-full"
  | "bx-kyc-address"
  | "bx-kyc-idv"
  | "bx-kyc-liveness"
  | "bx-phone-email-verify"
  | "bx-crypto-assessment";

interface KYCData {
  nameEn: string;
  nameZh: string;
  hkid: string;
  dob: string;
  nationality: string;
  address: string;
  mobile: string;
  email: string;
  occupation: string;
}

const emptyKYCData: KYCData = {
  nameEn: "",
  nameZh: "",
  hkid: "",
  dob: "",
  nationality: "",
  address: "",
  mobile: "",
  email: "",
  occupation: "",
};

const beanBankKYCData: KYCData = {
  nameEn: "John Doe",
  nameZh: "陳大文",
  hkid: "A1234567(8)",
  dob: "1990-01-15",
  nationality: "Hong Kong",
  address: "Flat A, 12/F, Tower 1, Central Plaza, Central, Hong Kong",
  mobile: "+852 9123 4567",
  email: "john.doe@email.com",
  occupation: "Software Engineer",
};

export default function App() {
  const [language, setLanguage] = useState<Language>("zh");
  const [screen, setScreen] = useState<Screen>("bean-home");
  const [miniAppOpen, setMiniAppOpen] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const [accountOpened, setAccountOpened] = useState(false);
  const [kycVerified, setKycVerified] = useState(false);
  const [phoneEmailVerified, setPhoneEmailVerified] = useState(false);
  const [cryptoAssessmentComplete, setCryptoAssessmentComplete] = useState(false);
  const [kycData, setKycData] = useState<KYCData>(emptyKYCData);

  const t = (key: string) => translations[language][key] || key;

  const openMiniApp = (targetScreen: Screen) => {
    setScreen(targetScreen);
    setMiniAppOpen(true);
  };

  const closeMiniApp = () => {
    setMiniAppOpen(false);
    setScreen("bean-home");
  };

  const handleBannerClick = () => {
    openMiniApp("bean-consent");
  };

  const handleConsentContinue = () => {
    if (accountOpened) {
      // Already opened account, go directly to exchange
      setScreen("bx-exchange");
    } else {
      // First time, show welcome screen
      setScreen("bx-welcome");
    }
  };

  const handleReset = () => {
    setConsentGiven(false);
    setAccountOpened(false);
    setKycVerified(false);
    setPhoneEmailVerified(false);
    setCryptoAssessmentComplete(false);
    setKycData(emptyKYCData);
    setMiniAppOpen(false);
    setScreen("bean-home");
  };

  const handleOpenAccount = () => {
    setAccountOpened(true);
    setScreen("bx-exchange");
  };

  const startKycVerification = () => {
    if (consentGiven) {
      // Consent given: pre-fill KYC data from Bean Bank
      setKycData(beanBankKYCData);
      setScreen("bx-kyc-verify-simple");
    } else {
      // No consent: start with empty data for manual entry
      setKycData(emptyKYCData);
      setScreen("bx-kyc-verify-full");
    }
  };

  const completeSimpleKyc = () => {
    setScreen("bx-kyc-liveness");
  };

  const completeFullKycInfo = () => {
    setScreen("bx-kyc-address");
  };

  const completeAddressVerification = () => {
    setScreen("bx-kyc-idv");
  };

  const completeIdUpload = () => {
    setScreen("bx-kyc-liveness");
  };

  const completeLivenessCheck = () => {
    setKycVerified(true);
    setScreen("bx-exchange");
  };

  const completePhoneEmailVerification = () => {
    setPhoneEmailVerified(true);
    setScreen("bx-exchange");
  };

  const completeCryptoAssessment = () => {
    setCryptoAssessmentComplete(true);
    setScreen("bx-exchange");
  };

  return (
    <div className="relative w-full h-screen bg-white overflow-hidden flex items-center justify-center">
      {/* iPhone Frame */}
      <div className="relative w-[390px] h-[844px] bg-black rounded-[60px] p-2 shadow-2xl">
        {/* Screen */}
        <div className="relative w-full h-full bg-white rounded-[52px] overflow-hidden">
          {/* Bean Bank App */}
          {!miniAppOpen && screen === "bean-home" && (
            <BeanBankHome
              language={language}
              setLanguage={setLanguage}
              onBannerClick={handleBannerClick}
              onSettingsClick={() => setScreen("bean-settings")}
              t={t}
            />
          )}

          {!miniAppOpen && screen === "bean-settings" && (
            <BeanBankSettings
              language={language}
              onBack={() => setScreen("bean-home")}
              onReset={handleReset}
              t={t}
            />
          )}

          {/* BeanExchange Mini App */}
          {miniAppOpen && (
            <>
              {/* Show Bean Bank in background for entire mini app */}
              <div className="absolute inset-0 pointer-events-none">
                <BeanBankHome
                  language={language}
                  setLanguage={setLanguage}
                  onBannerClick={handleBannerClick}
                  onSettingsClick={() => setScreen("bean-settings")}
                  t={t}
                />
              </div>

              <MiniAppContainer
                onClose={closeMiniApp}
                language={language}
                setLanguage={setLanguage}
                t={t}
              >
                {screen === "bean-consent" && (
                  <ConsentSheet
                    language={language}
                    consent={consentGiven}
                    setConsent={setConsentGiven}
                    accountOpened={accountOpened}
                    onContinue={handleConsentContinue}
                    onCancel={closeMiniApp}
                    t={t}
                  />
                )}

                {screen === "bx-welcome" && (
                  <BXWelcome onNext={handleOpenAccount} t={t} />
                )}

                {screen === "bx-exchange" && (
                  <BXExchange
                    userName={language === "en" ? kycData.nameEn : kycData.nameZh}
                    kycVerified={kycVerified}
                    phoneEmailVerified={phoneEmailVerified}
                    cryptoAssessmentComplete={cryptoAssessmentComplete}
                    onKycClick={startKycVerification}
                    onPhoneEmailClick={() => setScreen("bx-phone-email-verify")}
                    onCryptoAssessmentClick={() => setScreen("bx-crypto-assessment")}
                    onProfileClick={() => setScreen("bx-profile")}
                    t={t}
                  />
                )}

                {screen === "bx-kyc-verify-simple" && (
                  <BXKYCVerifySimple
                    kycData={kycData}
                    language={language}
                    onNext={completeSimpleKyc}
                    t={t}
                  />
                )}

                {screen === "bx-kyc-verify-full" && (
                  <BXKYCVerifyFull
                    kycData={kycData}
                    setKycData={setKycData}
                    onNext={completeFullKycInfo}
                    t={t}
                  />
                )}

                {screen === "bx-kyc-address" && (
                  <BXKYCAddress
                    onNext={completeAddressVerification}
                    t={t}
                  />
                )}

                {screen === "bx-kyc-idv" && (
                  <BXKYCIDV
                    onNext={completeIdUpload}
                    t={t}
                  />
                )}

                {screen === "bx-kyc-liveness" && (
                  <BXKYCLiveness
                    onNext={completeLivenessCheck}
                    t={t}
                  />
                )}

                {screen === "bx-phone-email-verify" && (
                  <BXPhoneEmailVerify
                    kycData={kycData}
                    onComplete={completePhoneEmailVerification}
                    t={t}
                  />
                )}

                {screen === "bx-crypto-assessment" && (
                  <BXCryptoAssessment
                    onComplete={completeCryptoAssessment}
                    t={t}
                  />
                )}

              {screen === "bx-profile" && (
                <BXProfile
                  kycData={kycData}
                  language={language}
                  onBack={() => setScreen("bx-exchange")}
                  t={t}
                />
              )}
            </MiniAppContainer>
            </>
          )}
        </div>

        {/* Notch */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[120px] h-[30px] bg-black rounded-b-[20px] z-50" />
      </div>
    </div>
  );
}

// Bean Bank Home Screen
function BeanBankHome({
  language,
  setLanguage,
  onBannerClick,
  onSettingsClick,
  t,
}: {
  language: Language;
  setLanguage: (lang: Language) => void;
  onBannerClick: () => void;
  onSettingsClick: () => void;
  t: (key: string) => string;
}) {
  return (
    <div className="w-full h-full bg-[#f5f5f7] overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-[rgba(0,0,0,0.08)] z-10">
        <div className="px-4 pt-14 pb-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-[#1c1c1e]">Bean Bank</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLanguage(language === "en" ? "zh" : "en")}
              className="p-2 hover:bg-[#f5f5f7] rounded-full transition-colors"
            >
              <Globe className="w-5 h-5 text-[#0A4DA2]" />
            </button>
            <button
              onClick={onSettingsClick}
              className="p-2 hover:bg-[#f5f5f7] rounded-full transition-colors"
            >
              <Settings className="w-5 h-5 text-[#8e8e93]" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Balance Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <p className="text-sm text-[#8e8e93] mb-2">{t("totalBalance")}</p>
          <h2 className="text-4xl font-semibold text-[#1c1c1e] mb-4">
            HK$245,890.50
          </h2>
          <div className="flex gap-3">
            <button className="flex-1 bg-[#0A4DA2] text-white rounded-xl py-3 font-medium">
              {t("transfer")}
            </button>
            <button className="flex-1 bg-[#f5f5f7] text-[#1c1c1e] rounded-xl py-3 font-medium">
              {t("deposit")}
            </button>
          </div>
        </div>

        {/* BeanExchange Banner */}
        <button
          onClick={onBannerClick}
          className="w-full bg-gradient-to-r from-[#5856d6] to-[#30d5c8] rounded-2xl p-6 text-left shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-semibold text-white">
              {t("tradeCryptoNow")}
            </h3>
            <ChevronRight className="w-6 h-6 text-white" />
          </div>
          <p className="text-sm text-white/80">{t("serviceProvidedBy")}</p>
        </button>

        {/* Accounts */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-[#1c1c1e] mb-4 px-2">
            {t("myAccounts")}
          </h3>
          <div className="space-y-2">
            <div className="p-3 hover:bg-[#f5f5f7] rounded-xl transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-[#1c1c1e]">{t("savingsAccount")}</p>
                  <p className="text-sm text-[#8e8e93]">****1234</p>
                </div>
                <p className="font-semibold text-[#1c1c1e]">HK$125,430.25</p>
              </div>
            </div>
            <div className="p-3 hover:bg-[#f5f5f7] rounded-xl transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-[#1c1c1e]">{t("currentAccount")}</p>
                  <p className="text-sm text-[#8e8e93]">****5678</p>
                </div>
                <p className="font-semibold text-[#1c1c1e]">HK$120,460.25</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-[#1c1c1e] mb-4 px-2">
            {t("recentTransactions")}
          </h3>
          <div className="space-y-2">
            {[
              { name: "Starbucks Coffee", amount: "-HK$65.00", date: "2026-06-03" },
              { name: "Salary Deposit", amount: "+HK$28,500.00", date: "2026-06-01" },
              { name: "MTR Corporation", amount: "-HK$150.00", date: "2026-05-31" },
            ].map((tx, i) => (
              <div
                key={i}
                className="p-3 hover:bg-[#f5f5f7] rounded-xl transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#1c1c1e]">{tx.name}</p>
                    <p className="text-sm text-[#8e8e93]">{tx.date}</p>
                  </div>
                  <p
                    className={`font-semibold ${
                      tx.amount.startsWith("+")
                        ? "text-[#34c759]"
                        : "text-[#1c1c1e]"
                    }`}
                  >
                    {tx.amount}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Bean Bank Settings
function BeanBankSettings({
  language,
  onBack,
  onReset,
  t,
}: {
  language: Language;
  onBack: () => void;
  onReset: () => void;
  t: (key: string) => string;
}) {
  return (
    <div className="w-full h-full bg-[#f5f5f7] overflow-y-auto">
      <div className="sticky top-0 bg-white border-b border-[rgba(0,0,0,0.08)] z-10">
        <div className="px-4 pt-14 pb-4">
          <button onClick={onBack} className="text-[#0A4DA2] font-medium mb-2">
            ← {t("back")}
          </button>
          <h1 className="text-2xl font-semibold text-[#1c1c1e]">{t("settings")}</h1>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-[rgba(0,0,0,0.08)]">
            <p className="font-medium text-[#1c1c1e]">{t("account")}</p>
          </div>
          <div className="p-4 border-b border-[rgba(0,0,0,0.08)]">
            <p className="font-medium text-[#1c1c1e]">{t("security")}</p>
          </div>
          <div className="p-4 border-b border-[rgba(0,0,0,0.08)]">
            <p className="font-medium text-[#1c1c1e]">{t("notifications")}</p>
          </div>
          <button
            onClick={onReset}
            className="w-full p-4 text-left hover:bg-[#f5f5f7] transition-colors"
          >
            <p className="font-medium text-[#ff3b30]">{t("resetTesting")}</p>
          </button>
        </div>
      </div>
    </div>
  );
}

// Consent Sheet
function ConsentSheet({
  language,
  consent,
  setConsent,
  accountOpened,
  onContinue,
  onCancel,
  t,
}: {
  language: Language;
  consent: boolean;
  setConsent: (val: boolean) => void;
  accountOpened: boolean;
  onContinue: () => void;
  onCancel: () => void;
  t: (key: string) => string;
}) {
  return (
    <div className="h-full bg-white flex flex-col">
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="w-12 h-1 bg-[#8e8e93]/30 rounded-full mx-auto mb-6" />

        <h2 className="text-2xl font-semibold text-[#1c1c1e] mb-4">
          {accountOpened ? t("redirectingToBX") : t("leavingBeanBank")}
        </h2>

        <p className="text-[#1c1c1e] mb-6 leading-relaxed">
          {accountOpened ? t("simpleRedirectNotice") : t("redirectNotice")}
        </p>

        {!accountOpened && (
          <>
            <div className="bg-[#f5f5f7] rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <p className="text-sm text-[#1c1c1e] mb-2">
                    {t("consentToShare")}
                  </p>
                </div>
                <button
                  onClick={() => setConsent(!consent)}
                  className={`w-12 h-7 rounded-full transition-colors ${
                    consent ? "bg-[#34c759]" : "bg-[#e5e5ea]"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                      consent ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            <p className="text-xs text-[#8e8e93] mb-6">{t("riskDisclosure")}</p>
          </>
        )}
      </div>

      {/* Bottom buttons */}
      <div className="p-6 bg-white border-t border-[rgba(0,0,0,0.08)]">
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 px-6 rounded-xl font-semibold text-[#0A4DA2]"
          >
            {t("cancel")}
          </button>
          <button
            onClick={onContinue}
            className="flex-1 py-3 px-6 bg-[#0A4DA2] text-white rounded-xl font-semibold"
          >
            {accountOpened ? t("go") : t("okContinue")}
          </button>
        </div>
      </div>
    </div>
  );
}

// Mini App Container
function MiniAppContainer({
  onClose,
  language,
  setLanguage,
  t,
  children,
}: {
  onClose: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  children: React.ReactNode;
}) {
  const [scrolled, setScrolled] = useState(false);

  return (
    <div className="absolute inset-0 flex items-end z-30 animate-slide-up">
      {/* Dimmed background */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Mini App */}
      <div className="relative w-full h-[90%] bg-white rounded-t-3xl overflow-hidden flex flex-col">
        {/* Sticky Top Bar */}
        <div
          className={`sticky top-0 z-50 flex items-center justify-between px-4 py-3 transition-all ${
            scrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-transparent"
          }`}
        >
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#34c759]" />
            <span className="text-sm font-medium text-[#8e8e93]">{t("secure")}</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#f5f5f7] rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-[#1c1c1e]" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div
          className="flex-1 overflow-y-auto"
          onScroll={(e) => setScrolled(e.currentTarget.scrollTop > 10)}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

// BeanExchange Welcome
function BXWelcome({ onNext, t }: { onNext: () => void; t: (key: string) => string }) {
  return (
    <div className="h-full bg-gradient-to-br from-[#f8f9ff] to-[#e8f4f8] flex flex-col">
      <div className="flex-1 overflow-y-auto px-5 py-6">
        <div className="mb-6">
          <div className="w-14 h-14 bg-gradient-to-br from-[#5856d6] to-[#7c3aed] rounded-2xl mb-4 flex items-center justify-center shadow-md">
            <TrendingUp className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#1a1a2e] mb-1">
            {t("welcomeToBeanExchange")}
          </h1>
          <div className="h-0.5 w-16 bg-gradient-to-r from-[#5856d6] to-[#30d5c8] rounded-full" />
        </div>

        <div className="space-y-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-700 leading-relaxed">{t("bxIntro")}</p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex gap-2">
              <span className="text-amber-600 text-base mt-0.5">⚠️</span>
              <p className="text-xs text-amber-800 leading-relaxed">{t("vaRiskWarning")}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 bg-white border-t border-gray-200">
        <button
          onClick={onNext}
          className="w-full py-3 bg-gradient-to-r from-[#5856d6] to-[#7c3aed] text-white rounded-xl font-semibold text-sm shadow-sm hover:shadow-md transition-all"
        >
          {t("openAccountNow")}
        </button>
        <p className="text-xs text-gray-400 text-center mt-3">
          Bank ID: bb · Client ID: bb_234232134
        </p>
      </div>
    </div>
  );
}

// Progress Bar Component
function KYCProgress({ current, total }: { current: number; total: number }) {
  return (
    <div className="mb-5">
      <div className="flex justify-between text-xs text-gray-500 mb-2">
        <span>
          Step {current} of {total}
        </span>
        <span className="text-[#5856d6] font-medium">{Math.round((current / total) * 100)}%</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#5856d6] to-[#7c3aed] transition-all duration-500"
          style={{ width: `${(current / total) * 100}%` }}
        />
      </div>
    </div>
  );
}

// BX Exchange
function BXExchange({
  userName,
  kycVerified,
  phoneEmailVerified,
  cryptoAssessmentComplete,
  onKycClick,
  onPhoneEmailClick,
  onCryptoAssessmentClick,
  onProfileClick,
  t,
}: {
  userName: string;
  kycVerified: boolean;
  phoneEmailVerified: boolean;
  cryptoAssessmentComplete: boolean;
  onKycClick: () => void;
  onPhoneEmailClick: () => void;
  onCryptoAssessmentClick: () => void;
  onProfileClick: () => void;
  t: (key: string) => string;
}) {
  const hasPendingActions = !kycVerified || !phoneEmailVerified || !cryptoAssessmentComplete;

  return (
    <div className="h-full bg-[#fafafa] flex flex-col">
      {/* Header */}
      <div className="bg-white px-4 pt-3 pb-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#F0B90B] to-[#F8D12F] rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">BX</span>
            </div>
            <h1 className="text-base font-semibold text-gray-900">BeanExchange</h1>
          </div>
          <button onClick={onProfileClick} className="p-1.5">
            <User className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Balance Overview */}
        <div className="bg-gradient-to-r from-[#F0B90B] to-[#F8D12F] rounded-lg p-3">
          <p className="text-xs text-black/60 mb-0.5">{t("totalBalance")}</p>
          <h2 className="text-2xl font-bold text-black mb-2">0.00 <span className="text-sm font-normal">HKD</span></h2>
          <div className="flex gap-2">
            <button
              disabled={hasPendingActions}
              className="flex-1 bg-black text-white text-xs font-medium py-2 rounded disabled:opacity-50"
            >
              {t("deposit")}
            </button>
            <button
              disabled={hasPendingActions}
              className="flex-1 bg-white text-black text-xs font-medium py-2 rounded disabled:opacity-50"
            >
              {t("withdraw")}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Pending Actions Banner */}
        {hasPendingActions && (
          <div className="bg-amber-50 border-y border-amber-100 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
              <p className="text-xs text-amber-900 font-medium">{t("completeVerification")}</p>
            </div>
          </div>
        )}

        {/* Verification Cards */}
        {hasPendingActions && (
          <div className="px-4 py-3 space-y-2">
            {!kycVerified && (
              <button
                onClick={onKycClick}
                className="w-full bg-white border border-gray-200 rounded-lg p-3 hover:border-[#F0B90B] transition-all text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
                      <span className="text-sm">🔐</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{t("kycVerification")}</p>
                      <p className="text-xs text-gray-500">{t("requiredToTrade")}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </button>
            )}

            {!phoneEmailVerified && (
              <button
                onClick={onPhoneEmailClick}
                className="w-full bg-white border border-gray-200 rounded-lg p-3 hover:border-[#F0B90B] transition-all text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
                      <span className="text-sm">📱</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{t("phoneEmailVerification")}</p>
                      <p className="text-xs text-gray-500">{t("verifyContact")}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </button>
            )}

            {!cryptoAssessmentComplete && (
              <button
                onClick={onCryptoAssessmentClick}
                className="w-full bg-white border border-gray-200 rounded-lg p-3 hover:border-[#F0B90B] transition-all text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
                      <span className="text-sm">📊</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{t("cryptoAssessment")}</p>
                      <p className="text-xs text-gray-500">{t("sfcRequired")}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </button>
            )}
          </div>
        )}

        {/* Market Section */}
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900">{t("markets")}</h3>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              <span className="text-xs text-gray-500">24h</span>
            </div>
          </div>

          {/* Crypto List - Binance Style */}
          <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
            {[
              { symbol: "BTC", name: "Bitcoin", price: "524,230.00", change: "+2.45", changePercent: "+2.45%", isPositive: true },
              { symbol: "ETH", name: "Ethereum", price: "28,450.00", change: "+1.23", changePercent: "+1.23%", isPositive: true },
              { symbol: "USDT", name: "Tether", price: "7.80", change: "+0.01", changePercent: "+0.01%", isPositive: true },
              { symbol: "BNB", name: "Binance Coin", price: "3,234.00", change: "-28.56", changePercent: "-0.87%", isPositive: false },
            ].map((crypto, idx) => (
              <div
                key={crypto.symbol}
                className={`p-3 ${idx !== 3 ? "border-b border-gray-100" : ""} ${
                  hasPendingActions ? "opacity-50" : "active:bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-[#F0B90B] rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xs">{crypto.symbol[0]}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-semibold text-gray-900">{crypto.symbol}</p>
                        <span className="text-xs text-gray-400">/HKD</span>
                      </div>
                      <p className="text-xs text-gray-500">{crypto.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{crypto.price}</p>
                    <p className={`text-xs font-medium ${
                      crypto.isPositive ? "text-[#0ECB81]" : "text-[#F6465D]"
                    }`}>
                      {crypto.changePercent}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Nav - Binance Style */}
      <div className="bg-white border-t border-gray-200 px-2 py-1.5">
        <div className="flex items-center justify-around">
          <button className="flex flex-col items-center gap-0.5 py-1 px-3">
            <Home className="w-5 h-5 text-[#F0B90B]" />
            <span className="text-[10px] font-medium text-[#F0B90B]">{t("home")}</span>
          </button>
          <button className="flex flex-col items-center gap-0.5 py-1 px-3">
            <TrendingUp className="w-5 h-5 text-gray-400" />
            <span className="text-[10px] text-gray-500">{t("markets")}</span>
          </button>
          <button className="flex flex-col items-center gap-0.5 py-1 px-3">
            <div className="w-5 h-5 flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-gray-400 rounded" />
            </div>
            <span className="text-[10px] text-gray-500">{t("trade")}</span>
          </button>
          <button className="flex flex-col items-center gap-0.5 py-1 px-3">
            <div className="w-5 h-5 flex items-center justify-center text-gray-400">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path d="M9 12h6m-3-3v6" />
              </svg>
            </div>
            <span className="text-[10px] text-gray-500">{t("futures")}</span>
          </button>
          <button className="flex flex-col items-center gap-0.5 py-1 px-3">
            <User className="w-5 h-5 text-gray-400" />
            <span className="text-[10px] text-gray-500">{t("wallet")}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Simple KYC Verification (consent given - data pre-filled)
function BXKYCVerifySimple({
  kycData,
  language,
  onNext,
  t,
}: {
  kycData: KYCData;
  language: Language;
  onNext: () => void;
  t: (key: string) => string;
}) {
  return (
    <div className="h-full bg-gradient-to-br from-[#f8f9ff] to-[#e8f4f8] flex flex-col">
      <div className="flex-1 overflow-y-auto px-5 py-6">
        <h2 className="text-xl font-bold text-[#1a1a2e] mb-1">{t("verifyInformation")}</h2>
        <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-full mb-5">
          <span className="text-xs text-emerald-700 font-medium">✓ {t("preFilled")}</span>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-white border border-gray-200 rounded-xl">
            <p className="text-xs text-gray-500 mb-1">{t("fullNameEn")}</p>
            <p className="text-sm text-gray-900 font-medium">{kycData.nameEn}</p>
          </div>

          <div className="p-4 bg-white border border-gray-200 rounded-xl">
            <p className="text-xs text-gray-500 mb-1">{t("fullNameZh")}</p>
            <p className="text-sm text-gray-900 font-medium">{kycData.nameZh}</p>
          </div>

          <div className="p-4 bg-white border border-gray-200 rounded-xl">
            <p className="text-xs text-gray-500 mb-1">{t("hkid")}</p>
            <p className="text-sm text-gray-900 font-medium">{kycData.hkid}</p>
            <p className="text-xs text-emerald-600 mt-1.5">✓ {t("sharedByBeanBank")}</p>
          </div>

          <div className="p-4 bg-white border border-gray-200 rounded-xl">
            <p className="text-xs text-gray-500 mb-1">{t("dob")}</p>
            <p className="text-sm text-gray-900 font-medium">{kycData.dob}</p>
            <p className="text-xs text-emerald-600 mt-1.5">✓ {t("sharedByBeanBank")}</p>
          </div>

          <div className="p-4 bg-white border border-gray-200 rounded-xl">
            <p className="text-xs text-gray-500 mb-1">{t("email")}</p>
            <p className="text-sm text-gray-900 font-medium">{kycData.email}</p>
            <p className="text-xs text-emerald-600 mt-1.5">✓ {t("sharedByBeanBank")}</p>
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-5">{t("reviewAndConfirm")}</p>
      </div>

      <div className="p-5 bg-white border-t border-gray-200">
        <button
          onClick={onNext}
          className="w-full py-3 bg-gradient-to-r from-[#5856d6] to-[#7c3aed] text-white rounded-xl font-semibold text-sm"
        >
          {t("confirm")}
        </button>
      </div>
    </div>
  );
}

// Full KYC Verification (no consent - manual entry)
function BXKYCVerifyFull({
  kycData,
  setKycData,
  onNext,
  t,
}: {
  kycData: KYCData;
  setKycData: (data: KYCData) => void;
  onNext: () => void;
  t: (key: string) => string;
}) {
  return (
    <div className="h-full bg-gradient-to-br from-[#f8f9ff] to-[#e8f4f8] flex flex-col">
      <div className="flex-1 overflow-y-auto px-5 py-6">
        <h2 className="text-xl font-bold text-[#1a1a2e] mb-5">{t("personalDetails")}</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">{t("fullNameEn")}</label>
            <input
              type="text"
              value={kycData.nameEn}
              onChange={(e) => setKycData({ ...kycData, nameEn: e.target.value })}
              className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:border-[#5856d6] focus:outline-none focus:ring-2 focus:ring-[#5856d6]/20"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">{t("fullNameZh")}</label>
            <input
              type="text"
              value={kycData.nameZh}
              onChange={(e) => setKycData({ ...kycData, nameZh: e.target.value })}
              className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:border-[#5856d6] focus:outline-none focus:ring-2 focus:ring-[#5856d6]/20"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">{t("hkid")}</label>
            <input
              type="text"
              value={kycData.hkid}
              onChange={(e) => setKycData({ ...kycData, hkid: e.target.value })}
              className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:border-[#5856d6] focus:outline-none focus:ring-2 focus:ring-[#5856d6]/20"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">{t("dob")}</label>
            <input
              type="date"
              value={kycData.dob}
              onChange={(e) => setKycData({ ...kycData, dob: e.target.value })}
              className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:border-[#5856d6] focus:outline-none focus:ring-2 focus:ring-[#5856d6]/20"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">{t("email")}</label>
            <input
              type="email"
              value={kycData.email}
              onChange={(e) => setKycData({ ...kycData, email: e.target.value })}
              className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:border-[#5856d6] focus:outline-none focus:ring-2 focus:ring-[#5856d6]/20"
            />
          </div>
        </div>
      </div>

      <div className="p-5 bg-white border-t border-gray-200">
        <button
          onClick={onNext}
          className="w-full py-3 bg-gradient-to-r from-[#5856d6] to-[#7c3aed] text-white rounded-xl font-semibold text-sm"
        >
          {t("next")}
        </button>
      </div>
    </div>
  );
}

// Address Verification
function BXKYCAddress({
  onNext,
  t,
}: {
  onNext: () => void;
  t: (key: string) => string;
}) {
  return (
    <div className="h-full bg-gradient-to-br from-[#f8f9ff] to-[#e8f4f8] flex flex-col">
      <div className="flex-1 overflow-y-auto px-5 py-6">
        <h2 className="text-xl font-bold text-[#1a1a2e] mb-5">{t("addressVerification")}</h2>

        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center mb-4">
          <div className="w-14 h-14 bg-gray-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
            <Plus className="w-7 h-7 text-gray-400" />
          </div>
          <p className="text-sm text-gray-900 font-medium mb-1">{t("uploadProofOfAddress")}</p>
          <p className="text-xs text-gray-500">{t("last3Months")}</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
          <p className="text-xs text-blue-800">{t("acceptedDocuments")}</p>
        </div>
      </div>

      <div className="p-5 bg-white border-t border-gray-200">
        <button
          onClick={onNext}
          className="w-full py-3 bg-gradient-to-r from-[#5856d6] to-[#7c3aed] text-white rounded-xl font-semibold text-sm"
        >
          {t("next")}
        </button>
      </div>
    </div>
  );
}

// Update BXKYCIDV - remove progress parameter
function BXKYCIDV({
  onNext,
  t,
}: {
  onNext: () => void;
  t: (key: string) => string;
}) {
  return (
    <div className="h-full bg-gradient-to-br from-[#f8f9ff] to-[#e8f4f8] flex flex-col">
      <div className="flex-1 overflow-y-auto px-5 py-6">
        <h2 className="text-xl font-bold text-[#1a1a2e] mb-5">{t("idVerification")}</h2>

        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
          <div className="w-14 h-14 bg-gray-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
            <Plus className="w-7 h-7 text-gray-400" />
          </div>
          <p className="text-sm text-gray-900 font-medium mb-1">{t("uploadHKID")}</p>
          <p className="text-xs text-gray-500">{t("frontAndBack")}</p>
        </div>

        <p className="text-xs text-gray-500 mt-4">{t("idvNote")}</p>
      </div>

      <div className="p-5 bg-white border-t border-gray-200">
        <button
          onClick={onNext}
          className="w-full py-3 bg-gradient-to-r from-[#5856d6] to-[#7c3aed] text-white rounded-xl font-semibold text-sm"
        >
          {t("next")}
        </button>
      </div>
    </div>
  );
}

// Update BXKYCLiveness - remove progress parameter
function BXKYCLiveness({
  onNext,
  t,
}: {
  onNext: () => void;
  t: (key: string) => string;
}) {
  return (
    <div className="h-full bg-gradient-to-br from-[#f8f9ff] to-[#e8f4f8] flex flex-col">
      <div className="flex-1 overflow-y-auto px-5 py-6">
        <h2 className="text-xl font-bold text-[#1a1a2e] mb-5">{t("livenessCheck")}</h2>

        <div className="aspect-square border-2 border-dashed border-gray-300 rounded-2xl p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <User className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-sm text-gray-900 font-medium">{t("takeSelfie")}</p>
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-4">{t("livenessNote")}</p>
      </div>

      <div className="p-5 bg-white border-t border-gray-200">
        <button
          onClick={onNext}
          className="w-full py-3 bg-gradient-to-r from-[#5856d6] to-[#7c3aed] text-white rounded-xl font-semibold text-sm"
        >
          {t("complete")}
        </button>
      </div>
    </div>
  );
}

// Phone/Email Verification
function BXPhoneEmailVerify({
  kycData,
  onComplete,
  t,
}: {
  kycData: KYCData;
  onComplete: () => void;
  t: (key: string) => string;
}) {
  const [phoneCode, setPhoneCode] = useState("");
  const [emailCode, setEmailCode] = useState("");

  return (
    <div className="h-full bg-gradient-to-br from-[#f8f9ff] to-[#e8f4f8] flex flex-col">
      <div className="flex-1 overflow-y-auto px-5 py-6">
        <h2 className="text-xl font-bold text-[#1a1a2e] mb-5">{t("verifyContact")}</h2>

        <div className="space-y-4">
          <div className="p-4 bg-white border border-gray-200 rounded-xl">
            <p className="text-xs text-gray-500 mb-3">{t("phoneNumber")}</p>
            <p className="text-sm text-gray-900 font-medium mb-3">{kycData.mobile}</p>
            <button className="px-4 py-2 bg-[#5856d6] text-white text-xs rounded-lg font-medium">
              {t("sendCode")}
            </button>
            <input
              type="text"
              placeholder={t("enterCode")}
              value={phoneCode}
              onChange={(e) => setPhoneCode(e.target.value)}
              className="w-full mt-3 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
            />
          </div>

          <div className="p-4 bg-white border border-gray-200 rounded-xl">
            <p className="text-xs text-gray-500 mb-3">{t("email")}</p>
            <p className="text-sm text-gray-900 font-medium mb-3">{kycData.email}</p>
            <button className="px-4 py-2 bg-[#5856d6] text-white text-xs rounded-lg font-medium">
              {t("sendCode")}
            </button>
            <input
              type="text"
              placeholder={t("enterCode")}
              value={emailCode}
              onChange={(e) => setEmailCode(e.target.value)}
              className="w-full mt-3 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
            />
          </div>
        </div>
      </div>

      <div className="p-5 bg-white border-t border-gray-200">
        <button
          onClick={onComplete}
          disabled={!phoneCode || !emailCode}
          className="w-full py-3 bg-gradient-to-r from-[#5856d6] to-[#7c3aed] text-white rounded-xl font-semibold text-sm disabled:opacity-50"
        >
          {t("verify")}
        </button>
      </div>
    </div>
  );
}

// Crypto Assessment (SFC Required)
function BXCryptoAssessment({
  onComplete,
  t,
}: {
  onComplete: () => void;
  t: (key: string) => string;
}) {
  const [answer1, setAnswer1] = useState("");
  const [answer2, setAnswer2] = useState("");

  return (
    <div className="h-full bg-gradient-to-br from-[#f8f9ff] to-[#e8f4f8] flex flex-col">
      <div className="flex-1 overflow-y-auto px-5 py-6">
        <h2 className="text-xl font-bold text-[#1a1a2e] mb-1">{t("cryptoKnowledgeTest")}</h2>
        <p className="text-xs text-gray-500 mb-5">{t("sfcRequirement")}</p>

        <div className="space-y-5">
          <div>
            <p className="text-sm text-gray-900 font-medium mb-3">{t("cryptoQuestion1")}</p>
            <div className="space-y-2">
              {["low", "high", "veryHigh"].map((ans) => (
                <button
                  key={ans}
                  onClick={() => setAnswer1(ans)}
                  className={`w-full p-3 rounded-xl border-2 text-left transition-all ${
                    answer1 === ans
                      ? "border-[#5856d6] bg-[#5856d6]/5"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <p className="text-sm text-gray-900">{t(`cryptoAnswer_${ans}`)}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-900 font-medium mb-3">{t("cryptoQuestion2")}</p>
            <div className="space-y-2">
              {["yes", "no", "partial"].map((ans) => (
                <button
                  key={ans}
                  onClick={() => setAnswer2(ans)}
                  className={`w-full p-3 rounded-xl border-2 text-left transition-all ${
                    answer2 === ans
                      ? "border-[#5856d6] bg-[#5856d6]/5"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <p className="text-sm text-gray-900">{t(`cryptoAnswer2_${ans}`)}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 bg-white border-t border-gray-200">
        <button
          onClick={onComplete}
          disabled={!answer1 || !answer2}
          className="w-full py-3 bg-gradient-to-r from-[#5856d6] to-[#7c3aed] text-white rounded-xl font-semibold text-sm disabled:opacity-50"
        >
          {t("submit")}
        </button>
      </div>
    </div>
  );
}

// BX Profile
function BXProfile({
  kycData,
  language,
  onBack,
  t,
}: {
  kycData: KYCData;
  language: Language;
  onBack: () => void;
  t: (key: string) => string;
}) {
  return (
    <div className="h-full bg-gradient-to-br from-[#f8f9ff] to-[#e8f4f8] flex flex-col">
      <div className="flex-1 overflow-y-auto px-5 py-6">
        <button onClick={onBack} className="text-[#5856d6] font-medium mb-6 flex items-center gap-2 hover:gap-3 transition-all text-sm">
          <ArrowRight className="w-4 h-4 rotate-180" /> {t("back")}
        </button>

        <h1 className="text-2xl font-bold text-[#1a1a2e] mb-1">{t("profile")}</h1>
        <p className="text-base text-gray-600 mb-8">
          {language === "en" ? kycData.nameEn : kycData.nameZh}
        </p>

        {/* Account Origin Badge */}
        <div className="bg-gradient-to-r from-[#0A4DA2]/5 to-blue-50 border border-[#0A4DA2]/20 rounded-xl p-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#0A4DA2] to-[#1e5bb8] rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">BB</span>
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm mb-0.5">{t("accountOpenedVia")}</p>
              <p className="text-xs text-[#0A4DA2] font-medium">Bean Bank</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="p-4 bg-white border border-gray-200 rounded-xl">
            <p className="text-xs text-gray-500 mb-1.5 uppercase tracking-wide">{t("clientRef")}</p>
            <p className="font-mono text-sm text-[#5856d6] font-medium">BX234232134</p>
          </div>

          <div className="p-4 bg-white border border-gray-200 rounded-xl">
            <p className="text-xs text-gray-500 mb-1.5 uppercase tracking-wide">{t("email")}</p>
            <p className="text-sm text-gray-900">{kycData.email}</p>
          </div>
        </div>
      </div>

      <div className="bg-white border-t border-gray-200 px-5 py-2.5">
        <div className="flex items-center justify-around">
          <button className="flex flex-col items-center gap-0.5 text-gray-400">
            <Home className="w-5 h-5" />
            <span className="text-xs">{t("home")}</span>
          </button>
          <button className="flex flex-col items-center gap-0.5 text-gray-400">
            <TrendingUp className="w-5 h-5" />
            <span className="text-xs">{t("markets")}</span>
          </button>
          <button className="flex flex-col items-center gap-0.5 text-[#5856d6]">
            <User className="w-5 h-5" />
            <span className="text-xs font-medium">{t("profile")}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Translations
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Bean Bank
    totalBalance: "Total Balance",
    transfer: "Transfer",
    deposit: "Deposit",
    tradeCryptoNow: "Trade Crypto at BeanExchange now!",
    serviceProvidedBy: "Service provided by BeanExchange",
    myAccounts: "My Accounts",
    savingsAccount: "Savings Account",
    currentAccount: "Current Account",
    recentTransactions: "Recent Transactions",
    settings: "Settings",
    account: "Account",
    security: "Security",
    notifications: "Notifications",
    resetTesting: "Reset (Testing)",
    back: "Back",

    // Consent
    leavingBeanBank: "You're leaving Bean Bank",
    redirectNotice:
      "You will be redirected to third-party BeanExchange. Any actions are not related to Bean Bank, which is not liable.",
    consentToShare:
      "We'd like your consent to share your information (KYC details) with BeanExchange to provide this service.",
    riskDisclosure:
      "Virtual assets are high-risk and not covered by the Investor Compensation Fund.",
    cancel: "Cancel",
    okContinue: "OK, Continue",
    redirectingToBX: "Redirecting to BeanExchange",
    simpleRedirectNotice: "You will be redirected to BeanExchange.",
    go: "Go",

    // Mini App
    secure: "Secure",

    // BeanExchange
    welcomeToBeanExchange: "Welcome to BeanExchange",
    bxIntro:
      "Start trading Bitcoin, Ethereum, and other virtual assets. BeanExchange is licensed by the SFC under the AMLO regime.",
    vaRiskWarning:
      "Virtual assets are high-risk investments. Prices can be extremely volatile. Trading is conducted by BeanExchange, not Bean Bank.",
    next: "Next",
    openAccountNow: "Open Account Now!",

    // Pending Actions
    pendingActions: "Pending Actions",
    kycVerification: "KYC Verification",
    requiredToTrade: "Required to trade",
    phoneEmailVerification: "Phone / Email Verification",
    verifyContact: "Verify your contact details",
    cryptoAssessment: "Crypto Knowledge Assessment",
    sfcRequired: "Required by SFC",

    // New KYC Flow
    verifyInformation: "Verify Your Information",
    reviewAndConfirm: "Please review and confirm your information is correct",
    confirm: "Confirm",
    addressVerification: "Address Verification",
    uploadProofOfAddress: "Upload proof of address",
    last3Months: "Utility bill or bank statement (last 3 months)",
    acceptedDocuments: "Accepted: Utility bills, bank statements, government correspondence",

    // Phone/Email Verification
    phoneNumber: "Phone Number",
    sendCode: "Send Code",
    enterCode: "Enter verification code",
    verify: "Verify",

    // Crypto Assessment
    cryptoKnowledgeTest: "Virtual Asset Knowledge Test",
    sfcRequirement: "Required by SFC for all virtual asset traders",
    cryptoQuestion1: "How would you describe the risk level of virtual assets?",
    cryptoAnswer_low: "Low risk - similar to traditional investments",
    cryptoAnswer_high: "High risk - volatile but manageable",
    cryptoAnswer_veryHigh: "Very high risk - extremely volatile and speculative",
    cryptoQuestion2: "Are virtual assets covered by the Investor Compensation Fund?",
    cryptoAnswer2_yes: "Yes, fully protected",
    cryptoAnswer2_no: "No, not covered at all",
    cryptoAnswer2_partial: "Partially covered",
    submit: "Submit",

    // KYC
    eligibility: "Eligibility Check",
    hkResident: "I am a Hong Kong resident with a valid HK address",
    age18Plus: "I am 18 years or older",
    personalDetails: "Personal Details",
    preFilled: "Pre-filled from Bean Bank",
    fullNameEn: "Full Legal Name (English)",
    fullNameZh: "Full Legal Name (Chinese)",
    hkid: "HKID Number",
    dob: "Date of Birth",
    email: "Email Address",
    sharedByBeanBank: "Shared by Bean Bank",
    idVerification: "Identity Verification",
    uploadHKID: "Upload your HKID",
    frontAndBack: "Front and back required",
    idvNote:
      "We'll verify your identity using OCR and authenticity checks including hologram detection.",
    livenessCheck: "Liveness Check",
    takeSelfie: "Take a selfie",
    livenessNote: "Please take a live selfie for identity verification.",
    verifyingDetails: "Verifying your details",
    pleaseWait: "This may take a moment...",
    sourceOfFunds: "Source of Funds",
    salary: "Salary",
    savings: "Savings",
    investments: "Investments",
    business: "Business Income",
    riskAssessment: "Risk Assessment",
    knowledgeTest: "Virtual asset knowledge test",
    question1: "How would you describe the volatility of virtual assets?",
    answer_low: "Low - stable like traditional currencies",
    answer_medium: "Medium - some fluctuation",
    answer_high: "High - extremely volatile and risky",
    disclosures: "Agreements & Disclosures",
    clientAgreement: "I agree to the BeanExchange Client Agreement",
    vaRiskDisclosure: "I acknowledge the Virtual Asset Risk Disclosure",
    custodyDisclosure: "I understand the custody disclosure",
    feeSchedule: "I agree to the fee schedule",
    icfNotCovered:
      "I understand virtual assets are not covered by the Investor Compensation Fund and Bean Bank bears no responsibility",
    fundingSetup: "Funding Setup",
    linkedAccount: "Linked Account",
    verified: "Verified",
    addFPS: "Add FPS",
    fundingNote:
      "Funds must route through your own verified bank account. No third-party funding allowed.",
    complete: "Complete",

    // Activation
    accountReady: "Your BeanExchange account is ready",
    clientRef: "Client Reference",
    startTrading: "Start Trading",

    // Exchange
    hi: "Hi",
    markets: "Markets",
    home: "Home",
    profile: "Profile",
    withdraw: "Withdraw",
    trade: "Trade",
    futures: "Futures",
    wallet: "Wallet",
    completeVerification: "Complete verification to start trading",

    // Profile
    accountOpenedVia: "Account opened via",
  },
  zh: {
    // Bean Bank
    totalBalance: "總餘額",
    transfer: "轉賬",
    deposit: "存款",
    tradeCryptoNow: "立即在BeanExchange交易加密貨幣！",
    serviceProvidedBy: "由BeanExchange提供服務",
    myAccounts: "我的賬戶",
    savingsAccount: "儲蓄賬戶",
    currentAccount: "往來賬戶",
    recentTransactions: "最近交易",
    settings: "設定",
    account: "賬戶",
    security: "安全",
    notifications: "通知",
    resetTesting: "重設（測試）",
    back: "返回",

    // Consent
    leavingBeanBank: "您即將離開Bean Bank",
    redirectNotice:
      "您將被重定向至第三方BeanExchange。任何操作與Bean Bank無關，Bean Bank不承擔任何責任。",
    consentToShare: "我們希望獲得您的同意，與BeanExchange分享您的資料（KYC詳情）以提供此服務。",
    riskDisclosure: "虛擬資產屬高風險投資，不受投資者賠償基金保障。",
    cancel: "取消",
    okContinue: "確定，繼續",
    redirectingToBX: "正在跳轉至BeanExchange",
    simpleRedirectNotice: "您將被重定向至BeanExchange。",
    go: "前往",

    // Mini App
    secure: "安全",

    // BeanExchange
    welcomeToBeanExchange: "歡迎來到BeanExchange",
    bxIntro:
      "開始交易比特幣、以太坊及其他虛擬資產。BeanExchange已獲證監會根據打擊洗錢條例發牌。",
    vaRiskWarning: "虛擬資產屬高風險投資。價格可能極度波動。交易由BeanExchange進行，而非Bean Bank。",
    next: "下一步",
    openAccountNow: "立即開戶！",

    // Pending Actions
    pendingActions: "待辦事項",
    kycVerification: "KYC認證",
    requiredToTrade: "交易前必須完成",
    phoneEmailVerification: "電話 / 電郵驗證",
    verifyContact: "驗證您的聯絡資料",
    cryptoAssessment: "虛擬資產知識測試",
    sfcRequired: "證監會要求",

    // New KYC Flow
    verifyInformation: "驗證您的資料",
    reviewAndConfirm: "請檢查並確認您的資料正確",
    confirm: "確認",
    addressVerification: "地址驗證",
    uploadProofOfAddress: "上傳地址證明",
    last3Months: "公用事業賬單或銀行月結單（最近3個月）",
    acceptedDocuments: "接受：公用事業賬單、銀行月結單、政府信件",

    // Phone/Email Verification
    phoneNumber: "電話號碼",
    sendCode: "發送驗證碼",
    enterCode: "輸入驗證碼",
    verify: "驗證",

    // Crypto Assessment
    cryptoKnowledgeTest: "虛擬資產知識測試",
    sfcRequirement: "證監會要求所有虛擬資產交易者完成",
    cryptoQuestion1: "您如何描述虛擬資產的風險級別？",
    cryptoAnswer_low: "低風險 - 與傳統投資類似",
    cryptoAnswer_high: "高風險 - 波動但可控",
    cryptoAnswer_veryHigh: "極高風險 - 極度波動和投機性",
    cryptoQuestion2: "虛擬資產是否受投資者賠償基金保障？",
    cryptoAnswer2_yes: "是，完全保障",
    cryptoAnswer2_no: "否，完全不受保障",
    cryptoAnswer2_partial: "部分保障",
    submit: "提交",

    // KYC
    eligibility: "資格檢查",
    hkResident: "我是香港居民，擁有有效香港地址",
    age18Plus: "我已年滿18歲或以上",
    personalDetails: "個人資料",
    preFilled: "已從Bean Bank預填",
    fullNameEn: "全名（英文）",
    fullNameZh: "全名（中文）",
    hkid: "香港身份證號碼",
    dob: "出生日期",
    email: "電郵地址",
    sharedByBeanBank: "由Bean Bank分享",
    idVerification: "身份驗證",
    uploadHKID: "上傳您的香港身份證",
    frontAndBack: "需要正面和背面",
    idvNote: "我們將使用OCR和真實性檢查（包括全息圖檢測）驗證您的身份。",
    livenessCheck: "活體檢測",
    takeSelfie: "拍攝自拍照",
    livenessNote: "請拍攝實時自拍照以進行身份驗證。",
    verifyingDetails: "正在驗證您的資料",
    pleaseWait: "這可能需要一些時間...",
    sourceOfFunds: "資金來源",
    salary: "薪金",
    savings: "儲蓄",
    investments: "投資",
    business: "業務收入",
    riskAssessment: "風險評估",
    knowledgeTest: "虛擬資產知識測試",
    question1: "您如何描述虛擬資產的波動性？",
    answer_low: "低 - 像傳統貨幣一樣穩定",
    answer_medium: "中 - 有一些波動",
    answer_high: "高 - 極度波動和高風險",
    disclosures: "協議及披露",
    clientAgreement: "我同意BeanExchange客戶協議",
    vaRiskDisclosure: "我確認已閱讀虛擬資產風險披露",
    custodyDisclosure: "我理解託管披露",
    feeSchedule: "我同意收費表",
    icfNotCovered:
      "我理解虛擬資產不受投資者賠償基金保障，Bean Bank不承擔任何責任",
    fundingSetup: "資金設置",
    linkedAccount: "已連結賬戶",
    verified: "已驗證",
    addFPS: "添加轉數快",
    fundingNote: "資金必須通過您自己的已驗證銀行賬戶。不允許第三方注資。",
    complete: "完成",

    // Activation
    accountReady: "您的BeanExchange賬戶已準備好",
    clientRef: "客戶參考編號",
    startTrading: "開始交易",

    // Exchange
    hi: "你好",
    markets: "市場",
    home: "主頁",
    profile: "個人檔案",
    withdraw: "提現",
    trade: "交易",
    futures: "合約",
    wallet: "錢包",
    completeVerification: "完成驗證以開始交易",

    // Profile
    accountOpenedVia: "賬戶開通經由",
  },
};
