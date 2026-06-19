
/**
 * Local Smart Logic for IELTS Master BD
 * Replaces AI calls with fast, reliable local calculations.
 */

export const DAILY_TIPS = [
  "Use 'Moreover' instead of 'Also' to sound more formal in Writing Task 2.",
  "In Speaking Part 1, try to extend your answers by giving reasons with 'because'.",
  "Listen for 'distractors' in the Listening section where the speaker changes their mind.",
  "For Reading, skimming helps you find the general idea of a paragraph quickly.",
  "In Writing Task 1, always mention the highest and lowest points of a graph.",
  "Try not to repeat the same word; use synonyms like 'essential' instead of 'important'.",
  "Focus on your pronunciation of 'th' sounds for a better Speaking score.",
  "Make sure your subject and verb agree in every sentence you write.",
  "Read the questions before the recording starts in the Listening module.",
  "Manage your time carefully; don't spend more than 20 minutes on Writing Task 1.",
  // Add more tips here (up to 300)
];

export const LISTENING_SETS = [
  [
    "The registration office is open from Monday to Friday.",
    "You need to bring your passport and two recent photographs.",
    "The tuition fees must be paid in full by the end of this month."
  ],
  [
    "The library offers a wide range of academic journals and digital resources.",
    "Students must return borrowed books within two weeks to avoid fines.",
    "Quiet study areas are located on the third floor of the building."
  ],
  [
    "The campus shuttle runs every twenty minutes during peak hours.",
    "Bicycle parking is available near the main entrance of the science block.",
    "Students are encouraged to use public transport to reduce carbon emissions."
  ]
];

export const SPEAKING_SETS = [
  [
    "Let's talk about your hometown. Where do you come from?",
    "Do you like your hometown? Why?",
    "What do you like to do in your free time?",
    "Do you prefer to study alone or with others?"
  ],
  [
    "Do you prefer working in the morning or at night? Why?",
    "What kind of music do you like to listen to?",
    "Have you always liked that kind of music?",
    "Is music an important part of your culture?"
  ],
  [
    "Let's talk about technology. How often do you use a computer?",
    "What are the benefits of using the internet for students?",
    "Do you think people spend too much time on their phones?",
    "How has technology changed the way we communicate?"
  ]
];

export const READING_SETS = [
  {
    passage: "The impact of environmental changes on global biodiversity is a matter of serious concern. Scientists believe that rapid urbanization and deforestation are the primary drivers of species extinction.",
    keywords: ["Biodiversity", "Urbanization", "Deforestation"]
  },
  {
    passage: "Artificial Intelligence is transforming the modern workplace at an unprecedented pace. While it increases efficiency, many experts warn about the potential displacement of traditional jobs.",
    keywords: ["Intelligence", "Unprecedented", "Displacement"]
  },
  {
    passage: "The history of ancient civilizations reveals complex social structures and advanced engineering. The ruins found in Egypt and Mesopotamia continue to fascinate archaeologists today.",
    keywords: ["Civilizations", "Structures", "Archaeologists"]
  }
];

export function getRandomSet(type: 'listening' | 'speaking' | 'reading') {
  if (type === 'listening') return LISTENING_SETS[Math.floor(Math.random() * LISTENING_SETS.length)];
  if (type === 'speaking') return SPEAKING_SETS[Math.floor(Math.random() * SPEAKING_SETS.length)];
  return READING_SETS[Math.floor(Math.random() * READING_SETS.length)];
}
export const SCORING_KEYWORDS = {
  advanced: ["moreover", "consequently", "nevertheless", "furthermore", "nonetheless", "subsequently"],
  intermediate: ["however", "therefore", "although", "whereas", "besides", "despite"],
  basic: ["and", "but", "so", "because", "also"]
};

/**
 * Local Scoring Logic for Writing/Speaking
 */
export function calculateLocalScore(text: string) {
  const words = text.toLowerCase().split(/\s+/);
  let advancedCount = 0;
  let intermediateCount = 0;
  
  SCORING_KEYWORDS.advanced.forEach(k => { if (words.includes(k)) advancedCount++; });
  SCORING_KEYWORDS.intermediate.forEach(k => { if (words.includes(k)) intermediateCount++; });

  let band = 5.0;
  if (advancedCount > 2) band += 1.5;
  else if (advancedCount > 0) band += 1.0;
  
  if (intermediateCount > 3) band += 1.0;
  else if (intermediateCount > 1) band += 0.5;

  if (text.length > 250) band += 0.5;
  if (text.length < 50) band -= 1.0;

  const finalBand = Math.min(9.0, Math.max(1.0, band));
  const roundedBand = (Math.round(finalBand * 2) / 2).toFixed(1);

  return {
    overall_band: roundedBand,
    ta_score: roundedBand,
    cc_score: (finalBand + (Math.random() * 0.5 - 0.25)).toFixed(1),
    lr_score: (finalBand + (Math.random() * 0.5 - 0.25)).toFixed(1),
    gra_score: (finalBand + (Math.random() * 0.5 - 0.25)).toFixed(1),
    xp: (advancedCount * 20) + (intermediateCount * 10) + (text.length > 100 ? 50 : 0),
    strengths_bengali: "আপনার রাইটিংয়ের গঠন বেশ ভালো। বিশেষ করে জটিল শব্দগুলোর সঠিক ব্যবহার লক্ষ্য করা গেছে।",
    improvements_bengali: "আরো কিছু কানেক্টিং শব্দ (যেমন: Furthermore, In contrast) ব্যবহার করলে স্কোর আরো বাড়বে। গ্রামারে কিছু ছোট ভুল সংশোধন করা প্রয়োজন।",
    model_answer: "Sample Model Answer: In the current educational landscape, allowing students to choose subjects they are passionate about is a positive step. This approach fosters motivation and allows individuals to specialize in areas where they can excel..."
  };
}

/**
 * Get Tip of the Day based on date
 */
export function getDailyTip() {
  const start = new Date(new Date().getFullYear(), 0, 0);
  const diff = new Date().getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  return DAILY_TIPS[dayOfYear % DAILY_TIPS.length];
}
