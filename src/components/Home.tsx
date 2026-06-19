import { motion } from 'motion/react';
import { Headphones, BookOpen, PenTool, Mic, Flame, Bell, ChevronRight, Play } from 'lucide-react';
import { getDailyTip } from '../lib/localLogic';

interface HomeProps {
  onModuleClick: (module: string) => void;
}

export const Home = ({ onModuleClick }: HomeProps) => {
  const modules = [
    { id: 'listening', icon: '🎧', title: 'লিসেনিং মডিউল', desc: 'AI ভয়েস শুনে শুনে সঠিক উত্তর টাইপ করার প্র্যাকটিস করুন।', color: 'border-indigo-600', bg: 'bg-indigo-50', badge: 'Academic' },
    { id: 'reading', icon: '📖', title: 'রিডিং মডিউল', desc: 'জোরে জোরে পড়ুন, AI আপনার প্রনন্সিয়েশন চেক করবে।', color: 'border-green-600', bg: 'bg-green-50', badge: 'Academic' },
    { id: 'writing', icon: '✍️', title: 'রাইটিং মডিউল', desc: 'ছবি আপলোড বা টাইপ করে AI থেকে ব্যান্ড স্কোর বুঝে নিন।', color: 'border-warning', bg: 'bg-amber-50', badge: 'Task 1 & 2' },
    { id: 'speaking', icon: '🎤', title: 'স্পিকিং মডিউল', desc: 'AI এক্সামিনারের সাথে লাইভ কথোপকথন প্র্যাকটিস করুন।', color: 'border-accent', bg: 'bg-red-50', badge: 'Live AI' },
  ];

  return (
    <div className="space-y-6 pb-24 md:pb-8">
      {/* Trial Banner */}
      <div className="bg-warning/10 border-b border-warning/20 -mx-4 md:-mx-8 px-6 py-3 flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <span className="text-warning">⏳</span>
          <p className="text-sm font-semibold text-primary font-bengali">আপনার ফ্রি ট্রায়াল শেষ হতে আর <span className="text-accent font-bold">৫ দিন</span> বাকি আছে।</p>
        </div>
        <button className="text-[10px] font-bold uppercase tracking-wider text-warning hover:underline font-poppins">Details</button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column: Progress */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-3xl shadow-soft border border-gray-100 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full border-4 border-gray-50 flex items-center justify-center mb-4 relative">
              <svg className="absolute w-full h-full -rotate-90">
                <circle cx="48" cy="48" r="44" stroke="#F3F4F6" strokeWidth="6" fill="transparent" />
                <circle cx="48" cy="48" r="44" stroke="#1A237E" strokeWidth="6" fill="transparent" strokeDasharray="276" strokeDashoffset="69" />
              </svg>
              <div className="text-3xl font-bold font-poppins text-primary">৭.৫</div>
            </div>
            <h2 className="font-bold text-lg text-primary font-bengali">টার্গেট ব্যান্ড স্কোর</h2>
            <p className="text-xs text-gray-400 mb-4 font-bengali">আপনার বর্তমান প্রস্তুতি লক্ষ্য অনুযায়ী ৭৫% সম্পন্ন হয়েছে</p>
            <div className="flex items-center space-x-2 bg-gray-50 rounded-2xl p-2 w-full justify-between border border-gray-100">
              <button className="w-8 h-8 rounded-xl bg-white border border-gray-200 text-primary font-bold shadow-sm hover:bg-gray-50">-</button>
              <div className="flex flex-col">
                <span className="text-[9px] text-gray-400 font-bold uppercase font-poppins tracking-tighter">Adjust Target</span>
                <span className="font-poppins font-bold text-primary text-sm">Band 7.5</span>
              </div>
              <button className="w-8 h-8 rounded-xl bg-white border border-gray-200 text-primary font-bold shadow-sm hover:bg-gray-50">+</button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-soft border border-gray-100 flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-primary font-bengali">দৈনিক টাস্ক প্রগ্রেস</h2>
              <div className="flex items-center space-x-1 bg-red-50 px-2 py-1 rounded-lg">
                <span className="text-sm">🔥</span>
                <span className="text-sm font-bold text-accent font-poppins uppercase tracking-tighter">7 Days</span>
              </div>
            </div>
            <div className="space-y-3 font-bengali">
              <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-2xl border border-gray-100 transition-all hover:bg-white hover:shadow-sm">
                <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-sm font-bold">✓</div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-gray-800">লিসেনিং প্র্যাকটিস</p>
                  <p className="text-[10px] text-gray-500">২ টি সেগমেন্ট সম্পন্ন</p>
                </div>
                <span className="text-[9px] font-bold text-green-600 font-poppins">+15 XP</span>
              </div>
              <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-2xl border border-gray-100 opacity-60">
                <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-sm font-bold">○</div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-gray-800">ভোকাবুলারি কুইজ</p>
                  <p className="text-[10px] text-gray-500">৫ টি শব্দ বাকি</p>
                </div>
                <span className="text-[9px] font-bold text-gray-400 font-poppins">+10 XP</span>
              </div>
              <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-2xl border border-gray-100 opacity-60">
                <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-sm font-bold">○</div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-gray-800">রাইটিং গ্রামার চেক</p>
                  <p className="text-[10px] text-gray-500">৩ টি বাক্য সংশোধন</p>
                </div>
                <span className="text-[9px] font-bold text-gray-400 font-poppins">+20 XP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Modules & Daily Tip */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {modules.map((module) => (
              <motion.button
                key={module.id}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onModuleClick(module.id)}
                className={`bg-white p-6 rounded-3xl shadow-soft border-b-4 ${module.color} border-gray-100 text-left transition-all hover:bg-gray-50/50 flex flex-col h-full`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-12 h-12 ${module.bg} rounded-2xl flex items-center justify-center text-2xl`}>
                    {module.icon}
                  </div>
                  <span className={`${module.bg} text-primary-light text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-tight font-poppins`}>
                    {module.badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-primary mb-2 font-bengali tracking-tight">{module.title}</h3>
                <p className="text-xs text-gray-500 font-bengali leading-relaxed flex-1">{module.desc}</p>
              </motion.button>
            ))}
          </div>

          <div className="bg-gradient-to-r from-primary to-primary-light p-8 rounded-3xl text-white flex flex-col md:flex-row items-center gap-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Flame size={120} />
            </div>
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-4xl shrink-0 backdrop-blur-sm border border-white/30">
              🎯
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-1 font-bengali">আজকের টিপ</h3>
              <p className="text-sm text-white/80 leading-relaxed font-bengali opacity-90">
                {getDailyTip()}
              </p>
              <button className="mt-4 flex items-center space-x-2 text-[10px] font-bold bg-white text-primary px-5 py-2.5 rounded-full uppercase tracking-widest shadow-lg hover:bg-gray-100 transition-colors">
                <Play size={14} fill="currentColor" />
                <span className="font-poppins">Listen (Play Audio)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
