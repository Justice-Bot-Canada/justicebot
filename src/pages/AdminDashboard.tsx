import { useState, useEffect } from 'react';
import { Helmet } from "react-helmet-async";
import { useAuth } from '@/hooks/useAuth';
import { useRole } from '@/hooks/useRole';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Users, DollarSign, FileText, TrendingUp, Loader2, Sparkles } from 'lucide-react';
import { Navigate } from 'react-router-dom';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { isAdmin, loading: roleLoading } = useRole();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    premiumUsers: 0,
    monthlyRevenue: 0,
    seoPages: 0,
    referrals: 0,
    conversionRate: 0
  });

  // SEO Generator State
  const [topic, setTopic] = useState('');
  const [location, setLocation] = useState('Toronto');
  const [formType, setFormType] = useState('');
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      loadStats();
    }
  }, [isAdmin]);

  const loadStats = async () => {
    setLoading(true);
    try {
      // Get total users
      const { count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get premium users
      const { count: premiumCount } = await supabase
        .from('entitlements')
        .select('*', { count: 'exact', head: true });

      // Get SEO pages
      const { count: seoCount } = await supabase
        .from('seo_pages' as any)
        .select('*', { count: 'exact', head: true });

      // Get referrals
      const { count: referralCount } = await supabase
        .from('referrals')
        .select('*', { count: 'exact', head: true });

      // Get recent analytics
      const { data: analyticsData } = await supabase
        .from('analytics_events')
        .select('event_type')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      const conversions = analyticsData?.filter(e => e.event_type === 'conversion').length || 0;
      const total = analyticsData?.length || 1;

      setStats({
        totalUsers: userCount || 0,
        premiumUsers: premiumCount || 0,
        monthlyRevenue: (premiumCount || 0) * 59.99,
        seoPages: seoCount || 0,
        referrals: referralCount || 0,
        conversionRate: Math.round((conversions / total) * 100)
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSEOPage = async () => {
    if (!topic || !formType) {
      toast({
        title: "Missing Fields",
        description: "Please fill in topic and form type",
        variant: "destructive"
      });
      return;
    }

    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-seo-pages', {
        body: { topic, location, formType }
      });

      if (error) throw error;

      toast({
        title: "SEO Page Generated!",
        description: `Created: /seo/${data.slug}`,
      });

      setTopic('');
      setFormType('');
      loadStats();
    } catch (error: any) {
      console.error('Error generating SEO page:', error);
      toast({
        title: "Generation Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setGenerating(false);
    }
  };

  if (roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Command center for Justice-Bot operations</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">Registered accounts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Premium Users</CardTitle>
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.premiumUsers}</div>
              <p className="text-xs text-muted-foreground">
                {((stats.premiumUsers / Math.max(stats.totalUsers, 1)) * 100).toFixed(1)}% conversion
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <DollarSign className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.monthlyRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Est. recurring revenue</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">SEO Pages</CardTitle>
              <FileText className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.seoPages}</div>
              <p className="text-xs text-muted-foreground">Published landing pages</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Referrals</CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.referrals}</div>
              <p className="text-xs text-muted-foreground">Total referrals made</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.conversionRate}%</div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
          </Card>
        </div>

        {/* SEO Page Generator */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              AI SEO Page Generator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="topic">Legal Topic</Label>
              <Input
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., eviction defense, wrongful dismissal"
              />
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Toronto">Toronto</SelectItem>
                  <SelectItem value="Ottawa">Ottawa</SelectItem>
                  <SelectItem value="Mississauga">Mississauga</SelectItem>
                  <SelectItem value="Brampton">Brampton</SelectItem>
                  <SelectItem value="Hamilton">Hamilton</SelectItem>
                  <SelectItem value="London">London</SelectItem>
                  <SelectItem value="Windsor">Windsor</SelectItem>
                  <SelectItem value="Kitchener">Kitchener</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="formType">Form/Process Type</Label>
              <Input
                id="formType"
                value={formType}
                onChange={(e) => setFormType(e.target.value)}
                placeholder="e.g., Form T2, Application to HRTO"
              />
            </div>

            <Button
              onClick={generateSEOPage}
              disabled={generating || !topic || !formType}
              className="w-full"
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating with AI...
                </>
              ) : (
                'Generate SEO Page'
              )}
            </Button>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
    </>
  );
}
