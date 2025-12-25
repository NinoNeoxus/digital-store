import { AdminSidebar } from '@/components/admin-sidebar';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/login');
    }

    if (session.user.role !== 'ADMIN') {
        redirect('/');
    }

    return (
        <div className="flex min-h-screen bg-black text-white pt-16">
            <AdminSidebar />
            <main className="flex-1 ml-64 p-8 animate-in fade-in duration-500">
                {children}
            </main>
        </div>
    );
}
