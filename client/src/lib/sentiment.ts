// Simple sentiment analysis utility
// In a production app, you might use a more sophisticated library like compromise or sentiment

interface SentimentResult {
  sentiment: "positive" | "neutral" | "negative";
  score: number; // -1 to 1
}

// Predefined word lists for sentiment analysis
const positiveWords = [
  "amazing", "awesome", "brilliant", "excellent", "fantastic", "great", "incredible", 
  "love", "wonderful", "perfect", "outstanding", "superb", "terrific", "magnificent",
  "good", "nice", "helpful", "useful", "clear", "easy", "simple", "beautiful",
  "impressed", "satisfied", "happy", "pleased", "delighted", "thrilled", "excited",
  "recommend", "best", "favorite", "appreciate", "thank", "thanks", "grateful"
];

const negativeWords = [
  "awful", "terrible", "horrible", "disgusting", "hate", "worst", "bad", "poor",
  "disappointing", "frustrated", "annoying", "confusing", "difficult", "hard",
  "broken", "bug", "error", "problem", "issue", "fail", "failed", "wrong",
  "slow", "laggy", "crash", "crashed", "useless", "pointless", "waste",
  "angry", "upset", "sad", "unhappy", "dissatisfied", "disappointed"
];

const neutralWords = [
  "okay", "ok", "fine", "average", "normal", "standard", "typical", "regular",
  "maybe", "perhaps", "possibly", "might", "could", "would", "should"
];

// Intensifiers that modify sentiment
const intensifiers = {
  "very": 1.5,
  "really": 1.4,
  "extremely": 1.8,
  "incredibly": 1.7,
  "absolutely": 1.6,
  "totally": 1.5,
  "completely": 1.6,
  "quite": 1.2,
  "pretty": 1.1,
  "somewhat": 0.8,
  "kind of": 0.7,
  "sort of": 0.7,
  "not": -1,
  "never": -1,
  "no": -0.8,
  "hardly": -0.6,
  "barely": -0.6
};

export function analyzeSentiment(text: string): SentimentResult {
  if (!text || text.trim().length === 0) {
    return { sentiment: "neutral", score: 0 };
  }

  // Normalize text: lowercase and remove punctuation
  const normalizedText = text.toLowerCase().replace(/[^\w\s]/g, " ");
  const words = normalizedText.split(/\s+/).filter(word => word.length > 0);

  let score = 0;
  let wordCount = 0;

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    let wordScore = 0;
    let modifier = 1;

    // Check for intensifiers in the previous words
    for (let j = Math.max(0, i - 2); j < i; j++) {
      const prevWord = words[j];
      if (intensifiers[prevWord]) {
        modifier *= intensifiers[prevWord];
      }
    }

    // Calculate base sentiment score for the word
    if (positiveWords.includes(word)) {
      wordScore = 1;
    } else if (negativeWords.includes(word)) {
      wordScore = -1;
    } else if (neutralWords.includes(word)) {
      wordScore = 0;
    }

    // Apply modifier if word has sentiment
    if (wordScore !== 0) {
      score += wordScore * modifier;
      wordCount++;
    }
  }

  // Normalize score by the number of sentiment words found
  const normalizedScore = wordCount > 0 ? score / wordCount : 0;

  // Clamp score between -1 and 1
  const clampedScore = Math.max(-1, Math.min(1, normalizedScore));

  // Determine sentiment category
  let sentiment: "positive" | "neutral" | "negative";
  if (clampedScore > 0.1) {
    sentiment = "positive";
  } else if (clampedScore < -0.1) {
    sentiment = "negative";
  } else {
    sentiment = "neutral";
  }

  return {
    sentiment,
    score: clampedScore
  };
}

// Additional utility functions for sentiment analysis

export function getSentimentColor(sentiment: string): string {
  switch (sentiment) {
    case "positive":
      return "text-green-600 dark:text-green-400";
    case "negative":
      return "text-red-600 dark:text-red-400";
    default:
      return "text-amber-600 dark:text-amber-400";
  }
}

export function getSentimentBadgeColor(sentiment: string): string {
  switch (sentiment) {
    case "positive":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
    case "negative":
      return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
    default:
      return "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400";
  }
}

export function getSentimentEmoji(sentiment: string): string {
  switch (sentiment) {
    case "positive":
      return "😊";
    case "negative":
      return "😞";
    default:
      return "😐";
  }
}

// Batch analysis for multiple texts
export function analyzeSentimentBatch(texts: string[]): SentimentResult[] {
  return texts.map(text => analyzeSentiment(text));
}

// Calculate sentiment statistics for a collection of feedback
export function calculateSentimentStats(feedbackItems: Array<{ sentiment: string; sentimentScore?: number }>) {
  const total = feedbackItems.length;
  if (total === 0) {
    return {
      total: 0,
      positive: 0,
      neutral: 0,
      negative: 0,
      positivePercentage: 0,
      neutralPercentage: 0,
      negativePercentage: 0,
      averageScore: 0
    };
  }

  const positive = feedbackItems.filter(item => item.sentiment === "positive").length;
  const neutral = feedbackItems.filter(item => item.sentiment === "neutral").length;
  const negative = feedbackItems.filter(item => item.sentiment === "negative").length;

  const averageScore = feedbackItems.reduce((sum, item) => {
    return sum + (item.sentimentScore || 0);
  }, 0) / total;

  return {
    total,
    positive,
    neutral,
    negative,
    positivePercentage: Math.round((positive / total) * 100),
    neutralPercentage: Math.round((neutral / total) * 100),
    negativePercentage: Math.round((negative / total) * 100),
    averageScore: Math.round(averageScore * 100) / 100
  };
}
