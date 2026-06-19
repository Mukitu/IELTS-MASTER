import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, Video, Send, RefreshCcw, Camera, Award } from 'lucide-react';
import { useSpeechRecognition } from '../hooks/useSpeech';
import { calculateLocalScore, getRandomSet } from '../lib/localLogic';

export const SpeakingModule = ({ onBack }: { onBack: () => void }) => {
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState<'intro' | 'part1' | 'part2' | 'part3' | 'result'>('intro');
  const [questions, setQuestions] = useState<string[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [transcripts, setTranscripts] = useState<string[]>([]);
  const [result, setResult] = useState<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { isListening, transcript, startListening, stopListening } = useSpeechRecognition();

  useEffect(() => {
    if (stage !== 'intro' && stage !== 'result') {
      navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(stream => {
          if (videoRef.current) videoRef.current.srcObject = stream;
        })
        .catch(err => console.error(err));
    }
  }, [stage]);

  const startExam = async () => {
    setLoading(true);
    // Local randomized questions instead of API call
    setTimeout(() => {
      const randomSet = getRandomSet('speaking') as string[];
      setQuestions(randomSet);
      setStage('part1');
      setQIndex(0);
      setTranscripts([]);
      setLoading(false);
    }, 1000);
  };

  const handleNext = () => {
    const newTranscripts = [...transcripts, transcript];
    setTranscripts(newTranscripts);
    
    if (qIndex < questions.length - 1) {
      setQIndex(qIndex + 1);
    } else {
      evaluateSpeaking(newTranscripts);
    }
  };

  const evaluateSpeaking = async (ans: string[]) => {
    setLoading(true);
    // Simulate delay
    await new Promise(r => setTimeout(r, 1500));
    
    const combinedTranscript = ans.join(' ');
    const evaluation = calculateLocalScore(combinedTranscript || "I love my hometown because it is very quiet.");
    
    setResult({
      ...evaluation,
      fluency_score: evaluation.ta_score,
      vocab_score: evaluation.lr_score,
      grammar_score: evaluation.gra_score,
      pronunciation_score: evaluation.cc_score,
      feedback_bengali: evaluation.improvements_bengali,
      top_3_mistakes_bengali: [
        "কথা বলার সময় 'আহ্', 'উম্' (fillers) কমানোর চেষ্টা করুন।",
        "প্রতিটি প্রশ্নের উত্তরের সাথে একটি করে উদাহরণ যোগ করুন।",
        "উচ্চারণে আরো স্পষ্টতা প্রয়োজন।"
      ]
    });
    setStage('result');
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-gray-500 hover:text-primary transition-colors">← ফিরে যান</button>
        <h2 className="text-xl font-bold font-bengali">স্পিকিং সিমুলেশন (Full Exam)</h2>
        <div className="w-10"></div>
      </div>

      <AnimatePresence mode="wait">
        {stage === 'intro' && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center p-12 bg-white rounded-3xl border border-gray-100 shadow-sm"
          >
            <div className="bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-orange-600">
              <Mic size={40} />
            </div>
            <h3 className="text-2xl font-bold font-bengali mb-4">স্পিকিং টেস্ট শুরু করুন</h3>
            <p className="text-gray-500 font-bengali mb-8 max-w-sm mx-auto leading-relaxed">
              আপনার ক্যামেরা এবং মাইক প্রস্তুত রাখুন। AI আপনাকে প্রশ্ন করবে এবং আপনি উত্তর দিবেন।
            </p>
            <button 
              onClick={startExam}
              className="bg-primary text-white px-10 py-4 rounded-2xl font-bold text-lg"
            >
              পরীক্ষা শুরু করুন
            </button>
          </motion.div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin text-primary mb-4">
              <RefreshCcw size={40} />
            </div>
            <p className="font-bengali text-gray-600">AI বিশ্লেষণ করছে...</p>
          </div>
        )}

        {(stage === 'part1' || stage === 'part2' || stage === 'part3') && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm min-h-[300px] flex flex-col justify-center relative overflow-hidden">
                <span className="text-xs font-bold text-primary mb-2 uppercase tracking-widest">Question {qIndex + 1}</span>
                <h3 className="text-2xl font-bold text-gray-900 leading-tight mb-8">
                  {questions[qIndex]}
                </h3>

                <div className="mt-auto">
                  <div className={`min-h-[80px] p-5 bg-gray-50 rounded-2xl italic text-gray-500 font-medium text-lg border border-gray-200/50 flex items-center justify-center text-center transition-all ${isListening ? 'bg-red-50 ring-2 ring-red-100 text-red-600' : ''}`}>
                    {transcript || (isListening ? 'বলা শুরু করুন...' : 'সবুজ বাটন চেপে ধরে কথা বলুন')}
                  </div>
                </div>
              </div>

              <button 
                disabled={!transcript && !isListening}
                onClick={handleNext}
                className="w-full bg-primary text-white py-5 rounded-2xl font-bold flex items-center justify-center space-x-2 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                <span className="font-bengali text-lg">{qIndex === questions.length - 1 ? 'মূল্যায়ন এ যান' : 'পরবর্তী প্রশ্ন'}</span>
                <Send size={20} />
              </button>
            </div>

            <div className="space-y-6">
              <div 
                onMouseDown={startListening}
                onMouseUp={stopListening}
                onTouchStart={(e) => { e.preventDefault(); startListening(); }}
                onTouchEnd={(e) => { e.preventDefault(); stopListening(); }}
                className={`bg-black rounded-3xl aspect-[3/4] md:aspect-auto md:h-full overflow-hidden relative border-4 shadow-2xl transition-all cursor-pointer group ${
                  isListening ? 'border-red-500 ring-8 ring-red-100 scale-[1.02]' : 'border-white hover:border-primary/30'
                }`}
              >
                <video ref={videoRef} autoPlay playsInline muted className={`w-full h-full object-cover grayscale transition-all duration-500 ${isListening ? 'grayscale-0' : ''}`} />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                <div className="absolute top-4 left-4 flex items-center space-x-2 bg-red-500/90 text-white px-3 py-1.5 rounded-full text-[10px] font-bold shadow-lg">
                  <div className={`w-2 h-2 bg-white rounded-full ${isListening ? 'animate-ping' : 'animate-pulse'}`} />
                  <span>LIVE SIMULATION</span>
                </div>

                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <motion.div 
                    animate={isListening ? { scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] } : {}}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                      isListening ? 'bg-red-500 text-white shadow-2xl' : 'bg-white/20 text-white backdrop-blur-md group-hover:bg-white/30'
                    }`}
                  >
                    <Mic size={32} />
                  </motion.div>
                </div>

                <div className="absolute bottom-6 left-0 right-0 text-center text-white pointer-events-none px-4">
                  <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">
                    {isListening ? 'Recording now...' : 'Hold to record'}
                  </p>
                  <p className="text-[10px] font-bengali opacity-60">ভিডিওর ওপর চেপে ধরে কথা বলুন</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {stage === 'result' && result && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 space-y-8"
          >
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-orange-50 text-orange-600 mb-4">
                <Award size={48} />
              </div>
              <h3 className="text-3xl font-bold mb-1">Estimated Band: {result.overall_band}</h3>
              <p className="text-gray-500 font-bengali">স্পিকিং পারফরম্যান্স রিপোর্ট</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Fluency', score: result.fluency_score || result.scores?.['Fluency & Coherence'] || 6.5 },
                { label: 'Vocab', score: result.vocab_score || result.scores?.['Lexical Resource'] || 6.0 },
                { label: 'Grammar', score: result.grammar_score || result.scores?.['Grammatical Range & Accuracy'] || 7.0 },
                { label: 'Pronunciation', score: result.pronunciation_score || result.scores?.['Pronunciation'] || 6.5 },
              ].map((item: any) => (
                <div key={item.label} className="text-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-[10px] text-gray-500 font-bold mb-1 uppercase tracking-wider">{item.label}</p>
                  <p className="text-xl font-bold text-gray-900">{item.score}</p>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
                <h4 className="font-bold text-blue-900 mb-2 font-bengali">AI ফিডব্যাক:</h4>
                <p className="text-sm font-bengali leading-relaxed text-blue-800">
                  {result.feedback_bengali || result.tips_bengali}
                </p>
              </div>

              {result.top_3_mistakes_bengali && (
                <div className="space-y-2">
                  <h4 className="font-bold font-bengali px-2">প্রধান ভুলসমূহ:</h4>
                  <div className="space-y-2">
                    {result.top_3_mistakes_bengali.map((m: string, i: number) => (
                      <div key={`${m.substring(0, 10)}-${i}`} className="flex items-center space-x-3 p-3 bg-red-50 rounded-xl border border-red-100 text-sm text-red-900">
                        <span className="w-5 h-5 flex items-center justify-center bg-red-200 rounded-full font-bold text-[10px]">{i+1}</span>
                        <span className="font-bengali">{m}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button 
              onClick={() => setStage('intro')}
              className="w-full bg-primary text-white py-4 rounded-2xl font-bold font-bengali"
            >
              আবার প্র্যাকটিস করুন
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
