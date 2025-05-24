import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface MetricsCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconColor: "blue" | "green" | "purple" | "amber" | "red";
}

export function MetricsCard({ 
  title, 
  value, 
  change, 
  changeType, 
  icon: Icon, 
  iconColor 
}: MetricsCardProps) {
  const getIconColorClasses = (color: string) => {
    switch (color) {
      case "blue":
        return "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400";
      case "green":
        return "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400";
      case "purple":
        return "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400";
      case "amber":
        return "bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400";
      case "red":
        return "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400";
    }
  };

  const getChangeColorClasses = (type: string) => {
    switch (type) {
      case "positive":
        return "text-green-600 dark:text-green-400";
      case "negative":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  const getTrendIcon = () => {
    if (changeType === "positive") {
      return <TrendingUp className="w-3 h-3 mr-1" />;
    } else if (changeType === "negative") {
      return <TrendingDown className="w-3 h-3 mr-1" />;
    }
    return null;
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
            <p className={`text-sm mt-1 flex items-center ${getChangeColorClasses(changeType)}`}>
              {getTrendIcon()}
              {change}
            </p>
          </div>
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getIconColorClasses(iconColor)}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
