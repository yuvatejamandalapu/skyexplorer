import React from 'react';
import { motion } from 'motion/react';
import { X, Database, Table, Code, ShieldCheck, Zap } from 'lucide-react';

export default function DatabaseView({ onClose }: { onClose: () => void }) {
  const sqlScript = `CREATE TABLE queries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  query_id TEXT UNIQUE NOT NULL,
  ra FLOAT8 NOT NULL,
  dec FLOAT8 NOT NULL,
  catalog_data JSONB NOT NULL,
  ai_summary TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS and allow public access
ALTER TABLE queries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read/Write" ON queries FOR ALL USING (true);`;

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl bg-[#141414] border border-white/10 rounded-3xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
              <Database className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <h2 className="text-2xl font-serif italic text-white">PostgreSQL Architecture</h2>
              <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Relational Database Management System</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-3 hover:bg-white/5 rounded-full transition-all text-zinc-500 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-12 custom-scrollbar">
          {/* Setup Instructions */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 text-orange-500">
              <Zap className="w-4 h-4" />
              <h3 className="text-xs uppercase font-bold tracking-widest">Required Setup for Deployment</h3>
            </div>
            <div className="bg-orange-500/5 border border-orange-500/10 p-6 rounded-2xl space-y-4">
              <p className="text-sm text-zinc-300 leading-relaxed">
                To see data after deploying, you <span className="text-orange-500 font-bold">must</span> add your Supabase credentials to the Project Settings:
              </p>
              <ol className="list-decimal list-inside text-xs text-zinc-500 space-y-2 ml-2">
                <li>Open <span className="text-zinc-300">Settings</span> (gear icon) in the top-right.</li>
                <li>Go to <span className="text-zinc-300">Secrets</span> or <span className="text-zinc-300">Environment Variables</span>.</li>
                <li>Add <span className="text-orange-500 font-mono">VITE_SUPABASE_URL</span> with your project URL.</li>
                <li>Add <span className="text-orange-500 font-mono">VITE_SUPABASE_ANON_KEY</span> with your public anon key.</li>
                <li>Add <span className="text-orange-500 font-mono">VITE_GEMINI_API_KEY</span> with your Gemini API key.</li>
              </ol>
            </div>
          </section>

          {/* Schema Visualization */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 text-zinc-500">
              <Table className="w-4 h-4" />
              <h3 className="text-xs uppercase font-bold tracking-widest">Table Definition: "queries"</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-black/40 border border-white/5 p-6 rounded-2xl font-mono text-[11px] space-y-3">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-orange-500">Column Name</span>
                  <span className="text-zinc-500">Data Type</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-300">id</span>
                  <span className="text-blue-400">UUID (PK)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-300">query_id</span>
                  <span className="text-blue-400">TEXT (UNIQUE)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-300">ra / dec</span>
                  <span className="text-blue-400">FLOAT8</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-300">catalog_data</span>
                  <span className="text-blue-400">JSONB</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-300">ai_summary</span>
                  <span className="text-blue-400">TEXT</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-300">created_at</span>
                  <span className="text-blue-400">TIMESTAMPTZ</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl flex gap-4">
                  <ShieldCheck className="w-5 h-5 text-orange-500 shrink-0" />
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Data Integrity</h4>
                    <p className="text-xs text-zinc-500 leading-relaxed">ACID compliance ensures that every celestial analysis is stored reliably without corruption.</p>
                  </div>
                </div>
                <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl flex gap-4">
                  <Zap className="w-5 h-5 text-orange-500 shrink-0" />
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Performance</h4>
                    <p className="text-xs text-zinc-500 leading-relaxed">JSONB indexing allows for lightning-fast retrieval of complex astronomical metadata.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SQL Script */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 text-zinc-500">
              <Code className="w-4 h-4" />
              <h3 className="text-xs uppercase font-bold tracking-widest">Setup Script (Copy to Supabase SQL Editor)</h3>
            </div>
            <div className="relative group">
              <pre className="p-6 bg-black rounded-2xl border border-white/10 font-mono text-[11px] text-zinc-400 overflow-x-auto">
                {sqlScript}
              </pre>
              <button 
                onClick={() => navigator.clipboard.writeText(sqlScript)}
                className="absolute top-4 right-4 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[9px] uppercase tracking-widest transition-all opacity-0 group-hover:opacity-100"
              >
                Copy Script
              </button>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/5 bg-black/20 flex items-center justify-between">
          <p className="text-[9px] font-mono uppercase tracking-[0.3em] text-zinc-600">
            PostgreSQL // Supabase Cloud Instance
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 rounded-xl text-[9px] uppercase tracking-widest text-orange-500 transition-all font-bold"
          >
            Refresh & Test Connection
          </button>
        </div>
      </motion.div>
    </div>
  );
}
