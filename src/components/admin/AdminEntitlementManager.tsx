import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/lib/toast-stub";
import { Gift, XCircle, History, Loader2, Search, Calendar, User } from "lucide-react";
import { format } from "date-fns";

interface AuditEntry {
  id: number;
  acted_by: string;
  acted_on: string;
  action: string;
  product_id: string;
  ends_at: string | null;
  note: string | null;
  created_at: string;
  admin_email?: string;
  user_email?: string;
}

interface EntitlementInfo {
  user_id: string;
  product_id: string;
  access_level: string;
  source: string;
  starts_at: string;
  ends_at: string | null;
}

const PRODUCT_OPTIONS = [
  { value: 'basic_monthly', label: 'Basic Monthly ($19/mo)' },
  { value: 'professional_monthly', label: 'Professional Monthly ($29.99/mo)' },
  { value: 'premium_monthly', label: 'Premium Monthly ($49.99/mo)' },
  { value: 'yearly_access', label: 'Yearly Access ($99.99/yr)' },
  { value: 'court_ready_bundle', label: 'Court-Ready Document Pack ($39)' },
  { value: 'form_unlock', label: 'Legal Form ($5.99)' },
];

export default function AdminEntitlementManager() {
  const [email, setEmail] = useState("");
  const [productId, setProductId] = useState("");
  const [customEndsAt, setCustomEndsAt] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [userEntitlements, setUserEntitlements] = useState<EntitlementInfo[]>([]);
  const [auditHistory, setAuditHistory] = useState<AuditEntry[]>([]);
  const [foundUserId, setFoundUserId] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<'grant' | 'revoke' | null>(null);
  const [selectedEntitlement, setSelectedEntitlement] = useState<EntitlementInfo | null>(null);

  // Search for user and their entitlements
  const searchUser = async () => {
    if (!email.trim()) {
      toast.error("Please enter an email address");
      return;
    }

    setSearching(true);
    setUserEntitlements([]);
    setFoundUserId(null);
    setAuditHistory([]);

    try {
      // Use edge function to look up user (since we can't access auth.users directly)
      const { data, error } = await supabase.functions.invoke('admin-grant-entitlement', {
        body: { email: email.trim(), product_id: 'search_only', action: 'grant', note: 'search' }
      });

      // If user found, we get their ID back; if not, we get an error
      if (error) {
        // Check if it's a "not found" error vs actual error
        if (error.message?.includes('not found')) {
          toast.error("User not found with that email");
        } else {
          throw error;
        }
        return;
      }

      if (data?.user_id) {
        setFoundUserId(data.user_id);
        
        // Fetch user's entitlements
        const { data: entitlements } = await supabase
          .from('entitlements')
          .select('*')
          .eq('user_id', data.user_id);
        
        setUserEntitlements(entitlements || []);

        // Fetch audit history for this user
        const { data: audit } = await supabase
          .from('entitlement_audit')
          .select('*')
          .eq('acted_on', data.user_id)
          .order('created_at', { ascending: false })
          .limit(20);

        setAuditHistory(audit || []);
        toast.success(`Found user: ${data.email}`);
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Failed to search for user");
    } finally {
      setSearching(false);
    }
  };

  const handleGrant = async () => {
    if (!email.trim() || !productId) {
      toast.error("Email and product are required");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('admin-grant-entitlement', {
        body: {
          email: email.trim(),
          product_id: productId,
          ends_at: customEndsAt || null,
          note: note || `Manual grant by admin`,
          action: 'grant'
        }
      });

      if (error) throw error;

      toast.success(`Entitlement granted to ${data.email}`);
      setNote("");
      setCustomEndsAt("");
      setConfirmAction(null);
      
      // Refresh search
      if (foundUserId) {
        searchUser();
      }
    } catch (error: unknown) {
      console.error("Grant error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to grant entitlement");
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async (entitlement: EntitlementInfo) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('admin-grant-entitlement', {
        body: {
          email: email.trim(),
          product_id: entitlement.product_id,
          note: note || `Revoked by admin`,
          action: 'revoke'
        }
      });

      if (error) throw error;

      toast.success(`Entitlement revoked`);
      setConfirmAction(null);
      setSelectedEntitlement(null);
      setNote("");
      
      // Refresh search
      searchUser();
    } catch (error: unknown) {
      console.error("Revoke error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to revoke entitlement");
    } finally {
      setLoading(false);
    }
  };

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'grant':
        return <Badge className="bg-green-100 text-green-800">Grant</Badge>;
      case 'revoke':
        return <Badge variant="destructive">Revoke</Badge>;
      case 'extend':
        return <Badge className="bg-blue-100 text-blue-800">Extend</Badge>;
      default:
        return <Badge variant="secondary">{action}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Grant Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Grant/Revoke Entitlements
          </CardTitle>
          <CardDescription>
            Manually manage user entitlements for customers who paid before the database reset
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Email Search */}
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="email">User Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="customer@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && searchUser()}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={searchUser} disabled={searching} variant="outline">
                {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                <span className="ml-2">Search</span>
              </Button>
            </div>
          </div>

          {/* Current Entitlements */}
          {foundUserId && (
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium flex items-center gap-2 mb-2">
                <User className="h-4 w-4" />
                Current Entitlements
              </h4>
              {userEntitlements.length === 0 ? (
                <p className="text-sm text-muted-foreground">No active entitlements</p>
              ) : (
                <div className="space-y-2">
                  {userEntitlements.map((ent) => (
                    <div key={ent.product_id} className="flex items-center justify-between p-2 bg-background rounded border">
                      <div>
                        <span className="font-medium">{ent.product_id}</span>
                        <span className="text-sm text-muted-foreground ml-2">
                          ({ent.source})
                        </span>
                        {ent.ends_at && (
                          <span className="text-sm text-muted-foreground ml-2">
                            expires {format(new Date(ent.ends_at), 'MMM d, yyyy')}
                          </span>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          setSelectedEntitlement(ent);
                          setConfirmAction('revoke');
                        }}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Revoke
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Grant Form */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="product">Product/Plan</Label>
              <Select value={productId} onValueChange={setProductId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a plan" />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCT_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="endsAt">Custom End Date (optional)</Label>
              <Input
                id="endsAt"
                type="date"
                value={customEndsAt}
                onChange={(e) => setCustomEndsAt(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="note">Note (for audit log)</Label>
            <Textarea
              id="note"
              placeholder="e.g., Stripe paid before reset; manual restore"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
            />
          </div>

          <Button
            onClick={() => setConfirmAction('grant')}
            disabled={!email || !productId || loading}
            className="w-full"
          >
            <Gift className="h-4 w-4 mr-2" />
            Grant Entitlement
          </Button>
        </CardContent>
      </Card>

      {/* Audit History */}
      {foundUserId && auditHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Audit History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <div className="space-y-2">
                {auditHistory.map((entry) => (
                  <div key={entry.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      {getActionBadge(entry.action)}
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(entry.created_at), 'MMM d, yyyy h:mm a')}
                      </span>
                    </div>
                    <p className="text-sm font-medium">{entry.product_id}</p>
                    {entry.ends_at && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Expires: {format(new Date(entry.ends_at), 'MMM d, yyyy')}
                      </p>
                    )}
                    {entry.note && (
                      <p className="text-xs text-muted-foreground mt-1 italic">"{entry.note}"</p>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Confirmation Dialogs */}
      <AlertDialog open={confirmAction === 'grant'} onOpenChange={() => setConfirmAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Entitlement Grant</AlertDialogTitle>
            <AlertDialogDescription>
              This will grant <strong>{productId}</strong> access to <strong>{email}</strong>.
              {note && <><br /><br />Note: "{note}"</>}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleGrant} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Confirm Grant
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={confirmAction === 'revoke'} onOpenChange={() => setConfirmAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Entitlement Revocation</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove <strong>{selectedEntitlement?.product_id}</strong> access from this user.
              This action is logged in the audit trail.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedEntitlement && handleRevoke(selectedEntitlement)}
              disabled={loading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Confirm Revoke
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
