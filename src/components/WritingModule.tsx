import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Camera, Upload, Send, RefreshCcw, FileText, Image as ImageIcon } from 'lucide-react';
import { calculateLocalScore } from '../lib/localLogic';

export const WritingModule = ({ onBack }: { onBack: () => void }) => {
  const [loading, setLoading] = useState(false);
  const [task, setTask] = useState('');
  const [userText, setUserText] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateTask = async () => {
    setTask("In many countries, secondary schools allow pupils to study the subjects they like. Is it a positive or negative development?");
    setResult(null);
    setUserText('');
    setImage(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const evaluateWriting = async () => {
    setLoading(true);
    // Simulate processing delay
    await new Promise(r => setTimeout(r, 1500));
    
    try {
      const evaluation = calculateLocalScore(userText || "Sample text for analysis");
      setResult(evaluation);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-gray-500 hover:text-primary transition-colors">← ফিরে যান</button>
        <h2 className="text-xl font-bold font-bengali">রাইটিং প্র্যাকটিস (Task 2)</h2>
        <div className="w-10"></div>
      </div>

      {!task && !loading && (
        <div className="text-center p-12 bg-white rounded-3xl border-2 border-dashed border-gray-200">
          <h3 className="text-2xl font-bold mb-4 font-bengali">রাইটিং শুরু করুন</h3>
          <button 
            onClick={generateTask}
            className="bg-primary text-white px-8 py-3 rounded-2xl font-bold"
          >
            প্রশ্ন দেখুন
          </button>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin text-primary mb-4">
            <RefreshCcw size={40} />
          </div>
          <p className="font-bengali text-gray-600">AI মূল্যায়ন করছে...</p>
        </div>
      )}

      {task && !result && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 text-primary font-bold">
              <FileText size={20} />
              <span className="font-bengali">প্রশ্ন:</span>
            </div>
            <p className="text-lg leading-relaxed text-gray-800 font-medium">
              {task}
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bengali font-bold">আপনার উত্তর:</span>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full flex items-center space-x-1 hover:bg-gray-200 transition-all font-bengali"
              >
                <ImageIcon size={14} />
                <span>হ্যান্ডরাইটিং আপলোড</span>
              </button>
              <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleImageUpload} />
            </div>

            {image ? (
              <div className="relative group rounded-xl overflow-hidden mb-4 border border-gray-200">
                <img src={image} alt="Handwritten response" className="w-full h-48 object-cover" />
                <button 
                  onClick={() => setImage(null)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <RefreshCcw size={16} />
                </button>
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white font-bengali text-sm font-bold">অন্য ছবি দিতে ক্লিক করুন</p>
                </div>
              </div>
            ) : (
              <textarea 
                value={userText}
                onChange={(e) => setUserText(e.target.value)}
                className="flex-1 w-full p-4 bg-gray-50 rounded-2xl border-2 border-gray-100 focus:border-primary focus:ring-0 outline-none min-h-[300px]"
                placeholder="আপনার প্রবন্ধ এখানে লিখুন..."
              />
            )}

            <button 
              disabled={!userText && !image}
              onClick={evaluateWriting}
              className="w-full bg-primary text-white py-4 rounded-2xl font-bold font-bengali disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <span>মূল্যায়ন দেখুন</span>
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      {result && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-white p-8 rounded-3xl shadow-md border border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-8 border-b border-gray-100">
              <div className="mb-4 md:mb-0">
                <h3 className="text-3xl font-bold text-primary">Band {result.overall_band}</h3>
                <p className="text-gray-500 font-bengali uppercase tracking-wider text-xs font-bold">Estimated Overall Score</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'TA', score: result.ta_score },
                  { label: 'CC', score: result.cc_score },
                  { label: 'LR', score: result.lr_score },
                  { label: 'GRA', score: result.gra_score },
                ].map((item) => (
                  <div key={item.label} className="text-center p-3 bg-gray-50 rounded-2xl border border-gray-100">
                    <p className="text-xs text-gray-500 font-bold mb-1">{item.label}</p>
                    <p className="text-lg font-bold text-gray-900">{item.score}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-gray-900 mb-2 font-bengali">ভালো দিকসমূহ:</h4>
                <p className="bg-green-50 p-4 rounded-2xl border border-green-100 text-green-900 text-sm font-bengali leading-relaxed">
                  {result.strengths_bengali}
                </p>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2 font-bengali">উন্নতির জায়গা:</h4>
                <p className="bg-orange-50 p-4 rounded-2xl border border-orange-100 text-orange-900 text-sm font-bengali leading-relaxed">
                  {result.improvements_bengali}
                </p>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2 font-bengali">মডেল উত্তর (Model Answer):</h4>
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 prose prose-sm prose-blue text-gray-800">
                  {result.model_answer}
                </div>
              </div>
            </div>

            <button 
              onClick={generateTask}
              className="mt-8 w-full bg-primary text-white py-4 rounded-2xl font-bold font-bengali"
            >
              আবার প্র্যাকটিস করুন
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
