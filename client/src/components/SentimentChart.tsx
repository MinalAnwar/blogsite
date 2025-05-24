import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3 } from "lucide-react";
import { useState } from "react";

export function SentimentChart() {
  const [timeRange, setTimeRange] = useState("7");

  const { data: feedback } = useQuery({
    queryKey: ["/api/feedback"],
  });

  // Process feedback data for chart visualization
  const processChartData = () => {
    if (!feedback) return { chartData: [], summary: { positive: 0, neutral: 0, negative: 0 } };

    const now = new Date();
    const daysAgo = parseInt(timeRange);
    const startDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

    const filteredFeedback = feedback.filter((item: any) => 
      new Date(item.createdAt) >= startDate
    );

    // Group by date
    const dateGroups: Record<string, { positive: number; neutral: number; negative: number }> = {};
    
    for (let i = 0; i < daysAgo; i++) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateKey = date.toISOString().split('T')[0];
      dateGroups[dateKey] = { positive: 0, neutral: 0, negative: 0 };
    }

    filteredFeedback.forEach((item: any) => {
      const dateKey = new Date(item.createdAt).toISOString().split('T')[0];
      if (dateGroups[dateKey]) {
        dateGroups[dateKey][item.sentiment as keyof typeof dateGroups[typeof dateKey]]++;
      }
    });

    const chartData = Object.entries(dateGroups)
      .map(([date, counts]) => ({
        date,
        ...counts,
      }))
      .reverse();

    const summary = filteredFeedback.reduce(
      (acc: any, item: any) => {
        acc[item.sentiment]++;
        return acc;
      },
      { positive: 0, neutral: 0, negative: 0 }
    );

    return { chartData, summary };
  };

  const { chartData, summary } = processChartData();

  const maxValue = Math.max(
    ...chartData.map(day => Math.max(day.positive, day.neutral, day.negative))
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Sentiment Analysis Over Time</CardTitle>
            <CardDescription>Track how sentiment changes across your feedback</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant={timeRange === "7" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange("7")}
            >
              7 days
            </Button>
            <Button
              variant={timeRange === "30" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange("30")}
            >
              30 days
            </Button>
            <Button
              variant={timeRange === "90" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange("90")}
            >
              90 days
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <div className="space-y-6">
            {/* Simple Bar Chart Visualization */}
            <div className="h-64 flex items-end justify-between space-x-1 border-b border-gray-200 dark:border-slate-700">
              {chartData.map((day, index) => {
                const total = day.positive + day.neutral + day.negative;
                const height = maxValue > 0 ? (total / maxValue) * 100 : 0;
                
                return (
                  <div key={day.date} className="flex-1 flex flex-col items-center space-y-1">
                    <div 
                      className="w-full max-w-8 bg-gradient-to-t from-blue-200 to-blue-500 dark:from-blue-800 dark:to-blue-600 rounded-t-sm relative"
                      style={{ height: `${height}%` }}
                      title={`${new Date(day.date).toLocaleDateString()}: ${total} feedback items`}
                    >
                      {/* Sentiment breakdown within the bar */}
                      {total > 0 && (
                        <div className="absolute inset-0 flex flex-col">
                          <div 
                            className="bg-green-500 dark:bg-green-400 rounded-t-sm"
                            style={{ height: `${(day.positive / total) * 100}%` }}
                          />
                          <div 
                            className="bg-amber-500 dark:bg-amber-400"
                            style={{ height: `${(day.neutral / total) * 100}%` }}
                          />
                          <div 
                            className="bg-red-500 dark:bg-red-400 rounded-b-sm"
                            style={{ height: `${(day.negative / total) * 100}%` }}
                          />
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 transform -rotate-45 origin-center whitespace-nowrap">
                      {new Date(day.date).getDate()}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Chart Legend */}
            <div className="flex items-center justify-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Positive ({summary.positive})
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Neutral ({summary.neutral})
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Negative ({summary.negative})
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-700 dark:to-slate-600 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">No feedback data available</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                Start collecting feedback to see sentiment trends
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
