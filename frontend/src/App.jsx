import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import { 
  BarChart2, Activity, Clock, Map as MapIcon, History, Shield, 
  UploadCloud, Bot, CheckCircle2, Zap, BrainCircuit, TrendingUp,
  Truck, Search, RefreshCw, TriangleAlert, Waypoints
} from 'lucide-react';

// --- CUSTOM SVG ICONS FOR EXACT REPLICATION ---
const TrafficLightIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="7" y="2" width="10" height="20" rx="3"></rect>
    <circle cx="12" cy="7" r="1.5"></circle>
    <circle cx="12" cy="12" r="1.5"></circle>
    <circle cx="12" cy="17" r="1.5"></circle>
  </svg>
);

const SidebarItem = ({ icon: Icon, text, active, badge, onClick }) => (
  <div 
    onClick={onClick}
    className={`flex items-center justify-between px-4 py-3 mb-2 cursor-pointer transition-all duration-300 rounded-lg ${
    active 
      ? 'bg-[#5b36bd] text-white shadow-lg' 
      : 'text-[#8b95a5] hover:text-white hover:bg-[#151a28]'
  }`}>
    <div className="flex items-center gap-3">
      <Icon size={20} strokeWidth={2.5} />
      <span className="font-semibold text-[15px] tracking-wide">{text}</span>
    </div>
    {badge && (
      <span className="bg-[#e63946] text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
        {badge}
      </span>
    )}
  </div>
);

const KPICard = ({ title, value, subtitle, subtitleIcon: SubIcon, icon: Icon, colorClass, iconBgClass, subtitleColorClass }) => (
  <div className="bg-[#111623] border border-[#1e2536] rounded-xl p-5 flex items-center gap-5 hover:border-[#2a3449] transition-colors relative overflow-hidden">
    <div className={`w-[52px] h-[52px] rounded-xl flex items-center justify-center shrink-0 ${iconBgClass}`}>
      <Icon size={26} className={colorClass} strokeWidth={2.5} />
    </div>
    <div className="flex flex-col">
      <p className="text-[#8b95a5] text-[11px] font-bold tracking-widest uppercase mb-1">{title}</p>
      <h3 className="text-[32px] font-bold text-white leading-none mb-1">{value}</h3>
      <div className={`flex items-center gap-1.5 text-[11px] font-bold ${subtitleColorClass}`}>
        <SubIcon size={12} strokeWidth={3} />
        {subtitle}
      </div>
    </div>
  </div>
);

