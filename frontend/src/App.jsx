import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  Activity, AlertTriangle, Clock, ActivitySquare, UploadCloud, 
  Map, History, Settings, Bot, ShieldAlert, LayoutDashboard
} from 'lucide-react';

const SidebarItem = ({ icon: Icon, text, active, badge }) => (
  <div className={`flex items-center justify-between px-4 py-3 cursor-pointer rounded-lg mb-2 transition-all duration-200 ${active ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}>
    <div className="flex items-center gap-3">
      <Icon size={20} />
      <span className="font-medium text-sm">{text}</span>
    </div>
    {badge && (
      <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
        {badge}
      </span>
    )}
  </div>
);

const KPICard = ({ title, value, subtitle, icon: Icon, color, alert }) => (
  <div className="glass p-6 rounded-2xl flex flex-col justify-between h-32 relative overflow-hidden group hover:border-indigo-500/50 transition-colors">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-slate-400 text-xs font-semibold tracking-wider uppercase mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-white">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
    </div>
    <div className="flex items-center gap-2 mt-4 text-xs font-medium">
      {alert ? (
        <span className="text-red-400 flex items-center gap-1"><AlertTriangle size={12}/> {subtitle}</span>
      ) : (
        <span className="text-emerald-400 flex items-center gap-1"><Activity size={12}/> {subtitle}</span>
      )}
    </div>
  </div>
);

export default function App() {
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
    <div className="min-h-screen bg-[#0f172a] text-slate-200 flex font-sans">
      
      {/* Sidebar */}
      <div className="w-64 border-r border-slate-800 p-4 flex flex-col bg-[#0b1120]">
        <div className="flex items-center gap-3 mb-10 px-2 mt-4">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <ActivitySquare size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white leading-tight">AstraGrid</h1>
            <p className="text-[10px] text-slate-400 tracking-widest font-semibold">TRAFFIC CONTROL</p>
          </div>
        </div>

        <div className="flex-1">
          <SidebarItem icon={LayoutDashboard} text="Executive Dashboard" active={true} />
          <SidebarItem icon={Bot} text="AI Predictor" />
          <SidebarItem icon={ShieldAlert} text="Dispatch Center" badge="15" />
          <SidebarItem icon={History} text="Historical Analytics" />
          <SidebarItem icon={Map} text="Post-Event Learning" />
        </div>

        <div className="mt-auto p-4 glass rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600"></div>
            <div>
              <p className="text-sm font-semibold text-white">Dispatcher 01</p>
              <p className="text-xs text-slate-400">Bengaluru Traffic Police</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col max-h-screen overflow-y-auto">
        
        {/* Topbar */}
        <header className="h-20 border-b border-slate-800 flex items-center justify-between px-8 bg-[#0f172a]/80 backdrop-blur-md sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-bold text-white">Executive Dashboard</h2>
            <p className="text-sm text-slate-400">Real-time event forecasting and resource deployment optimizer</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Monitoring
            </div>
            <span className="text-indigo-400 font-mono font-medium text-lg bg-indigo-500/10 px-3 py-1 rounded-md">
              {new Date().toLocaleTimeString('en-US', { hour12: false })}
            </span>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-8 max-w-7xl mx-auto w-full space-y-6">
          
          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <KPICard title="Total Historic Events" value="8,173" subtitle="100% anonymized" icon={Activity} color="bg-indigo-600" />
            <KPICard title="Active Congestions" value="15" subtitle="Requiring Dispatch" icon={AlertTriangle} color="bg-red-500" alert />
            <KPICard title="Avg. Clearance Time" value="165.6 m" subtitle="Historical Average" icon={Clock} color="bg-blue-500" />
            <KPICard title="Feedback Loops Logged" value="0" subtitle="Model Self-Learning" icon={ActivitySquare} color="bg-emerald-500" />
          </div>

          {/* AI Analysis Section */}
          <div className="glass rounded-2xl p-6 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Bot size={20} className="text-indigo-400"/>
              Live AI Violation Detection
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Uploader & Original */}
              <div className="space-y-4">
                <div className="border-2 border-dashed border-slate-700 hover:border-indigo-500 transition-colors rounded-xl p-8 text-center bg-slate-800/30">
                  <input type="file" id="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                  <label htmlFor="file" className="cursor-pointer flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                      <UploadCloud size={24} />
                    </div>
                    <div>
                      <p className="text-slate-200 font-medium">Click to upload traffic image</p>
                      <p className="text-slate-500 text-xs mt-1">JPEG, PNG up to 10MB</p>
                    </div>
                  </label>
                </div>

                {preview && (
                  <div className="rounded-xl overflow-hidden border border-slate-700 relative group">
                    <img src={preview} alt="Original" className="w-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        onClick={handleAnalyze}
                        disabled={loading}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium shadow-lg disabled:opacity-50 flex items-center gap-2"
                      >
                        {loading ? <span className="animate-spin text-xl">⚙️</span> : <Bot size={18}/>}
                        {loading ? 'Analyzing AI...' : 'Run AI Analysis'}
                      </button>
                    </div>
                  </div>
                )}
                {error && <p className="text-red-400 text-sm">{error}</p>}
              </div>

              {/* Result Preview */}
              <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-4 min-h-[400px] flex flex-col relative overflow-hidden">
                {!result && !loading && (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
                    <Map size={48} className="mb-4 opacity-20" />
                    <p>Upload an image and run analysis to view AI evidence.</p>
                  </div>
                )}
                
                {loading && (
                  <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                     <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                     <p className="text-indigo-400 font-medium animate-pulse">Running YOLOv8 & EasyOCR models...</p>
                  </div>
                )}

                {result && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4">
                    <div className="rounded-lg overflow-hidden border border-slate-700 shadow-2xl">
                      <img src={result.annotated_image_base64} alt="Annotated Evidence" className="w-full h-auto" />
                    </div>
                    
                    <div className="glass rounded-lg p-4 mt-2">
                      <h4 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                         <Activity size={16}/> Extraction Metadata Log
                      </h4>
                      {result.report.violations.length > 0 ? (
                        <div className="space-y-2">
                          {result.report.violations.map((v, i) => (
                            <div key={i} className="flex items-center justify-between bg-slate-800/80 p-3 rounded-md border border-slate-700/50">
                              <div className="flex items-center gap-3">
                                <span className="text-red-400 font-bold text-xs uppercase bg-red-400/10 px-2 py-1 rounded">{v.type}</span>
                                <span className="text-slate-300 text-sm capitalize">{v.vehicle}</span>
                              </div>
                              <div className="text-right">
                                <span className="text-indigo-300 font-mono text-sm bg-indigo-500/10 px-2 py-1 rounded">{v.plate}</span>
                                <p className="text-slate-500 text-[10px] mt-1">CONF: {v.confidence}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-emerald-400 text-sm bg-emerald-400/10 p-3 rounded-md border border-emerald-500/20">✅ No violations detected by AI</p>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
