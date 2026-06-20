import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, Zap, Database, 
  UploadCloud, Search, Bell, Settings, 
  AlertTriangle, CheckCircle, Shield, Image as ImageIcon,
  Activity, Monitor, LayoutDashboard, FileText,
  Download, FileJson, AlignLeft, Video, Bot
} from 'lucide-react';

const StatCard = ({ title, value, trend, icon: Icon, colorClass }) => (
  <div className="bg-[#0a0a0a] border border-[#222] rounded-2xl p-6 hover:border-[#444] transition-all group relative overflow-hidden">
    <div className={`absolute top-0 right-0 w-24 h-24 bg-${colorClass}-500/10 rounded-bl-full blur-2xl group-hover:bg-${colorClass}-500/20 transition-all`}></div>
    <div className="flex justify-between items-start mb-6 relative z-10">
      <p className="text-[#888] text-sm font-semibold tracking-wide uppercase">{title}</p>
      <div className={`p-2.5 bg-[#111] border border-[#333] rounded-xl text-${colorClass}-500`}>
        <Icon size={18} />
      </div>
    </div>
    <div className="flex items-baseline gap-3 relative z-10">
      <h3 className="text-4xl font-bold text-white tracking-tight">{value}</h3>
      <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full border border-emerald-400/20">{trend}</span>
    </div>
  </div>
);

