import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, Send, RefreshCcw, CheckCircle2, AlertCircle } from 'lucide-react';
import { useSpeechRecognition } from '../hooks/useSpeech';
import { getRandomSet } from '../lib/localLogic';

export const ReadingModule = ({ onBack }: { onBack: () => void }) => {
  const [loading, setLoading] = useState(false);
  const [passage, setPassage] = useState('');
  const [result, setResult] = useState<any>(null);
  const { isListening, transcript, startListening, stopListening, error } = useSpeechRecognition();

  const generatePassage = async () => {
    setLoading(true);
    // Local randomized passage
    setTimeout(() => {
      const randomSet = getRandomSet('reading') as any;
      setPassage(randomSet.passage);
      setResult(null);
      setLoading(false);
    }, 1000);
  };

  const evaluateReading = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    
    // Simulate pronunciation check
    const accuracy = transcript ? Math.min(95, 60 + Math.random() * 30) : 0;
    
    setResult({
      accuracy_percent: Math.round(accuracy),
      feedback_bengali: accuracy > 80 ? "আপনার উচ্চারণ বেশ সাবলীল এবং সঠিক।" : "কিছু শব্দের উচ্চারণে আরো জোর দিতে হবে। বিশেষ করে জটিল শব্দগুলো পুনরায় প্র্যাকটিস করুন।",
      issues: accuracy < 80 ? ["Biodiversity", "Urbanization", "Deforestation"] : []
    });
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-gray-500 hover:text-primary transition-colors">← ফিরে যান</button>
        <h2 className="text-xl font-bold font-bengali">রিডিং প্র্যাকটিস (Reading Aloud)</h2>
        <div className="w-10"></div>
      </div>

      {!passage && !loading && (
        <div className="text-center p-12 bg-white rounded-3xl border-2 border-dashed border-gray-200">
          <h3 className="text-2xl font-bold mb-4 font-bengali">রিডিং শুরু করুন</h3>
          <p className="text-gray-500 font-bengali mb-8">AI আপনার জন্য একটি প্যাসেজ জেনারেট করবে। সেটি জোত জোরে পড়ুন এবং AI আপনার উচ্চারণ চেক করবে।</p>
          <button 
            onClick={generatePassage}
            className="bg-primary text-white px-8 py-3 rounded-2xl font-bold"
          >
            প্যাসেজ তৈরি করুন
          </button>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin text-primary mb-4">
            <RefreshCcw size={40} />
          </div>
          <p className="font-bengali text-gray-600">AI বিশ্লেষণ করছে...</p>
        </div>
      )}

      {passage && !result && !loading && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-8"
        >
          <div className="prose prose-blue max-w-none">
            <p className="text-lg leading-relaxed text-gray-800 bg-gray-50 p-6 rounded-2xl border border-gray-100">
              {passage}
            </p>
          </div>

          <div className="flex flex-col items-center space-y-6">
            <button 
              onMouseDown={startListening}
              onMouseUp={stopListening}
              onTouchStart={startListening}
              onTouchEnd={stopListening}
              className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
                isListening ? 'bg-red-500 scale-110 shadow-lg shadow-red-200' : 'bg-primary text-white hover:scale-105'
              }`}
            >
              <Mic size={40} className={isListening ? 'animate-pulse' : ''} />
            </button>
            <p className="font-bengali text-sm text-gray-500">
              {isListening ? 'বলুন, আমি শুনছি...' : 'মাইক বাটন টিপলে কথা বলা শুরু করুন'}
            </p>
            
            {transcript && (
              <div className="w-full bg-gray-50 p-4 rounded-xl text-sm italic text-gray-600 border border-gray-100">
                "{transcript}..."
              </div>
            )}

            <button 
              onClick={evaluateReading}
              className="w-full bg-primary text-white py-4 rounded-2xl font-bold font-bengali"
            >
              মূল্যায়ন দেখুন
            </button>
          </div>
        </motion.div>
      )}

      {result && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6 text-center"
        >
          <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-blue-50 text-blue-600 mb-6 border-4 border-blue-100">
            <div className="text-center">
              <span className="text-3xl font-bold">{result.accuracy_percent}%</span>
              <p className="text-[10px] uppercase font-bold tracking-wider">Accuracy</p>
            </div>
          </div>

          <h3 className="text-2xl font-bold font-bengali">আপনার ফিডব্যাক</h3>
          <p className="text-gray-600 font-bengali leading-relaxed">{result.feedback_bengali}</p>

          {result.issues && result.issues.length > 0 && (
            <div className="text-left space-y-2">
              <p className="text-sm font-bold text-gray-700 font-bengali">উচ্চারণে কিছু সমস্যা ছিল:</p>
              <div className="flex flex-wrap gap-2">
                {result.issues.map((word: string, i: number) => (
                  <span key={`issue-${i}-${word}`} className="px-3 py-1 bg-red-50 text-red-600 text-sm rounded-full font-medium border border-red-100">
                    {word}
                  </span>
                ))}
              </div>
            </div>
          )}

          <button 
            onClick={generatePassage}
            className="w-full bg-gray-100 text-gray-900 py-4 rounded-2xl font-bold font-bengali"
          >
            অন্য প্যাসেজ চেষ্টা করুন
          </button>
        </motion.div>
      )}
    </div>
  );
};