// Map markers mimicking the screenshot exactly
const activeHotspots = [
  [12.9716, 77.5946], [12.9816, 77.6046], [12.9616, 77.5846], [12.9516, 77.6146], [12.9316, 77.6246]
];
const historicalHotspots = [
  [12.9916, 77.5746], [12.9216, 77.5546], [12.9416, 77.6346], [12.9116, 77.5946], [12.9816, 77.6346],
  [12.9016, 77.6146], [12.9616, 77.5546], [12.9116, 77.6446], [12.9516, 77.5646]
];

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
      <div className="w-[280px] border-r border-[#1e2536] bg-[#0a0c10] flex flex-col shrink-0">
        <div className="p-6 mb-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#00e5ff] rounded-[8px] flex items-center justify-center shadow-[0_0_15px_rgba(0,229,255,0.3)]">
              <BarChart2 size={22} className="text-[#0a0c10]" strokeWidth={3} />
            </div>
            <div>
              <h1 className="text-[22px] font-bold text-white leading-none tracking-wide">AstraGrid</h1>
              <p className="text-[10px] text-[#8b95a5] tracking-[0.2em] font-bold mt-1 uppercase">Traffic Control</p>
            </div>
          </div>
        </div>

        <div className="px-4 flex-1 mt-4">
          <SidebarItem 
            icon={TrendingUp} text="Executive Dashboard" 
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

        <div className="p-5 mb-2">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full bg-[#112338] border border-[#1e2536] flex items-center justify-center shrink-0">
               <Shield size={18} className="text-[#00b8ff]" />
            </div>
            <div>
              <p className="text-[14px] font-bold text-white leading-tight">Dispatcher 01</p>
              <p className="text-[11px] font-semibold text-[#8b95a5]">Bengaluru Traffic Police</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-[#0b0f19]">
        
        {/* Topbar */}
        <header className="h-[88px] border-b border-[#1e2536] flex items-center justify-between px-8 bg-[#0b0f19] shrink-0">
          <div>
            <h2 className="text-[24px] font-bold text-white tracking-wide">{activeTab}</h2>
            <p className="text-[#8b95a5] text-[14px] font-medium mt-1">Real-time event forecasting and resource deployment optimizer</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="px-4 py-1.5 rounded-full bg-[#112a20] border border-[#1a4231] text-[#00ff88] text-[13px] font-bold flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00ff88] animate-pulse"></span>
              Live Monitoring
            </div>
            <span className="text-[#00e5ff] font-mono font-bold text-[18px] tracking-wider">
              {time}
            </span>
          </div>
        </header>

        {/* Dashboard Content */}
        {activeTab === 'Executive Dashboard' ? (
          <main className="p-8 space-y-6 flex-1 flex flex-col bg-[#0b0f19]">
            
            {/* KPIs */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              <KPICard 
                title="Total Historic Events" 
                value="8,173" 
                subtitle="100% anonymized" 
                icon={TriangleAlert} 
                subtitleIcon={TrendingUp}
                colorClass="text-[#a274ff]" 
                iconBgClass="bg-[#241a3f]"
                subtitleColorClass="text-[#8b95a5]"
              />
              <KPICard 
                title="Active Congestions" 
                value="15" 
                subtitle="Requiring Dispatch" 
                icon={TrafficLightIcon} 
                subtitleIcon={Zap}
                colorClass="text-[#ff4b4b]" 
                iconBgClass="bg-[#3d1a20]"
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
                icon={Waypoints} 
                subtitleIcon={Activity}
                colorClass="text-[#00ff88]" 
                iconBgClass="bg-[#112a20]"
                subtitleColorClass="text-[#00ff88]"
              />
            </div>

            {/* REAL INTERACTIVE MAP AREA */}
            <div className="bg-[#151a28] border border-[#1e2536] rounded-2xl flex-1 flex flex-col min-h-[500px] shadow-xl overflow-hidden">
              {/* Card Header */}
              <div className="px-6 py-5 flex items-center justify-between border-b border-[#1e2536] bg-[#151a28] z-10">
                 <h3 className="text-[16px] font-bold text-white flex items-center gap-3">
                   <MapIcon className="text-[#00b8ff]" size={20} strokeWidth={2.5} />
                   Bengaluru Traffic Hotspots & Incident Map
                 </h3>
                 <div className="flex items-center gap-6 text-[12px] font-bold text-[#8b95a5]">
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

              {/* Map Content - Actual Leaflet Map */}
              <div className="flex-1 w-full bg-[#0b0f19] relative z-0">
                <MapContainer 
                  center={[12.9716, 77.5946]} 
                  zoom={12} 
                  zoomControl={true}
                  style={{ height: '100%', width: '100%', backgroundColor: '#0b0f19' }}
                >
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
                  />
                  
                  {activeHotspots.map((pos, idx) => (
                    <CircleMarker 
                      key={`active-${idx}`} 
                      center={pos} 
                      radius={7}
                      pathOptions={{ 
                        color: '#151a28', 
                        weight: 2,
                        fillColor: '#ff4b4b', 
                        fillOpacity: 1 
                      }} 
                    />
                  ))}

                  {historicalHotspots.map((pos, idx) => (
                    <CircleMarker 
                      key={`hist-${idx}`} 
                      center={pos} 
                      radius={5}
                      pathOptions={{ 
                        color: 'transparent',
                        fillColor: '#00b8ff', 
                        fillOpacity: 0.6 
                      }} 
                    />
                  ))}
                </MapContainer>
                {/* CSS hack to add the glowing ring effect to active markers since SVG filters are tricky in Leaflet */}
                <style>{`
                  .leaflet-interactive { transition: all 0.2s; }
                  path[fill="#ff4b4b"] { filter: drop-shadow(0px 0px 6px #ff4b4b); }
                  path[fill="#00b8ff"] { filter: drop-shadow(0px 0px 4px #00b8ff); }
                  .leaflet-container { background: #0b0f19 !important; }
                `}</style>
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
