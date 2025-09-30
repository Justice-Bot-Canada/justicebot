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
        <div className="container mx-auto px-4 py-20 text-center">
          <AlertCircle className="w-16 h-16 text-warning mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Admin Access Required</h1>
          <p className="text-muted-foreground">
            You don't have permission to access the admin console.
          </p>
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
                      Across all cases
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">+{userStats.newUsersThisWeek}</div>
                    <p className="text-xs text-muted-foreground">
                      Users this week
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