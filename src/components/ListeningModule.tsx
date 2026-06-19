import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Headphones, Play, Send, CheckCircle2, AlertCircle, RefreshCcw, Gauge } from 'lucide-react';
import { useTTS } from '../hooks/useSpeech';
import { getRandomSet } from '../lib/localLogic';

export const ListeningModule = ({ onBack }: { onBack: () => void }) => {
  const [loading, setLoading] = useState(false);
  const [segments, setSegments] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [result, setResult] = useState<any>(null);
  const { speak } = useTTS();

  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  const startExercise = async () => {
    setLoading(true);
    // Local randomized segments instead of API call
    setTimeout(() => {
      const randomSet = getRandomSet('listening') as string[];
      setSegments(randomSet);
      setCurrentIndex(0);
      setUserAnswers([]);
      setLoading(false);
    }, 1000);
  };

  const handleNextSegment = () => {
    const newAnswers = [...userAnswers, currentAnswer];
    setUserAnswers(newAnswers);
    setCurrentAnswer('');
    
    if (currentIndex < segments.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      evaluateResults(newAnswers);
    }
  };

  const evaluateResults = async (answers: string[]) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    
    const mistakes: any[] = [];
    let correctCount = 0;
    
    segments.forEach((original, idx) => {
      const user = (answers[idx] || "").trim().toLowerCase();
      const orig = original.trim().toLowerCase();
      
      if (user === orig || orig.includes(user) && user.length > orig.length * 0.8) {
        correctCount++;
      } else {
        mistakes.push({
          segment_index: idx,
          expected: original,
          got: answers[idx] || "(Blank)",
          explanation_bengali: "উচ্চারণ বা স্পেলিং-এ সামান্য ভুল হয়েছে। সঠিক বাক্যটি লক্ষ্য করুন।"
        });
      }
    });

    const accuracy = Math.round((correctCount / segments.length) * 100);
    
    setResult({
      accuracy_percent: accuracy,
      mistakes: mistakes
    });
    setLoading(false);
  };

  useEffect(() => {
    if (currentIndex >= 0 && currentIndex < segments.length) {
      speak(segments[currentIndex]);
    }
  }, [currentIndex]);

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between mb-2">
        <button onClick={onBack} className="text-gray-400 hover:text-primary transition-all flex items-center space-x-1 text-sm font-bold uppercase tracking-widest font-poppins">
          <span>←</span>
          <span className="font-bengali">ফিরে যান</span>
        </button>
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-bold font-bengali text-primary">লিসেনিং প্র্যাকটিস</h2>
          <div className="h-1 w-8 bg-accent rounded-full mt-1"></div>
        </div>
        <div className="w-20"></div>
      </div>

      <AnimatePresence mode="wait">
        {!segments.length && !loading && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center p-12 bg-white rounded-[32px] border border-gray-100 shadow-soft"
          >
            <div className="bg-indigo-50 p-6 rounded-3xl w-24 h-24 flex items-center justify-center mx-auto mb-6 text-primary shadow-sm border border-indigo-100">
              <Headphones size={40} />
            </div>
            <h3 className="text-2xl font-bold mb-2 font-poppins">Ready to listen?</h3>
            <p className="text-gray-500 font-bengali mb-8 max-w-xs mx-auto leading-relaxed">AI দ্বারা জেনারেট করা লিসেনিং টেস্ট শুরু করতে নিচের বাটনে ক্লিক করুন।</p>
            <button 
              onClick={startExercise}
              className="bg-primary text-white px-10 py-4 rounded-2xl font-bold hover:scale-105 transition-all shadow-lg shadow-primary/20 flex items-center justify-center space-x-2 mx-auto"
            >
              <span className="font-bengali">শুরু করুন</span>
              <Play size={18} fill="currentColor" />
            </button>
          </motion.div>
        )}

        {loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 bg-white rounded-[32px] border border-gray-100 shadow-soft"
          >
            <div className="relative">
              <div className="animate-spin text-primary opacity-20">
                <RefreshCcw size={64} />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3 h-3 bg-accent rounded-full animate-pulse"></div>
              </div>
            </div>
            <p className="font-bengali text-gray-400 mt-6 font-bold tracking-widest text-xs uppercase">AI ভাবছে...</p>
          </motion.div>
        )}

        {currentIndex >= 0 && !result && !loading && (
          <motion.div 
            key="practice"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-8 md:p-12 rounded-[32px] shadow-soft border border-gray-100 space-y-10"
          >
            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <span className="text-primary font-bold font-poppins text-sm tracking-tight bg-white px-3 py-1 rounded-lg border border-gray-100 shadow-sm">
                Segment {currentIndex + 1} / {segments.length}
              </span>
              
              <div className="flex bg-white p-1 rounded-xl border border-gray-100 shadow-sm">
                {[0.5, 0.75, 1, 1.25].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => setPlaybackSpeed(speed)}
                    className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all ${
                      playbackSpeed === speed ? 'bg-primary text-white' : 'text-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>

              <button 
                onClick={() => speak(segments[currentIndex], 'en-US', playbackSpeed)}
                className="bg-primary text-white p-4 rounded-2xl transition-all hover:scale-110 hover:shadow-lg shadow-primary/20"
              >
                <Play size={28} fill="currentColor" />
              </button>
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest font-poppins">Transcription Input</label>
              <input 
                autoFocus
                type="text"
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && currentAnswer && handleNextSegment()}
                className="w-full text-2xl p-6 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary focus:ring-0 outline-none transition-all font-medium placeholder-gray-300"
                placeholder="সঠিকভাবে টাইপ করুন..."
              />
            </div>

            <button 
              disabled={!currentAnswer}
              onClick={handleNextSegment}
              className="w-full bg-primary text-white py-5 rounded-2xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-light transition-all flex items-center justify-center space-x-3 shadow-lg shadow-primary/20"
            >
              <span className="font-bengali text-lg">{currentIndex === segments.length - 1 ? 'সাবমিট করুন' : 'পরবর্তী সেগমেন্ট'}</span>
              <Send size={20} />
            </button>
          </motion.div>
        )}

        {result && (
          <motion.div 
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center">
              <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-green-50 text-green-600 mb-6 border-4 border-green-100">
                <div className="text-center">
                  <span className="text-3xl font-bold">{result.accuracy_percent}%</span>
                  <p className="text-[10px] uppercase font-bold tracking-wider">Accuracy</p>
                </div>
              </div>
              <h3 className="text-2xl font-bold font-bengali mb-2">চমৎকার প্রচেষ্টা!</h3>
              <p className="text-gray-500 font-bengali mb-8">নিচে আপনার ভুলগুলো এবং সঠিক উত্তরগুলো দেখে নিন।</p>
              
              <div className="space-y-4 text-left">
                {result.mistakes?.map((mistake: any, idx: number) => (
                  <div key={`mistake-${idx}-${mistake.got?.substring(0, 5) || idx}`} className="p-4 bg-red-50 rounded-2xl border border-red-100">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="text-red-500 shrink-0 mt-1" size={20} />
                      <div>
                        <p className="text-sm font-medium text-red-900">
                          ভুল অংশ: <span className="line-through opacity-60">"{mistake.got}"</span>
                        </p>
                        <p className="text-sm font-bold text-green-700">সঠিক: "{mistake.expected}"</p>
                        <p className="text-xs text-gray-600 mt-1 font-bengali">{mistake.explanation_bengali}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => {
                  setSegments([]);
                  setResult(null);
                  setCurrentIndex(-1);
                }}
                className="mt-8 w-full bg-gray-100 text-gray-900 py-4 rounded-2xl font-bold font-bengali hover:bg-gray-200 transition-all"
              >
                আবার চেষ্টা করুন
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
