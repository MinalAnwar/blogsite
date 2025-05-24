import { Navigation } from "@/components/Navigation";
import { SentimentChart } from "@/components/SentimentChart";
import { MetricsCard } from "@/components/MetricsCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  MessageSquare,
  Calendar,
  Download,
  Filter,
  Eye,
  ThumbsUp,
  MessageCircle
} from "lucide-react";

export default function Analytics() {
  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ["/api/dashboard/metrics"],
  });

  const { data: feedback } = useQuery({
    queryKey: ["/api/feedback"],
  });

  // Mock analytics data - in a real app, this would come from your API
  const analyticsData = {
    totalViews: 15284,
    totalEngagement: 3847,
    averageEngagement: 25.2,
    topPosts: [
      { title: "How to Automate Customer Feedback Collection", views: 2150, engagement: 89 },
      { title: "Building Better Content with Sentiment Analysis", views: 1890, engagement: 76 },
      { title: "The Future of Content Creation Automation", views: 1650, engagement: 63 },
    ],
    engagementTrends: [
      { date: "2024-01-01", positive: 85, neutral: 45, negative: 12 },
      { date: "2024-01-02", positive: 92, neutral: 38, negative: 8 },
      { date: "2024-01-03", positive: 78, neutral: 52, negative: 15 },
      { date: "2024-01-04", positive: 95, neutral: 41, negative: 6 },
      { date: "2024-01-05", positive: 88, neutral: 47, negative: 11 },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Navigation />
      
      <main className="ml-64 min-h-screen">
        {/* Header */}
        <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sentiment Analytics</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Analyze feedback patterns and content performance</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                Last 30 days
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8 space-y-8">
          {/* Overview Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricsCard
              title="Total Feedback"
              value={metrics?.totalFeedback?.toLocaleString() || "0"}
              change="+12% from last month"
              changeType="positive"
              icon={MessageSquare}
              iconColor="blue"
            />
            <MetricsCard
              title="Content Views"
              value={analyticsData.totalViews.toLocaleString()}
              change="+18% from last month"
              changeType="positive"
              icon={Eye}
              iconColor="green"
            />
            <MetricsCard
              title="Avg. Engagement"
              value={`${analyticsData.averageEngagement}%`}
              change="+3.2% from last month"
              changeType="positive"
              icon={ThumbsUp}
              iconColor="purple"
            />
            <MetricsCard
              title="Positive Sentiment"
              value={`${metrics?.positiveSentiment || 0}%`}
              change="+5% improvement"
              changeType="positive"
              icon={TrendingUp}
              iconColor="amber"
            />
          </div>

          <Tabs defaultValue="sentiment" className="space-y-6">
            <TabsList>
              <TabsTrigger value="sentiment">Sentiment Analysis</TabsTrigger>
              <TabsTrigger value="content">Content Performance</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
              <TabsTrigger value="sources">Feedback Sources</TabsTrigger>
            </TabsList>

            <TabsContent value="sentiment" className="space-y-6">
              {/* Sentiment Chart */}
              <SentimentChart />

              {/* Sentiment Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      Positive Feedback
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {metrics?.feedbackStats?.positive || 0}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {metrics?.feedbackStats?.total > 0 
                        ? Math.round((metrics.feedbackStats.positive / metrics.feedbackStats.total) * 100)
                        : 0
                      }% of total feedback
                    </p>
                    <div className="mt-4">
                      <div className="flex items-center text-green-600 dark:text-green-400 text-sm">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        +5% from last week
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center">
                      <div className="w-3 h-3 bg-amber-500 rounded-full mr-2"></div>
                      Neutral Feedback
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {metrics?.feedbackStats?.neutral || 0}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {metrics?.feedbackStats?.total > 0 
                        ? Math.round((metrics.feedbackStats.neutral / metrics.feedbackStats.total) * 100)
                        : 0
                      }% of total feedback
                    </p>
                    <div className="mt-4">
                      <div className="flex items-center text-amber-600 dark:text-amber-400 text-sm">
                        <TrendingDown className="w-4 h-4 mr-1" />
                        -2% from last week
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                      Negative Feedback
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {metrics?.feedbackStats?.negative || 0}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {metrics?.feedbackStats?.total > 0 
                        ? Math.round((metrics.feedbackStats.negative / metrics.feedbackStats.total) * 100)
                        : 0
                      }% of total feedback
                    </p>
                    <div className="mt-4">
                      <div className="flex items-center text-red-600 dark:text-red-400 text-sm">
                        <TrendingDown className="w-4 h-4 mr-1" />
                        -3% from last week
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="content" className="space-y-6">
              {/* Top Performing Content */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Content</CardTitle>
                  <CardDescription>Your most viewed and engaged content this month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.topPosts.map((post, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border border-gray-200 dark:border-slate-600 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-white">{post.title}</h4>
                          <div className="flex items-center space-x-4 mt-2">
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                              <Eye className="w-4 h-4 mr-1" />
                              {post.views.toLocaleString()} views
                            </div>
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                              <MessageCircle className="w-4 h-4 mr-1" />
                              {post.engagement} engagements
                            </div>
                          </div>
                        </div>
                        <Badge variant="secondary" className="ml-4">
                          #{index + 1}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Content Performance Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Content Performance Over Time</CardTitle>
                  <CardDescription>Views and engagement metrics for your published content</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-700 dark:to-slate-600 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400">Content performance chart</p>
                      <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Showing views and engagement over time</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="trends" className="space-y-6">
              {/* Trending Topics */}
              <Card>
                <CardHeader>
                  <CardTitle>Trending Feedback Topics</CardTitle>
                  <CardDescription>Most discussed topics in your feedback</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {["UI/UX Design", "Content Quality", "Feature Requests", "Bug Reports", "Performance", "Documentation", "Mobile Experience", "Accessibility"].map((topic, index) => (
                      <div key={topic} className="p-4 border border-gray-200 dark:border-slate-600 rounded-lg text-center">
                        <div className="text-lg font-semibold text-gray-900 dark:text-white">{topic}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {Math.floor(Math.random() * 50) + 10} mentions
                        </div>
                        <Badge 
                          variant="secondary" 
                          className={`mt-2 ${index % 3 === 0 ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' : 
                            index % 3 === 1 ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                            'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'}`}
                        >
                          {index % 3 === 0 ? 'Rising' : index % 3 === 1 ? 'Stable' : 'Hot'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Engagement Trends */}
              <Card>
                <CardHeader>
                  <CardTitle>Engagement Trends</CardTitle>
                  <CardDescription>How your audience engagement has changed over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gradient-to-br from-green-50 to-blue-50 dark:from-slate-700 dark:to-slate-600 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <TrendingUp className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400">Engagement trends chart</p>
                      <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Showing audience engagement patterns</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sources" className="space-y-6">
              {/* Feedback Sources */}
              <Card>
                <CardHeader>
                  <CardTitle>Feedback Sources</CardTitle>
                  <CardDescription>Where your feedback is coming from</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      {[
                        { source: "YouTube Comments", count: 45, percentage: 32 },
                        { source: "Email Feedback", count: 38, percentage: 27 },
                        { source: "Twitter/X", count: 28, percentage: 20 },
                        { source: "Direct Messages", count: 15, percentage: 11 },
                        { source: "Survey Forms", count: 14, percentage: 10 },
                      ].map((item) => (
                        <div key={item.source} className="flex items-center justify-between p-3 border border-gray-200 dark:border-slate-600 rounded-lg">
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">{item.source}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">{item.count} feedback items</div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-gray-900 dark:text-white">{item.percentage}%</div>
                            <div className="w-16 h-2 bg-gray-200 dark:bg-slate-700 rounded-full mt-1">
                              <div 
                                className="h-full bg-blue-500 rounded-full" 
                                style={{ width: `${item.percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-700 dark:to-slate-600 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <BarChart3 className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-400">Sources distribution chart</p>
                        <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Visual breakdown of feedback sources</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
