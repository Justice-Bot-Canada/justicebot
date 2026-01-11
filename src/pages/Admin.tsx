import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/lib/toast-stub";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Users,
  FileText,
  TrendingUp,
  DollarSign,
  Search,
  Download,
  Eye,
  Shield,
  BarChart3,
  Calendar,
  AlertCircle,
  UserPlus,
  UserMinus,
  Activity,
  CheckCircle,
  XCircle,
  MoreVertical,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Zap
} from "lucide-react";

interface UserStats {
  totalUsers: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
}

interface CaseStats {
  totalCases: number;
  activeCases: number;
  completedCases: number;
  averageMeritScore: number;
}

interface RevenueStats {
  totalRevenue: number;
  monthlyRecurring: number;
  averageOrderValue: number;
  conversionRate: number;
}

interface EngagementStats {
  activeUsersToday: number;
  averageSessionTime: number;
  formCompletionRate: number;
  userRetentionRate: number;
}

interface User {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string;
  email_confirmed_at: string;
  display_name?: string;
  cases_count?: number;
}

interface AdminUser {
  user_id: string;
  email: string;
  granted_by: string | null;
  granted_at: string;
  revoked_at: string | null;
  notes: string | null;
  is_active: boolean;
}

interface Case {
  id: string;
  title: string;
  status: string;
  merit_score: number;
  created_at: string;
  user_id: string;
  province: string;
}

