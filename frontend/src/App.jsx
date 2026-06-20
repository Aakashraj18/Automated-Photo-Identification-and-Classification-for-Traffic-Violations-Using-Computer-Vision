import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  BarChart2, Activity, AlertTriangle, Clock, Share2, 
  Map as MapIcon, History, Shield, LayoutDashboard, 
  UploadCloud, Bot, CheckCircle2, Zap, BrainCircuit,
  Truck, Search, RefreshCw, TriangleAlert
} from 'lucide-react';

const SidebarItem = ({ icon: Icon, text, active, badge, onClick }) => (
  <div 
    onClick={onClick}
    className={`flex items-center justify-between px-4 py-3 mb-1 cursor-pointer transition-all duration-300 relative rounded-md ${
    active 
      ? 'bg-gradient-to-r from-[#2c1d5e] to-[#101322] text-white' 
      : 'text-[#8b95a5] hover:text-white hover:bg-[#111623]'
  }`}>
    {active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#8b5cf6] rounded-r-sm"></div>}
    <div className="flex items-center gap-3">
      <Icon size={18} strokeWidth={2.5} />
      <span className="font-semibold text-sm tracking-wide">{text}</span>
    </div>
    {badge && (
      <span className="bg-[#e63946] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
        {badge}
      </span>
    )}
  </div>
);

const KPICard = ({ title, value, subtitle, subtitleIcon: SubIcon, icon: Icon, colorClass, iconBgClass, subtitleColorClass }) => (
  <div className="bg-[#151a28] border border-[#1e2536] rounded-xl p-5 flex flex-col justify-center gap-1 hover:border-[#2a3449] transition-colors relative overflow-hidden">
    <div className="flex items-start gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${iconBgClass}`}>
        <Icon size={22} className={colorClass} strokeWidth={2.5} />
      </div>
      <div className="flex flex-col mt-1">
        <p className="text-[#8b95a5] text-[10px] font-bold tracking-widest uppercase mb-1">{title}</p>
        <h3 className="text-[28px] font-bold text-white leading-none mb-2">{value}</h3>
        <div className={`flex items-center gap-1.5 text-[11px] font-semibold ${subtitleColorClass}`}>
          <SubIcon size={12} strokeWidth={3} />
          {subtitle}
        </div>
      </div>
    </div>
  </div>
);

export default function App() {
  const [activeTab, setActiveTab] = useState('Executive Dashboard');
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
      <div className="w-[260px] border-r border-[#1e2536] bg-[#0b0f19] flex flex-col shrink-0">
        <div className="p-5 pt-6 mb-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#00e5ff] rounded-[6px] flex items-center justify-center">
              <BarChart2 size={20} className="text-[#0b0f19]" strokeWidth={3} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white leading-none tracking-wide">AstraGrid</h1>
              <p className="text-[9px] text-[#8b95a5] tracking-[0.15em] font-bold mt-1 uppercase">Traffic Control</p>
            </div>
          </div>
        </div>

        <div className="px-3 flex-1 mt-4">
          <SidebarItem 
            icon={LayoutDashboard} text="Executive Dashboard" 
            active={activeTab === 'Executive Dashboard'} 
            onClick={() => setActiveTab('Executive Dashboard')} 
          />
          <SidebarItem 
            icon={BrainCircuit} text="AI Predictor" 
            active={activeTab === 'AI Predictor'} 
            onClick={() => setActiveTab('AI Predictor')} 
          />
          <SidebarItem icon={Truck} text="Dispatch Center" badge="15" active={activeTab === 'Dispatch Center'} onClick={() => setActiveTab('Dispatch Center')} />
          <SidebarItem icon={Search} text="Historical Analytics" active={activeTab === 'Historical Analytics'} onClick={() => setActiveTab('Historical Analytics')} />
          <SidebarItem icon={RefreshCw} text="Post-Event Learning" active={activeTab === 'Post-Event Learning'} onClick={() => setActiveTab('Post-Event Learning')} />
        </div>

        <div className="p-4 mb-2">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-[#112338] flex items-center justify-center shrink-0">
               <Shield size={16} className="text-[#00b8ff]" />
            </div>
            <div>
              <p className="text-[13px] font-bold text-white leading-tight">Dispatcher 01</p>
              <p className="text-[10px] font-semibold text-[#8b95a5]">Bengaluru Traffic Police</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-[#0b0f19]">
        
        {/* Topbar */}
        <header className="h-[80px] border-b border-[#1e2536] flex items-center justify-between px-8 bg-[#0b0f19] shrink-0">
          <div>
            <h2 className="text-[22px] font-bold text-white tracking-wide">{activeTab}</h2>
            <p className="text-[#8b95a5] text-[13px] font-medium mt-0.5">Real-time event forecasting and resource deployment optimizer</p>
          </div>
          <div className="flex items-center gap-5">
            <div className="px-3 py-1.5 rounded-full bg-[#0d2a23] text-[#00ff88] text-[12px] font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse"></span>
              Live Monitoring
            </div>
            <span className="text-[#00e5ff] font-mono font-bold text-[17px] tracking-wider">
              {time}
            </span>
          </div>
        </header>

        {/* Dashboard Content */}
        {activeTab === 'Executive Dashboard' ? (
          <main className="p-6 space-y-6 flex-1 flex flex-col bg-[#0b0f19]">
            
            {/* KPIs */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
              <KPICard 
                title="Total Historic Events" 
                value="8,173" 
                subtitle="100% anonymized" 
                icon={TriangleAlert} 
                subtitleIcon={Activity}
                colorClass="text-[#a274ff]" 
                iconBgClass="bg-[#21153a]"
                subtitleColorClass="text-[#8b95a5]"
              />
              <KPICard 
                title="Active Congestions" 
                value="15" 
                subtitle="Requiring Dispatch" 
                icon={BarChart2} 
                subtitleIcon={Zap}
                colorClass="text-[#ff4b4b]" 
                iconBgClass="bg-[#3a151b]"
                subtitleColorClass="text-[#ff4b4b]"
              />
              <KPICard 
                title="Avg. Clearance Time" 
                value="165.6 min" 
                subtitle="Historical Average" 
                icon={Clock} 
                subtitleIcon={CheckCircle2}
                colorClass="text-[#00b8ff]" 
                iconBgClass="bg-[#112338]"
                subtitleColorClass="text-[#8b95a5]"
              />
              <KPICard 
                title="Feedback Loops Logged" 
                value="0" 
                subtitle="Model Self-Learning" 
                icon={Share2} 
                subtitleIcon={Activity}
                colorClass="text-[#00ff88]" 
                iconBgClass="bg-[#112a20]"
                subtitleColorClass="text-[#00ff88]"
              />
            </div>

            {/* Map Area */}
            <div className="bg-[#151a28] border border-[#1e2536] rounded-xl flex-1 flex flex-col min-h-[450px]">
              {/* Card Header */}
              <div className="px-5 py-4 flex items-center justify-between border-b border-[#1e2536]">
                 <h3 className="text-[14px] font-bold text-white flex items-center gap-2">
                   <MapIcon className="text-[#00b8ff]" size={16} strokeWidth={2.5} />
                   Bengaluru Traffic Hotspots & Incident Map
                 </h3>
                 <div className="flex items-center gap-5 text-[11px] font-bold text-[#8b95a5]">
                   <div className="flex items-center gap-1.5">
                     <div className="w-2 h-2 rounded-full bg-[#ff4b4b]"></div>
                     Active
                   </div>
                   <div className="flex items-center gap-1.5">
                     <div className="w-2 h-2 rounded-full bg-[#00b8ff]"></div>
                     Historical Hotspots
                   </div>
                 </div>
              </div>

              {/* Map Content Simulation */}
              <div className="relative flex-1 w-full rounded-b-xl overflow-hidden bg-[#0a0c10]">
                {/* Background image mimicking dark map */}
                <div className="absolute inset-0 opacity-40 bg-[url('https://cartodb-basemaps-a.global.ssl.fastly.net/dark_all/12/2965/1922.png')] bg-cover bg-center mix-blend-screen"></div>
                
                {/* Grid Overlay */}
                <div className="absolute inset-0 opacity-10" style={{backgroundImage: "linear-gradient(#1e2536 1px, transparent 1px), linear-gradient(90deg, #1e2536 1px, transparent 1px)", backgroundSize: "40px 40px"}}></div>

                {/* Simulated Nodes matching the screenshot */}
                <div className="absolute top-[35%] left-[30%] w-4 h-4 bg-[#ff4b4b] rounded-full border-[3px] border-[#151a28] shadow-[0_0_12px_#ff4b4b]"></div>
                <div className="absolute top-[42%] left-[35%] w-4 h-4 bg-[#ff4b4b] rounded-full border-[3px] border-[#151a28] shadow-[0_0_12px_#ff4b4b]"></div>
                <div className="absolute top-[50%] left-[28%] w-4 h-4 bg-[#ff4b4b] rounded-full border-[3px] border-[#151a28] shadow-[0_0_12px_#ff4b4b]"></div>
                <div className="absolute top-[58%] left-[32%] w-4 h-4 bg-[#ff4b4b] rounded-full border-[3px] border-[#151a28] shadow-[0_0_12px_#ff4b4b]"></div>
                <div className="absolute top-[75%] left-[45%] w-4 h-4 bg-[#e6a23c] rounded-full border-[3px] border-[#151a28] shadow-[0_0_12px_#e6a23c]"></div>
                
                {/* Historical Nodes */}
                <div className="absolute top-[20%] left-[25%] w-2.5 h-2.5 bg-[#00b8ff] rounded-full opacity-60"></div>
                <div className="absolute top-[60%] left-[22%] w-2.5 h-2.5 bg-[#00b8ff] rounded-full opacity-60"></div>
                <div className="absolute top-[65%] left-[38%] w-2.5 h-2.5 bg-[#00b8ff] rounded-full opacity-60"></div>
                <div className="absolute top-[80%] left-[25%] w-2.5 h-2.5 bg-[#00b8ff] rounded-full opacity-60"></div>
                <div className="absolute top-[30%] left-[45%] w-2.5 h-2.5 bg-[#00b8ff] rounded-full opacity-60"></div>
                <div className="absolute top-[40%] left-[48%] w-2.5 h-2.5 bg-[#00b8ff] rounded-full opacity-60"></div>

                {/* City Label */}
                <div className="absolute top-[45%] left-[25%] text-white/50 text-sm font-bold tracking-widest">Bengaluru</div>
              </div>
            </div>
          </main>
        ) : activeTab === 'AI Predictor' ? (
          <main className="p-8 max-w-6xl mx-auto w-full space-y-6 flex-1">
            <div className="bg-[#151a28] border border-[#1e2536] rounded-xl overflow-hidden shadow-2xl p-8">
              <h3 className="text-[18px] font-bold text-white flex items-center gap-3 mb-8">
                <BrainCircuit className="text-[#8b5cf6]" size={22} strokeWidth={2.5} />
                Vision AI Predictor Module
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Uploader */}
                <div className="space-y-6">
                  <div className="bg-[#0b0f19] border border-[#1e2536] rounded-xl p-6 relative">
                    <input type="file" id="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    <label htmlFor="file" className="cursor-pointer flex flex-col items-center justify-center py-12 border-2 border-dashed border-[#2a3449] hover:border-[#8b5cf6] rounded-lg transition-all group">
                      <div className="w-14 h-14 rounded-full bg-[#151a28] group-hover:bg-[#8b5cf6]/20 flex items-center justify-center text-[#8b95a5] group-hover:text-[#8b5cf6] mb-4 transition-all">
                        <UploadCloud size={28} />
                      </div>
                      <p className="text-white font-bold text-sm mb-1">Upload Street/Traffic Image</p>
                      <p className="text-[#8b95a5] text-[11px] font-medium">JPEG, PNG formats supported</p>
                    </label>
                  </div>

                  {preview && (
                    <div className="bg-[#0b0f19] border border-[#1e2536] rounded-xl p-4">
                      <img src={preview} alt="Upload Preview" className="w-full h-48 object-cover rounded-lg border border-[#1e2536]" />
                      <button 
                        onClick={handleAnalyze}
                        disabled={loading}
                        className="w-full mt-4 bg-gradient-to-r from-[#6b38fb] to-[#4522a9] text-white py-3 rounded-lg font-bold text-sm shadow-[0_0_15px_rgba(107,56,251,0.3)] hover:shadow-[0_0_25px_rgba(107,56,251,0.5)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {loading ? <span className="animate-spin text-lg">⚙️</span> : <Bot size={18}/>}
                        {loading ? 'Processing Frames...' : 'Run Prediction Engine'}
                      </button>
                    </div>
                  )}
                  {error && <p className="text-[#ff4b4b] text-sm bg-[#3a151b] p-3 rounded-lg border border-[#ff4b4b]/20 font-medium">{error}</p>}
                </div>

                {/* Results */}
                <div className="bg-[#0b0f19] border border-[#1e2536] rounded-xl p-6 flex flex-col relative overflow-hidden min-h-[400px]">
                  <h4 className="text-white font-bold mb-4 flex items-center gap-2 text-[14px]">
                    <Activity className="text-[#00ff88]" size={18} />
                    Live Analysis Output
                  </h4>

                  {!result && !loading && (
                    <div className="flex-1 flex flex-col items-center justify-center text-[#8b95a5]">
                      <BrainCircuit size={40} className="mb-4 opacity-10" />
                      <p className="text-xs font-medium">Model standing by for image input.</p>
                    </div>
                  )}
                  
                  {loading && (
                    <div className="absolute inset-0 bg-[#0b0f19]/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-xl">
                        <div className="w-12 h-12 border-[3px] border-[#8b5cf6] border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-[#8b5cf6] font-bold text-sm tracking-widest uppercase">Detecting...</p>
                    </div>
                  )}

                  {result && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 h-full">
                      <div className="rounded-lg overflow-hidden border border-[#1e2536] relative">
                        <img src={result.annotated_image_base64} alt="Evidence" className="w-full h-auto max-h-[250px] object-contain bg-black" />
                      </div>
                      
                      <div className="bg-[#151a28] rounded-lg p-4 border border-[#1e2536] flex-1 overflow-y-auto">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-[10px] font-bold text-[#8b95a5] tracking-widest uppercase">
                              Extracted Entities
                          </h4>
                          <span className="text-[9px] text-[#00ff88] bg-[#00ff88]/10 border border-[#00ff88]/20 px-2 py-0.5 rounded font-bold uppercase">{result.report.violations.length} Matches</span>
                        </div>
                        
                        {result.report.violations.length > 0 ? (
                          <div className="space-y-2">
                            {result.report.violations.map((v, i) => (
                              <div key={i} className="flex items-center justify-between bg-[#0b0f19] p-3 rounded-md border border-[#1e2536]">
                                <div className="flex items-center gap-3">
                                  <span className="text-[#ff4b4b] font-black text-[10px] uppercase bg-[#3a151b] px-2 py-1 rounded">{v.type}</span>
                                  <span className="text-white text-xs font-bold capitalize">{v.vehicle}</span>
                                </div>
                                <div className="text-right flex items-center gap-3">
                                  <span className="text-[#8b95a5] text-[10px] font-bold bg-[#151a28] px-2 py-1 rounded border border-[#1e2536]">{(v.confidence * 100).toFixed(0)}% CONF</span>
                                  <span className="text-[#00b8ff] font-mono text-[11px] font-bold">{v.plate}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-[#00ff88] text-xs bg-[#112a20] p-3 rounded-md border border-[#00ff88]/20 text-center font-bold">
                            No violations identified in frame.
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </main>
        ) : (
          <div className="flex-1 flex items-center justify-center text-[#8b95a5] font-medium text-sm bg-[#0b0f19]">
            Module currently offline. Please check back later.
          </div>
        )}
      </div>
    </div>
  );
}
