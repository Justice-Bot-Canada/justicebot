import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  TrendingUp, 
  TrendingDown,
  Users,
  FileText,
  DollarSign,
  Clock
} from "lucide-react";

interface QuickStat {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: "up" | "down";
}

interface QuickStatsCardProps {
  title: string;
  description: string;
  stats: QuickStat[];
}

export function QuickStatsCard({ title, description, stats }: QuickStatsCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription className="text-xs">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {stats.map((stat, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="text-muted-foreground">{stat.icon}</div>
              <span className="text-sm">{stat.label}</span>
            </div>
            <div className="flex items-center gap-1">
              <Badge variant={stat.trend === "up" ? "default" : stat.trend === "down" ? "destructive" : "secondary"}>
                {stat.value}
              </Badge>
              {stat.trend && (
                stat.trend === "up" ? (
                  <TrendingUp className="w-3 h-3 text-green-500" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-red-500" />
                )
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

interface RecentActivityItem {
  id: string;
  type: "user" | "case" | "payment" | "form";
  message: string;
  timestamp: string;
}

interface RecentActivityProps {
  activities: RecentActivityItem[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  const getIcon = (type: RecentActivityItem["type"]) => {
    switch (type) {
      case "user": return <Users className="w-4 h-4 text-blue-500" />;
      case "case": return <FileText className="w-4 h-4 text-purple-500" />;
      case "payment": return <DollarSign className="w-4 h-4 text-green-500" />;
      case "form": return <FileText className="w-4 h-4 text-orange-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[200px]">
          <div className="divide-y">
            {activities.length > 0 ? (
              activities.map((activity) => (
                <div key={activity.id} className="flex items-center gap-3 p-3">
                  {getIcon(activity.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-muted-foreground text-sm">
                No recent activity
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

interface SystemHealthProps {
  apiStatus: "healthy" | "degraded" | "down";
  databaseStatus: "healthy" | "degraded" | "down";
  emailStatus: "healthy" | "degraded" | "down";
  paymentStatus: "healthy" | "degraded" | "down";
}

export function SystemHealth({ apiStatus, databaseStatus, emailStatus, paymentStatus }: SystemHealthProps) {
  const getStatusColor = (status: "healthy" | "degraded" | "down") => {
    switch (status) {
      case "healthy": return "bg-green-500";
      case "degraded": return "bg-yellow-500";
      case "down": return "bg-red-500";
    }
  };

  const getStatusText = (status: "healthy" | "degraded" | "down") => {
    switch (status) {
      case "healthy": return "Operational";
      case "degraded": return "Degraded";
      case "down": return "Down";
    }
  };

  const systems = [
    { name: "API", status: apiStatus },
    { name: "Database", status: databaseStatus },
    { name: "Email", status: emailStatus },
    { name: "Payments", status: paymentStatus },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">System Health</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3">
        {systems.map((system) => (
          <div key={system.name} className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${getStatusColor(system.status)}`} />
            <span className="text-sm">{system.name}</span>
            <span className="text-xs text-muted-foreground ml-auto">
              {getStatusText(system.status)}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
