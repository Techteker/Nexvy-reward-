import React from 'react';
import { motion } from 'motion/react';
import { ExternalLink, ShieldCheck, Lock, RefreshCw } from 'lucide-react';

export const IframeRedirect: React.FC = () => {
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '#';

  const handleManualRedirect = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('bypass_iframe', 'true');
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 mesh-gradient relative overflow-hidden">
      {/* Background Decorative Blurs */}
      <div className="absolute -top-32 -left-32 w-64 h-64 bg-brand-purple/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-violet-400/15 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md gaming-card p-8 bg-white border border-slate-100 shadow-2xl relative overflow-hidden flex flex-col items-center"
      >
        {/* Accent strip on top */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-brand-purple via-violet-500 to-indigo-500" />

        {/* Brand Logo & Name */}
        <div className="flex flex-col items-center gap-2 mb-8 mt-4">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
            className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg border border-slate-100 overflow-hidden"
          >
            <img src="/input_file_0.png" alt="Nexvy Logo" className="w-16 h-16 object-contain" referrerPolicy="no-referrer" />
          </motion.div>
          <h1 className="text-3xl font-display font-black text-brand-purple italic tracking-tighter mt-4 leading-none">NEXVY</h1>
          <p className="text-slate-400 font-black uppercase text-[9px] tracking-wider mt-1.5 flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-150/60">
            <Lock className="w-3 h-3 text-brand-purple" /> SECURE SANDBOX PROTOCOL
          </p>
        </div>

        {/* Informative text */}
        <div className="text-center mb-8 px-2">
          <h2 className="text-xl font-display font-bold text-slate-800 tracking-tight mb-3">
            Open in Dedicated Browser Tab
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed mb-4">
            Google AI Studio frames enforce strict third-party cookie restrictions. To use secure login sessions and earn rewards smoothly, please launch Nexvy directly in a dedicated browser tab.
          </p>

          <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100 text-left flex gap-3 text-xs text-slate-600">
            <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-700">100% Direct Connection Mode</p>
              <p className="text-slate-500 mt-0.5">Launches your secure workspace directly. Re-authenticates Appwrite with zero network sandboxing blocks.</p>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="w-full flex flex-col gap-3">
          <a
            href={currentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-gradient-to-r from-brand-purple to-violet-600 hover:from-brand-purple/95 hover:to-violet-600/95 text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(124,58,237,0.25)] hover:shadow-[0_6px_25px_rgba(124,58,237,0.35)] transition-all transform hover:-translate-y-0.5 text-center cursor-pointer"
          >
            <span>Launch Nexvy</span>
            <ExternalLink className="w-4 h-4" />
          </a>

          <button
            onClick={handleManualRedirect}
            className="w-full py-3.5 px-6 rounded-2xl border border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-50 font-bold transition-all text-xs flex items-center justify-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry Embedded Connection
          </button>
        </div>

        <p className="text-[10px] text-slate-400 mt-6 text-center">
          Active Development Session • Cloud Run Sandbox Enabled
        </p>
      </motion.div>
    </div>
  );
};
