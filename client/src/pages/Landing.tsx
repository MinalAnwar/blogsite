import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, MessageSquare, Bot, PenTool, TrendingUp, Zap } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Navigation */}
      <nav className="p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">FeedbackFlow</span>
          </div>
          <Button onClick={handleLogin} className="bg-blue-600 hover:bg-blue-700 text-white">
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Automate Your
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {" "}Customer Feedback{" "}
            </span>
            Collection
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            No coding or technical skills required. Collect, analyze, and organize customer feedback by sentiment 
            to improve your content strategy and grow your audience.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Button size="lg" onClick={handleLogin} className="bg-blue-600 hover:bg-blue-700 text-white">
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline">
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white dark:bg-slate-800">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle>Smart Feedback Collection</CardTitle>
              <CardDescription>
                Create beautiful feedback forms and surveys that integrate with your existing content platforms.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white dark:bg-slate-800">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle>Sentiment Analysis</CardTitle>
              <CardDescription>
                Automatically categorize feedback as positive, neutral, or negative using advanced AI algorithms.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white dark:bg-slate-800">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mb-4">
                <Bot className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle>Automation Rules</CardTitle>
              <CardDescription>
                Set up intelligent workflows that automatically process and organize feedback without manual work.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white dark:bg-slate-800">
            <CardHeader>
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/20 rounded-lg flex items-center justify-center mb-4">
                <PenTool className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <CardTitle>Content Creation Hub</CardTitle>
              <CardDescription>
                Use feedback insights to create better content with our built-in rich text editor and publishing tools.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white dark:bg-slate-800">
            <CardHeader>
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <CardTitle>Analytics Dashboard</CardTitle>
              <CardDescription>
                Get detailed insights into feedback trends, sentiment patterns, and content performance metrics.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white dark:bg-slate-800">
            <CardHeader>
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <CardTitle>No Technical Skills Required</CardTitle>
              <CardDescription>
                Simple drag-and-drop interface makes it easy for anyone to set up powerful feedback automation.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Feedback Process?</h2>
          <p className="text-blue-100 mb-8 text-lg">
            Join thousands of content creators who are already using FeedbackFlow to grow their audience.
          </p>
          <Button size="lg" onClick={handleLogin} className="bg-white text-blue-600 hover:bg-gray-100">
            Get Started for Free
          </Button>
        </div>
      </div>
    </div>
  );
}
