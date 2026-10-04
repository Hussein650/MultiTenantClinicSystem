import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    FolderGit2,
    LayoutGrid,
    Users,
    UserCircle,
    Calendar,
    CalendarPlus,
    CheckCircle,
    Building2,
    Clock
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';


export function AppSidebar() {
    const page = usePage();
    const user = (page.props.auth as { user: {role?: string } }).user;

    const dashboardUrl = '/dashboard';

    const mainNavItems: NavItem[] = [
        {
            title: 'لوحة التحكم',
            href: dashboardUrl,
            icon: LayoutGrid,
        },
    ];

    if (user?.role === 'super_admin') {
        mainNavItems.push(
            { title: 'العيادات', href: '/admin/clinics', icon: FolderGit2 },
            { title: 'المستخدمون', href: '/admin/users', icon: Users },
        );
    } else if (user?.role === 'clinic_admin') {
        mainNavItems.push(
            { title: 'الأطباء', href: '/doctors', icon: Users },
            { title: 'المرضى', href: '/patients', icon: UserCircle },
            { title: 'الموافقات', href: '/admin/approvals', icon: CheckCircle },
            { title: 'المواعيد', href: '/appointments', icon: Calendar },
        );
    } else if (user?.role === 'doctor') {
        mainNavItems.push(
            { title: 'الجدول الزمني', href: '/doctor/availability', icon: Clock },
            { title: 'المواعيد', href: '/appointments', icon: Calendar },
            { title: 'المرضى', href: '/patients', icon: UserCircle },
        );
    } else if (user?.role === 'patient') {
        mainNavItems.push(
            { title: 'الحجز عند طبيب', href: '/doctors', icon: Users },
            { title: 'المواعيد', href: '/appointments', icon: CalendarPlus },
        );
    }

    const isSuperAdmin = user?.role === 'super_admin';

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboardUrl} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>

                {isSuperAdmin && (
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <div className="flex items-center gap-2 px-2 py-1.5 text-xs text-muted-foreground  group-data-[collapsible=icon]:hidden">
                                <Building2 className='h-3 w-3'/>
                                <span>مشرف النظام</span>
                            </div>
                        </SidebarMenuItem>
                    </SidebarMenu>
                )}
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
