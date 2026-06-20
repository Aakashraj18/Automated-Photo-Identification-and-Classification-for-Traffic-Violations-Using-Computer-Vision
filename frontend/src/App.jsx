import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, Zap, ShieldCheck, Database, 
  UploadCloud, Search, Bell, Settings, 
  ChevronRight, CarFront, ScanLine, AlertCircle
} from 'lucide-react';

const StatCard = ({ title, value, trend, icon: Icon }) => (
  <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-colors">
    <div className="flex justify-between items-start mb-4">
      <p className="text-zinc-400 text-sm font-medium">{title}</p>
      <div className="p-2 bg-zinc-900 rounded-md">
        <Icon size={16} className="text-blue-500" />
      </div>
    </div>
    <div className="flex items-baseline gap-3">
      <h3 className="text-3xl font-semibold text-white">{value}</h3>
      <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">{trend}</span>
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
      setError(err.response?.data?.detail || 'Analysis failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-blue-500/30">
      
      {/* Top Navigation */}
      <nav className="border-b border-zinc-800 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <Camera size={18} className="text-black" />
              </div>
              <span className="font-bold text-xl tracking-tight">GRIDLOCK</span>
            </div>
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
              <a href="#" className="text-white">Overview</a>
              <a href="#" className="hover:text-zinc-200 transition-colors">Vision Pipeline</a>
              <a href="#" className="hover:text-zinc-200 transition-colors">Violations</a>
              <a href="#" className="hover:text-zinc-200 transition-colors">Deployments</a>
            </div>
          </div>
          <div className="flex items-center gap-4 text-zinc-400">
            <Search size={18} className="cursor-pointer hover:text-white transition-colors" />
            <Bell size={18} className="cursor-pointer hover:text-white transition-colors" />
            <Settings size={18} className="cursor-pointer hover:text-white transition-colors" />
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-violet-600 ml-2 border-2 border-zinc-800 cursor-pointer"></div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight mb-2">Traffic Analysis Node</h1>
            <p className="text-zinc-400 text-sm">Process live traffic feeds through the YOLOv8 + EasyOCR computer vision pipeline.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 text-xs font-medium bg-emerald-500/10 text-emerald-500 px-3 py-1.5 rounded-full border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Pipeline Online
            </span>
            <button className="bg-white text-black px-4 py-1.5 rounded-full text-sm font-medium hover:bg-zinc-200 transition-colors">
              Deploy Model
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard title="Frames Processed" value="24.8k" trend="+12% today" icon={Database} />
          <StatCard title="Violations Detected" value="1,402" trend="+5% today" icon={AlertCircle} />
          <StatCard title="Model Confidence" value="94.2%" trend="Stable" icon={ShieldCheck} />
          <StatCard title="Inference Latency" value="42ms" trend="-2ms avg" icon={Zap} />
        </div>

        {/* Pipeline Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Input Panel */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/50">
              <h2 className="font-medium flex items-center gap-2">
                <ScanLine size={18} className="text-blue-500" />
                Input Stream
              </h2>
              <span className="text-xs text-zinc-500 font-mono">Source: Local File</span>
            </div>
            
            <div className="p-6 flex-1 flex flex-col">
              {!preview ? (
                <label className="flex-1 border-2 border-dashed border-zinc-800 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-zinc-600 hover:bg-zinc-900/50 transition-all min-h-[300px]">
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                  <UploadCloud size={40} className="text-zinc-600 mb-4" />
                  <p className="text-zinc-300 font-medium mb-1">Upload traffic frame</p>
                  <p className="text-zinc-500 text-xs">JPEG or PNG, up to 10MB</p>
                </label>
              ) : (
                <div className="flex-1 flex flex-col relative group">
                  <div className="relative rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 flex-1 flex items-center justify-center min-h-[300px]">
                    <img src={preview} alt="Upload Preview" className="max-w-full max-h-[400px] object-contain" />
                    
                    {/* Floating change button */}
                    <label className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-zinc-700 text-white text-xs px-3 py-1.5 rounded-lg cursor-pointer hover:bg-black/80 transition-colors opacity-0 group-hover:opacity-100">
                      <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                      Change Image
                    </label>
                  </div>
                  
                  <button 
                    onClick={handleAnalyze}
                    disabled={loading}
                    className="mt-6 w-full bg-white text-black font-semibold py-3.5 rounded-xl hover:bg-zinc-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <ScanLine size={18} />
                    )}
                    {loading ? 'Running Inference...' : 'Analyze Frame'}
                  </button>
                </div>
              )}
              {error && (
                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm flex items-center gap-2">
                  <AlertCircle size={16} /> {error}
                </div>
              )}
            </div>
          </div>

          {/* Output Panel */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col min-h-[500px]">
             <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/50">
              <h2 className="font-medium flex items-center gap-2">
                <Database size={18} className="text-emerald-500" />
                Pipeline Output
              </h2>
              {result && (
                <span className="text-xs bg-zinc-800 text-zinc-300 px-2 py-1 rounded font-mono">
                  {result.report.violations.length} Matches
                </span>
              )}
            </div>

            <div className="p-6 flex-1 flex flex-col bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900/40 via-zinc-950 to-zinc-950">
              <AnimatePresence mode="wait">
                {!result && !loading ? (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="flex-1 flex flex-col items-center justify-center text-zinc-600"
                  >
                    <CarFront size={48} strokeWidth={1} className="mb-4" />
                    <p className="text-sm font-medium">Awaiting inference trigger.</p>
                  </motion.div>
                ) : loading ? (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="flex-1 flex flex-col items-center justify-center"
                  >
                    <div className="relative w-24 h-24">
                      <div className="absolute inset-0 border-4 border-zinc-800 rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                      <ScanLine size={32} className="absolute inset-0 m-auto text-blue-500 animate-pulse" />
                    </div>
                    <p className="mt-6 text-zinc-400 font-mono text-sm">Processing layers...</p>
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-6"
                  >
                    {/* Annotated Image */}
                    <div className="rounded-xl overflow-hidden border border-zinc-800 bg-black flex justify-center">
                      <img 
                        src={result.annotated_image_base64} 
                        alt="Detection Results" 
                        className="max-h-[300px] object-contain"
                      />
                    </div>

                    {/* Metadata Table */}
                    <div>
                      <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Extracted Payload</h3>
                      {result.report.violations.length > 0 ? (
                        <div className="border border-zinc-800 rounded-xl overflow-hidden">
                          <table className="w-full text-sm text-left">
                            <thead className="bg-zinc-900/50 text-zinc-400 text-xs uppercase border-b border-zinc-800">
                              <tr>
                                <th className="px-4 py-3 font-medium">Type</th>
                                <th className="px-4 py-3 font-medium">Classification</th>
                                <th className="px-4 py-3 font-medium text-right">Confidence</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800/50">
                              {result.report.violations.map((v, i) => (
                                <tr key={i} className="hover:bg-zinc-900/30 transition-colors">
                                  <td className="px-4 py-3">
                                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium bg-red-500/10 text-red-500 border border-red-500/20">
                                      {v.type}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 text-zinc-200 capitalize">
                                    {v.vehicle}
                                    {v.plate && v.plate !== "UNKNOWN" && (
                                      <span className="ml-2 font-mono text-[10px] bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded">
                                        {v.plate}
                                      </span>
                                    )}
                                  </td>
                                  <td className="px-4 py-3 text-right">
                                    <span className="font-mono text-blue-400">{(v.confidence * 100).toFixed(1)}%</span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 text-center">
                          <CheckCircle2 size={24} className="text-emerald-500 mx-auto mb-2" />
                          <p className="text-zinc-300 font-medium">Clear frame</p>
                          <p className="text-zinc-500 text-xs mt-1">No traffic violations detected by YOLOv8.</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
