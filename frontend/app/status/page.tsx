"use client";

import { useState, useEffect } from "react";
import { 
  CheckCircle2, Server, Database, Activity, 
  RefreshCcw, Mail, ShieldCheck, Cpu, Globe 
} from "lucide-react";
import SiteHeader from "../components/SiteHeader";

// Mock data for the 30-day uptime bars
const uptimeData = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  status: Math.random() > 0.97 ? "down" : "up", 
}));

const services = [
  { id: "api", name: "Nexus API", description: "Core processing & Webhooks", icon: <Globe size={18} /> },
  { id: "db", name: "Database", description: "User records & Workout logs", icon: <Database size={18} /> },
  { id: "auth", name: "Auth Service", description: "Login & Session management", icon: <ShieldCheck size={18} /> },
  { id: "ai", name: "Recovery AI", description: "Muscle analysis engine", icon: <Cpu size={18} /> },
];

export default function StatusPage() {
  const [isScanning, setIsScanning] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [emailSubscribed, setEmailSubscribed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsScanning(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  const triggerManualRefresh = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setLastUpdated(new Date());
    }, 1200);
  };

  return (

    <>
    
    <SiteHeader />
    
    <div className="min-h-screen bg-black text-white py-24 px-6 relative overflow-hidden">
      {/* Dynamic Background Glow */}
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full h-[400px] blur-[140px] pointer-events-none transition-colors duration-1000 ${isScanning ? "bg-blue-500/10" : "bg-green-500/10"}`} />

      <div className="max-w-3xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className={`w-2 h-2 rounded-full animate-pulse ${isScanning ? "bg-blue-500" : "bg-green-500"}`} />
              <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${isScanning ? "text-blue-500" : "text-green-500"}`}>
                {isScanning ? "System Diagnostic in Progress" : "All Systems Nominal"}
              </span>
            </div>
            <h1 className="text-5xl font-bold tracking-tighter">Status</h1>
          </div>
          <button 
            onClick={triggerManualRefresh}
            disabled={isScanning}
            className="group flex items-center gap-2 px-6 py-3 bg-[#111] border border-white/5 rounded-2xl hover:border-white/20 transition-all text-sm font-bold shadow-2xl"
          >
            <RefreshCcw size={16} className={isScanning ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-700"} />
            {isScanning ? "Scanning..." : "Refresh"}
          </button>
        </div>

        {/* Global Hero Status */}
        <div className={`transition-all duration-700 p-1 rounded-[3rem] mb-16 border ${
          isScanning ? "border-white/5 bg-white/5" : "border-green-500/20 bg-green-500/5"
        }`}>
          <div className="bg-[#080808] rounded-[2.8rem] p-8 flex flex-col md:flex-row items-center gap-8">
            <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center transition-all duration-700 ${
              isScanning ? "bg-blue-500/10 text-blue-500" : "bg-green-500/20 text-green-500 shadow-[0_0_30px_-5px_rgba(34,197,94,0.3)]"
            }`}>
              {isScanning ? <Activity size={36} className="animate-pulse" /> : <CheckCircle2 size={36} />}
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold mb-2">99.9% Uptime</h2>
              <p className="text-gray-500 text-sm max-w-sm">
                Systems are running at optimal speed across all global edge locations. Last incident recorded 14 days ago.
              </p>
            </div>
          </div>
        </div>

        {/* Service Health Grid */}
        <div className="space-y-12 mb-20">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Service Breakdown</h3>
            <span className="text-[10px] text-gray-600">Current Latency: 24ms</span>
          </div>

          {services.map((service) => (
            <div key={service.id} className="group relative">
              <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-3">
                  <div className="text-gray-400 group-hover:text-white transition-colors">
                    {service.icon}
                  </div>
                  <span className="font-bold text-sm tracking-tight">{service.name}</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                  isScanning ? "bg-white/5 text-gray-600" : "bg-green-500/10 text-green-500"
                }`}>
                  {isScanning ? "CHECKING" : "OPERATIONAL"}
                </span>
              </div>

              {/* Modernized Uptime Bars */}
              <div className="flex gap-[4px] h-10 items-center justify-between">
                {uptimeData.map((day) => (
                  <div 
                    key={day.id} 
                    className={`flex-1 rounded-full transition-all duration-1000 ease-out ${
                      isScanning 
                        ? "bg-white/5 h-1 animate-pulse" 
                        : day.status === "up" 
                          ? "bg-green-500/20 h-6 hover:bg-green-500 hover:h-10 hover:shadow-[0_0_15px_rgba(34,197,94,0.4)]" 
                          : "bg-orange-500/40 h-10 hover:bg-orange-500"
                    }`}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-3 px-1 text-[9px] font-bold text-gray-600 uppercase tracking-widest">
                <span>30 Days ago</span>
                <span className="h-px flex-1 mx-4 bg-white/5 self-center" />
                <span>Today</span>
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic Notification Section */}
        <div className="relative overflow-hidden bg-[#0A0A0A] border border-white/5 p-12 rounded-[3rem] text-center">
          {!emailSubscribed ? (
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-3">Service Alerts</h3>
              <p className="text-gray-500 mb-8 text-sm max-w-xs mx-auto">
                Get notified instantly when we detect a service blip or scheduled maintenance.
              </p>
              <form 
                onSubmit={(e) => { e.preventDefault(); setEmailSubscribed(true); }}
                className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
              >
                <input 
                  required 
                  type="email" 
                  placeholder="Enter email" 
                  className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-3 outline-none focus:border-orange-600 focus:bg-white/10 transition-all text-sm"
                />
                <button className="bg-orange-600 text-white hover:bg-orange-700 hover:text-white font-bold px-8 py-3 rounded-2xl transition-all text-sm">
                  Subscribe
                </button>
              </form>
            </div>
          ) : (
            <div className="animate-in zoom-in-95 duration-500 py-4">
              <CheckCircle2 size={40} className="text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Connected</h3>
              <p className="text-gray-500 text-sm">You will now receive real-time status updates.</p>
            </div>
          )}
        </div>

        <div className="mt-20 flex justify-center items-center gap-6">
          <p className="text-gray-700 text-[10px] font-bold tracking-[0.3em] uppercase">
            Nexus Infrastructure Engine v2.4
          </p>
        </div>
      </div>
    </div>
    </>
  );
}