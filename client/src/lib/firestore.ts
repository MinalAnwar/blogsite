import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  getDoc,
  Timestamp 
} from "firebase/firestore";
import { db } from "../../../firebase";
import { analyzeSentiment } from "./sentiment";

export interface BlogPost {
  id?: string;
  userId: string;
  title: string;
  content: string;
  excerpt?: string;
  slug: string;
  status: "draft" | "published";
  category?: string;
  tags?: string[];
  metaTitle?: string;
  metaDescription?: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export interface Feedback {
  id?: string;
  userId: string;
  content: string;
  source: string;
  sentiment: "positive" | "neutral" | "negative";
  sentimentScore: number;
  createdAt: Date;
}

export interface AutomationRule {
  id?: string;
  userId: string;
  name: string;
  trigger: string;
  action: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Blog Posts
export const createPost = async (post: Omit<BlogPost, "id" | "createdAt" | "updatedAt">) => {
  const now = new Date();
  const docRef = await addDoc(collection(db, "posts"), {
    ...post,
    createdAt: Timestamp.fromDate(now),
    updatedAt: Timestamp.fromDate(now),
    publishedAt: post.status === "published" ? Timestamp.fromDate(now) : null,
  });
  return { id: docRef.id, ...post, createdAt: now, updatedAt: now };
};

export const getPostsByUser = async (userId: string) => {
  const q = query(
    collection(db, "posts"),
    where("userId", "==", userId),
    orderBy("updatedAt", "desc")
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
    updatedAt: doc.data().updatedAt?.toDate(),
    publishedAt: doc.data().publishedAt?.toDate(),
  })) as BlogPost[];
};

export const getPublishedPosts = async () => {
  const q = query(
    collection(db, "posts"),
    where("status", "==", "published"),
    orderBy("publishedAt", "desc")
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
    updatedAt: doc.data().updatedAt?.toDate(),
    publishedAt: doc.data().publishedAt?.toDate(),
  })) as BlogPost[];
};

export const updatePost = async (id: string, updates: Partial<BlogPost>) => {
  const postRef = doc(db, "posts", id);
  const updateData = {
    ...updates,
    updatedAt: Timestamp.fromDate(new Date()),
  };
  
  if (updates.status === "published" && !updates.publishedAt) {
    updateData.publishedAt = Timestamp.fromDate(new Date());
  }
  
  await updateDoc(postRef, updateData);
  return { id, ...updates };
};

export const deletePost = async (id: string) => {
  await deleteDoc(doc(db, "posts", id));
};

export const getPost = async (id: string) => {
  const docRef = doc(db, "posts", id);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return {
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: docSnap.data().createdAt?.toDate(),
      updatedAt: docSnap.data().updatedAt?.toDate(),
      publishedAt: docSnap.data().publishedAt?.toDate(),
    } as BlogPost;
  }
  return null;
};

// Feedback
export const createFeedback = async (feedbackData: Omit<Feedback, "id" | "createdAt" | "sentiment" | "sentimentScore">) => {
  const sentiment = analyzeSentiment(feedbackData.content);
  const feedback = {
    ...feedbackData,
    sentiment: sentiment.sentiment,
    sentimentScore: sentiment.score,
    createdAt: Timestamp.fromDate(new Date()),
  };
  
  const docRef = await addDoc(collection(db, "feedback"), feedback);
  return { id: docRef.id, ...feedback, createdAt: new Date() };
};

export const getFeedbackByUser = async (userId: string) => {
  const q = query(
    collection(db, "feedback"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
    limit(50)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
  })) as Feedback[];
};

// Automation Rules
export const createAutomationRule = async (rule: Omit<AutomationRule, "id" | "createdAt" | "updatedAt">) => {
  const now = new Date();
  const docRef = await addDoc(collection(db, "automationRules"), {
    ...rule,
    createdAt: Timestamp.fromDate(now),
    updatedAt: Timestamp.fromDate(now),
  });
  return { id: docRef.id, ...rule, createdAt: now, updatedAt: now };
};

export const getAutomationRulesByUser = async (userId: string) => {
  const q = query(
    collection(db, "automationRules"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
    updatedAt: doc.data().updatedAt?.toDate(),
  })) as AutomationRule[];
};

export const updateAutomationRule = async (id: string, updates: Partial<AutomationRule>) => {
  const ruleRef = doc(db, "automationRules", id);
  await updateDoc(ruleRef, {
    ...updates,
    updatedAt: Timestamp.fromDate(new Date()),
  });
  return { id, ...updates };
};

export const deleteAutomationRule = async (id: string) => {
  await deleteDoc(doc(db, "automationRules", id));
};