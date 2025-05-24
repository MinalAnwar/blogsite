import { Badge } from "@/components/ui/badge";

interface FeedbackCardProps {
  feedback: {
    id: number;
    content: string;
    source: string;
    sentiment: string;
    createdAt: string;
  };
}

export function FeedbackCard({ feedback }: FeedbackCardProps) {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-green-500";
      case "negative":
        return "bg-red-500";
      default:
        return "bg-amber-500";
    }
  };

  const getSentimentBadgeColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "negative":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400";
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} hours ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} days ago`;
    }
  };

  return (
    <div className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50 dark:bg-slate-700/50 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
      <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${getSentimentColor(feedback.sentiment)}`}></div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900 dark:text-white mb-2 leading-relaxed">{feedback.content}</p>
        <div className="flex items-center space-x-4">
          <span className="text-xs text-gray-500 dark:text-gray-400">{feedback.source}</span>
          <Badge variant="secondary" className={getSentimentBadgeColor(feedback.sentiment)}>
            {feedback.sentiment}
          </Badge>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatTimeAgo(feedback.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
}
