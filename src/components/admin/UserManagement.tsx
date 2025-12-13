import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Eye, 
  UserPlus, 
  UserMinus, 
  Shield,
  ShieldCheck,
  ShieldX,
  MoreHorizontal,
  Mail,
  Calendar,
  Briefcase
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";

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

interface UserListProps {
  users: User[];
  admins: AdminUser[];
  onViewDetails: (user: User) => void;
  onGrantAdmin: (user: User) => void;
  onRevokeAdmin: (user: User) => void;
}

export function UserList({ users, admins, onViewDetails, onGrantAdmin, onRevokeAdmin }: UserListProps) {
  const isAdmin = (userId: string) => {
    return admins.some(a => a.user_id === userId && a.is_active);
  };

  const getInitials = (email: string, displayName?: string) => {
    if (displayName) {
      return displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return email.slice(0, 2).toUpperCase();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users</CardTitle>
        <CardDescription>{users.length} registered users</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          <div className="divide-y">
            {users.map((user) => {
              const userIsAdmin = isAdmin(user.id);
              
              return (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className={userIsAdmin ? "bg-primary text-primary-foreground" : ""}>
                        {getInitials(user.email, user.display_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{user.email}</span>
                        {userIsAdmin && (
                          <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
                            <ShieldCheck className="w-3 h-3 mr-1" />
                            Admin
                          </Badge>
                        )}
                        {user.email_confirmed_at && (
                          <Badge variant="outline" className="text-xs text-green-600 border-green-200">
                            Verified
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(user.created_at), "MMM d, yyyy")}
                        </span>
                        {user.cases_count !== undefined && user.cases_count > 0 && (
                          <span className="flex items-center gap-1">
                            <Briefcase className="w-3 h-3" />
                            {user.cases_count} cases
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onViewDetails(user)}>
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      {!userIsAdmin ? (
                        <DropdownMenuItem onClick={() => onGrantAdmin(user)}>
                          <UserPlus className="w-4 h-4 mr-2" />
                          Grant Admin
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem 
                          onClick={() => onRevokeAdmin(user)}
                          className="text-destructive"
                        >
                          <UserMinus className="w-4 h-4 mr-2" />
                          Revoke Admin
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

interface AdminListProps {
  admins: AdminUser[];
  onRevokeAdmin: (admin: AdminUser) => void;
}

export function AdminList({ admins, onRevokeAdmin }: AdminListProps) {
  const activeAdmins = admins.filter(a => a.is_active);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Admin Users
        </CardTitle>
        <CardDescription>{activeAdmins.length} active administrators</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[300px]">
          <div className="divide-y">
            {admins.map((admin) => (
              <div
                key={admin.user_id}
                className={`flex items-center justify-between p-4 ${
                  !admin.is_active ? "opacity-50" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    admin.is_active ? "bg-green-500/10" : "bg-red-500/10"
                  }`}>
                    {admin.is_active ? (
                      <ShieldCheck className="w-4 h-4 text-green-600" />
                    ) : (
                      <ShieldX className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{admin.email}</p>
                    <p className="text-xs text-muted-foreground">
                      Granted {format(new Date(admin.granted_at), "MMM d, yyyy")}
                      {admin.notes && ` • ${admin.notes}`}
                    </p>
                    {admin.revoked_at && (
                      <p className="text-xs text-red-500">
                        Revoked {format(new Date(admin.revoked_at), "MMM d, yyyy")}
                      </p>
                    )}
                  </div>
                </div>
                
                {admin.is_active && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => onRevokeAdmin(admin)}
                  >
                    <UserMinus className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
