'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { Users, Clock, CheckCircle, XCircle, ShieldCheck, Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/api/client';

interface Member {
  _id: string; firstName: string; lastName: string; email: string;
  role: string; status: string; country: string; createdAt: string;
  chapter?: { name: string };
}
interface Stats { byStatus: Record<string, number>; byRole: Record<string, number>; newThisMonth: number; }

export default function AdminPage() {
  const qc = useQueryClient();

  const { data: stats } = useQuery<Stats>({
    queryKey: ['admin-stats'],
    queryFn: () => apiClient.get('/admin/stats').then((r) => r.data.data),
  });

  const { data: pending, isLoading: pendingLoading } = useQuery<Member[]>({
    queryKey: ['admin-pending'],
    queryFn: () => apiClient.get('/admin', { params: { status: 'Pending', limit: 20 } }).then((r) => r.data.data),
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => apiClient.patch(`/admin/${id}/approve`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-pending'] }); qc.invalidateQueries({ queryKey: ['admin-stats'] }); },
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) => apiClient.patch(`/admin/${id}/reject`, { reason: 'Application not approved at this time.' }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-pending'] }); qc.invalidateQueries({ queryKey: ['admin-stats'] }); },
  });

  const statCards = [
    { label: 'Active Members',   value: stats?.byStatus?.Active   ?? 0, icon: Users,        color: 'text-green-600 bg-green-50' },
    { label: 'Pending Approval', value: stats?.byStatus?.Pending  ?? 0, icon: Clock,        color: 'text-amber-600 bg-amber-50' },
    { label: 'Suspended',        value: stats?.byStatus?.Suspended ?? 0, icon: XCircle,     color: 'text-red-600 bg-red-50' },
    { label: 'New This Month',   value: stats?.newThisMonth       ?? 0, icon: CheckCircle,  color: 'text-blue-600 bg-blue-50' },
  ];

  return (
    <main className="min-h-screen bg-stone-50 pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">

        <div className="flex items-center gap-3 mb-8">
          <ShieldCheck className="w-7 h-7 text-amber-500" />
          <h1 className="text-2xl font-bold text-stone-900">Admin Panel</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {statCards.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-2xl border border-stone-100 px-5 py-4">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${color}`}>
                <Icon className="w-4.5 h-4.5" />
              </div>
              <p className="text-2xl font-bold text-stone-900">{value}</p>
              <p className="text-xs text-stone-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Nav shortcuts */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
          {[
            { href: '/admin/members', label: 'All Members', desc: 'View, search & manage' },
            { href: '/admin/members?status=Pending', label: 'Registration Queue', desc: 'Approve or reject' },
            { href: '/admin/members?status=Suspended', label: 'Suspended', desc: 'Review & reinstate' },
          ].map(({ href, label, desc }) => (
            <Link key={href} href={href}
              className="bg-white border border-stone-100 rounded-2xl px-5 py-4 hover:shadow-md transition-shadow">
              <p className="font-semibold text-stone-900 text-sm">{label}</p>
              <p className="text-xs text-stone-400 mt-1">{desc}</p>
            </Link>
          ))}
        </div>

        {/* Pending registrations */}
        <div className="bg-white rounded-2xl border border-stone-100">
          <div className="px-6 py-4 border-b border-stone-50 flex items-center justify-between">
            <h2 className="font-semibold text-stone-900">Pending Registrations</h2>
            <Link href="/admin/members?status=Pending" className="text-xs text-amber-600 hover:underline">View all</Link>
          </div>

          {pendingLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-stone-300" />
            </div>
          ) : !pending?.length ? (
            <p className="text-stone-400 text-sm text-center py-10">No pending registrations</p>
          ) : (
            <ul className="divide-y divide-stone-50">
              {pending.map((m) => (
                <li key={m._id} className="flex items-center gap-4 px-6 py-4">
                  <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-sm shrink-0">
                    {m.firstName[0]}{m.lastName[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-stone-900 truncate">{m.firstName} {m.lastName}</p>
                    <p className="text-xs text-stone-400 truncate">{m.email} · {m.country}</p>
                  </div>
                  <p className="text-xs text-stone-400 shrink-0 hidden sm:block">
                    {new Date(m.createdAt).toLocaleDateString()}
                  </p>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => approveMutation.mutate(m._id)}
                      disabled={approveMutation.isPending}
                      className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {approveMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : '✓'} Approve
                    </button>
                    <button
                      onClick={() => rejectMutation.mutate(m._id)}
                      disabled={rejectMutation.isPending}
                      className="flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors border border-red-200 disabled:opacity-50"
                    >
                      ✕ Reject
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