export default function App() {
  const [appState, setAppState] = useState('landing');
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // New State for Upgrades
  const [inputMode, setInputMode] = useState('upload'); // 'upload' or 'stream'
  const [outputTab, setOutputTab] = useState('table'); // 'table', 'json', 'summary'

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
      setError(err.response?.data?.detail || 'Analysis failed. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  // Generate a fake AI dispatch summary for the hackathon
  const generateSummary = () => {
    if (!result || result.report.violations.length === 0) return "No violations detected in the current frame. Traffic flow is normal.";
    const count = result.report.violations.length;
    return `AI Dispatch Alert: ${count} severe traffic violation(s) detected in the current frame. The vision model has identified individuals operating motorcycles without mandatory safety helmets. Confidence scores average above 80%. Immediate enforcement action is recommended.`;
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30 overflow-x-hidden">
      
      {/* Top Navigation */}
      <nav className="border-b border-[#222] bg-black/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <div 
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => setAppState('landing')}
            >
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                <Camera size={22} className="text-black" strokeWidth={2.5} />
              </div>
              <span className="font-extrabold text-2xl tracking-tighter bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">GRIDLOCK</span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-[15px] font-semibold text-[#888]">
              <span className={`cursor-pointer transition-colors ${appState === 'dashboard' ? 'text-white' : 'hover:text-white'}`} onClick={() => setAppState('dashboard')}>Platform</span>
              <span className="cursor-pointer hover:text-white transition-colors">Documentation</span>
              <span className="cursor-pointer hover:text-white transition-colors">Enterprise</span>
            </div>
          </div>
          
          <div className="flex items-center gap-6 text-[#888]">
            <Search size={20} className="cursor-pointer hover:text-white transition-colors" />
            <Bell size={20} className="cursor-pointer hover:text-white transition-colors" />
            <div className="w-px h-6 bg-[#333]"></div>
            <div className="flex items-center gap-3 cursor-pointer hover:bg-[#111] p-1.5 pr-4 rounded-full border border-transparent hover:border-[#333] transition-all">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 border-2 border-black shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
              <span className="text-sm font-semibold text-white">Admin Team</span>
            </div>
          </div>
        </div>
      </nav>

      <AnimatePresence mode="wait">
        {appState === 'landing' ? (
          <motion.div 
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-[1200px] mx-auto px-8 py-32 flex flex-col items-center text-center relative"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 font-semibold text-sm mb-8">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
              Gridlock Engine v2.0 is now live
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[1.1] mb-8 bg-gradient-to-b from-white to-[#888] bg-clip-text text-transparent">
              Automate Traffic <br/> Enforcement with AI.
            </h1>
            
            <p className="text-[#888] text-xl md:text-2xl max-w-2xl mb-12 font-medium leading-relaxed">
              Upload traffic camera feeds and instantly identify vehicles, extract license plates, and detect violations using advanced Computer Vision.
            </p>
            
            <div className="flex justify-center w-full">
              <button 
                onClick={() => setAppState('dashboard')}
                className="px-8 py-4 bg-white text-black font-bold text-lg rounded-xl hover:bg-zinc-200 hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)] flex items-center gap-2"
              >
                Launch Platform
                <Activity size={20} />
              </button>
            </div>
            
            <div className="mt-24 w-full rounded-2xl border border-[#333] bg-[#0a0a0a] p-4 shadow-2xl relative overflow-hidden group cursor-pointer hover:border-blue-500/50 transition-colors" onClick={() => setAppState('dashboard')}>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>
              <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200&dark=true" alt="Dashboard Preview" className="w-full h-[400px] object-cover rounded-xl opacity-60 group-hover:opacity-80 transition-opacity" />
              <div className="absolute bottom-10 left-10 z-20">
                <h3 className="text-3xl font-bold text-white mb-2">Production-Ready Detection</h3>
                <p className="text-[#888] font-medium">Click anywhere to enter the interactive dashboard.</p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-[1500px] mx-auto px-8 py-10"
          >
            {/* Dashboard Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
              <div>
                <h2 className="text-4xl font-bold tracking-tight mb-2">Vision Pipeline Workspace</h2>
                <p className="text-[#888] text-lg font-medium">High-speed YOLOv8 object detection and metadata extraction.</p>
              </div>
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 bg-[#111] hover:bg-[#222] border border-[#333] text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors">
                  <Download size={16} /> Export Evidence
                </button>
                <span className="flex items-center gap-2 text-sm font-bold bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-lg border border-emerald-500/20">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Node Active
                </span>
              </div>
            </div>

            {/* KPI Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <StatCard title="Frames Processed" value="1.2M" trend="+12% today" icon={Database} colorClass="blue" />
              <StatCard title="Active Incidents" value="1,402" trend="+5% today" icon={AlertTriangle} colorClass="red" />
              <StatCard title="Accuracy Target" value="98.1%" trend="Peak" icon={Shield} colorClass="emerald" />
              <StatCard title="Inference Delay" value="18ms" trend="Optimal" icon={Zap} colorClass="indigo" />
            </div>

            {/* Platform UI Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Input Configuration Panel */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                <div className="bg-[#0a0a0a] border border-[#222] rounded-3xl overflow-hidden flex flex-col shadow-2xl h-full">
                  
                  {/* Tabs for Input Mode */}
                  <div className="flex items-center border-b border-[#222] bg-[#0d0d0d] p-2">
                     <button 
                        onClick={() => setInputMode('upload')}
                        className={`flex-1 py-3 text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${inputMode === 'upload' ? 'bg-[#222] text-white' : 'text-[#666] hover:text-white'}`}
                     >
                       <ImageIcon size={16} /> Static Frame
                     </button>
                     <button 
                        onClick={() => setInputMode('stream')}
                        className={`flex-1 py-3 text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${inputMode === 'stream' ? 'bg-[#222] text-white' : 'text-[#666] hover:text-white'}`}
                     >
                       <Video size={16} /> Live CCTV Stream
                     </button>
                  </div>
                  
                  <div className="p-8 flex-1 flex flex-col">
                    {inputMode === 'stream' ? (
                       <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-[#333] rounded-2xl bg-[#050505]">
                         <Video size={40} className="text-[#444] mb-4" />
                         <p className="text-white font-bold mb-1">RTSP Stream Offline</p>
                         <p className="text-[#666] text-sm">Connect a camera source in settings.</p>
                       </div>
                    ) : !preview ? (
                      <label className="flex-1 border-2 border-dashed border-[#333] rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-500/5 transition-all min-h-[350px] group relative overflow-hidden">
                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/0 via-blue-500/5 to-blue-500/0 translate-y-[100%] group-hover:translate-y-[-100%] transition-transform duration-1000"></div>
                        <div className="w-20 h-20 bg-[#111] border border-[#222] rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                          <UploadCloud size={32} className="text-blue-500" />
                        </div>
                        <p className="text-xl font-bold text-white mb-2">Drag & Drop Image</p>
                        <p className="text-[#666] font-medium text-sm">Supports high-res JPEG, PNG (Max 20MB)</p>
                      </label>
                    ) : (
                      <div className="flex-1 flex flex-col relative">
                        <div className="relative rounded-2xl overflow-hidden border border-[#333] bg-[#050505] flex items-center justify-center min-h-[300px] group shadow-[0_0_30px_rgba(0,0,0,0.8)]">
                          <img src={preview} alt="Upload Preview" className="max-w-full max-h-[400px] object-contain" />
                          
                          {/* Animated Scanning Laser Overlay while loading */}
                          {loading && (
                            <motion.div 
                              initial={{ top: '0%' }}
                              animate={{ top: ['0%', '100%', '0%'] }}
                              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                              className="absolute left-0 right-0 h-1 bg-blue-500 shadow-[0_0_20px_#3b82f6] z-20"
                            ></motion.div>
                          )}
                          
                          <label className="absolute top-4 right-4 bg-black/80 backdrop-blur-md border border-[#444] text-white text-sm font-semibold px-4 py-2 rounded-xl cursor-pointer hover:bg-black transition-colors opacity-0 group-hover:opacity-100 z-30">
                            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                            Change Feed
                          </label>
                        </div>
                        
                        <button 
                          onClick={handleAnalyze}
                          disabled={loading}
                          className="mt-6 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-lg py-5 rounded-2xl hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-3 relative overflow-hidden"
                        >
                          {loading ? (
                             <span className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></span>
                          ) : (
                             <Zap size={22} fill="currentColor" />
                          )}
                          {loading ? 'YOLOv8 Processing Sequence...' : 'Initialize Analysis'}
                        </button>
                      </div>
                    )}
                    {error && (
                      <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 font-semibold rounded-xl flex items-center gap-3">
                        <AlertTriangle size={20} /> {error}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Output Telemetry Panel */}
              <div className="lg:col-span-7 flex flex-col">
                <div className="bg-[#0a0a0a] border border-[#222] rounded-3xl overflow-hidden flex flex-col shadow-2xl min-h-[650px] h-full">
                   
                  <div className="px-8 py-5 border-b border-[#222] bg-[#0d0d0d] flex items-center justify-between">
                    <h2 className="text-lg font-bold flex items-center gap-3">
                      <Monitor className="text-emerald-500" size={22} />
                      Telemetry Output
                    </h2>
                    {result && (
                      <div className="flex bg-[#111] border border-[#333] rounded-lg overflow-hidden p-1">
                        <button onClick={() => setOutputTab('table')} className={`px-4 py-1.5 text-xs font-bold rounded-md flex items-center gap-2 ${outputTab === 'table' ? 'bg-[#333] text-white' : 'text-[#666]'}`}><AlignLeft size={14}/> Table</button>
                        <button onClick={() => setOutputTab('json')} className={`px-4 py-1.5 text-xs font-bold rounded-md flex items-center gap-2 ${outputTab === 'json' ? 'bg-[#333] text-white' : 'text-[#666]'}`}><FileJson size={14}/> JSON</button>
                        <button onClick={() => setOutputTab('summary')} className={`px-4 py-1.5 text-xs font-bold rounded-md flex items-center gap-2 ${outputTab === 'summary' ? 'bg-[#333] text-white' : 'text-[#666]'}`}><FileText size={14}/> AI Summary</button>
                      </div>
                    )}
                  </div>

                  <div className="p-8 flex-1 flex flex-col bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#111] via-[#0a0a0a] to-[#0a0a0a]">
                    {!result && !loading ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-[#444]">
                        <LayoutDashboard size={64} strokeWidth={1} className="mb-6" />
                        <p className="text-lg font-semibold text-white mb-2">No Data Available</p>
                        <p className="text-sm">Please provide an input feed to begin extraction.</p>
                      </div>
                    ) : loading ? (
                      <div className="flex-1 flex flex-col items-center justify-center">
                        <div className="relative w-32 h-32 mb-8">
                          <div className="absolute inset-0 border-4 border-[#222] rounded-full"></div>
                          <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                          <Activity size={40} className="absolute inset-0 m-auto text-blue-500 animate-pulse" />
                        </div>
                        <p className="text-xl font-bold text-white mb-2 tracking-wide">Running Neural Network</p>
                        <p className="text-[#888] font-mono text-sm">Identifying vehicles and extracting OCR plates...</p>
                      </div>
                    ) : (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col gap-8 h-full"
                      >
                        {/* Annotated Image */}
                        <div className="rounded-2xl overflow-hidden border border-[#333] bg-[#050505] flex justify-center shadow-[0_0_50px_rgba(0,0,0,0.8)] relative group">
                          <img 
                            src={result.annotated_image_base64} 
                            alt="Detection Results" 
                            className="max-h-[350px] object-contain"
                          />
                          <div className="absolute top-3 right-3 bg-emerald-500 text-black text-[10px] font-black uppercase px-2 py-1 rounded">Visual Evidence Generated</div>
                        </div>

                        {/* Dynamic Metadata Section based on selected tab */}
                        <div className="flex-1">
                          {outputTab === 'table' && (
                            <div className="animate-in fade-in">
                              <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-bold text-[#888] uppercase tracking-widest flex items-center gap-2">
                                  <Database size={16} /> Extracted Entities
                                </h3>
                                <span className="text-xs font-bold text-red-400 bg-red-400/10 px-2.5 py-1 rounded-md border border-red-400/20">
                                  {result.report.violations.length} INFRACTIONS
                                </span>
                              </div>
                              
                              {result.report.violations.length > 0 ? (
                                <div className="border border-[#222] rounded-2xl overflow-hidden bg-[#0d0d0d] shadow-xl">
                                  <table className="w-full text-left">
                                    <thead className="bg-[#111] text-[#666] text-xs uppercase font-bold tracking-wider border-b border-[#222]">
                                      <tr>
                                        <th className="px-6 py-4">Event Type</th>
                                        <th className="px-6 py-4">Target Class</th>
                                        <th className="px-6 py-4 text-right">Model Confidence</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#222]">
                                      {result.report.violations.map((v, i) => (
                                        <tr key={i} className="hover:bg-[#151515] transition-colors">
                                          <td className="px-6 py-5">
                                            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20">
                                              <AlertTriangle size={14} />
                                              {v.type}
                                            </span>
                                          </td>
                                          <td className="px-6 py-5 text-white font-semibold capitalize flex items-center gap-3">
                                            {v.vehicle}
                                            {v.plate && v.plate !== "UNKNOWN" && (
                                              <span className="font-mono text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-1 rounded-md shadow-[0_0_10px_rgba(59,130,246,0.2)]">
                                                {v.plate}
                                              </span>
                                            )}
                                          </td>
                                          <td className="px-6 py-5">
                                            <div className="flex flex-col items-end gap-1.5">
                                              <span className="font-mono text-emerald-400 font-bold text-sm">
                                                {(v.confidence * 100).toFixed(1)}%
                                              </span>
                                              <div className="w-24 h-1.5 bg-[#222] rounded-full overflow-hidden">
                                                <div 
                                                  className="h-full bg-emerald-400 rounded-full shadow-[0_0_5px_#34d399]" 
                                                  style={{ width: `${v.confidence * 100}%` }}
                                                ></div>
                                              </div>
                                            </div>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              ) : (
                                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-8 text-center flex flex-col items-center">
                                  <CheckCircle size={40} className="text-emerald-500 mb-4" />
                                  <p className="text-white text-xl font-bold mb-1">Frame is Clear</p>
                                  <p className="text-emerald-400 font-medium">No traffic violations detected by the model.</p>
                                </div>
                              )}
                            </div>
                          )}

                          {outputTab === 'json' && (
                            <div className="animate-in fade-in h-full">
                               <h3 className="text-sm font-bold text-[#888] uppercase tracking-widest flex items-center gap-2 mb-4">
                                  <FileJson size={16} /> Raw API Response
                               </h3>
                               <div className="bg-[#0a0a0a] border border-[#222] p-5 rounded-2xl overflow-y-auto max-h-[300px] font-mono text-[13px] text-emerald-400 shadow-inner">
                                 <pre>{JSON.stringify(result.report, null, 2)}</pre>
                               </div>
                            </div>
                          )}

                          {outputTab === 'summary' && (
                            <div className="animate-in fade-in h-full">
                               <h3 className="text-sm font-bold text-[#888] uppercase tracking-widest flex items-center gap-2 mb-4">
                                  <FileText size={16} /> Generative AI Report
                               </h3>
                               <div className="bg-blue-500/5 border border-blue-500/20 p-6 rounded-2xl shadow-inner relative overflow-hidden">
                                 <div className="absolute top-0 right-0 p-4">
                                   <Bot size={40} className="text-blue-500/20" />
                                 </div>
                                 <p className="text-blue-100 leading-relaxed font-medium text-[15px] relative z-10">
                                   {generateSummary()}
                                 </p>
                                 <div className="mt-6 flex gap-3 relative z-10">
                                    <button className="px-4 py-2 bg-blue-600 text-white font-bold text-sm rounded-lg hover:bg-blue-500 transition-colors">Route to Dispatch</button>
                                    <button className="px-4 py-2 bg-[#222] text-white font-bold text-sm rounded-lg hover:bg-[#333] transition-colors">Save Transcript</button>
                                 </div>
                               </div>
                            </div>
                          )}

                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
