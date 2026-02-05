 import React from 'react';
 import { useAuthStore } from '@/stores/authStore';
 import { useNavigate, Link, useLocation } from 'react-router-dom';
 import { Button } from '@/components/ui/button';
 import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
 } from '@/components/ui/dropdown-menu';
 import { LayoutDashboard, Plus, User, LogOut, Menu } from 'lucide-react';
 import { cn } from '@/lib/utils';
 
 interface DashboardLayoutProps {
   children: React.ReactNode;
 }
 
 export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
   const { user, logout } = useAuthStore();
   const navigate = useNavigate();
   const location = useLocation();
 
   const handleLogout = () => {
     logout();
     navigate('/login');
   };
 
   const navItems = [
     { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
     { label: 'Novo Card', href: '/dashboard/cards/new', icon: Plus },
   ];
 
   return (
     <div className="min-h-screen bg-background">
       {/* Header */}
       <header className="sticky top-0 z-40 glass border-b">
         <div className="container mx-auto px-4 h-16 flex items-center justify-between">
           <div className="flex items-center gap-8">
             <Link to="/dashboard" className="flex items-center gap-2">
               <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                 <svg
                   className="w-4 h-4 text-primary-foreground"
                   fill="none"
                   viewBox="0 0 24 24"
                   stroke="currentColor"
                 >
                   <path
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     strokeWidth={2}
                     d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                   />
                 </svg>
               </div>
               <span className="font-bold text-lg hidden sm:inline">VoiceCards</span>
             </Link>
 
             <nav className="hidden md:flex items-center gap-1">
               {navItems.map(item => (
                 <Link
                   key={item.href}
                   to={item.href}
                   className={cn(
                     'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                     location.pathname === item.href
                       ? 'bg-primary/10 text-primary'
                       : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                   )}
                 >
                   <item.icon className="h-4 w-4" />
                   {item.label}
                 </Link>
               ))}
             </nav>
           </div>
 
           <div className="flex items-center gap-2">
             <DropdownMenu>
               <DropdownMenuTrigger asChild>
                 <Button variant="ghost" className="flex items-center gap-2">
                   <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                     <User className="h-4 w-4 text-primary" />
                   </div>
                   <span className="hidden sm:inline text-sm font-medium">
                     {user?.name}
                   </span>
                 </Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent align="end" className="w-48">
                 <div className="px-2 py-1.5">
                   <p className="text-sm font-medium">{user?.name}</p>
                   <p className="text-xs text-muted-foreground">{user?.email}</p>
                 </div>
                 <DropdownMenuSeparator />
                 <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                   <LogOut className="h-4 w-4 mr-2" />
                   Sair
                 </DropdownMenuItem>
               </DropdownMenuContent>
             </DropdownMenu>
           </div>
         </div>
       </header>
 
       {/* Main content */}
       <main className="container mx-auto px-4 py-8">
         {children}
       </main>
     </div>
   );
 };