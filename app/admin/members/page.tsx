'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { Search, Loader2, CheckCircle, XCircle, PauseCircle, RotateCcw } from 'lucide-react';
import { apiClient } from '@/lib/api/client';

interface Member {
  _id: string; firstName: string; lastName: string; email: string;
  role: string; status: string; country: string; createdAt: string;
  memberNumber?: string; chapter?: { name: string };
}

const STATUS_COLORS: Record<string, string> = {
  Active: 'bg-green-100 text-green-700',
  Pending: 'bg-amber-100 text-amber-700',
  Suspended: 'bg-red-100 text-red-700',
  Inactive: 'bg-stone-100 text-stone-600',
  Rejected: 'bg-stone-100 text-stone-500',
};

export default function AdminMembersPage() {
  const searchParams = useSearchParams();
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState(searchParams.get('status') ?? '');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-members', search, status],
    queryFn: () =>
      apiClient.get('/admin', { params: { search: search || undefined, status: status || undefined, limit: 50 } }).then((r) => r.data),
    placeholderData: (prev) => prev,
  });

  const members: Member[] = data?.data ?? [];

  const action = (id: string, endpoint: string, body?: object) =>
    apiClient.patch(`/admin/${id}/${endpoint}`, body ?? {});

  const mut = (endpoint: string, body?: object) =>
    useMutation({
      mutationFn: (id: string) => action(id, endpoint, body),
      onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-members'] }),
    });

  const approveMut  = mut('approve');
  const rejectMut   = mut('reject', { reason: 'Application not approved.' });
  const suspendMut  = mut('suspend', { reason: 'Account suspended by admin.' });
  const reinstateMut = mut('reinstate');

  return (
    <main className="min-h-screen bg-stone-50 pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <h1 className="text-2xl font-bold text-stone-900 mb-6">All Members</h1>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, country…"
              className="w-full pl-10 pr-4 py-2.5 border border-stone-200 rounded-xl text-sm bg-white focus:outline-none focus:border-amber-400"
            />
          </div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border border-stone-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-amber-400"
          >
            <option value="">All Statuses</option>
            {['Active','Pending','Suspended','Inactive','Rejected'].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-stone-300" />
            </div>
          ) : !members.length ? (
            <p className="text-stone-400 text-sm text-center py-16">No members found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-100 bg-stone-50">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-stone-400 uppercase tracking-wide">Member</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-stone-400 uppercase tracking-wide hidden sm:table-cell">Country</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-stone-400 uppercase tracking-wide hidden md:table-cell">Chapter</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-stone-400 uppercase tracking-wide">Status</th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-stone-400 uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {members.map((m) => (
                    <tr key={m._id} className="hover:bg-stone-50/60 transition-colors">
                      <td className="px-5 py-3.5">
                        <p className="font-semibold text-stone-900">{m.firstName} {m.lastName}</p>
                        <p className="text-xs text-stone-400">{m.email}</p>
                        {m.memberNumber && <p className="text-xs text-amber-600">{m.memberNumber}</p>}
                      </td>
                      <td className="px-4 py-3.5 text-stone-600 hidden sm:table-cell">{m.country}</td>
                      <td className="px-4 py-3.5 text-stone-500 hidden md:table-cell">{m.chapter?.name ?? '—'}</td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_COLORS[m.status] ?? ''}`}>
                          {m.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1.5">
                          {m.status === 'Pending' && (
                            <>
                              <button onClick={() => approveMut.mutate(m._id)} title="Approve"
                                className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button onClick={() => rejectMut.mutate(m._id)} title="Reject"
                                className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          {m.status === 'Active' && (
                            <button onClick={() => suspendMut.mutate(m._id)} title="Suspend"
                              className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors">
                              <PauseCircle className="w-4 h-4" />
                            </button>
                          )}
                          {m.status === 'Suspended' && (
                            <button onClick={() => reinstateMut.mutate(m._id)} title="Reinstate"
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                              <RotateCcw className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <p className="text-xs text-stone-400 text-right mt-3">{members.length} member(s) shown</p>
      </div>
    </main>
  );
}
