import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  FileText, 
  ArrowUpRight,
  ArrowDownRight,
  Activity
} from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subValue?: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    label: string;
    positive?: boolean;
  };
  progress?: number;
  variant?: "default" | "success" | "warning" | "danger";
}

export function MetricCard({ 
  title, 
  value, 
  subValue, 
  icon, 
  trend,
  progress,
  variant = "default"
}: MetricCardProps) {
  const variantStyles = {
    default: "bg-card",
    success: "bg-green-500/5 border-green-500/20",
    warning: "bg-yellow-500/5 border-yellow-500/20",
    danger: "bg-red-500/5 border-red-500/20",
  };

  const iconStyles = {
    default: "bg-primary/10 text-primary",
    success: "bg-green-500/10 text-green-600",
    warning: "bg-yellow-500/10 text-yellow-600",
    danger: "bg-red-500/10 text-red-600",
  };

  return (
    <Card className={`${variantStyles[variant]} transition-all hover:shadow-md`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={`p-2 rounded-lg ${iconStyles[variant]}`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subValue && (
          <p className="text-xs text-muted-foreground mt-1">{subValue}</p>
        )}
        {trend && (
          <div className="flex items-center gap-1 mt-2">
            {trend.positive !== false ? (
              <ArrowUpRight className="w-4 h-4 text-green-500" />
            ) : (
              <ArrowDownRight className="w-4 h-4 text-red-500" />
            )}
            <span className={`text-sm font-medium ${
              trend.positive !== false ? "text-green-600" : "text-red-600"
            }`}>
              {trend.value}%
            </span>
            <span className="text-xs text-muted-foreground">{trend.label}</span>
          </div>
        )}
        {progress !== undefined && (
          <div className="mt-3">
            <Progress value={progress} className="h-1.5" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface StatsGridProps {
  userStats: {
    totalUsers: number;
    newUsersToday: number;
    newUsersThisWeek: number;
  };
  revenueStats: {
    totalRevenue: number;
    monthlyRecurring: number;
    conversionRate: number;
    averageOrderValue: number;
  };
  caseStats: {
    totalCases: number;
    activeCases: number;
    averageMeritScore: number;
  };
  engagementStats: {
    activeUsersToday: number;
    userRetentionRate: number;
    formCompletionRate: number;
  };
}

export function AdminStatsGrid({ 
  userStats, 
  revenueStats, 
  caseStats, 
  engagementStats 
}: StatsGridProps) {
  return (
    <div className="space-y-6">
      {/* Primary Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Users"
          value={userStats.totalUsers.toLocaleString()}
          subValue={`+${userStats.newUsersToday} today`}
          icon={<Users className="w-4 h-4" />}
          trend={{ 
            value: Math.round((userStats.newUsersThisWeek / Math.max(userStats.totalUsers, 1)) * 100), 
            label: "this week",
            positive: true
          }}
          variant="success"
        />
        
        <MetricCard
          title="Total Revenue"
          value={`$${revenueStats.totalRevenue.toFixed(2)}`}
          subValue={`$${revenueStats.monthlyRecurring.toFixed(2)} MRR`}
          icon={<DollarSign className="w-4 h-4" />}
          variant={revenueStats.totalRevenue > 0 ? "success" : "default"}
        />
        
        <MetricCard
          title="Conversion Rate"
          value={`${revenueStats.conversionRate}%`}
          subValue={`AOV: $${revenueStats.averageOrderValue.toFixed(2)}`}
          icon={<TrendingUp className="w-4 h-4" />}
          progress={revenueStats.conversionRate}
          variant={revenueStats.conversionRate >= 5 ? "success" : revenueStats.conversionRate >= 2 ? "warning" : "danger"}
        />
        
        <MetricCard
          title="Active Today"
          value={engagementStats.activeUsersToday}
          subValue={`${engagementStats.userRetentionRate}% retention`}
          icon={<Activity className="w-4 h-4" />}
          progress={engagementStats.userRetentionRate}
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Cases"
          value={caseStats.totalCases}
          subValue={`${caseStats.activeCases} active`}
          icon={<FileText className="w-4 h-4" />}
        />
        
        <MetricCard
          title="Avg Merit Score"
          value={`${caseStats.averageMeritScore}/100`}
          subValue="Quality indicator"
          icon={<TrendingUp className="w-4 h-4" />}
          progress={caseStats.averageMeritScore}
          variant={caseStats.averageMeritScore >= 70 ? "success" : caseStats.averageMeritScore >= 50 ? "warning" : "danger"}
        />
        
        <MetricCard
          title="Form Completion"
          value={`${engagementStats.formCompletionRate}%`}
          subValue="Success rate"
          icon={<FileText className="w-4 h-4" />}
          progress={engagementStats.formCompletionRate}
          variant={engagementStats.formCompletionRate >= 80 ? "success" : engagementStats.formCompletionRate >= 50 ? "warning" : "danger"}
        />
        
        <MetricCard
          title="New This Week"
          value={userStats.newUsersThisWeek}
          subValue="User registrations"
          icon={<Users className="w-4 h-4" />}
          trend={{
            value: userStats.newUsersToday,
            label: "today",
            positive: userStats.newUsersToday > 0
          }}
        />
      </div>
    </div>
  );
}
