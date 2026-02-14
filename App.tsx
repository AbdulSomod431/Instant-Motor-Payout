
import React, { useState, useRef } from 'react';
import { Layout } from './components/Layout';
import { Hero } from './components/Hero';
import { ClaimState } from './types';
import { analyzeVehicleDamage } from './services/geminiService';
import { AnalysisDisplay } from './components/AnalysisDisplay';

const App: React.FC = () => {
  const [claim, setClaim] = useState<ClaimState>({
    image: null,
    status: 'idle',
    report: null
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setClaim(prev => ({ ...prev, image: reader.result as string, status: 'idle', report: null }));
      };
      reader.readAsDataURL(file);
    }
  };

  const startAnalysis = async () => {
    if (!claim.image) return;

    setClaim(prev => ({ ...prev, status: 'analyzing', error: undefined }));

    try {
      const result = await analyzeVehicleDamage(claim.image);
      setClaim(prev => ({ ...prev, status: 'completed', report: result }));
      
      setTimeout(() => {
        window.scrollTo({ top: 800, behavior: 'smooth' });
      }, 300);

    } catch (err: any) {
      setClaim(prev => ({ ...prev, status: 'error', error: err.message || 'Failed to analyze bash. Check connection and try again.' }));
    }
  };

  const resetClaim = () => {
    setClaim({ image: null, status: 'idle', report: null });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <Layout>
      <Hero />
      
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          <div className="w-full lg:w-1/3">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 sticky top-24">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <i className="fas fa-shield-car text-green-600"></i>
                Lodge Claim
              </h2>
              
              <div 
                onClick={() => !claim.image && fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-2xl aspect-[4/3] flex flex-col items-center justify-center transition overflow-hidden group ${
                  claim.image ? 'border-green-500' : 'border-slate-300 hover:border-green-400 cursor-pointer bg-slate-50'
                }`}
              >
                {claim.image ? (
                  <>
                    <img src={claim.image} alt="Preview" className="w-full h-full object-cover" />
                    <button 
                      onClick={(e) => { e.stopPropagation(); resetClaim(); }}
                      className="absolute top-2 right-2 bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/70 transition"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition">
                      <i className="fas fa-camera text-green-600"></i>
                    </div>
                    <p className="text-sm font-medium text-slate-500 text-center px-4">
                      Tap to snap the car "bash"
                    </p>
                  </>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                />
              </div>

              {claim.image && claim.status !== 'completed' && (
                <button
                  disabled={claim.status === 'analyzing'}
                  onClick={startAnalysis}
                  className={`w-full mt-6 py-4 rounded-xl font-bold text-white shadow-lg transition flex items-center justify-center gap-3 ${
                    claim.status === 'analyzing' ? 'bg-slate-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 active:scale-95 shadow-green-500/20'
                  }`}
                >
                  {claim.status === 'analyzing' ? (
                    <>
                      <i className="fas fa-spinner animate-spin"></i>
                      Checking Nigerian Market Rates...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-magnifying-glass-chart"></i>
                      Estimate Repair Cost
                    </>
                  )}
                </button>
              )}

              {claim.status === 'error' && (
                <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-xl text-xs flex gap-2 items-start border border-red-100">
                  <i className="fas fa-circle-exclamation mt-0.5"></i>
                  <span>{claim.error}</span>
                </div>
              )}

              <div className="mt-8 pt-8 border-t border-slate-100">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Verification Steps</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-sm text-slate-600">
                    <i className="fas fa-check-circle text-green-500"></i> License Plate visible
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-600">
                    <i className="fas fa-check-circle text-green-500"></i> Current Policy Active
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-600">
                    <i className="fas fa-check-circle text-green-500"></i> Linked BVN for Payout
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-2/3">
            {claim.status === 'idle' && !claim.image && (
              <div className="h-full min-h-[400px] border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-400 p-8 text-center bg-white/50">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
                  <i className="fas fa-car-side text-3xl text-green-400"></i>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Claim Portal</h3>
                <p className="max-w-xs mx-auto">Upload a clear photo of the damage to get an instant Naira estimate and settlement offer.</p>
              </div>
            )}

            {claim.status === 'analyzing' && (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center p-8 bg-white rounded-3xl border border-slate-200">
                <div className="relative mb-8">
                  <div className="w-24 h-24 border-4 border-green-100 border-t-green-500 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <i className="fas fa-microchip text-green-500 text-2xl animate-pulse"></i>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-3">AI Damage Assessment</h3>
                <div className="space-y-2 text-center text-slate-500">
                  <p className="animate-pulse">Checking local part availability...</p>
                  <p className="text-sm opacity-60">Consulting Lagos/Abuja labor rates...</p>
                </div>
              </div>
            )}

            {claim.status === 'completed' && claim.report && (
              <AnalysisDisplay report={claim.report} />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default App;
