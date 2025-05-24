import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertFeedbackSchema, insertPostSchema, insertAutomationRuleSchema, insertFeedbackCollectionSchema } from "@shared/schema";
import { analyzeSentiment } from "../client/src/lib/sentiment";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Dashboard metrics
  app.get('/api/dashboard/metrics', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      const feedbackStats = await storage.getFeedbackStats(userId);
      const posts = await storage.getPostsByUserId(userId);
      const automationRules = await storage.getAutomationRulesByUserId(userId);
      
      const publishedPosts = posts.filter(post => post.status === 'published').length;
      const draftPosts = posts.filter(post => post.status === 'draft').length;
      const activeRules = automationRules.filter(rule => rule.isActive).length;

      res.json({
        totalFeedback: feedbackStats.total,
        positiveSentiment: feedbackStats.total > 0 ? Math.round((feedbackStats.positive / feedbackStats.total) * 100) : 0,
        activeAutomations: activeRules,
        contentPublished: publishedPosts,
        draftPosts,
        feedbackStats
      });
    } catch (error) {
      console.error("Error fetching dashboard metrics:", error);
      res.status(500).json({ message: "Failed to fetch dashboard metrics" });
    }
  });

  // Feedback routes
  app.post('/api/feedback', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const feedbackData = insertFeedbackSchema.parse({
        ...req.body,
        userId,
      });

      // Analyze sentiment
      const sentimentResult = analyzeSentiment(feedbackData.content);
      feedbackData.sentiment = sentimentResult.sentiment;
      feedbackData.sentimentScore = sentimentResult.score;

      const feedback = await storage.createFeedback(feedbackData);
      res.json(feedback);
    } catch (error) {
      console.error("Error creating feedback:", error);
      res.status(400).json({ message: "Failed to create feedback" });
    }
  });

  app.get('/api/feedback', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const feedback = await storage.getFeedbackByUserId(userId, limit);
      res.json(feedback);
    } catch (error) {
      console.error("Error fetching feedback:", error);
      res.status(500).json({ message: "Failed to fetch feedback" });
    }
  });

  // Posts routes
  app.get('/api/posts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const posts = await storage.getPostsByUserId(userId);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });

  app.post('/api/posts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const postData = insertPostSchema.parse({
        ...req.body,
        userId,
        slug: req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      });

      const post = await storage.createPost(postData);
      res.json(post);
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(400).json({ message: "Failed to create post" });
    }
  });

  app.get('/api/posts/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const post = await storage.getPostById(id);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.json(post);
    } catch (error) {
      console.error("Error fetching post:", error);
      res.status(500).json({ message: "Failed to fetch post" });
    }
  });

  app.put('/api/posts/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const postData = req.body;
      
      if (postData.status === 'published' && !postData.publishedAt) {
        postData.publishedAt = new Date();
      }

      const post = await storage.updatePost(id, postData);
      res.json(post);
    } catch (error) {
      console.error("Error updating post:", error);
      res.status(400).json({ message: "Failed to update post" });
    }
  });

  app.delete('/api/posts/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deletePost(id);
      res.json({ message: "Post deleted successfully" });
    } catch (error) {
      console.error("Error deleting post:", error);
      res.status(500).json({ message: "Failed to delete post" });
    }
  });

  // Public blog routes
  app.get('/api/blog/posts', async (req, res) => {
    try {
      const posts = await storage.getPublishedPosts();
      res.json(posts);
    } catch (error) {
      console.error("Error fetching published posts:", error);
      res.status(500).json({ message: "Failed to fetch published posts" });
    }
  });

  // Automation rules routes
  app.get('/api/automation-rules', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const rules = await storage.getAutomationRulesByUserId(userId);
      res.json(rules);
    } catch (error) {
      console.error("Error fetching automation rules:", error);
      res.status(500).json({ message: "Failed to fetch automation rules" });
    }
  });

  app.post('/api/automation-rules', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const ruleData = insertAutomationRuleSchema.parse({
        ...req.body,
        userId,
      });

      const rule = await storage.createAutomationRule(ruleData);
      res.json(rule);
    } catch (error) {
      console.error("Error creating automation rule:", error);
      res.status(400).json({ message: "Failed to create automation rule" });
    }
  });

  app.put('/api/automation-rules/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const ruleData = req.body;
      const rule = await storage.updateAutomationRule(id, ruleData);
      res.json(rule);
    } catch (error) {
      console.error("Error updating automation rule:", error);
      res.status(400).json({ message: "Failed to update automation rule" });
    }
  });

  app.delete('/api/automation-rules/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteAutomationRule(id);
      res.json({ message: "Automation rule deleted successfully" });
    } catch (error) {
      console.error("Error deleting automation rule:", error);
      res.status(500).json({ message: "Failed to delete automation rule" });
    }
  });

  // Feedback collections routes
  app.get('/api/feedback-collections', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const collections = await storage.getFeedbackCollectionsByUserId(userId);
      res.json(collections);
    } catch (error) {
      console.error("Error fetching feedback collections:", error);
      res.status(500).json({ message: "Failed to fetch feedback collections" });
    }
  });

  app.post('/api/feedback-collections', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const collectionData = insertFeedbackCollectionSchema.parse({
        ...req.body,
        userId,
      });

      const collection = await storage.createFeedbackCollection(collectionData);
      res.json(collection);
    } catch (error) {
      console.error("Error creating feedback collection:", error);
      res.status(400).json({ message: "Failed to create feedback collection" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
