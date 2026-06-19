import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, query, where, getDocs, orderBy, limit, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSy...", // These will be injected at runtime
  authDomain: "crafty-bolt-xkm1r.firebaseapp.com",
  projectId: "crafty-bolt-xkm1r",
  storageBucket: "crafty-bolt-xkm1r.firebasestorage.app",
  messagingSenderId: "...",
  appId: "..."
};

// In AI Studio, we often rely on the injected credentials.
// For the preview, we'll try to initialize but handle cases where it's not yet configured.
let db: any;
let auth: any;

try {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
} catch (e) {
  console.warn("Firebase initialization failed. Using local storage fallback.");
}

export { db, auth };

export const saveResult = async (userId: string, module: string, score: number, data: any) => {
  if (!db) return;
  try {
    await addDoc(collection(db, 'practice_results'), {
      userId,
      module,
      score,
      data,
      timestamp: new Date()
    });
  } catch (e) {
    console.error("Firestore error:", e);
  }
};

export const getCommunityPosts = async () => {
  if (!db) return [];
  try {
    const q = query(collection(db, 'community_posts'), orderBy('timestamp', 'desc'), limit(20));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (e) {
    console.error("Firestore error:", e);
    return [];
  }
};
