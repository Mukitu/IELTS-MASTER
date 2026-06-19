/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface UserProgress {
  xp: number;
  level: number;
  badges: string[];
  currentStreak: number;
  longestStreak: number;
  phone: string;
  targetBand: number;
  academicType: 'Academic' | 'General';
  lastCheckIn?: string;
  subscriptionStatus: 'trial' | 'subscribed' | 'expired';
}

export interface CommunityPost {
  id: string;
  userId: string;
  userName: string;
  bandScore?: number;
  content: string;
  likes: number;
  timestamp: any;
}

export interface PracticeResult {
  id: string;
  userId: string;
  module: 'listening' | 'reading' | 'writing' | 'speaking';
  score: number;
  timestamp: any;
  data: any;
}

export interface MockTestResult {
  id: string;
  userId: string;
  scores: {
    listening: number;
    reading: number;
    writing: number;
    speaking: number;
  };
  overallBand: number;
  timestamp: any;
  type: 'Academic' | 'General';
}

export interface ListeningSegment {
  text: string;
  audioUrl?: string;
}

export interface ListeningExercise {
  segments: string[];
  topic: string;
}

export interface EvaluationResult {
  accuracy_percent: number;
  mistakes?: Array<{
    segment_index: number;
    expected: string;
    got: string;
    explanation_bengali: string;
  }>;
  overall_band?: number;
  ta_score?: number;
  cc_score?: number;
  lr_score?: number;
  gra_score?: number;
  feedback_bengali?: string;
  strengths_bengali?: string;
  improvements_bengali?: string;
  model_answer?: string;
  issues?: string[];
  top_3_mistakes_bengali?: string[];
  tips_bengali?: string;
}
