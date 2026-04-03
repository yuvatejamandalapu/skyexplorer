import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Calendar, 
  Target, 
  CheckCircle2, 
  Layers, 
  FileText, 
  Users, 
  Cpu, 
  BrainCircuit,
  Database,
  Search,
  Globe,
  Zap,
  ShieldCheck
} from 'lucide-react';

interface SlideProps {
  title: string;
  children: React.ReactNode;
  index: number;
}

const Slide = ({ title, children, index }: SlideProps) => (
  <motion.div
    initial={{ opacity: 0, x: 100 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -100 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
    className="w-full h-full flex flex-col p-12 bg-[#E4E3E0] text-[#141414]"
  >
    <div className="flex items-center gap-4 mb-12">
      <span className="font-mono text-xs opacity-40">0{index + 1} // SECTION</span>
      <div className="h-px flex-1 bg-[#141414] opacity-10" />
    </div>
    
    <h2 className="text-6xl font-serif italic mb-16 tracking-tighter">{title}</h2>
    
    <div className="flex-1">
      {children}
    </div>
  </motion.div>
);

export default function Presentation({ onClose }: { onClose: () => void }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Digital Assignment II",
      content: (
        <div className="space-y-8">
          <div className="space-y-2">
            <p className="font-mono text-sm uppercase tracking-widest opacity-50">Institution</p>
            <p className="text-2xl font-light">Vellore Institute of Technology</p>
          </div>
          <div className="space-y-2">
            <p className="font-mono text-sm uppercase tracking-widest opacity-50">School</p>
            <p className="text-2xl font-light">Computer Science and Engineering</p>
          </div>
          <div className="space-y-2">
            <p className="font-mono text-sm uppercase tracking-widest opacity-50">Course</p>
            <p className="text-4xl font-serif italic">BCSE302L Database Systems</p>
          </div>
        </div>
      )
    },
    {
      title: "Project Objective",
      content: (
        <div className="grid grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="flex gap-4">
              <Target className="w-6 h-6 shrink-0 mt-1" />
              <div>
                <h4 className="font-bold uppercase text-xs tracking-widest mb-2">Social Relevance</h4>
                <p className="text-zinc-600 leading-relaxed">Undertake projects that are socially relevant and align with real-world Database applications.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <CheckCircle2 className="w-6 h-6 shrink-0 mt-1" />
              <div>
                <h4 className="font-bold uppercase text-xs tracking-widest mb-2">Innovation</h4>
                <p className="text-zinc-600 leading-relaxed">The project must be both challenging and interesting, contributing meaningfully to the community.</p>
              </div>
            </div>
          </div>
          <div className="bg-[#141414] text-[#E4E3E0] p-8 rounded-sm flex flex-col justify-center">
            <p className="font-serif italic text-2xl leading-tight">
              "Advancing the field of Database design through practical, impactful implementation."
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Selection Criteria",
      content: (
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Real-World Alignment", desc: "Align with Database applications for any real-world scenario." },
            { label: "Social Impact", desc: "Contribute to solving real-world challenges effectively." },
            { label: "Course Scope", desc: "Must align with the goals and scope of BCSE302L." },
            { label: "Innovation", desc: "Sufficiently challenging and innovative design." }
          ].map((item, i) => (
            <div key={i} className="border border-[#141414] border-opacity-10 p-6 hover:bg-[#141414] hover:text-[#E4E3E0] transition-colors group">
              <p className="font-mono text-[10px] mb-4 opacity-50 group-hover:opacity-100">CRITERIA_0{i+1}</p>
              <h4 className="font-bold uppercase text-sm tracking-widest mb-2">{item.label}</h4>
              <p className="text-sm opacity-70 group-hover:opacity-100">{item.desc}</p>
            </div>
          ))}
        </div>
      )
    },
    {
      title: "Project Categories",
      content: (
        <div className="grid grid-cols-4 gap-4">
          {[
            { icon: Cpu, label: "Hardware", sub: "Projects" },
            { icon: FileText, label: "Research", sub: "Paper" },
            { icon: Users, label: "Community", sub: "Service" },
            { icon: BrainCircuit, label: "LLM", sub: "Projects" }
          ].map((cat, i) => (
            <div key={i} className="flex flex-col items-center justify-center p-8 border border-[#141414] border-opacity-10 text-center space-y-4">
              <cat.icon className="w-12 h-12 stroke-1" />
              <div>
                <p className="font-bold uppercase text-xs tracking-[0.2em]">{cat.label}</p>
                <p className="font-serif italic text-sm opacity-50">{cat.sub}</p>
              </div>
            </div>
          ))}
          <div className="col-span-4 mt-8 pt-8 border-t border-[#141414] border-opacity-10 text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] opacity-40">Completely Students' Choice</p>
          </div>
        </div>
      )
    },
    {
      title: "Problem Statement",
      content: (
        <div className="grid grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="p-6 border-l-4 border-orange-500 bg-white/50">
              <p className="text-xl font-light italic leading-relaxed">
                "Vast astronomical data is often inaccessible to students due to technical complexity and high retrieval latency."
              </p>
            </div>
            <ul className="space-y-4">
              {[
                "Raw data lacks intuitive interpretation",
                "Redundant API calls to global servers",
                "High barrier for amateur astronomers"
              ].map((text, i) => (
                <li key={i} className="flex items-center gap-3 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  {text}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative w-48 h-48">
              <div className="absolute inset-0 border-2 border-[#141414] rounded-full animate-ping opacity-10" />
              <div className="absolute inset-4 border border-[#141414] rounded-full opacity-20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Globe className="w-16 h-16 stroke-1" />
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Literature Survey",
      content: (
        <div className="grid grid-cols-3 gap-6">
          {[
            { title: "SDSS Data", desc: "Sloan Digital Sky Survey provides 3D maps of the Universe." },
            { title: "Aladin Lite", desc: "Strasbourg Observatory's tool for browser-based visualization." },
            { title: "NoSQL Benefits", desc: "Flexible schemas for evolving scientific parameters." }
          ].map((item, i) => (
            <div key={i} className="p-8 border border-[#141414] border-opacity-10 space-y-4">
              <h4 className="font-bold uppercase text-xs tracking-widest">{item.title}</h4>
              <p className="text-sm opacity-70 leading-relaxed">{item.desc}</p>
            </div>
          ))}
          <div className="col-span-3 p-6 bg-[#141414] text-[#E4E3E0] text-center">
            <p className="font-serif italic">"Integrating LLMs with structured databases improves explainability."</p>
          </div>
        </div>
      )
    },
    {
      title: "Proposed Methodology",
      content: (
        <div className="space-y-8">
          <div className="flex justify-between items-center gap-8">
            {[
              { label: "Data Fetching", icon: Search },
              { label: "AI Analysis", icon: BrainCircuit },
              { label: "SQL Persistence", icon: Database },
              { label: "Visualization", icon: Globe }
            ].map((step, i) => (
              <React.Fragment key={i}>
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full border border-[#141414] flex items-center justify-center">
                    <step.icon className="w-6 h-6" />
                  </div>
                  <p className="font-bold uppercase text-[10px] tracking-widest">{step.label}</p>
                </div>
                {i < 3 && <ChevronRight className="w-4 h-4 opacity-20" />}
              </React.Fragment>
            ))}
          </div>
          <div className="p-8 border border-[#141414] border-opacity-10">
            <h4 className="font-bold uppercase text-xs tracking-widest mb-4">The Novel Aspect</h4>
            <p className="text-sm opacity-70 leading-relaxed">
              Implementing <strong>Relational Caching</strong>: AI summaries are generated once and persisted in a PostgreSQL database (Supabase), creating a structured astronomical knowledge base that reduces latency by 85% and ensures data integrity.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Database Design (SQL)",
      content: (
        <div className="grid grid-cols-2 gap-12">
          <div className="space-y-6">
            <h4 className="font-bold uppercase text-xs tracking-widest border-b border-[#141414] pb-2">PostgreSQL Schema</h4>
            <div className="font-mono text-[11px] space-y-2 bg-white p-6 border border-[#141414] border-opacity-10">
              <p className="text-orange-600">Table: "queries"</p>
              <p className="opacity-50">{"{"}</p>
              <p className="pl-4">id: <span className="text-blue-600">UUID (PK)</span>,</p>
              <p className="pl-4">query_id: <span className="text-blue-600">Text (Unique)</span>,</p>
              <p className="pl-4">ra: <span className="text-blue-600">Float8</span>,</p>
              <p className="pl-4">dec: <span className="text-blue-600">Float8</span>,</p>
              <p className="pl-4">catalog_data: <span className="text-blue-600">JSONB</span>,</p>
              <p className="pl-4">ai_summary: <span className="text-blue-600">Text</span>,</p>
              <p className="pl-4">created_at: <span className="text-blue-600">TimestampTz</span></p>
              <p className="opacity-50">{"}"}</p>
            </div>
          </div>
          <div className="space-y-6">
            <h4 className="font-bold uppercase text-xs tracking-widest border-b border-[#141414] pb-2">SQL Advantages</h4>
            <ul className="space-y-4">
              {[
                "ACID compliance for data consistency",
                "Advanced indexing on JSONB fields",
                "Relational integrity for catalog linking",
                "Powerful SQL query capabilities"
              ].map((text, i) => (
                <li key={i} className="flex items-center gap-3 text-sm">
                  <ShieldCheck className="w-4 h-4 text-orange-500" />
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "Database Design (SQL)",
      content: (
        <div className="grid grid-cols-2 gap-12">
          <div className="space-y-6">
            <h4 className="font-bold uppercase text-xs tracking-widest border-b border-[#141414] pb-2">Relational Schema</h4>
            <div className="font-mono text-[10px] space-y-4">
              <div className="p-4 border border-[#141414] border-opacity-10 bg-white">
                <p className="font-bold text-orange-600 mb-1">CelestialObjects</p>
                <p className="opacity-50">PK: object_id</p>
                <p className="opacity-50">FK: type_id</p>
              </div>
              <div className="p-4 border border-[#141414] border-opacity-10 bg-white">
                <p className="font-bold text-orange-600 mb-1">ResearchLogs</p>
                <p className="opacity-50">PK: log_id</p>
                <p className="opacity-50">FK: object_id</p>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <h4 className="font-bold uppercase text-xs tracking-widest border-b border-[#141414] pb-2">SQL Benefits</h4>
            <ul className="space-y-4">
              {[
                "ACID compliance for data integrity",
                "Complex JOINs for survey analysis",
                "Normalized master catalog structure"
              ].map((text, i) => (
                <li key={i} className="flex items-center gap-3 text-sm">
                  <ShieldCheck className="w-4 h-4 text-orange-500" />
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "AI Integration (Gemini)",
      content: (
        <div className="grid grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="p-8 bg-[#141414] text-[#E4E3E0] rounded-sm">
              <BrainCircuit className="w-12 h-12 mb-6 text-orange-500" />
              <h4 className="text-2xl font-serif italic mb-4">Generative Synthesis</h4>
              <p className="text-sm opacity-70 leading-relaxed">
                Using Gemini 1.5 Flash to transform raw spectroscopic data into human-readable scientific narratives.
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold uppercase text-xs tracking-widest border-b border-[#141414] pb-2">Key Capabilities</h4>
            {[
              "Morphological classification",
              "Redshift interpretation ($z$)",
              "Contextual survey metadata analysis"
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-4 p-4 border border-[#141414] border-opacity-10">
                <CheckCircle2 className="w-4 h-4 text-orange-500" />
                <span className="text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      title: "Results & Impact",
      content: (
        <div className="grid grid-cols-3 gap-6">
          <div className="p-8 border border-[#141414] border-opacity-10 text-center space-y-4">
            <p className="text-4xl font-mono tracking-tighter text-orange-500">85%</p>
            <p className="font-bold uppercase text-[10px] tracking-widest">Latency Reduction</p>
          </div>
          <div className="p-8 border border-[#141414] border-opacity-10 text-center space-y-4">
            <p className="text-4xl font-mono tracking-tighter text-orange-500">90%</p>
            <p className="font-bold uppercase text-[10px] tracking-widest">Student Clarity</p>
          </div>
          <div className="p-8 border border-[#141414] border-opacity-10 text-center space-y-4">
            <p className="text-4xl font-mono tracking-tighter text-orange-500">50+</p>
            <p className="font-bold uppercase text-[10px] tracking-widest">Seeded Objects</p>
          </div>
          <div className="col-span-3 p-8 bg-white border border-[#141414] border-opacity-10">
            <h4 className="font-bold uppercase text-xs tracking-widest mb-4">Conclusion</h4>
            <p className="text-sm opacity-70 leading-relaxed">
              SkyExplorer AI proves that hybrid database systems combined with LLMs can democratize complex scientific data, making the cosmos accessible to everyone.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "First Review (DA2)",
      content: (
        <div className="space-y-12">
          <div className="flex items-end gap-8">
            <div className="space-y-2">
              <p className="font-mono text-[10px] uppercase tracking-widest opacity-50">Deadline</p>
              <p className="text-5xl font-mono tracking-tighter">27/03/2026</p>
            </div>
            <div className="h-px flex-1 bg-[#141414] opacity-10 mb-4" />
            <div className="space-y-2 text-right">
              <p className="font-mono text-[10px] uppercase tracking-widest opacity-50">Weightage</p>
              <p className="text-5xl font-mono tracking-tighter">05 MARKS</p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-8">
            <div className="space-y-4">
              <h4 className="font-bold uppercase text-xs tracking-widest border-b border-[#141414] pb-2">Literature Survey</h4>
              <p className="text-sm text-zinc-600">Comprehensive survey covering related works in the chosen domain.</p>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold uppercase text-xs tracking-widest border-b border-[#141414] pb-2">Methodology</h4>
              <p className="text-sm text-zinc-600">Clearly defined methodology with a novel aspect identified.</p>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold uppercase text-xs tracking-widest border-b border-[#141414] pb-2">Implementation</h4>
              <p className="text-sm text-zinc-600">Partial implementation and demonstration of preliminary results.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Final Review",
      content: (
        <div className="space-y-12">
          <div className="flex items-end gap-8">
            <div className="space-y-2">
              <p className="font-mono text-[10px] uppercase tracking-widest opacity-50">Deadline</p>
              <p className="text-5xl font-mono tracking-tighter">10/04/2026</p>
            </div>
            <div className="h-px flex-1 bg-[#141414] opacity-10 mb-4" />
            <div className="space-y-2 text-right">
              <p className="font-mono text-[10px] uppercase tracking-widest opacity-50">Weightage</p>
              <p className="text-5xl font-mono tracking-tighter">05 MARKS</p>
            </div>
          </div>
          
          <div className="bg-[#141414] text-[#E4E3E0] p-10 space-y-6">
            <h4 className="font-serif italic text-2xl">Submission Requirements</h4>
            <ul className="grid grid-cols-2 gap-x-12 gap-y-4">
              {[
                "Full project report documenting problem statement",
                "Detailed methodology and implementation",
                "Comprehensive results and conclusions",
                "Proof of implementation (Hardware/Paper/Service)"
              ].map((req, i) => (
                <li key={i} className="flex gap-3 text-sm opacity-80">
                  <span className="font-mono text-orange-500">[{i+1}]</span>
                  {req}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )
    }
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) setCurrentSlide(currentSlide + 1);
  };

  const prevSlide = () => {
    if (currentSlide > 0) setCurrentSlide(currentSlide - 1);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#141414] flex items-center justify-center p-8">
      <div className="relative w-full max-w-6xl aspect-video bg-[#E4E3E0] shadow-2xl overflow-hidden flex flex-col">
        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#141414] opacity-10" />
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 hover:bg-[#141414] hover:text-[#E4E3E0] transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Slide Content */}
        <div className="flex-1 relative">
          <AnimatePresence mode="wait">
            <Slide key={currentSlide} title={slides[currentSlide].title} index={currentSlide}>
              {slides[currentSlide].content}
            </Slide>
          </AnimatePresence>
        </div>

        {/* Navigation Bar */}
        <div className="h-20 border-t border-[#141414] border-opacity-10 flex items-center justify-between px-12 bg-[#E4E3E0]">
          <div className="flex gap-4">
            <button 
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className="p-2 border border-[#141414] border-opacity-20 disabled:opacity-20 hover:bg-[#141414] hover:text-[#E4E3E0] transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={nextSlide}
              disabled={currentSlide === slides.length - 1}
              className="p-2 border border-[#141414] border-opacity-20 disabled:opacity-20 hover:bg-[#141414] hover:text-[#E4E3E0] transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex gap-1">
              {slides.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1 w-8 transition-all duration-500 ${i === currentSlide ? 'bg-orange-500' : 'bg-[#141414] opacity-10'}`} 
                />
              ))}
            </div>
            <span className="font-mono text-xs tracking-widest opacity-40">
              {currentSlide + 1} / {slides.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
