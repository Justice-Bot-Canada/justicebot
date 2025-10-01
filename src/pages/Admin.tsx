import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Users,
  FileText,
  TrendingUp,
  DollarSign,
  Search,
  Filter,
  Download,
  Eye,
  Shield,
  BarChart3,
  Calendar,
  AlertCircle
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
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (user) {
      loadAdminData();
    }
  }, [user]);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      
      // Load all users using admin function
      const { data: usersData, error: usersError } = await supabase
        .rpc('get_all_users_admin');

      if (usersError) {
        console.error('Error fetching users:', usersError);
        toast.error('Failed to load user data: ' + usersError.message);
        return;
      }

      const allUsers = usersData || [];
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

      const newUsersToday = allUsers.filter(u => new Date(u.created_at) >= today).length;
      const newUsersThisWeek = allUsers.filter(u => new Date(u.created_at) >= weekAgo).length;
      const newUsersThisMonth = allUsers.filter(u => new Date(u.created_at) >= monthAgo).length;

      setUserStats({
        totalUsers: allUsers.length,
        newUsersToday,
        newUsersThisWeek,
        newUsersThisMonth
      });

      // Format users data with real emails
      const formattedUsers = allUsers.map(u => ({
        id: u.id,
        email: u.email,
        created_at: u.created_at,
        last_sign_in_at: u.last_sign_in_at || '',
        email_confirmed_at: u.email_confirmed_at || ''
      }));
      setUsers(formattedUsers);

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
          monthlyRecurring: monthlySubscriptions.length * 59.99, // Rough estimate
          averageOrderValue: avgOrderValue,
          conversionRate: Math.round(conversionRate * 10) / 10
        });
      }

      // Load engagement statistics
      const todaySignIns = allUsers.filter(u => {
        if (!u.last_sign_in_at) return false;
        const signInDate = new Date(u.last_sign_in_at);
        return signInDate >= today;
      }).length;

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
        const retainedUsers = allUsers.filter(u => {
          if (!u.last_sign_in_at) return false;
          const signInDate = new Date(u.last_sign_in_at);
          return signInDate >= monthAgo;
        }).length;
        const retentionRate = allUsers.length > 0 
          ? (retainedUsers / allUsers.length) * 100 
          : 0;

        setEngagementStats({
          activeUsersToday: todaySignIns,
          averageSessionTime: Math.round(avgSessionTime),
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
            <TabsList className="grid w-full lg:w-96 grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="cases">Cases</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Top Metrics Row */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{userStats.totalUsers}</div>
                    <p className="text-xs text-muted-foreground">
                      +{userStats.newUsersToday} today
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${revenueStats.totalRevenue.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">
                      ${revenueStats.monthlyRecurring.toFixed(2)} MRR
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{revenueStats.conversionRate}%</div>
                    <p className="text-xs text-muted-foreground">
                      AOV: ${revenueStats.averageOrderValue.toFixed(2)}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{engagementStats.activeUsersToday}</div>
                    <p className="text-xs text-muted-foreground">
                      {engagementStats.userRetentionRate}% retention
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Engagement Metrics Row */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Cases</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{caseStats.totalCases}</div>
                    <p className="text-xs text-muted-foreground">
                      {caseStats.activeCases} active
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg Merit Score</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{caseStats.averageMeritScore}/100</div>
                    <p className="text-xs text-muted-foreground">
                      Quality indicator
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Form Completion</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{engagementStats.formCompletionRate}%</div>
                    <p className="text-xs text-muted-foreground">
                      Success rate
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg Session</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{engagementStats.averageSessionTime}m</div>
                    <p className="text-xs text-muted-foreground">
                      Per user
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent User Growth</CardTitle>
                    <CardDescription>New user registrations over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Today</span>
                        <Badge variant="secondary">{userStats.newUsersToday}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">This Week</span>
                        <Badge variant="secondary">{userStats.newUsersThisWeek}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">This Month</span>
                        <Badge variant="secondary">{userStats.newUsersThisMonth}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Case Status Breakdown</CardTitle>
                    <CardDescription>Current case distribution</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Active Cases</span>
                        <Badge variant="default">{caseStats.activeCases}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Completed Cases</span>
                        <Badge variant="secondary">{caseStats.completedCases}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Total Cases</span>
                        <Badge variant="outline">{caseStats.totalCases}</Badge>
                      </div>
                    </div>
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
                      <CardDescription>View and manage registered users</CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Search className="w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="max-w-sm"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                          <p className="font-medium">{user.email}</p>
                          <p className="text-sm text-muted-foreground">
                            Joined: {new Date(user.created_at).toLocaleDateString()}
                          </p>
                          {user.last_sign_in_at && (
                            <p className="text-xs text-muted-foreground">
                              Last seen: {new Date(user.last_sign_in_at).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={user.email_confirmed_at ? "default" : "secondary"}>
                            {user.email_confirmed_at ? "Verified" : "Unverified"}
                          </Badge>
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

      <Footer />
    </div>
  );
};

export default Admin;