import { BookOpen, Headphones, PenTool, Mic, Home, Trophy, Users, CreditCard, BarChart2, Bell, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  const menuItems = [
    { id: 'home', icon: Home, label: 'হোম' },
    { id: 'practice', icon: BookOpen, label: 'প্র্যাকটিস' },
    { id: 'mock', icon: Trophy, label: 'মক টেস্ট' },
    { id: 'community', icon: Users, label: 'কমিউনিটি' },
    { id: 'results', icon: BarChart2, label: 'ফলাফল' },
    { id: 'subscription', icon: CreditCard, label: 'সদস্যতা' },
  ];

  return (
    <>
      <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-100 z-50 fixed h-full shadow-soft">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="bg-primary p-1.5 rounded-lg">
              <div className="w-8 h-8 bg-white flex items-center justify-center text-primary font-bold rounded">M</div>
            </div>
            <div>
              <h1 className="text-lg font-bold text-primary font-poppins leading-none">IELTS Master</h1>
              <p className="text-[9px] uppercase tracking-widest font-bold text-gray-400 mt-1">AI Coach BD</p>
            </div>
          </div>
          
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-bengali ${
                  activeTab === item.id 
                    ? 'bg-primary/5 text-primary border border-primary/10 shadow-sm' 
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                <item.icon size={20} />
                <span className="font-semibold">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 px-2 py-2 flex justify-around items-center z-50 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] rounded-t-[32px] pb-safe">
        {menuItems.map((item) => (
          <button
            key={`mobile-${item.id}`}
            onClick={() => setActiveTab(item.id)}
            className={`relative flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-300 w-14 h-14 ${
              activeTab === item.id ? 'text-primary' : 'text-gray-400'
            }`}
          >
            {activeTab === item.id && (
              <motion.div
                layoutId="activeTabMobile"
                className="absolute inset-0 bg-primary/10 rounded-2xl"
                initial={false}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <item.icon size={22} className={`relative z-10 ${activeTab === item.id ? 'scale-110' : 'scale-100'} transition-transform`} />
            <span className="relative z-10 text-[8px] mt-1 font-bengali font-bold tracking-tight">{item.label}</span>
          </button>
        ))}
      </div>
    </>
  );
};

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 md:left-64 bg-primary text-white h-16 z-40 px-4 md:px-6 flex items-center justify-between shadow-lg border-b border-white/10">
      <div className="flex items-center space-x-2 md:hidden">
        <div className="bg-white p-1 rounded-lg">
          <div className="w-6 h-6 bg-primary flex items-center justify-center text-white font-bold rounded text-[10px]">M</div>
        </div>
        <h1 className="text-xs font-bold font-poppins tracking-tight">IELTS Master BD</h1>
      </div>
      <div className="hidden md:block"></div>
      <div className="flex items-center space-x-3 md:space-x-6">
        <div className="bg-white/10 px-3 md:px-4 py-1.5 rounded-full flex items-center space-x-1.5 md:space-x-2 border border-white/20">
          <span className="text-yellow-400 text-xs md:text-sm">⭐</span>
          <span className="text-[10px] md:text-sm font-poppins font-bold tracking-tight">Lv.3 • 245 XP</span>
        </div>
        <div className="relative cursor-pointer hover:scale-110 transition-transform hidden sm:block">
          <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-accent rounded-full border-2 border-primary"></div>
          <Bell size={20} />
        </div>
        <button 
          onClick={() => supabase.auth.signOut()}
          className="bg-white/10 p-1.5 md:p-2 rounded-xl hover:bg-white/20 transition-all border border-white/10"
        >
          <LogOut size={18} />
        </button>
        <div className="w-8 h-8 md:w-9 md:h-9 rounded-full border-2 border-white/30 overflow-hidden cursor-pointer shadow-sm">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User Profile" className="w-full h-full" />
        </div>
      </div>
    </header>
  );
};
