import React, { useState, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, TrendingUp, TrendingDown, DollarSign, ShoppingCart, Clock, CheckCircle, AlertTriangle, Copy, ArrowLeft, RefreshCw } from "lucide-react";
import { toast } from "@/lib/toast-stub";
import { format, subDays, startOfDay, endOfDay, differenceInHours } from "date-fns";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

// Status thresholds
const STATUS_THRESHOLDS = {
  intentToAction: { red: 2, yellow: 4, green: 6 },
  conversion: { red: 1, green: 2 },
  cac: { green: 4, yellow: 5.98, red: 5.99 },
  deliverySuccess: { red: 80, yellow: 90, green: 95 },
};

interface KPIData {
  organicIntentRate: number;
  organicIntentRateWoW: number;
  visitorPurchaseRate: number;
  visitorPurchaseRateWoW: number;
  transactionVolume: number;
  transactionVolumeWoW: number;
  medianTimeToPurchase: number;
  medianTimeToPurchaseWoW: number;
  deliverySuccessRate: number;
  deliverySuccessRateWoW: number;
  cac: number;
  cacWoW: number;
  totalSessions: number;
  organicSessions: number;
  totalPurchases: number;
  revenue: number;
}

interface ChannelData {
  channel: string;
  sessions: number;
  purchases: number;
  conversion: number;
  cac: number;
  revenue: number;
}

interface LandingPageData {
  page: string;
  sessions: number;
  intentActions: number;
  intentRate: number;
  purchases: number;
  conversion: number;
}

interface VenueData {
  venue: string;
  purchases: number;
  conversion: number;
  revenue: number;
}

interface DailyData {
  date: string;
  purchases: number;
  cac: number;
  intentRate: number;
}

const getStatus = (value: number, type: 'intentToAction' | 'conversion' | 'cac' | 'deliverySuccess'): 'red' | 'yellow' | 'green' | 'excellent' => {
  if (type === 'cac') {
    const thresholds = STATUS_THRESHOLDS.cac;
    if (value >= thresholds.red) return 'red';
    if (value > thresholds.green) return 'yellow';
    return 'green';
  }
  
  if (type === 'intentToAction') {
    const thresholds = STATUS_THRESHOLDS.intentToAction;
    if (value < thresholds.red) return 'red';
    if (value < thresholds.yellow) return 'yellow';
    if (value < thresholds.green) return 'green';
    return 'excellent';
  }
  
  if (type === 'conversion') {
    const thresholds = STATUS_THRESHOLDS.conversion;
    if (value < thresholds.red) return 'red';
    if (value < thresholds.green) return 'yellow';
    return 'green';
  }
  
  // deliverySuccess
  const thresholds = STATUS_THRESHOLDS.deliverySuccess;
  if (value < thresholds.red) return 'red';
  if (value < thresholds.yellow) return 'yellow';
  return 'green';
};

const StatusBadge = ({ status }: { status: 'red' | 'yellow' | 'green' | 'excellent' }) => {
  const colors = {
    red: 'bg-red-500/10 text-red-600 border-red-500/20',
    yellow: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
    green: 'bg-green-500/10 text-green-600 border-green-500/20',
    excellent: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  };
  
  const labels = {
    red: 'Needs Attention',
    yellow: 'Caution',
    green: 'On Track',
    excellent: 'Excellent',
  };
  
  return <Badge className={colors[status]} variant="outline">{labels[status]}</Badge>;
};

