import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sidebar, Header } from './components/Navigation';
import { Home } from './components/Home';
import { ListeningModule } from './components/ListeningModule';
import { ReadingModule } from './components/ReadingModule';
import { WritingModule } from './components/WritingModule';
import { SpeakingModule } from './components/SpeakingModule';
import { Auth } from './components/Auth';
import { supabase } from './lib/supabase';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [currentModule, setCurrentModule] = useState<string | null>(null);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return <Auth onAuthSuccess={() => {}} />;
  }

  const renderContent = () => {
    if (currentModule) {
      switch (currentModule) {
        case 'listening': return <ListeningModule onBack={() => setCurrentModule(null)} />;
        case 'reading': return <ReadingModule onBack={() => setCurrentModule(null)} />;
        case 'writing': return <WritingModule onBack={() => setCurrentModule(null)} />;
        case 'speaking': return <SpeakingModule onBack={() => setCurrentModule(null)} />;
        default: return <Home onModuleClick={setCurrentModule} />;
      }
    }

    switch (activeTab) {
      case 'home':
        return <Home onModuleClick={setCurrentModule} />;
      case 'practice':
        return (
          <div className="max-w-4xl mx-auto py-8">
            <h2 className="text-2xl font-bold mb-6 font-bengali">মডিউল সিলেক্ট করুন</h2>
            <Home onModuleClick={setCurrentModule} />
          </div>
        );
      case 'mock':
        return (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <div className="bg-primary text-white p-8 rounded-3xl shadow-xl max-w-md w-full">
              <h3 className="text-2xl font-bold mb-4 font-bengali">ফুল মক টেস্ট</h3>
              <p className="font-bengali opacity-80 mb-8 leading-relaxed">
                Listening, Reading, Writing এবং Speaking - ৪টি মডিউল একসাথে পরীক্ষা দিন।
              </p>
              <button 
                onClick={() => setCurrentModule('speaking')}
                className="w-full bg-accent text-white py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-all shadow-lg"
              >
                শুরু করুন
              </button>
            </div>
          </div>
        );
      case 'community':
        return (
          <div className="max-w-2xl mx-auto py-8 space-y-6">
            <h2 className="text-2xl font-bold font-bengali">কমিউনিটি ফিড</h2>
            {[
              { author: 'নিশাত', score: '7.5', text: 'আজকের মক টেস্টে ব্যান্ড ৭.৫ পেলাম! আলহামদুলিল্লাহ 🥰' },
              { author: 'রাফিদ', score: '6.0', text: 'রাইটিং এ ইমপ্রুভ করার কোনো টিপস থাকলে জানান প্লিজ।' },
            ].map((post, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full" />
                    <div>
                      <p className="font-bold">{post.author}</p>
                      <p className="text-xs text-gray-500">২ ঘণ্টা আগে</p>
                    </div>
                  </div>
                  {post.score && (
                    <div className="bg-green-100 text-green-700 font-bold px-3 py-1 rounded-full text-sm">
                      Band {post.score}
                    </div>
                  )}
                </div>
                <p className="text-gray-700 font-bengali">{post.text}</p>
              </div>
            ))}
          </div>
        );
      case 'results':
        return (
          <div className="max-w-4xl mx-auto py-8 space-y-8">
            <h2 className="text-2xl font-bold font-bengali">আপনার অগ্রগতি</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm h-64 flex items-center justify-center">
                <p className="text-gray-400 font-bengali italic">প্রগ্রেস চার্ট লোড হচ্ছে...</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {['Listening', 'Reading', 'Writing', 'Speaking'].map(m => (
                  <div key={m} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-center">
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-2">{m}</p>
                    <p className="text-2xl font-bold text-primary">6.5</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'subscription':
        return (
          <div className="max-w-4xl mx-auto py-8 text-center space-y-12">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold font-bengali">সাবস্ক্রিপশন প্ল্যান</h2>
              <p className="text-gray-500 font-bengali max-w-md mx-auto">
                আপনার IELTS প্রস্তুতিকে আরও এক ধাপ এগিয়ে নিতে প্রিমিয়াম প্ল্যান বেছে নিন।
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto px-4">
              {[
                { title: 'ডেইলি', price: '৳৩', period: 'প্রতিদিন', desc: 'অল্প প্রস্তুতিতে সেরা' },
                { title: 'সাপ্তাহিক', price: '৳১৫', period: 'প্রতি সপ্তাহ', desc: 'সবচেয়ে জনপ্রিয়', featured: true },
                { title: 'মাসিক', price: '৳৪৯', period: 'প্রতি মাস', desc: 'সেরা ভ্যালু প্যাক' },
              ].map((plan) => (
                <div 
                  key={plan.title}
                  className={`bg-white p-8 rounded-3xl border-2 flex flex-col justify-between ${
                    plan.featured ? 'border-primary shadow-xl scale-105' : 'border-gray-100'
                  }`}
                >
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 font-bengali">{plan.title}</h3>
                    <div className="space-y-1">
                      <p className="text-4xl font-black text-primary">{plan.price}</p>
                      <p className="text-sm text-gray-500">{plan.period}</p>
                    </div>
                    <p className="text-sm font-bengali text-gray-600">{plan.desc}</p>
                  </div>
                  <button className={`mt-8 w-full py-4 rounded-2xl font-bold font-bengali transition-all ${
                    plan.featured ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-gray-100 text-gray-900'
                  }`}>
                    সাবস্ক্রাইব করুন
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return <Home onModuleClick={setCurrentModule} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 w-full md:ml-64 min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-20 md:pt-24 px-4 md:px-8 max-w-7xl mx-auto w-full pb-24 md:pb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + (currentModule || '')}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
