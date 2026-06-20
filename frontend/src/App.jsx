import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  BarChart2, Activity, AlertTriangle, Clock, Share2, 
  Map as MapIcon, History, Shield, LayoutDashboard, 
  UploadCloud, Bot, CheckCircle2, Zap
} from 'lucide-react';

const SidebarItem = ({ icon: Icon, text, active, badge }) => (
  <div className={`flex items-center justify-between px-4 py-3 mb-2 rounded-xl cursor-pointer transition-all duration-300 ${
    active 
      ? 'bg-gradient-to-r from-[#6b38fb] to-[#4522a9] text-white shadow-lg shadow-[#6b38fb]/20' 
      : 'text-[#8b95a5] hover:text-white hover:bg-[#111623]'
  }`}>
    <div className="flex items-center gap-3">
      <Icon size={18} strokeWidth={2.5} />
      <span className="font-semibold text-sm">{text}</span>
    </div>
    {badge && (
      <span className="bg-[#e63946] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
        {badge}
      </span>
    )}
  </div>
);

const KPICard = ({ title, value, subtitle, subtitleIcon: SubIcon, icon: Icon, colorClass, iconBgClass, subtitleColorClass }) => (
  <div className="bg-[#111623] border border-[#1e2536] rounded-2xl p-5 flex items-center gap-5 hover:border-[#2a3449] transition-colors">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${iconBgClass}`}>
      <Icon size={24} className={colorClass} strokeWidth={2.5} />
    </div>
    <div className="flex flex-col">
      <p className="text-[#8b95a5] text-[10px] font-bold tracking-widest uppercase mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-white leading-none mb-2">{value}</h3>
      <div className={`flex items-center gap-1.5 text-[11px] font-semibold ${subtitleColorClass}`}>
        <SubIcon size={12} strokeWidth={3} />
        {subtitle}
      </div>
    </div>
  </div>
);

export default function App() {
  const [time, setTime] = useState(new Date().toLocaleTimeString('en-GB', { hour12: false }));
  
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString('en-GB', { hour12: false })), 1000);
    return () => clearInterval(timer);
  }, []);

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
      setError('');
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setError('');
    const formData = new FormData();
    formData.append('file', selectedFile);
    try {
      const response = await axios.post('http://localhost:8000/api/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred during analysis.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white flex font-sans overflow-hidden">
      
      {/* Sidebar */}
      <div className="w-[280px] border-r border-[#1e2536] bg-[#06080f] flex flex-col shrink-0">
        <div className="p-6 pt-8 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#00e5ff] rounded-lg flex items-center justify-center">
              <BarChart2 size={20} className="text-[#06080f]" strokeWidth={3} />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white leading-none tracking-wide">AstraGrid</h1>
              <p className="text-[10px] text-[#8b95a5] tracking-[0.2em] font-semibold mt-1">TRAFFIC CONTROL</p>
            </div>
          </div>
        </div>

        <div className="px-4 flex-1">
          <SidebarItem icon={LayoutDashboard} text="Executive Dashboard" active={true} />
          <SidebarItem icon={Bot} text="AI Predictor" />
          <SidebarItem icon={AlertTriangle} text="Dispatch Center" badge="15" />
          <SidebarItem icon={History} text="Historical Analytics" />
          <SidebarItem icon={MapIcon} text="Post-Event Learning" />
        </div>

        <div className="p-4 mb-4">
          <div className="bg-[#111623] border border-[#1e2536] rounded-xl p-4 flex items-center gap-4 hover:border-[#2a3449] cursor-pointer transition-colors">
            <div className="w-10 h-10 rounded-full bg-[#1e2536] flex items-center justify-center shrink-0">
               <Shield size={18} className="text-[#00e5ff]" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Dispatcher 01</p>
              <p className="text-[11px] font-medium text-[#8b95a5]">Bengaluru Traffic Police</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col max-h-screen overflow-y-auto">
        
        {/* Topbar */}
        <header className="h-[100px] border-b border-[#1e2536] flex items-center justify-between px-10 bg-[#0b0f19] sticky top-0 z-10 shrink-0">
          <div>
            <h2 className="text-[28px] font-extrabold text-white tracking-wide">Executive Dashboard</h2>
            <p className="text-[#8b95a5] text-sm font-medium mt-1">Real-time event forecasting and resource deployment optimizer</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="px-4 py-1.5 rounded-full bg-[#111e1f] border border-[#1a3835] text-[#00e5ff] text-[13px] font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00e5ff] animate-pulse shadow-[0_0_8px_#00e5ff]"></span>
              Live Monitoring
            </div>
            <span className="text-[#00e5ff] font-mono font-bold text-xl tracking-wider">
              {time}
            </span>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-10 space-y-8">
          
          {/* KPIs */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            <KPICard 
              title="Total Historic Events" 
              value="8,173" 
              subtitle="100% anonymized" 
              icon={AlertTriangle} 
              subtitleIcon={Activity}
              colorClass="text-[#a274ff]" 
              iconBgClass="bg-[#241b3d]"
              subtitleColorClass="text-[#8b95a5]"
            />
            <KPICard 
              title="Active Congestions" 
              value="15" 
              subtitle="Requiring Dispatch" 
              icon={AlertTriangle} 
              subtitleIcon={Zap}
              colorClass="text-[#ff4b4b]" 
              iconBgClass="bg-[#3d191e]"
              subtitleColorClass="text-[#ff4b4b]"
            />
            <KPICard 
              title="Avg. Clearance Time" 
              value="165.6 min" 
              subtitle="Historical Average" 
              icon={Clock} 
              subtitleIcon={CheckCircle2}
              colorClass="text-[#00b8ff]" 
              iconBgClass="bg-[#122b3e]"
              subtitleColorClass="text-[#8b95a5]"
            />
            <KPICard 
              title="Feedback Loops Logged" 
              value="0" 
              subtitle="Model Self-Learning" 
              icon={Share2} 
              subtitleIcon={Activity}
              colorClass="text-[#00ff88]" 
              iconBgClass="bg-[#103323]"
              subtitleColorClass="text-[#00ff88]"
            />
          </div>

          {/* Map/AI UI Area */}
          <div className="bg-[#111623] border border-[#1e2536] rounded-2xl overflow-hidden shadow-2xl">
            {/* Card Header matching Map Header */}
            <div className="p-6 border-b border-[#1e2536] flex items-center justify-between bg-[#111623]">
               <h3 className="text-[17px] font-bold text-white flex items-center gap-3">
                 <MapIcon className="text-[#00b8ff]" size={20} strokeWidth={2.5} />
                 Bengaluru Traffic Hotspots & Incident Map
               </h3>
               <div className="flex items-center gap-6 text-[13px] font-semibold text-[#8b95a5]">
                 <div className="flex items-center gap-2">
                   <div className="w-2.5 h-2.5 rounded-full bg-[#ff4b4b] shadow-[0_0_8px_#ff4b4b]"></div>
                   Active
                 </div>
                 <div className="flex items-center gap-2">
                   <div className="w-2.5 h-2.5 rounded-full bg-[#00b8ff] shadow-[0_0_8px_#00b8ff]"></div>
                   Historical Hotspots
                 </div>
               </div>
            </div>

            {/* Content Area - Where Map usually is, we put the AI Predictor */}
            <div className="p-8 relative bg-cover bg-center min-h-[500px]" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/stardust.png")' }}>
                <div className="absolute inset-0 bg-[#0b0f19]/60 backdrop-blur-[2px] z-0"></div>
                
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
                  
                  {/* Uploader */}
                  <div className="space-y-6">
                    <div className="bg-[#111623]/90 backdrop-blur-md border border-[#1e2536] rounded-2xl p-8 hover:border-[#6b38fb] transition-all duration-300">
                      <h4 className="text-white font-bold mb-4 flex items-center gap-2 text-lg">
                        <Bot className="text-[#6b38fb]" />
                        Run AI Traffic Analysis
                      </h4>
                      
                      <input type="file" id="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                      <label htmlFor="file" className="cursor-pointer flex flex-col items-center justify-center p-10 border-2 border-dashed border-[#2a3449] hover:border-[#6b38fb] rounded-xl bg-[#06080f]/50 transition-all duration-300 group">
                        <div className="w-16 h-16 rounded-full bg-[#1a1c2a] group-hover:bg-[#6b38fb]/20 flex items-center justify-center text-[#8b95a5] group-hover:text-[#6b38fb] transition-all mb-4">
                          <UploadCloud size={30} />
                        </div>
                        <p className="text-white font-semibold text-base mb-1">Click to upload street image</p>
                        <p className="text-[#8b95a5] text-xs">Supports JPG, PNG up to 10MB</p>
                      </label>
                    </div>

                    {preview && (
                      <div className="bg-[#111623]/90 backdrop-blur-md border border-[#1e2536] rounded-2xl p-4 shadow-xl">
                        <img src={preview} alt="Upload Preview" className="w-full h-auto rounded-xl border border-[#2a3449]" />
                        <button 
                          onClick={handleAnalyze}
                          disabled={loading}
                          className="w-full mt-4 bg-gradient-to-r from-[#6b38fb] to-[#4522a9] text-white py-3.5 rounded-xl font-bold shadow-lg shadow-[#6b38fb]/20 hover:shadow-[#6b38fb]/40 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {loading ? <span className="animate-spin text-xl">⚙️</span> : <Bot size={20}/>}
                          {loading ? 'Processing via YOLOv8...' : 'Detect Violations'}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Results */}
                  <div className="bg-[#111623]/90 backdrop-blur-md border border-[#1e2536] rounded-2xl p-6 shadow-xl flex flex-col relative overflow-hidden min-h-[400px]">
                    <h4 className="text-white font-bold mb-4 flex items-center gap-2 text-lg">
                      <Activity className="text-[#00ff88]" />
                      Live Extraction Results
                    </h4>

                    {!result && !loading && (
                      <div className="flex-1 flex flex-col items-center justify-center text-[#8b95a5]">
                        <MapIcon size={50} className="mb-4 opacity-10" />
                        <p className="text-sm font-medium">Awaiting image input to generate annotated evidence.</p>
                      </div>
                    )}
                    
                    {loading && (
                      <div className="absolute inset-0 bg-[#0b0f19]/90 backdrop-blur-md flex flex-col items-center justify-center z-10 rounded-2xl">
                         <div className="w-14 h-14 border-[4px] border-[#6b38fb] border-t-transparent rounded-full animate-spin mb-6"></div>
                         <p className="text-[#6b38fb] font-bold text-lg animate-pulse tracking-wide">Analyzing Image Data</p>
                         <p className="text-[#8b95a5] text-xs mt-2 font-mono">Running detection pipeline...</p>
                      </div>
                    )}

                    {result && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-5 h-full">
                        <div className="rounded-xl overflow-hidden border border-[#2a3449] shadow-2xl relative group">
                          <img src={result.annotated_image_base64} alt="Annotated Evidence" className="w-full h-auto object-contain bg-black" />
                          <div className="absolute top-3 right-3 bg-[#00e5ff] text-black text-[10px] font-bold px-2 py-1 rounded">PROCESSED</div>
                        </div>
                        
                        <div className="bg-[#0b0f19] rounded-xl p-5 border border-[#1e2536] flex-1 overflow-y-auto">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-xs font-extrabold text-[#8b95a5] tracking-widest uppercase">
                               Metadata Log
                            </h4>
                            <span className="text-[10px] text-[#00ff88] bg-[#00ff88]/10 px-2 py-1 rounded font-bold">{result.report.violations.length} ALERTS</span>
                          </div>
                          
                          {result.report.violations.length > 0 ? (
                            <div className="space-y-3">
                              {result.report.violations.map((v, i) => (
                                <div key={i} className="flex items-center justify-between bg-[#111623] p-3.5 rounded-lg border border-[#1e2536] hover:border-[#6b38fb]/50 transition-colors">
                                  <div className="flex items-center gap-4">
                                    <span className="text-[#ff4b4b] font-black text-xs uppercase bg-[#ff4b4b]/10 border border-[#ff4b4b]/20 px-2.5 py-1 rounded shadow-[0_0_10px_rgba(255,75,75,0.1)]">{v.type}</span>
                                    <span className="text-white text-sm capitalize font-semibold">{v.vehicle}</span>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-[#00e5ff] font-mono text-xs font-bold bg-[#00e5ff]/10 px-2 py-1 rounded inline-block">{v.plate}</span>
                                    <p className="text-[#8b95a5] text-[10px] mt-1.5 font-semibold tracking-wider">CONF: {(v.confidence * 100).toFixed(1)}%</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-emerald-400 text-sm bg-emerald-400/10 p-4 rounded-lg border border-emerald-500/20 text-center font-semibold">
                              ✅ No violations detected by AI
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
