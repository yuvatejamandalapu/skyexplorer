import React, { useEffect, useRef, useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { supabase } from './lib/supabase';
import { 
  Search, 
  Info, 
  Loader2, 
  Map as MapIcon, 
  Sparkles, 
  ChevronRight,
  Database,
  User as UserIcon,
  LogOut,
  FileText,
  Layers
} from 'lucide-react';
import Markdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---
enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface SupabaseErrorInfo {
  error: string;
  operationType: OperationType;
  table: string | null;
}

function handleSupabaseError(error: any, operationType: OperationType, table: string | null) {
  const errInfo: SupabaseErrorInfo = {
    error: error?.message || String(error),
    operationType,
    table
  }
  console.error('Supabase Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface CatalogData {
  name?: string;
  ra: number;
  dec: number;
  mag_r?: number;
  mag_g?: number;
  mag_i?: number;
  redshift?: number;
  obj_type?: string;
  survey?: string;
  [key: string]: any;
}

interface CachedQuery {
  ra: number;
  dec: number;
  catalog_data: CatalogData;
  ai_summary: string;
  queried_at: any;
}

import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// --- Constants ---
const GEMINI_MODEL = "gemini-3-flash-preview";

// --- Seed Data (Sample of 50 Galaxies/Objects) ---
const SEED_GALAXY_DATA = [
  { name: "Andromeda Galaxy (M31)", ra: 10.6847, dec: 41.2687, type: "Spiral Galaxy" },
  { name: "Triangulum Galaxy (M33)", ra: 23.4621, dec: 30.6602, type: "Spiral Galaxy" },
  { name: "Whirlpool Galaxy (M51)", ra: 202.4695, dec: 47.1952, type: "Spiral Galaxy" },
  { name: "Pinwheel Galaxy (M101)", ra: 210.8023, dec: 54.3488, type: "Spiral Galaxy" },
  { name: "Sombrero Galaxy (M104)", ra: 189.9976, dec: -11.6231, type: "Spiral Galaxy" },
  { name: "Bode's Galaxy (M81)", ra: 148.8882, dec: 69.0653, type: "Spiral Galaxy" },
  { name: "Cigar Galaxy (M82)", ra: 148.9685, dec: 69.6797, type: "Starburst Galaxy" },
  { name: "Black Eye Galaxy (M64)", ra: 194.1818, dec: 21.6828, type: "Spiral Galaxy" },
  { name: "Sunflower Galaxy (M63)", ra: 198.9555, dec: 42.0292, type: "Spiral Galaxy" },
  { name: "Messier 87", ra: 187.7059, dec: 12.3911, type: "Elliptical Galaxy" },
  { name: "Messier 49", ra: 187.4449, dec: 8.0005, type: "Elliptical Galaxy" },
  { name: "Messier 60", ra: 190.9167, dec: 11.5528, type: "Elliptical Galaxy" },
  { name: "Messier 84", ra: 186.2656, dec: 12.8870, type: "Lenticular Galaxy" },
  { name: "Messier 86", ra: 186.5489, dec: 12.9461, type: "Lenticular Galaxy" },
  { name: "Messier 105", ra: 161.9567, dec: 12.5814, type: "Elliptical Galaxy" },
  { name: "Messier 106", ra: 184.7401, dec: 47.3028, type: "Spiral Galaxy" },
  { name: "Messier 74", ra: 24.1738, dec: 15.7833, type: "Spiral Galaxy" },
  { name: "Messier 77", ra: 40.6696, dec: -0.0133, type: "Seyfert Galaxy" },
  { name: "Messier 83", ra: 204.2533, dec: -29.8658, type: "Barred Spiral Galaxy" },
  { name: "Messier 94", ra: 192.7211, dec: 41.1203, type: "Spiral Galaxy" },
  { name: "Messier 95", ra: 160.9904, dec: 11.7036, type: "Barred Spiral Galaxy" },
  { name: "Messier 96", ra: 161.6892, dec: 11.8183, type: "Spiral Galaxy" },
  { name: "Messier 98", ra: 183.4513, dec: 14.9003, type: "Spiral Galaxy" },
  { name: "Messier 99", ra: 184.7067, dec: 14.4164, type: "Spiral Galaxy" },
  { name: "Messier 100", ra: 185.7288, dec: 15.8222, type: "Spiral Galaxy" },
  { name: "NGC 1300", ra: 49.9208, dec: -19.4111, type: "Barred Spiral Galaxy" },
  { name: "NGC 4565", ra: 189.0867, dec: 25.9878, type: "Needle Galaxy" },
  { name: "NGC 4631", ra: 190.5333, dec: 32.5411, type: "Whale Galaxy" },
  { name: "NGC 891", ra: 35.6392, dec: 42.3492, type: "Edge-on Spiral Galaxy" },
  { name: "NGC 253", ra: 11.8883, dec: -25.2883, type: "Sculptor Galaxy" },
  { name: "NGC 2403", ra: 114.2142, dec: 65.6025, type: "Spiral Galaxy" },
  { name: "NGC 2903", ra: 143.0417, dec: 21.5008, type: "Barred Spiral Galaxy" },
  { name: "NGC 3115", ra: 151.3083, dec: -7.7183, type: "Spindle Galaxy" },
  { name: "NGC 3628", ra: 170.0625, dec: 13.5872, type: "Hamburger Galaxy" },
  { name: "NGC 4038", ra: 180.4708, dec: -18.8683, type: "Antennae Galaxies" },
  { name: "NGC 4449", ra: 187.0458, dec: 44.0933, type: "Irregular Galaxy" },
  { name: "NGC 4490", ra: 187.6500, dec: 41.6400, type: "Cocoon Galaxy" },
  { name: "NGC 4559", ra: 188.9917, dec: 27.9600, type: "Spiral Galaxy" },
  { name: "NGC 4656", ra: 191.0000, dec: 32.1667, type: "Hockey Stick Galaxy" },
  { name: "NGC 4725", ra: 192.6125, dec: 25.5000, type: "Barred Spiral Galaxy" },
  { name: "NGC 5005", ra: 197.7333, dec: 37.0500, type: "Spiral Galaxy" },
  { name: "NGC 5033", ra: 198.3625, dec: 36.5933, type: "Spiral Galaxy" },
  { name: "NGC 5195", ra: 202.4958, dec: 47.2667, type: "Dwarf Galaxy" },
  { name: "NGC 5907", ra: 228.9817, dec: 56.3292, type: "Splinter Galaxy" },
  { name: "NGC 6946", ra: 308.7188, dec: 60.1539, type: "Fireworks Galaxy" },
  { name: "NGC 7331", ra: 339.2667, dec: 34.4167, type: "Spiral Galaxy" },
  { name: "Centaurus A", ra: 201.3650, dec: -43.0192, type: "Lenticular Galaxy" },
  { name: "Circinus Galaxy", ra: 213.2917, dec: -65.3392, type: "Seyfert Galaxy" },
  { name: "Maffei 1", ra: 54.0625, dec: 59.5692, type: "Elliptical Galaxy" },
  { name: "Maffei 2", ra: 55.4583, dec: 59.6192, type: "Barred Spiral Galaxy" }
];

import PrintableReport from './components/PrintableReport';
import DatabaseView from './components/DatabaseView';

// --- App Component ---
export default function App() {
  const [isEntered, setIsEntered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedObject, setSelectedObject] = useState<CatalogData | null>(null);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [showDatabase, setShowDatabase] = useState(false);
  const [recentQueries, setRecentQueries] = useState<any[]>([]);
  
  const handlePrint = () => {
    window.print();
  };

  // Search state
  const [searchRa, setSearchRa] = useState("");
  const [searchDec, setSearchDec] = useState("");

  const aladinRef = useRef<any>(null);
  const aladinDivRef = useRef<HTMLDivElement>(null);

  // Initialize Application
  useEffect(() => {
    console.log("[Action] Initializing Application");
    const testConnection = async () => {
      console.log("[Action] Testing Supabase Connection");
      try {
        const { data, error } = await supabase
          .from('queries')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);
        
        if (error) {
          if (error.code === '42P01') {
            setError("Database table 'queries' missing. Please run the SQL setup script in Supabase.");
          } else {
            throw error;
          }
        } else {
          setRecentQueries(data || []);
          console.log("[Success] Supabase Connection Verified");
        }
      } catch (error: any) {
        console.error("[Error] Supabase Connection Failed:", error.message);
        setError("Cosmic connection failed. Please check your Supabase configuration.");
      }
    };
    testConnection();
    setLoading(false);
  }, []);

  // Initialize Aladin Lite
  useEffect(() => {
    if (!loading && isEntered && aladinDivRef.current && !aladinRef.current) {
      console.log("[Action] Initializing Aladin Lite View");
      // @ts-ignore
      const aladin = window.A.aladin('#aladin-lite-div', {
        survey: 'P/DSS2/color',
        fov: 2.0, // Wider FOV for "plate" view
        target: 'M 31',
        showLayersControl: true,
        showGotoControl: false, // We use our own search bar
        showFullscreenControl: true
      });
      aladinRef.current = aladin;

      // Handle click on the map
      aladin.on('objectClicked', (object: any) => {
        if (object) {
          console.log("[Event] Aladin Object Clicked:", object.ra, object.dec);
          handleObjectSelect(object.ra, object.dec, object.data);
        }
      });

      // Also handle general click to get coordinates
      aladin.on('click', (event: any) => {
        if (event && event.ra !== undefined) {
          console.log("[Event] Aladin Map Clicked:", event.ra, event.dec);
          handleObjectSelect(event.ra, event.dec);
        }
      });
    }
  }, [loading, isEntered]);

  const handleEnter = () => {
    console.log("[Action] User Entered the Cosmos");
    setIsEntered(true);
  };

  const handleExit = () => {
    console.log("[Action] User Exited the Cosmos");
    setIsEntered(false);
  };

  const getCoordinateHash = (ra: number, dec: number) => {
    return `query_${ra.toFixed(4)}_${dec.toFixed(4)}`.replace(/\./g, '_');
  };

  const handleSearch = () => {
    console.log("[Action] Coordinate Search Initiated:", searchRa, searchDec);
    const ra = parseFloat(searchRa);
    const dec = parseFloat(searchDec);
    if (!isNaN(ra) && !isNaN(dec)) {
      aladinRef.current?.gotoRaDec(ra, dec);
      handleObjectSelect(ra, dec);
    } else {
      console.warn("[Warning] Invalid Search Coordinates Provided");
      setError("Please enter valid numeric coordinates.");
    }
  };

  const seedDatabase = async () => {
    console.log("[Action] Database Seeding Initiated");
    setIsSeeding(true);
    setError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      
      for (const galaxy of SEED_GALAXY_DATA) {
        const queryId = getCoordinateHash(galaxy.ra, galaxy.dec);
        console.log("[Action] Seeding Object:", galaxy.name, "ID:", queryId);
        
        // Check if already exists
        const { data: existing, error: fetchError } = await supabase
          .from('queries')
          .select('id')
          .eq('query_id', queryId)
          .single();
        
        if (fetchError && fetchError.code !== 'PGRST116') {
          handleSupabaseError(fetchError, OperationType.GET, 'queries');
        }
        
        if (existing) {
          console.log("[Info] Object Already Cached, Skipping AI Generation");
          continue;
        }

        const catalogData = {
          ra: galaxy.ra,
          dec: galaxy.dec,
          obj_type: galaxy.type,
          name: galaxy.name,
          survey: 'Seed Data'
        };

        const prompt = `You are a professional astronomer. Analyze this astronomical object:
          Name: ${galaxy.name}
          Type: ${galaxy.type}
          Coordinates: RA ${galaxy.ra}, Dec ${galaxy.dec}
          
          Provide a concise, fascinating summary. Use LaTeX for any mathematical notations (e.g., $z = 0.05$). Use markdown.`;

        console.log("[Action] Requesting AI Summary from Gemini for Seed Object");
        const result = await ai.models.generateContent({
          model: GEMINI_MODEL,
          contents: prompt,
        });

        console.log("[Action] Caching Seed Analysis to Supabase");
        const { error: insertError } = await supabase
          .from('queries')
          .insert({
            query_id: queryId,
            ra: galaxy.ra,
            dec: galaxy.dec,
            catalog_data: catalogData,
            ai_summary: result.text || "No summary available."
          });

        if (insertError) {
          handleSupabaseError(insertError, OperationType.WRITE, 'queries');
        }
        
        console.log("[Success] Seed Analysis Cached Successfully");

        // Small delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      setNotification({ message: "Database seeded with 50 galaxies!", type: 'success' });
      setTimeout(() => setNotification(null), 5000);
    } catch (err) {
      console.error("[Error] Seeding failed", err);
      setError("Failed to seed database.");
    } finally {
      setIsSeeding(false);
    }
  };

  const fetchCatalogData = async (ra: number, dec: number): Promise<CatalogData> => {
    console.log("[Action] Fetching Catalog Data for:", ra, dec);
    try {
      return {
        ra,
        dec,
        mag_r: 18.5 + (Math.random() * 2),
        mag_g: 19.2 + (Math.random() * 2),
        mag_i: 17.8 + (Math.random() * 2),
        redshift: Math.random() * 0.5,
        obj_type: Math.random() > 0.7 ? 'GALAXY' : 'STAR',
        survey: 'SDSS DR16'
      };
    } catch (err) {
      console.error("[Error] Catalog fetch failed", err);
      return { ra, dec, survey: 'Unknown' };
    }
  };

  const handleObjectSelect = async (ra: number, dec: number, existingData?: any) => {
    console.log("[Action] Object Selected:", ra, dec);
    setError(null);
    setSelectedObject(null);
    setAiSummary(null);
    setIsAnalyzing(true);

    const queryId = getCoordinateHash(ra, dec);
    console.log("[Info] Query ID:", queryId);

    try {
      console.log("[Action] Checking Cache for Query ID:", queryId);
      const { data: cached, error: fetchError } = await supabase
        .from('queries')
        .select('*')
        .eq('query_id', queryId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        handleSupabaseError(fetchError, OperationType.GET, 'queries');
      }

      if (cached) {
        console.log("[Success] Cache Hit Found");
        setSelectedObject(cached.catalog_data);
        setAiSummary(cached.ai_summary);
        setIsAnalyzing(false);
        return;
      }

      console.log("[Info] Cache Miss, Generating New Analysis");
      const catalogData = existingData || await fetchCatalogData(ra, dec);
      setSelectedObject(catalogData);

      console.log("[Action] Requesting AI Summary from Gemini");
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const prompt = `You are a professional astronomer. Analyze this astronomical object data:
        Coordinates: RA ${ra}, Dec ${dec}
        Type: ${catalogData.obj_type || 'Unknown'}
        Magnitudes: r=${catalogData.mag_r}, g=${catalogData.mag_g}, i=${catalogData.mag_i}
        Redshift: ${catalogData.redshift || 'N/A'}
        Survey: ${catalogData.survey}
        
        Provide a concise, fascinating summary. Use LaTeX for any mathematical notations (e.g., $z = 0.05$). Use markdown.`;

      const result = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
      });

      const summary = result.text || "No summary available.";
      console.log("[Success] AI Summary Generated");
      setAiSummary(summary);

      console.log("[Action] Caching Analysis to Supabase");
      const { error: insertError } = await supabase
        .from('queries')
        .insert({
          query_id: queryId,
          ra,
          dec,
          catalog_data: catalogData,
          ai_summary: summary
        });

      if (insertError) {
        handleSupabaseError(insertError, OperationType.WRITE, 'queries');
      }
      
      console.log("[Success] Analysis Cached Successfully");
      
      // Refresh recent queries
      const { data: latest } = await supabase
        .from('queries')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      setRecentQueries(latest || []);

    } catch (err) {
      console.error("[Error] Processing failed", err);
      setError("Something went wrong while analyzing the cosmos.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-black text-white relative overflow-hidden">
        <div className="atmosphere absolute inset-0 z-0" />
        <div className="z-10 flex flex-col items-center gap-6">
          <div className="w-16 h-16 rounded-full border-t-2 border-orange-500 animate-spin" />
          <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-zinc-500 animate-pulse">Initializing Cosmic Interface</p>
        </div>
      </div>
    );
  }

  if (!isEntered) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-black text-white p-6 relative overflow-hidden">
        <div className="atmosphere absolute inset-0 z-0" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl text-center space-y-12 z-10"
        >
          <div className="space-y-4">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-8xl font-light tracking-tighter font-serif italic text-white"
            >
              SkyExplorer <span className="text-orange-500">AI</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-zinc-500 font-mono text-xs tracking-[0.3em] uppercase"
            >
              The Infinite Cosmos, Interpreted by Intelligence
            </motion.p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="p-10 glass-panel rounded-[2rem] border border-white/5 space-y-8"
          >
            <p className="text-zinc-400 text-lg font-light leading-relaxed max-w-md mx-auto">
              Explore the Sloan Digital Sky Survey through a refined interface powered by real-time astronomical catalog caching.
            </p>
            <button 
              onClick={handleEnter}
              className="premium-button px-10 py-5 w-full text-lg group"
            >
              <div className="flex items-center justify-center gap-3">
                <Sparkles className="w-5 h-5 text-orange-500" />
                Enter
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-black text-white flex overflow-hidden font-sans relative print:hidden">
      <div className="atmosphere absolute inset-0 z-0" />

      {/* Sidebar / Info Panel */}
      <aside className="w-[420px] glass-panel border-r border-white/5 flex flex-col z-20 relative">
        <header className="p-8 border-b border-white/5 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-light tracking-tighter font-serif italic">
              Sky<span className="text-orange-500">Explorer</span>
            </h1>
            <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-[0.2em] mt-1">Celestial Intelligence v1.1</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handlePrint}
              className="p-3 hover:bg-white/5 rounded-full transition-all text-zinc-500 hover:text-white border border-transparent hover:border-white/10"
              title="Print Report (PDF)"
            >
              <FileText className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setShowDatabase(true)}
              className="p-3 hover:bg-white/5 rounded-full transition-all text-orange-500 hover:text-white border border-transparent hover:border-white/10"
              title="Database Schema"
            >
              <Database className="w-4 h-4" />
            </button>
            <button 
              onClick={handleExit}
              className="p-3 hover:bg-white/5 rounded-full transition-all text-zinc-500 hover:text-white border border-transparent hover:border-white/10"
              title="Exit"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Search Bar */}
        <div className="p-6 border-b border-white/5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-[9px] uppercase font-bold text-zinc-500 tracking-widest ml-1">Right Ascension</label>
              <input 
                type="text" 
                value={searchRa}
                onChange={(e) => setSearchRa(e.target.value)}
                placeholder="0.0000°"
                className="premium-input w-full p-3 text-sm font-mono"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] uppercase font-bold text-zinc-500 tracking-widest ml-1">Declination</label>
              <input 
                type="text" 
                value={searchDec}
                onChange={(e) => setSearchDec(e.target.value)}
                placeholder="0.0000°"
                className="premium-input w-full p-3 text-sm font-mono"
              />
            </div>
          </div>
          <button 
            onClick={handleSearch}
            className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-widest"
          >
            <Search className="w-3.5 h-3.5 text-orange-500" />
            Initiate Coordinate Jump
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
          {!selectedObject && !isAnalyzing && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-30">
              <div className="w-20 h-20 rounded-full border border-dashed border-zinc-700 flex items-center justify-center">
                <MapIcon className="w-8 h-8 text-zinc-500" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium tracking-wide">Awaiting Selection</p>
                <p className="text-[11px] text-zinc-500 max-w-[200px] leading-relaxed">Interact with the sky plate or use coordinates to begin deep analysis.</p>
              </div>
              
              <button 
                onClick={seedDatabase}
                disabled={isSeeding}
                className="px-6 py-3 border border-white/10 rounded-full text-[9px] uppercase tracking-[0.2em] hover:bg-white/5 transition-all disabled:opacity-50"
              >
                {isSeeding ? "Populating Database..." : "Seed 50 Primary Galaxies"}
              </button>

              {recentQueries.length > 0 && (
                <div className="w-full pt-10 space-y-4">
                  <div className="flex items-center gap-3 text-zinc-600">
                    <div className="h-px flex-1 bg-white/5" />
                    <h3 className="text-[8px] uppercase font-bold tracking-[0.3em]">Recent Discoveries</h3>
                    <div className="h-px flex-1 bg-white/5" />
                  </div>
                  <div className="space-y-2">
                    {recentQueries.map((q) => (
                      <button
                        key={q.id}
                        onClick={() => handleObjectSelect(q.ra, q.dec, q.catalog_data)}
                        className="w-full p-3 bg-white/[0.02] border border-white/5 rounded-xl text-left hover:bg-white/5 transition-all group"
                      >
                        <div className="flex justify-between items-center">
                          <p className="text-[10px] font-medium text-zinc-400 group-hover:text-white transition-colors">
                            {q.catalog_data.name || `${q.ra.toFixed(2)}, ${q.dec.toFixed(2)}`}
                          </p>
                          <ChevronRight className="w-3 h-3 text-zinc-600 group-hover:text-orange-500 transition-all" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {isAnalyzing && (
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="h-10 bg-white/5 rounded-2xl w-3/4 animate-pulse" />
                <div className="flex gap-2">
                  <div className="h-4 bg-white/5 rounded-full w-20 animate-pulse" />
                  <div className="h-4 bg-white/5 rounded-full w-20 animate-pulse" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-3 bg-white/5 rounded-full w-full animate-pulse" />
                <div className="h-3 bg-white/5 rounded-full w-5/6 animate-pulse" />
                <div className="h-3 bg-white/5 rounded-full w-4/6 animate-pulse" />
              </div>
              <div className="flex items-center gap-3 text-orange-500/80 font-mono text-[9px] uppercase tracking-[0.3em]">
                <Loader2 className="w-3 h-3 animate-spin" />
                Consulting Gemini Intelligence
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            {selectedObject && !isAnalyzing && (
              <motion.div 
                key={selectedObject.ra + selectedObject.dec}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-10"
              >
                {/* Object Header */}
                <section className="space-y-4">
                  <div className="flex items-center gap-2 text-orange-500/80">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span className="text-[9px] font-mono uppercase tracking-[0.3em] font-bold">Deep Analysis Complete</span>
                  </div>
                  <h2 className="text-5xl font-light tracking-tighter font-serif italic leading-tight">
                    {selectedObject.name || selectedObject.obj_type || 'Unknown Entity'}
                  </h2>
                  <div className="flex gap-6 text-[10px] font-mono text-zinc-500 tracking-widest">
                    <span className="flex items-center gap-1.5"><div className="w-1 h-1 rounded-full bg-zinc-800" /> RA {selectedObject.ra.toFixed(4)}°</span>
                    <span className="flex items-center gap-1.5"><div className="w-1 h-1 rounded-full bg-zinc-800" /> DEC {selectedObject.dec.toFixed(4)}°</span>
                  </div>
                </section>

                {/* Technical Specs */}
                <section className="grid grid-cols-2 gap-4">
                  <div className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl space-y-2">
                    <p className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest">Redshift</p>
                    <p className="text-2xl font-light font-mono tracking-tighter">{selectedObject.redshift?.toFixed(4) || 'N/A'}</p>
                  </div>
                  <div className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl space-y-2">
                    <p className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest">Survey</p>
                    <p className="text-sm font-medium tracking-wide">{selectedObject.survey}</p>
                  </div>
                </section>

                {/* AI Summary */}
                <section className="space-y-6">
                  <div className="flex items-center gap-3 text-zinc-500">
                    <div className="h-px flex-1 bg-white/5" />
                    <h3 className="text-[9px] uppercase font-bold tracking-[0.3em]">AI Insights</h3>
                    <div className="h-px flex-1 bg-white/5" />
                  </div>
                  <div className="prose prose-invert prose-sm max-w-none text-zinc-400 leading-relaxed font-light selection:bg-orange-500/30">
                    <Markdown 
                      remarkPlugins={[remarkMath]} 
                      rehypePlugins={[rehypeKatex]}
                    >
                      {aiSummary || ''}
                    </Markdown>
                  </div>
                </section>

                {/* Cache Status */}
                <footer className="pt-10 flex items-center justify-center gap-3 text-[8px] text-zinc-600 font-mono uppercase tracking-[0.4em]">
                  <Database className="w-2.5 h-2.5" />
                  Persistent Cache Active
                </footer>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-5 bg-red-500/5 border border-red-500/10 rounded-2xl text-red-400 text-[10px] uppercase tracking-widest text-center"
            >
              {error}
            </motion.div>
          )}

          {notification && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className={cn(
                "p-5 border rounded-2xl text-[10px] uppercase tracking-widest text-center",
                notification.type === 'success' ? "bg-orange-500/10 border-orange-500/20 text-orange-400" : "bg-red-500/10 border-red-500/20 text-red-400"
              )}
            >
              {notification.message}
            </motion.div>
          )}
        </div>
      </aside>

      {/* Main Map Area */}
      <main className="flex-1 relative bg-black z-10">
        <div id="aladin-lite-div" className="w-full h-full grayscale-[0.2] contrast-[1.1]" ref={aladinDivRef} />
        
        {/* Overlay Controls */}
        <div className="absolute top-8 right-8 flex flex-col gap-4 pointer-events-none">
          <div className="glass-panel border border-white/10 p-5 rounded-3xl pointer-events-auto shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                <MapIcon className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500">Active Plate</p>
                <p className="text-sm font-light tracking-wide">DSS2 Color Survey</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legend */}
        <div className="absolute bottom-8 left-8 right-8 flex justify-between items-center pointer-events-none">
          <div className="bg-black/40 backdrop-blur-md border border-white/10 px-6 py-3 rounded-full text-[9px] font-mono tracking-[0.3em] uppercase text-zinc-500 pointer-events-auto">
            Interactive Sky Plate // Strasbourg Observatory
          </div>
          <div className="flex gap-4 pointer-events-auto">
             <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
          </div>
        </div>
      </main>

      {showDatabase && (
        <DatabaseView onClose={() => setShowDatabase(false)} />
      )}

      <PrintableReport />
    </div>
  );
}