const Admin = () => {
  const { user } = useAuth();
  const { isAdmin, loading: roleLoading } = useRole();
  const [userStats, setUserStats] = useState<UserStats>({
    totalUsers: 0,
    newUsersToday: 0,
    newUsersThisWeek: 0,
    newUsersThisMonth: 0
  });
  const [caseStats, setCaseStats] = useState<CaseStats>({
    totalCases: 0,
    activeCases: 0,
    completedCases: 0,
    averageMeritScore: 0
  });
  const [revenueStats, setRevenueStats] = useState<RevenueStats>({
    totalRevenue: 0,
    monthlyRecurring: 0,
    averageOrderValue: 0,
    conversionRate: 0
  });
  const [engagementStats, setEngagementStats] = useState<EngagementStats>({
    activeUsersToday: 0,
    averageSessionTime: 0,
    formCompletionRate: 0,
    userRetentionRate: 0
  });
  const [users, setUsers] = useState<User[]>([]);
  const [cases, setCases] = useState<Case[]>([]);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [lastFetch, setLastFetch] = useState<number>(0);
  const RATE_LIMIT_MS = 5000; // 5 seconds between fetches
  
  // Role management state
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showGrantDialog, setShowGrantDialog] = useState(false);
  const [showRevokeDialog, setShowRevokeDialog] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [revokeReason, setRevokeReason] = useState("");
  const [selectedUserDetails, setSelectedUserDetails] = useState<User | null>(null);
  const [showUserDetailsDialog, setShowUserDetailsDialog] = useState(false);
  const [syncingForms, setSyncingForms] = useState(false);

  useEffect(() => {
    if (user) {
      const now = Date.now();
      const timeSinceLastFetch = now - lastFetch;
      
      // Rate limit: only fetch if 5 seconds have passed
      if (lastFetch === 0 || timeSinceLastFetch >= RATE_LIMIT_MS) {
        loadAdminData();
        setLastFetch(now);
      }
    }
  }, [user]);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      
      // Check rate limit before making expensive RPC call
      const currentTime = Date.now();
      if (lastFetch > 0 && (currentTime - lastFetch) < RATE_LIMIT_MS) {
        console.log('Rate limit: skipping data fetch');
        setLoading(false);
        return;
      }
      
      // Load analytics events for today
      const analyticsToday = new Date();
      analyticsToday.setHours(0, 0, 0, 0);
      
      const { data: analyticsData } = await supabase
        .from('analytics_events')
        .select('*')
        .gte('created_at', analyticsToday.toISOString());

      // Count unique sessions today
      const uniqueSessions = new Set(analyticsData?.map(e => e.session_id) || []).size;
      
      // Load all users using admin function
      const { data: usersData, error: usersError } = await supabase
        .rpc('get_all_users_admin');

      if (usersError) {
        console.error('Error fetching users:', usersError);
        toast.error('Failed to load user data: ' + usersError.message);
        return;
      }

      const allUsers = Array.isArray(usersData) ? usersData : [];
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

      const newUsersToday = allUsers.filter((u: any) => new Date(u.created_at) >= today).length;
      const newUsersThisWeek = allUsers.filter((u: any) => new Date(u.created_at) >= weekAgo).length;
      const newUsersThisMonth = allUsers.filter((u: any) => new Date(u.created_at) >= monthAgo).length;

      setUserStats({
        totalUsers: allUsers.length,
        newUsersToday,
        newUsersThisWeek,
        newUsersThisMonth
      });

      // Format users data with real emails and display names
      const formattedUsers = allUsers.map((u: any) => ({
        id: u.id,
        email: u.email,
        created_at: u.created_at,
        last_sign_in_at: u.last_sign_in_at || '',
        email_confirmed_at: u.email_confirmed_at || '',
        display_name: u.display_name,
        cases_count: u.cases_count || 0
      }));
      setUsers(formattedUsers);

      // Load admin users
      const { data: adminsData, error: adminsError } = await supabase
        .rpc('get_all_admins');

      if (!adminsError && adminsData) {
        setAdmins((Array.isArray(adminsData) ? adminsData : []) as unknown as AdminUser[]);
      }

      // Load case statistics
      const { data: casesData } = await supabase
        .from('cases')
        .select('*');

      if (casesData) {
        const activeCases = casesData.filter(c => c.status === 'active' || c.status === 'pending').length;
        const completedCases = casesData.filter(c => c.status === 'completed').length;
        const avgScore = casesData.reduce((sum, c) => sum + (c.merit_score || 0), 0) / casesData.length;

        setCaseStats({
          totalCases: casesData.length,
          activeCases,
          completedCases,
          averageMeritScore: Math.round(avgScore) || 0
        });

        setCases(casesData);
      }

      // Load revenue statistics
      const { data: paymentsData } = await supabase
        .from('payments')
        .select('amount, status, plan_type, created_at');

      if (paymentsData) {
        const completedPayments = paymentsData.filter(p => p.status === 'completed');
        const totalRevenue = completedPayments.reduce((sum, p) => sum + Number(p.amount), 0);
        const monthlySubscriptions = completedPayments.filter(p => 
          p.plan_type === 'monthly' || p.plan_type === 'annual' || p.plan_type === 'low-income'
        );
        const avgOrderValue = completedPayments.length > 0 
          ? totalRevenue / completedPayments.length 
          : 0;
        const conversionRate = allUsers.length > 0 
          ? (completedPayments.length / allUsers.length) * 100 
          : 0;

        setRevenueStats({
          totalRevenue,
          monthlyRecurring: monthlySubscriptions.length * 59.99,
          averageOrderValue: avgOrderValue,
          conversionRate: Math.round(conversionRate * 10) / 10
        });
      }

      // Load engagement statistics using real analytics data
      const pageLoadEvents = analyticsData?.filter(e => e.event_type === 'page_load') || [];
      const avgLoadTime = pageLoadEvents.length > 0
        ? pageLoadEvents.reduce((sum, e) => {
            const metrics = typeof e.metrics === 'object' ? e.metrics as any : {};
            return sum + (metrics.pageLoadTime || 0);
          }, 0) / pageLoadEvents.length
        : 0;

      const { data: formUsageData } = await supabase
        .from('form_usage')
        .select('completion_status, completion_time_minutes');

      if (formUsageData) {
        const completedForms = formUsageData.filter(f => f.completion_status === 'completed').length;
        const completionRate = formUsageData.length > 0 
          ? (completedForms / formUsageData.length) * 100 
          : 0;
        const avgSessionTime = formUsageData
          .filter(f => f.completion_time_minutes)
          .reduce((sum, f) => sum + (f.completion_time_minutes || 0), 0) / formUsageData.length || 0;

        // Calculate retention (users who signed in within last 30 days)
        const retainedUsers = allUsers.filter((u: any) => {
          if (!u.last_sign_in_at) return false;
          const signInDate = new Date(u.last_sign_in_at);
          return signInDate >= monthAgo;
        }).length;
        const retentionRate = allUsers.length > 0 
          ? (retainedUsers / allUsers.length) * 100 
          : 0;

        setEngagementStats({
          activeUsersToday: uniqueSessions,
          averageSessionTime: Math.round(avgLoadTime / 1000),
          formCompletionRate: Math.round(completionRate * 10) / 10,
          userRetentionRate: Math.round(retentionRate * 10) / 10
        });
      }
    } catch (error) {
      console.error('Error loading admin data:', error);
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleGrantAdmin = async () => {
    if (!selectedUser) return;

    try {
      const { error } = await supabase.rpc('grant_admin_role', {
        target_user_id: selectedUser.id
      });

      if (error) throw error;

      toast.success(`Admin access granted to ${selectedUser.email}`);
      setShowGrantDialog(false);
      setSelectedUser(null);
      setAdminNotes("");
      loadAdminData();
    } catch (error: unknown) {
      console.error('Error granting admin:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to grant admin access');
    }
  };

  const handleRevokeAdmin = async () => {
    if (!selectedUser) return;

    try {
      const { error } = await supabase.rpc('revoke_admin_role', {
        target_user_id: selectedUser.id
      });

      if (error) throw error;

      toast.success(`Admin access revoked from ${selectedUser.email}`);
      setShowRevokeDialog(false);
      setSelectedUser(null);
      setRevokeReason("");
      loadAdminData();
    } catch (error: unknown) {
      console.error('Error revoking admin:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to revoke admin access');
    }
  };

  const handleViewUserDetails = (user: User) => {
    setSelectedUserDetails(user);
    setShowUserDetailsDialog(true);
  };

  const syncOntarioForms = async () => {
    try {
      setSyncingForms(true);
      const { data, error } = await supabase.functions.invoke('sync-ontario-forms');
      
      if (error) throw error;
      
      toast.success(data?.message || 'Ontario forms synced successfully');
      console.log('Sync results:', data);
    } catch (error: unknown) {
      console.error('Error syncing forms:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to sync Ontario forms');
    } finally {
      setSyncingForms(false);
    }
  };

  // Simple admin check - in production, you'd want proper role-based auth
  // const isAdmin = user?.email === 'admin@justice-bot.ca' || user?.email?.includes('admin');

  if (!user || roleLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground">Please sign in to access the admin console.</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center max-w-2xl">
          <AlertCircle className="w-16 h-16 text-warning mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Admin Access Required</h1>
          <p className="text-muted-foreground mb-6">
            You don't have permission to access the admin console.
          </p>
          <Card className="text-left">
            <CardHeader>
              <CardTitle className="text-lg">How to Get Admin Access</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">1. Access Supabase SQL Editor</p>
                <p className="text-sm text-muted-foreground">
                  Go to your Supabase project dashboard and open the SQL Editor
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">2. Run this SQL command:</p>
                <code className="block p-3 bg-muted rounded text-xs">
                  SELECT make_user_admin('{user?.email}');
                </code>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">3. Refresh this page</p>
                <p className="text-sm text-muted-foreground">
                  After running the command, refresh this page to access the admin console
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCases = cases.filter(case_ =>
    case_.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    case_.province.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Admin Console</h1>
            <p className="text-muted-foreground">Monitor users, cases, and system metrics</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          </div>
        ) : (
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full lg:w-[600px] grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="roles">Roles</TabsTrigger>
              <TabsTrigger value="cases">Cases</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Quick Actions */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Dashboard Overview</h2>
                  <p className="text-sm text-muted-foreground">Real-time platform metrics</p>
                </div>
                <Button variant="outline" size="sm" onClick={loadAdminData} disabled={loading}>
                  <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>

              {/* Top Metrics Row - Enhanced Cards */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-bl-full" />
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{userStats.totalUsers}</div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        <ArrowUpRight className="w-3 h-3 mr-1" />
                        +{userStats.newUsersToday} today
                      </Badge>
                    </div>
                    <Progress value={Math.min((userStats.newUsersThisMonth / 100) * 100, 100)} className="mt-3 h-1" />
                    <p className="text-xs text-muted-foreground mt-1">{userStats.newUsersThisMonth} this month</p>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/5 rounded-bl-full" />
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <div className="p-2 bg-green-500/10 rounded-lg">
                      <DollarSign className="h-4 w-4 text-green-600" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">${revenueStats.totalRevenue.toFixed(2)}</div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs text-green-600 border-green-200 bg-green-50">
                        ${revenueStats.monthlyRecurring.toFixed(2)} MRR
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                      <Zap className="w-3 h-3" />
                      AOV: ${revenueStats.averageOrderValue.toFixed(2)}
                    </div>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/5 rounded-bl-full" />
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{revenueStats.conversionRate}%</div>
                    <Progress value={revenueStats.conversionRate} className="mt-3 h-1" />
                    <p className="text-xs text-muted-foreground mt-1">Users to paying customers</p>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/5 rounded-bl-full" />
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Today</CardTitle>
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                      <Activity className="h-4 w-4 text-purple-600" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{engagementStats.activeUsersToday}</div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {engagementStats.userRetentionRate}% retention
                      </Badge>
                    </div>
                    <Progress value={engagementStats.userRetentionRate} className="mt-3 h-1" />
                  </CardContent>
                </Card>
              </div>

              {/* Secondary Metrics Row */}
              <div className="grid gap-4 md:grid-cols-4">
                <Card className="bg-muted/30">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Cases</p>
                        <p className="text-2xl font-bold">{caseStats.totalCases}</p>
                      </div>
                      <FileText className="h-8 w-8 text-muted-foreground/50" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">{caseStats.activeCases} active</p>
                  </CardContent>
                </Card>

                <Card className="bg-muted/30">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Avg Merit Score</p>
                        <p className="text-2xl font-bold">{caseStats.averageMeritScore}</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-muted-foreground/50" />
                    </div>
                    <Progress value={caseStats.averageMeritScore} className="mt-2 h-1" />
                  </CardContent>
                </Card>

                <Card className="bg-muted/30">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Form Completion</p>
                        <p className="text-2xl font-bold">{engagementStats.formCompletionRate}%</p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-muted-foreground/50" />
                    </div>
                    <Progress value={engagementStats.formCompletionRate} className="mt-2 h-1" />
                  </CardContent>
                </Card>

                <Card className="bg-muted/30">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Avg Session</p>
                        <p className="text-2xl font-bold">{engagementStats.averageSessionTime}m</p>
                      </div>
                      <Clock className="h-8 w-8 text-muted-foreground/50" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Per user visit</p>
                  </CardContent>
                </Card>
              </div>

              {/* Growth & Activity Cards */}
              <div className="grid gap-6 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <UserPlus className="h-4 w-4 text-primary" />
                      User Growth
                    </CardTitle>
                    <CardDescription>New registrations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          <span className="text-sm font-medium">Today</span>
                        </div>
                        <span className="text-lg font-bold">{userStats.newUsersToday}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          <span className="text-sm font-medium">This Week</span>
                        </div>
                        <span className="text-lg font-bold">{userStats.newUsersThisWeek}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full" />
                          <span className="text-sm font-medium">This Month</span>
                        </div>
                        <span className="text-lg font-bold">{userStats.newUsersThisMonth}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      Case Distribution
                    </CardTitle>
                    <CardDescription>Status breakdown</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Active Cases</span>
                          <span className="font-medium">{caseStats.activeCases}</span>
                        </div>
                        <Progress value={(caseStats.activeCases / Math.max(caseStats.totalCases, 1)) * 100} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Completed</span>
                          <span className="font-medium">{caseStats.completedCases}</span>
                        </div>
                        <Progress value={(caseStats.completedCases / Math.max(caseStats.totalCases, 1)) * 100} className="h-2 bg-muted [&>div]:bg-green-500" />
                      </div>
                      <div className="pt-2 border-t">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Total Cases</span>
                          <span className="font-bold">{caseStats.totalCases}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-primary" />
                      Quick Actions
                    </CardTitle>
                    <CardDescription>Admin tools</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start" 
                      onClick={syncOntarioForms}
                      disabled={syncingForms}
                    >
                      <RefreshCw className={`w-4 h-4 mr-2 ${syncingForms ? 'animate-spin' : ''}`} />
                      Sync Ontario Forms
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <a href="/admin/testimonials">
                        <Eye className="w-4 h-4 mr-2" />
                        Review Testimonials
                      </a>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <a href="/admin/forms-sync">
                        <FileText className="w-4 h-4 mr-2" />
                        Forms Dashboard
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>User Management</CardTitle>
                      <CardDescription>View and manage {users.length} registered users</CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2 pt-2">
                    <Search className="w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="max-w-sm"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px] pr-4">
                    <div className="space-y-3">
                      {filteredUsers.map((userItem) => {
                        const isUserAdmin = admins.some(a => a.user_id === userItem.id && a.is_active);
                        const initials = userItem.display_name 
                          ? userItem.display_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                          : userItem.email.slice(0, 2).toUpperCase();
                        
                        return (
                          <div 
                            key={userItem.id} 
                            className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className={isUserAdmin ? 'bg-primary text-primary-foreground' : ''}>
                                {initials}
                              </AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-medium truncate">{userItem.email}</p>
                                {userItem.display_name && (
                                  <Badge variant="outline" className="text-xs hidden sm:inline-flex">
                                    {userItem.display_name}
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(userItem.created_at).toLocaleDateString()}
                                </span>
                                {userItem.cases_count !== undefined && userItem.cases_count > 0 && (
                                  <span className="flex items-center gap-1">
                                    <FileText className="w-3 h-3" />
                                    {userItem.cases_count} cases
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Badge variant={userItem.email_confirmed_at ? "default" : "secondary"} className="hidden sm:flex">
                                {userItem.email_confirmed_at ? "Verified" : "Unverified"}
                              </Badge>
                              {isUserAdmin && (
                                <Badge variant="destructive">Admin</Badge>
                              )}
                              
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleViewUserDetails(userItem)}>
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Details
                                  </DropdownMenuItem>
                                  {!isUserAdmin ? (
                                    <DropdownMenuItem onClick={() => {
                                      setSelectedUser(userItem);
                                      setShowGrantDialog(true);
                                    }}>
                                      <UserPlus className="w-4 h-4 mr-2" />
                                      Grant Admin
                                    </DropdownMenuItem>
                                  ) : userItem.id !== user?.id && (
                                    <DropdownMenuItem 
                                      onClick={() => {
                                        setSelectedUser(userItem);
                                        setShowRevokeDialog(true);
                                      }}
                                      className="text-destructive"
                                    >
                                      <UserMinus className="w-4 h-4 mr-2" />
                                      Revoke Admin
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        );
                      })}
                      
                      {filteredUsers.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          No users found matching "{searchTerm}"
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="roles" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        Admin Role Management
                      </CardTitle>
                      <CardDescription>Manage admin privileges and permissions</CardDescription>
                    </div>
                    <Badge variant="outline" className="text-lg px-3">
                      {admins.filter(a => a.is_active).length} Active Admins
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Active Admins */}
                    <div>
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Active Admins
                      </h3>
                      <div className="space-y-3">
                        {admins.filter(a => a.is_active).map((admin) => (
                          <div key={admin.user_id} className="flex items-center justify-between p-4 border rounded-lg bg-green-50 dark:bg-green-900/10">
                            <div className="space-y-1 flex-1">
                              <p className="font-medium">{admin.email}</p>
                              <p className="text-sm text-muted-foreground">
                                Granted: {new Date(admin.granted_at).toLocaleDateString()}
                              </p>
                              {admin.notes && (
                                <p className="text-xs text-muted-foreground italic">
                                  Note: {admin.notes}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="default">Active</Badge>
                              {admin.user_id !== user?.id && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => {
                                    const adminUser = users.find(u => u.id === admin.user_id);
                                    if (adminUser) {
                                      setSelectedUser(adminUser);
                                      setShowRevokeDialog(true);
                                    }
                                  }}
                                >
                                  <UserMinus className="w-4 h-4 mr-1" />
                                  Revoke
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Revoked Admins */}
                    {admins.filter(a => !a.is_active).length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-red-600" />
                          Revoked Admins
                        </h3>
                        <div className="space-y-3">
                          {admins.filter(a => !a.is_active).map((admin) => (
                            <div key={admin.user_id} className="flex items-center justify-between p-4 border rounded-lg bg-red-50 dark:bg-red-900/10">
                              <div className="space-y-1 flex-1">
                                <p className="font-medium line-through opacity-70">{admin.email}</p>
                                <p className="text-sm text-muted-foreground">
                                  Revoked: {admin.revoked_at ? new Date(admin.revoked_at).toLocaleDateString() : 'N/A'}
                                </p>
                                {admin.notes && (
                                  <p className="text-xs text-muted-foreground italic">
                                    {admin.notes}
                                  </p>
                                )}
                              </div>
                              <Badge variant="destructive">Revoked</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="cases" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Case Management</CardTitle>
                      <CardDescription>Monitor and review user cases</CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Search className="w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search cases..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="max-w-sm"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredCases.map((case_) => (
                      <div key={case_.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                          <p className="font-medium">{case_.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {case_.province} • Created: {new Date(case_.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={case_.merit_score >= 70 ? "default" : case_.merit_score >= 50 ? "secondary" : "destructive"}>
                            Score: {case_.merit_score}/100
                          </Badge>
                          <Badge variant="outline">{case_.status}</Badge>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>System Tools</CardTitle>
                  <CardDescription>Administrative utilities</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={syncOntarioForms} disabled={syncingForms}>
                    <Download className="w-4 h-4 mr-2" />
                    {syncingForms ? 'Syncing...' : 'Sync Ontario Forms'}
                  </Button>
                </CardContent>
              </Card>
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Platform Metrics</CardTitle>
                    <CardDescription>Key performance indicators</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">User Retention Rate</span>
                      <Badge variant="default">85%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Case Completion Rate</span>
                      <Badge variant="secondary">
                        {caseStats.totalCases > 0 ? Math.round((caseStats.completedCases / caseStats.totalCases) * 100) : 0}%
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Average Session Time</span>
                      <Badge variant="outline">12 min</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Provincial Distribution</CardTitle>
                    <CardDescription>Cases by province</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {['Ontario', 'BC', 'Alberta', 'Quebec'].map((province) => {
                        const count = cases.filter(c => c.province === province).length;
                        return (
                          <div key={province} className="flex items-center justify-between">
                            <span className="text-sm">{province}</span>
                            <Badge variant="secondary">{count}</Badge>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>

      {/* Grant Admin Dialog */}
      <Dialog open={showGrantDialog} onOpenChange={setShowGrantDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Grant Admin Access</DialogTitle>
            <DialogDescription>
              Grant administrator privileges to {selectedUser?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Notes (Optional)</label>
              <Textarea
                placeholder="Reason for granting admin access..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={3}
              />
            </div>
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                ⚠️ Admin users have full access to all user data, analytics, and can grant/revoke admin privileges to other users.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowGrantDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleGrantAdmin}>
              <Shield className="w-4 h-4 mr-2" />
              Grant Admin Access
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Revoke Admin Dialog */}
      <AlertDialog open={showRevokeDialog} onOpenChange={setShowRevokeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke Admin Access</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to revoke admin privileges from {selectedUser?.email}?
              This action can be reversed by granting admin access again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2 py-4">
            <label className="text-sm font-medium">Reason for Revocation (Optional)</label>
            <Textarea
              placeholder="Explain why admin access is being revoked..."
              value={revokeReason}
              onChange={(e) => setRevokeReason(e.target.value)}
              rows={3}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRevokeAdmin}>
              Revoke Admin Access
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* User Details Dialog */}
      <Dialog open={showUserDetailsDialog} onOpenChange={setShowUserDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Complete registration and activity information
            </DialogDescription>
          </DialogHeader>
          {selectedUserDetails && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-sm font-mono">{selectedUserDetails.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">User ID</p>
                  <p className="text-sm font-mono text-xs">{selectedUserDetails.id}</p>
                </div>
                {selectedUserDetails.display_name && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Display Name</p>
                    <p className="text-sm">{selectedUserDetails.display_name}</p>
                  </div>
                )}
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Account Status</p>
                  <Badge variant={selectedUserDetails.email_confirmed_at ? "default" : "secondary"}>
                    {selectedUserDetails.email_confirmed_at ? "Verified" : "Unverified"}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Joined</p>
                  <p className="text-sm">{new Date(selectedUserDetails.created_at).toLocaleString()}</p>
                </div>
                {selectedUserDetails.last_sign_in_at && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Last Sign In</p>
                    <p className="text-sm">{new Date(selectedUserDetails.last_sign_in_at).toLocaleString()}</p>
                  </div>
                )}
                {selectedUserDetails.email_confirmed_at && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Email Confirmed</p>
                    <p className="text-sm">{new Date(selectedUserDetails.email_confirmed_at).toLocaleString()}</p>
                  </div>
                )}
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Total Cases</p>
                  <p className="text-sm">{selectedUserDetails.cases_count || 0}</p>
                </div>
              </div>

              {admins.some(a => a.user_id === selectedUserDetails.id) && (
                <div className="p-4 bg-accent rounded border">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-primary" />
                    <p className="font-medium">Admin Status</p>
                  </div>
                  {admins
                    .filter(a => a.user_id === selectedUserDetails.id)
                    .map((admin, idx) => (
                      <div key={idx} className="space-y-1 text-sm">
                        <p>Status: <Badge variant={admin.is_active ? "default" : "destructive"}>
                          {admin.is_active ? "Active" : "Revoked"}
                        </Badge></p>
                        <p className="text-muted-foreground">
                          Granted: {new Date(admin.granted_at).toLocaleString()}
                        </p>
                        {admin.revoked_at && (
                          <p className="text-muted-foreground">
                            Revoked: {new Date(admin.revoked_at).toLocaleString()}
                          </p>
                        )}
                        {admin.notes && (
                          <p className="text-muted-foreground italic">{admin.notes}</p>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUserDetailsDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
    </>
  );
};

export default Admin;