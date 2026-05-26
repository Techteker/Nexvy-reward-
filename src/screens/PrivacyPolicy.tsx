import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, FileText, Lock, CheckCircle, ArrowLeft, Eye, ShieldAlert, Award, AlertTriangle, Key } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type TabType = 'terms' | 'privacy' | 'security';

export const PrivacyPolicy = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState<TabType>('terms');

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="flex flex-col gap-6"
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-2">
        <button
          onClick={() => navigate(-1)}
          className="p-3 bg-white border border-slate-100 text-slate-700 rounded-2xl hover:text-brand-purple active:scale-95 transition-all cursor-pointer shadow-sm"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none uppercase italic font-display">
            Secured Vault
          </h1>
          <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mt-1">
            Rules, Privacy & Trust
          </p>
        </div>
      </div>

      {/* Trust Hero Panel */}
      <div className="gaming-card p-6 bg-gradient-to-r from-brand-purple to-purple-800 text-white border-0 relative overflow-hidden shadow-xl rounded-[32px]">
        <div className="absolute top-0 right-0 p-4 opacity-10 text-white">
          <Shield size={120} />
        </div>
        <div className="relative z-10 flex flex-col gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/10 w-fit">
            <Lock size={11} className="text-yellow-300" />
            <span className="text-[8px] font-black uppercase tracking-wider text-yellow-300 font-mono">
              Nexvy Protected
            </span>
          </div>
          <h2 className="text-2xl font-black italic tracking-tighter leading-none mt-1">
            TRUST & SECURITY
          </h2>
          <p className="text-[11px] text-white/80 max-w-sm leading-relaxed mt-1 font-medium">
            We value your security above all. Explore our terms of play, reward distributions policies, security parameters, and strict privacy protections.
          </p>
        </div>
      </div>

      {/* Custom Elegance Navigation Tabs */}
      <div className="grid grid-cols-3 gap-2 bg-slate-50 border border-slate-100 p-1.5 rounded-2xl shadow-sm">
        {(['terms', 'privacy', 'security'] as TabType[]).map((tab) => {
          const isActive = activeTab === tab;
          const labels: Record<TabType, string> = {
            terms: 'Terms',
            privacy: 'Privacy',
            security: 'Security'
          };
          const icons: Record<TabType, any> = {
            terms: FileText,
            privacy: Eye,
            security: ShieldAlert
          };
          const Icon = icons[tab];

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-2 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer border-0 ${
                isActive
                  ? 'bg-brand-purple text-white shadow-md shadow-brand-purple/25 scale-105'
                  : 'bg-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              <Icon size={12} />
              <span>{labels[tab]}</span>
            </button>
          );
        })}
      </div>

      {/* Main Panel */}
      <div className="bg-white border border-slate-100 rounded-[28px] p-6 shadow-xl relative min-h-[400px]">
        <AnimatePresence mode="wait">
          {activeTab === 'terms' && (
            <motion.div
              key="terms"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col gap-6"
            >
              <div>
                <span className="text-[9px] font-mono font-black text-white bg-slate-900 px-2.5 py-1 rounded uppercase tracking-wider">
                  Terms of Service
                </span>
                <h3 className="text-lg font-black text-slate-900 italic font-display tracking-tight mt-3">
                  Rules and Reward Conditions
                </h3>
                <p className="text-[11px] text-slate-400 font-medium leading-relaxed mt-2">
                  By utilizing the Nexvy Platform, you agree to comply with the rules outlined below. Violations will lead to suspension.
                </p>
              </div>

              <div className="h-[1px] bg-slate-100 w-full" />

              {/* Clause Items */}
              <div className="flex flex-col gap-4">
                <div className="flex gap-3">
                  <div className="p-2.5 bg-indigo-50 text-indigo-500 rounded-xl max-h-10 shrink-0 flex items-center justify-center">
                    <Award size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight">1. Spin & Coin Policy</h4>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-1">
                      Our spinner rewards probability is transparently set to offer fair odds (5x, 4x, 3x, 2x, 1x, and 0x rates). Utilizing auto-clickers, macro tools, or scripts to automate spins is strictly prohibited.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="p-2.5 bg-yellow-50 text-yellow-600 rounded-xl max-h-10 shrink-0 flex items-center justify-center animate-pulse">
                    <AlertTriangle size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight">2. Referral Bonuses</h4>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-1">
                      Invited users must create verified, real accounts. Self-referrals (referring your own secondary devices) or abusing temporary burner emails will result in immediate coin forfeiture and permanent account limits.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="p-2.5 bg-emerald-50 text-emerald-500 rounded-xl max-h-10 shrink-0 flex items-center justify-center">
                    <CheckCircle size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight">3. Redemptions & Liquidations</h4>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-1">
                      Minimum coin balances must meet withdrawal thresholds (equivalent to selected USD tiers). All pending transfers undergo automated and manual auditing for compliance before execution.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'privacy' && (
            <motion.div
              key="privacy"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col gap-6"
            >
              <div>
                <span className="text-[9px] font-mono font-black text-white bg-brand-purple px-2.5 py-1 rounded uppercase tracking-wider">
                  Privacy Policy
                </span>
                <h3 className="text-lg font-black text-slate-900 italic font-display tracking-tight mt-3">
                  How We Protect Your Data
                </h3>
                <p className="text-[11px] text-slate-400 font-medium leading-relaxed mt-2">
                  Nexvy values transparency and your right to privacy. This covers exactly what data we record and how we keep it shielded.
                </p>
              </div>

              <div className="h-[1px] bg-slate-100 w-full" />

              <div className="flex flex-col gap-4">
                <div className="flex gap-3">
                  <div className="p-2.5 bg-purple-50 text-purple-500 rounded-xl max-h-10 shrink-0 flex items-center justify-center">
                    <Eye size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight">Data Registration</h4>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-1">
                      We only process username, encrypted authentication records, submission history metrics, and preferred payment gateways. Your credentials are fully protected using secure hashing algorithms.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="p-2.5 bg-blue-50 text-blue-500 rounded-xl max-h-10 shrink-0 flex items-center justify-center">
                    <CheckCircle size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight">Cookies & Storage</h4>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-1">
                      We use local and session storage memory buffers to maintain secure, offline-safe sessions, spin states, and progress caches. We do not place third-party marketing tracking cookies.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'security' && (
            <motion.div
              key="security"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col gap-6"
            >
              <div>
                <span className="text-[9px] font-mono font-black text-white bg-emerald-500 px-2.5 py-1 rounded uppercase tracking-wider">
                  Security Protocols
                </span>
                <h3 className="text-lg font-black text-slate-900 italic font-display tracking-tight mt-3">
                  Fraud Detection & Safe Safeguards
                </h3>
                <p className="text-[11px] text-slate-400 font-medium leading-relaxed mt-2">
                  Nexvy is secured with industry practices. Any suspicious account activities trigger active security interventions immediately.
                </p>
              </div>

              <div className="h-[1px] bg-slate-100 w-full" />

              <div className="flex flex-col gap-4">
                <div className="flex gap-3">
                  <div className="p-2.5 bg-emerald-50 text-emerald-500 rounded-xl max-h-10 shrink-0 flex items-center justify-center">
                    <Key size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight">Secured API & Database</h4>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-1">
                      All platform interaction pathways, databases, and submissions endpoints are encrypted using SSL protocols. Your rewards claims are written on atomic, transaction-checked ledger configurations.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="p-2.5 bg-red-50 text-red-500 rounded-xl max-h-10 shrink-0 flex items-center justify-center">
                    <ShieldAlert size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight">Active Anti-Cheat</h4>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-1">
                      Our live monitoring ledger analyses spin frequencies, claim trends, quiz timings, and multiple IPs. Accounts failing anti-exploit benchmarks are quarantined instantly.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Trust Stamp */}
        <div className="mt-8 pt-4 border-t border-slate-50 flex items-center justify-between">
          <span className="text-[8px] font-bold text-slate-300 tracking-wider uppercase">
            Updated: May 2026
          </span>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
            <span className="text-[8px] font-black text-emerald-600 tracking-widest uppercase">
              Vetted Secure
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PrivacyPolicy;