const MetricCard = ({ 
  title, 
  value, 
  subValue, 
  change, 
  status,
  icon: Icon 
}: { 
  title: string; 
  value: string; 
  subValue?: string;
  change?: number; 
  status?: 'red' | 'yellow' | 'green' | 'excellent';
  icon: React.ElementType;
}) => (
  <Card className={status === 'red' ? 'border-red-500/50 bg-red-500/5' : ''}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {subValue && <p className="text-xs text-muted-foreground">{subValue}</p>}
      <div className="flex items-center gap-2 mt-2">
        {change !== undefined && (
          <div className={`flex items-center text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
            {Math.abs(change).toFixed(1)}% WoW
          </div>
        )}
        {status && <StatusBadge status={status} />}
      </div>
    </CardContent>
  </Card>
);

const AdminKPI = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useRole();
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7');
  const [channel, setChannel] = useState('all');
  const [venue, setVenue] = useState('all');
  
  const [kpiData, setKpiData] = useState<KPIData>({
    organicIntentRate: 0, organicIntentRateWoW: 0,
    visitorPurchaseRate: 0, visitorPurchaseRateWoW: 0,
    transactionVolume: 0, transactionVolumeWoW: 0,
    medianTimeToPurchase: 0, medianTimeToPurchaseWoW: 0,
    deliverySuccessRate: 0, deliverySuccessRateWoW: 0,
    cac: 0, cacWoW: 0,
    totalSessions: 0, organicSessions: 0, totalPurchases: 0, revenue: 0,
  });
  
  const [channelData, setChannelData] = useState<ChannelData[]>([]);
  const [landingPageData, setLandingPageData] = useState<LandingPageData[]>([]);
  const [venueData, setVenueData] = useState<VenueData[]>([]);
  const [dailyData, setDailyData] = useState<DailyData[]>([]);

  useEffect(() => {
    if (authLoading || roleLoading) return;
    if (!user) {
      navigate('/welcome');
      return;
    }
    if (!isAdmin) {
      toast.error('Admin access required');
      navigate('/dashboard');
      return;
    }
    loadKPIData();
  }, [user, authLoading, isAdmin, roleLoading, dateRange, channel, venue]);

  const loadKPIData = async () => {
    setLoading(true);
    try {
      const days = parseInt(dateRange);
      const endDate = new Date();
      const startDate = subDays(endDate, days);
      const prevStartDate = subDays(startDate, days);
      
      // Fetch orders (purchases)
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('status', 'paid')
        .gte('paid_at', startDate.toISOString())
        .lte('paid_at', endDate.toISOString());
      
      if (ordersError) throw ordersError;
      
      // Fetch previous period orders for WoW comparison
      const { data: prevOrders } = await supabase
        .from('orders')
        .select('*')
        .eq('status', 'paid')
        .gte('paid_at', prevStartDate.toISOString())
        .lt('paid_at', startDate.toISOString());
      
      // Fetch analytics events
      const { data: events } = await supabase
        .from('analytics_events')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());
      
      const { data: prevEvents } = await supabase
        .from('analytics_events')
        .select('*')
        .gte('created_at', prevStartDate.toISOString())
        .lt('created_at', startDate.toISOString());
      
      // Fetch funnel events
      const { data: funnelEvents } = await supabase
        .from('funnel_events')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      // Calculate KPIs
      const currentOrders = orders || [];
      const previousOrders = prevOrders || [];
      const currentEvents = events || [];
      const previousEvents = prevEvents || [];
      const currentFunnel = funnelEvents || [];
      
      // Total sessions (unique session_ids)
      const totalSessions = new Set(currentEvents.map(e => e.session_id).filter(Boolean)).size || 1;
      const prevTotalSessions = new Set(previousEvents.map(e => e.session_id).filter(Boolean)).size || 1;
      
      // Organic sessions (metadata.channel = 'organic' or referrer contains google/bing)
      const organicSessions = currentEvents.filter(e => {
        const meta = e.metadata as Record<string, unknown> | null;
        return meta?.channel === 'organic' || (e.page_url && e.page_url.includes('utm_medium=organic'));
      }).length || 0;
      const prevOrganicSessions = previousEvents.filter(e => {
        const meta = e.metadata as Record<string, unknown> | null;
        return meta?.channel === 'organic' || (e.page_url && e.page_url.includes('utm_medium=organic'));
      }).length || 0;
      
      // Intent actions (triage_started or form_viewed)
      const intentActions = currentFunnel.filter(e => 
        e.event_type === 'triage_started' || 
        e.event_type === 'form_viewed' ||
        e.event_type === 'triage_submit'
      ).length;
      const prevIntentActions = (funnelEvents || []).filter(e => 
        e.event_type === 'triage_started' || 
        e.event_type === 'form_viewed'
      ).length;
      
      // Calculate rates
      const organicIntentRate = organicSessions > 0 ? (intentActions / organicSessions) * 100 : 0;
      const prevOrganicIntentRate = prevOrganicSessions > 0 ? (prevIntentActions / prevOrganicSessions) * 100 : 0;
      
      const transactionVolume = currentOrders.length;
      const prevTransactionVolume = previousOrders.length || 1;
      
      const visitorPurchaseRate = totalSessions > 0 ? (transactionVolume / totalSessions) * 100 : 0;
      const prevVisitorPurchaseRate = prevTotalSessions > 0 ? (prevTransactionVolume / prevTotalSessions) * 100 : 0;
      
      // Revenue
      const revenue = currentOrders.reduce((sum, o) => sum + (o.amount_total || 0), 0) / 100;
      
      // CAC - placeholder (needs marketing spend data)
      const marketingSpend = 0; // Would need separate tracking
      const cac = transactionVolume > 0 ? marketingSpend / transactionVolume : 0;
      const prevCac = prevTransactionVolume > 0 ? marketingSpend / prevTransactionVolume : 0;
      
      // Delivery success (documents_generated events / purchases)
      const deliveryEvents = currentFunnel.filter(e => 
        e.event_type === 'document_generated' || 
        e.event_type === 'delivery_completed'
      ).length;
      const deliverySuccessRate = transactionVolume > 0 ? (deliveryEvents / transactionVolume) * 100 : 100;
      
      // Median time to purchase (simplified - would need first visit tracking)
      const medianTimeToPurchase = 24; // Placeholder in hours
      
      // Calculate WoW changes
      const calcWoW = (current: number, prev: number) => {
        if (prev === 0) return current > 0 ? 100 : 0;
        return ((current - prev) / prev) * 100;
      };
      
      setKpiData({
        organicIntentRate,
        organicIntentRateWoW: calcWoW(organicIntentRate, prevOrganicIntentRate),
        visitorPurchaseRate,
        visitorPurchaseRateWoW: calcWoW(visitorPurchaseRate, prevVisitorPurchaseRate),
        transactionVolume,
        transactionVolumeWoW: calcWoW(transactionVolume, prevTransactionVolume),
        medianTimeToPurchase,
        medianTimeToPurchaseWoW: 0,
        deliverySuccessRate,
        deliverySuccessRateWoW: 0,
        cac,
        cacWoW: calcWoW(cac, prevCac),
        totalSessions,
        organicSessions,
        totalPurchases: transactionVolume,
        revenue,
      });
      
      // Build daily data for charts
      const dailyMap = new Map<string, DailyData>();
      for (let i = 0; i < days; i++) {
        const date = format(subDays(endDate, i), 'MMM dd');
        dailyMap.set(date, { date, purchases: 0, cac: 0, intentRate: 0 });
      }
      
      currentOrders.forEach(order => {
        if (order.paid_at) {
          const date = format(new Date(order.paid_at), 'MMM dd');
          const existing = dailyMap.get(date);
          if (existing) {
            existing.purchases += 1;
          }
        }
      });
      
      setDailyData(Array.from(dailyMap.values()).reverse());
      
      // Channel breakdown
      const channelMap = new Map<string, ChannelData>();
      ['organic', 'direct', 'paid', 'referral', 'email'].forEach(ch => {
        channelMap.set(ch, { channel: ch, sessions: 0, purchases: 0, conversion: 0, cac: 0, revenue: 0 });
      });
      
      currentEvents.forEach(event => {
        const meta = event.metadata as Record<string, unknown> | null;
        const ch = (meta?.channel as string) || 'direct';
        const existing = channelMap.get(ch);
        if (existing) {
          existing.sessions += 1;
        }
      });
      
      setChannelData(Array.from(channelMap.values()));
      
      // Landing page breakdown
      const pageMap = new Map<string, LandingPageData>();
      currentEvents.forEach(event => {
        if (event.page_url) {
          try {
            const url = new URL(event.page_url);
            const path = url.pathname || '/';
            if (!pageMap.has(path)) {
              pageMap.set(path, { page: path, sessions: 0, intentActions: 0, intentRate: 0, purchases: 0, conversion: 0 });
            }
            const existing = pageMap.get(path)!;
            existing.sessions += 1;
          } catch {
            // Invalid URL
          }
        }
      });
      
      setLandingPageData(
        Array.from(pageMap.values())
          .sort((a, b) => b.sessions - a.sessions)
          .slice(0, 10)
      );
      
      // Venue breakdown
      const venueMap = new Map<string, VenueData>();
      ['LTB', 'HRTO', 'Small Claims', 'Family', 'Criminal'].forEach(v => {
        venueMap.set(v, { venue: v, purchases: 0, conversion: 0, revenue: 0 });
      });
      
      setVenueData(Array.from(venueMap.values()));
      
    } catch (error) {
      console.error('Error loading KPI data:', error);
      toast.error('Failed to load KPI data');
    } finally {
      setLoading(false);
    }
  };

  const copyWeeklyReport = () => {
    const report = `
Weekly KPI Report - Justice-Bot
Generated: ${format(new Date(), 'PPP')}
Period: Last ${dateRange} days

| Metric | Current Value | WoW % Change | Target | Status |
|--------|---------------|--------------|--------|--------|
| Organic Intent-to-Action | ${kpiData.organicIntentRate.toFixed(2)}% | ${kpiData.organicIntentRateWoW >= 0 ? '+' : ''}${kpiData.organicIntentRateWoW.toFixed(1)}% | >6% | ${getStatus(kpiData.organicIntentRate, 'intentToAction')} |
| Visitor→Purchase | ${kpiData.visitorPurchaseRate.toFixed(2)}% | ${kpiData.visitorPurchaseRateWoW >= 0 ? '+' : ''}${kpiData.visitorPurchaseRateWoW.toFixed(1)}% | >2% | ${getStatus(kpiData.visitorPurchaseRate, 'conversion')} |
| Purchases (${dateRange}d) | ${kpiData.transactionVolume} | ${kpiData.transactionVolumeWoW >= 0 ? '+' : ''}${kpiData.transactionVolumeWoW.toFixed(1)}% | - | - |
| CAC | $${kpiData.cac.toFixed(2)} | ${kpiData.cacWoW >= 0 ? '+' : ''}${kpiData.cacWoW.toFixed(1)}% | <$4.00 | ${getStatus(kpiData.cac, 'cac')} |
| Delivery Success | ${kpiData.deliverySuccessRate.toFixed(1)}% | ${kpiData.deliverySuccessRateWoW >= 0 ? '+' : ''}${kpiData.deliverySuccessRateWoW.toFixed(1)}% | >95% | ${getStatus(kpiData.deliverySuccessRate, 'deliverySuccess')} |
| Median Time-to-Purchase | ${kpiData.medianTimeToPurchase}h | - | - | - |

Total Revenue: $${kpiData.revenue.toFixed(2)}
Total Sessions: ${kpiData.totalSessions}
`.trim();
    
    navigator.clipboard.writeText(report);
    toast.success('Weekly report copied to clipboard');
  };

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>KPI Dashboard | Admin | Justice-Bot</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/admin')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Transactional KPI Dashboard</h1>
              <p className="text-muted-foreground">$5.99 form purchase funnel metrics</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={loadKPIData} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button onClick={copyWeeklyReport}>
              <Copy className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="14">Last 14 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={channel} onValueChange={setChannel}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Channel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Channels</SelectItem>
              <SelectItem value="organic">Organic</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="direct">Direct</SelectItem>
              <SelectItem value="referral">Referral</SelectItem>
              <SelectItem value="email">Email</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={venue} onValueChange={setVenue}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Venue" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Venues</SelectItem>
              <SelectItem value="LTB">LTB</SelectItem>
              <SelectItem value="HRTO">HRTO</SelectItem>
              <SelectItem value="Small Claims">Small Claims</SelectItem>
              <SelectItem value="Family">Family</SelectItem>
              <SelectItem value="Criminal">Criminal</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <>
            {/* At-a-Glance Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 mb-8">
              <MetricCard
                title="Organic Intent-to-Action"
                value={`${kpiData.organicIntentRate.toFixed(2)}%`}
                change={kpiData.organicIntentRateWoW}
                status={getStatus(kpiData.organicIntentRate, 'intentToAction')}
                icon={TrendingUp}
              />
              <MetricCard
                title="Visitor→Purchase"
                value={`${kpiData.visitorPurchaseRate.toFixed(2)}%`}
                change={kpiData.visitorPurchaseRateWoW}
                status={getStatus(kpiData.visitorPurchaseRate, 'conversion')}
                icon={ShoppingCart}
              />
              <MetricCard
                title={`Purchases (${dateRange}d)`}
                value={kpiData.transactionVolume.toString()}
                subValue={`$${kpiData.revenue.toFixed(2)} revenue`}
                change={kpiData.transactionVolumeWoW}
                icon={DollarSign}
              />
              <MetricCard
                title="CAC"
                value={`$${kpiData.cac.toFixed(2)}`}
                status={getStatus(kpiData.cac, 'cac')}
                change={kpiData.cacWoW}
                icon={kpiData.cac >= 5.99 ? AlertTriangle : DollarSign}
              />
              <MetricCard
                title="Delivery Success"
                value={`${kpiData.deliverySuccessRate.toFixed(1)}%`}
                status={getStatus(kpiData.deliverySuccessRate, 'deliverySuccess')}
                icon={CheckCircle}
              />
              <MetricCard
                title="Time-to-Purchase"
                value={`${kpiData.medianTimeToPurchase}h`}
                subValue="median"
                icon={Clock}
              />
            </div>
            
            {/* Charts */}
            <div className="grid gap-6 lg:grid-cols-2 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Daily Purchases</CardTitle>
                  <CardDescription>Transaction volume over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={dailyData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="date" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="purchases" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trend</CardTitle>
                  <CardDescription>Cumulative daily metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={dailyData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="date" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="purchases" stroke="hsl(var(--chart-1))" strokeWidth={2} name="Purchases" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Diagnostic Tables */}
            <Tabs defaultValue="landing" className="space-y-4">
              <TabsList>
                <TabsTrigger value="landing">Landing Pages</TabsTrigger>
                <TabsTrigger value="channels">Channels</TabsTrigger>
                <TabsTrigger value="venues">Venues</TabsTrigger>
              </TabsList>
              
              <TabsContent value="landing">
                <Card>
                  <CardHeader>
                    <CardTitle>Top Landing Pages</CardTitle>
                    <CardDescription>Sessions, intent actions, and conversion by page</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Page</TableHead>
                          <TableHead className="text-right">Sessions</TableHead>
                          <TableHead className="text-right">Intent Actions</TableHead>
                          <TableHead className="text-right">Intent Rate</TableHead>
                          <TableHead className="text-right">Purchases</TableHead>
                          <TableHead className="text-right">Conversion</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {landingPageData.map((page) => (
                          <TableRow key={page.page}>
                            <TableCell className="font-mono text-sm">{page.page}</TableCell>
                            <TableCell className="text-right">{page.sessions}</TableCell>
                            <TableCell className="text-right">{page.intentActions}</TableCell>
                            <TableCell className="text-right">{page.intentRate.toFixed(2)}%</TableCell>
                            <TableCell className="text-right">{page.purchases}</TableCell>
                            <TableCell className="text-right">{page.conversion.toFixed(2)}%</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="channels">
                <Card>
                  <CardHeader>
                    <CardTitle>Channel Breakdown</CardTitle>
                    <CardDescription>Performance by acquisition channel</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Channel</TableHead>
                          <TableHead className="text-right">Sessions</TableHead>
                          <TableHead className="text-right">Purchases</TableHead>
                          <TableHead className="text-right">Conversion</TableHead>
                          <TableHead className="text-right">CAC</TableHead>
                          <TableHead className="text-right">Revenue</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {channelData.map((ch) => (
                          <TableRow key={ch.channel} className={ch.cac >= 5.99 ? 'bg-red-500/5' : ''}>
                            <TableCell className="capitalize font-medium">{ch.channel}</TableCell>
                            <TableCell className="text-right">{ch.sessions}</TableCell>
                            <TableCell className="text-right">{ch.purchases}</TableCell>
                            <TableCell className="text-right">{ch.conversion.toFixed(2)}%</TableCell>
                            <TableCell className="text-right">
                              ${ch.cac.toFixed(2)}
                              {ch.cac >= 5.99 && <AlertTriangle className="inline ml-1 h-4 w-4 text-red-500" />}
                            </TableCell>
                            <TableCell className="text-right">${ch.revenue.toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="venues">
                <Card>
                  <CardHeader>
                    <CardTitle>Venue Breakdown</CardTitle>
                    <CardDescription>Performance by tribunal/court type</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Venue</TableHead>
                          <TableHead className="text-right">Purchases</TableHead>
                          <TableHead className="text-right">Conversion</TableHead>
                          <TableHead className="text-right">Revenue</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {venueData.map((v) => (
                          <TableRow key={v.venue}>
                            <TableCell className="font-medium">{v.venue}</TableCell>
                            <TableCell className="text-right">{v.purchases}</TableCell>
                            <TableCell className="text-right">{v.conversion.toFixed(2)}%</TableCell>
                            <TableCell className="text-right">${v.revenue.toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminKPI;
