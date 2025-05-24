import {
  users,
  feedback,
  posts,
  automationRules,
  feedbackCollections,
  type User,
  type UpsertUser,
  type Feedback,
  type InsertFeedback,
  type Post,
  type InsertPost,
  type AutomationRule,
  type InsertAutomationRule,
  type FeedbackCollection,
  type InsertFeedbackCollection,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql, count, avg } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Feedback operations
  createFeedback(feedback: InsertFeedback): Promise<Feedback>;
  getFeedbackByUserId(userId: string, limit?: number): Promise<Feedback[]>;
  getFeedbackStats(userId: string): Promise<{
    total: number;
    positive: number;
    neutral: number;
    negative: number;
    averageScore: number;
  }>;

  // Post operations
  createPost(post: InsertPost): Promise<Post>;
  getPostsByUserId(userId: string): Promise<Post[]>;
  getPostById(id: number): Promise<Post | undefined>;
  updatePost(id: number, post: Partial<InsertPost>): Promise<Post>;
  deletePost(id: number): Promise<void>;
  getPublishedPosts(): Promise<Post[]>;

  // Automation rule operations
  createAutomationRule(rule: InsertAutomationRule): Promise<AutomationRule>;
  getAutomationRulesByUserId(userId: string): Promise<AutomationRule[]>;
  updateAutomationRule(id: number, rule: Partial<InsertAutomationRule>): Promise<AutomationRule>;
  deleteAutomationRule(id: number): Promise<void>;

  // Feedback collection operations
  createFeedbackCollection(collection: InsertFeedbackCollection): Promise<FeedbackCollection>;
  getFeedbackCollectionsByUserId(userId: string): Promise<FeedbackCollection[]>;
  getFeedbackCollectionById(id: number): Promise<FeedbackCollection | undefined>;
  updateFeedbackCollection(id: number, collection: Partial<InsertFeedbackCollection>): Promise<FeedbackCollection>;
  deleteFeedbackCollection(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Feedback operations
  async createFeedback(feedbackData: InsertFeedback): Promise<Feedback> {
    const [newFeedback] = await db
      .insert(feedback)
      .values(feedbackData)
      .returning();
    return newFeedback;
  }

  async getFeedbackByUserId(userId: string, limit = 50): Promise<Feedback[]> {
    return await db
      .select()
      .from(feedback)
      .where(eq(feedback.userId, userId))
      .orderBy(desc(feedback.createdAt))
      .limit(limit);
  }

  async getFeedbackStats(userId: string) {
    const stats = await db
      .select({
        total: count(),
        positive: sql<number>`SUM(CASE WHEN sentiment = 'positive' THEN 1 ELSE 0 END)`,
        neutral: sql<number>`SUM(CASE WHEN sentiment = 'neutral' THEN 1 ELSE 0 END)`,
        negative: sql<number>`SUM(CASE WHEN sentiment = 'negative' THEN 1 ELSE 0 END)`,
        averageScore: avg(feedback.sentimentScore),
      })
      .from(feedback)
      .where(eq(feedback.userId, userId));

    return {
      total: stats[0]?.total || 0,
      positive: Number(stats[0]?.positive) || 0,
      neutral: Number(stats[0]?.neutral) || 0,
      negative: Number(stats[0]?.negative) || 0,
      averageScore: Number(stats[0]?.averageScore) || 0,
    };
  }

  // Post operations
  async createPost(postData: InsertPost): Promise<Post> {
    const [newPost] = await db
      .insert(posts)
      .values(postData)
      .returning();
    return newPost;
  }

  async getPostsByUserId(userId: string): Promise<Post[]> {
    return await db
      .select()
      .from(posts)
      .where(eq(posts.userId, userId))
      .orderBy(desc(posts.updatedAt));
  }

  async getPostById(id: number): Promise<Post | undefined> {
    const [post] = await db
      .select()
      .from(posts)
      .where(eq(posts.id, id));
    return post;
  }

  async updatePost(id: number, postData: Partial<InsertPost>): Promise<Post> {
    const [updatedPost] = await db
      .update(posts)
      .set({ ...postData, updatedAt: new Date() })
      .where(eq(posts.id, id))
      .returning();
    return updatedPost;
  }

  async deletePost(id: number): Promise<void> {
    await db.delete(posts).where(eq(posts.id, id));
  }

  async getPublishedPosts(): Promise<Post[]> {
    return await db
      .select()
      .from(posts)
      .where(eq(posts.status, "published"))
      .orderBy(desc(posts.publishedAt));
  }

  // Automation rule operations
  async createAutomationRule(ruleData: InsertAutomationRule): Promise<AutomationRule> {
    const [newRule] = await db
      .insert(automationRules)
      .values(ruleData)
      .returning();
    return newRule;
  }

  async getAutomationRulesByUserId(userId: string): Promise<AutomationRule[]> {
    return await db
      .select()
      .from(automationRules)
      .where(eq(automationRules.userId, userId))
      .orderBy(desc(automationRules.createdAt));
  }

  async updateAutomationRule(id: number, ruleData: Partial<InsertAutomationRule>): Promise<AutomationRule> {
    const [updatedRule] = await db
      .update(automationRules)
      .set({ ...ruleData, updatedAt: new Date() })
      .where(eq(automationRules.id, id))
      .returning();
    return updatedRule;
  }

  async deleteAutomationRule(id: number): Promise<void> {
    await db.delete(automationRules).where(eq(automationRules.id, id));
  }

  // Feedback collection operations
  async createFeedbackCollection(collectionData: InsertFeedbackCollection): Promise<FeedbackCollection> {
    const [newCollection] = await db
      .insert(feedbackCollections)
      .values(collectionData)
      .returning();
    return newCollection;
  }

  async getFeedbackCollectionsByUserId(userId: string): Promise<FeedbackCollection[]> {
    return await db
      .select()
      .from(feedbackCollections)
      .where(eq(feedbackCollections.userId, userId))
      .orderBy(desc(feedbackCollections.createdAt));
  }

  async getFeedbackCollectionById(id: number): Promise<FeedbackCollection | undefined> {
    const [collection] = await db
      .select()
      .from(feedbackCollections)
      .where(eq(feedbackCollections.id, id));
    return collection;
  }

  async updateFeedbackCollection(id: number, collectionData: Partial<InsertFeedbackCollection>): Promise<FeedbackCollection> {
    const [updatedCollection] = await db
      .update(feedbackCollections)
      .set({ ...collectionData, updatedAt: new Date() })
      .where(eq(feedbackCollections.id, id))
      .returning();
    return updatedCollection;
  }

  async deleteFeedbackCollection(id: number): Promise<void> {
    await db.delete(feedbackCollections).where(eq(feedbackCollections.id, id));
  }
}

export const storage = new DatabaseStorage();
