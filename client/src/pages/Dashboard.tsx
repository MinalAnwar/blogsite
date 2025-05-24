import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/Navigation";
import { MetricsCard } from "@/components/MetricsCard";
import { FeedbackCard } from "@/components/FeedbackCard";
import { SentimentChart } from "@/components/SentimentChart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  MessageSquare, 
  PenTool, 
  Bot, 
  Plus, 
  Search,
  TrendingUp,
  Users,
  FileText,
  Settings
} from "lucide-react";
import { Link } from "wouter";

export default function Dashboard() {
  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ["/api/dashboard/metrics"],
  });

  const { data: recentFeedback, isLoading: feedbackLoading } = useQuery({
    queryKey: ["/api/feedback", { limit: 5 }],
  });

  const { data: automationRules, isLoading: rulesLoading } = useQuery({
    queryKey: ["/api/automation-rules"],
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Navigation />
      
      <main className="ml-64 min-h-screen">
        {/* Header */}
        <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Monitor your feedback and content performance</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search feedback, content..."
                  className="w-80 pl-10"
                />
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <Link href="/feedback">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  New Collection
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8 space-y-8">
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metricsLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-8 w-16" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                      <Skeleton className="h-12 w-12 rounded-lg" />
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <>
                <MetricsCard
                  title="Total Feedback"
                  value={metrics?.totalFeedback?.toLocaleString() || "0"}
                  change="+12% from last month"
                  changeType="positive"
                  icon={MessageSquare}
                  iconColor="blue"
                />
                <MetricsCard
                  title="Positive Sentiment"
                  value={`${metrics?.positiveSentiment || 0}%`}
                  change="+5% improvement"
                  changeType="positive"
                  icon={TrendingUp}
                  iconColor="green"
                />
                <MetricsCard
                  title="Active Automations"
                  value={metrics?.activeAutomations?.toString() || "0"}
                  change="3 new this week"
                  changeType="neutral"
                  icon={Bot}
                  iconColor="purple"
                />
                <MetricsCard
                  title="Content Published"
                  value={metrics?.contentPublished?.toString() || "0"}
                  change={`${metrics?.draftPosts || 0} drafts pending`}
                  changeType="neutral"
                  icon={FileText}
                  iconColor="amber"
                />
              </>
            )}
          </div>

          {/* Quick Actions & Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Actions */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/feedback">
                    <Button variant="outline" className="w-full justify-start">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mr-3">
                        <Plus className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">Create Feedback Form</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Set up a new collection</div>
                      </div>
                    </Button>
                  </Link>

                  <Link href="/content">
                    <Button variant="outline" className="w-full justify-start">
                      <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mr-3">
                        <PenTool className="w-4 h-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">Write Blog Post</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Start creating content</div>
                      </div>
                    </Button>
                  </Link>

                  <Link href="/automation">
                    <Button variant="outline" className="w-full justify-start">
                      <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mr-3">
                        <Bot className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">Setup Automation</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Configure smart workflows</div>
                      </div>
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Recent Feedback */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Recent Feedback</CardTitle>
                    <Link href="/feedback">
                      <Button variant="link" className="text-blue-600 dark:text-blue-400">
                        View all
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  {feedbackLoading ? (
                    <div className="space-y-4">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50 dark:bg-slate-700/50">
                          <Skeleton className="w-2 h-2 rounded-full mt-2" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <div className="flex space-x-4">
                              <Skeleton className="h-3 w-20" />
                              <Skeleton className="h-3 w-16" />
                              <Skeleton className="h-3 w-16" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : recentFeedback?.length > 0 ? (
                    <div className="space-y-4">
                      {recentFeedback.map((feedback: any) => (
                        <FeedbackCard key={feedback.id} feedback={feedback} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400">No feedback collected yet</p>
                      <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                        Create your first feedback collection to get started
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sentiment Analysis Chart */}
          <SentimentChart />

          {/* Automation Rules Preview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Active Automation Rules</CardTitle>
                <Link href="/automation">
                  <Button variant="link" className="text-blue-600 dark:text-blue-400">
                    Manage Rules
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {rulesLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border border-gray-200 dark:border-slate-600 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Skeleton className="w-10 h-10 rounded-lg" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-40" />
                          <Skeleton className="h-3 w-60" />
                        </div>
                      </div>
                      <Skeleton className="h-6 w-16" />
                    </div>
                  ))}
                </div>
              ) : automationRules?.length > 0 ? (
                <div className="space-y-4">
                  {automationRules.slice(0, 3).map((rule: any) => (
                    <div key={rule.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-slate-600 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          rule.isActive 
                            ? "bg-green-100 dark:bg-green-900/20" 
                            : "bg-gray-100 dark:bg-gray-700"
                        }`}>
                          {rule.isActive ? (
                            <Bot className="w-5 h-5 text-green-600 dark:text-green-400" />
                          ) : (
                            <Settings className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{rule.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{rule.description}</p>
                        </div>
                      </div>
                      <span className={`text-sm font-medium ${
                        rule.isActive 
                          ? "text-green-600 dark:text-green-400" 
                          : "text-gray-500 dark:text-gray-400"
                      }`}>
                        {rule.isActive ? "Active" : "Paused"}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Bot className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">No automation rules configured</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                    Set up intelligent workflows to automate feedback processing
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
