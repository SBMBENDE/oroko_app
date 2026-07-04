'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bell, CheckCheck, Trash2, Loader2 } from 'lucide-react';
import { notificationsApi } from '@/lib/api/messages.api';

const TYPE_STYLES: Record<string, { icon: string; color: string }> = {
  MESSAGE:    { icon: '💬', color: 'bg-blue-50 border-blue-100' },
  APPROVAL:   { icon: '✅', color: 'bg-green-50 border-green-100' },
  REJECTION:  { icon: '❌', color: 'bg-red-50 border-red-100' },
  SUSPENSION: { icon: '⚠️', color: 'bg-amber-50 border-amber-100' },
  ROLE_CHANGE:{ icon: '🎖️', color: 'bg-purple-50 border-purple-100' },
  SYSTEM:     { icon: '📢', color: 'bg-stone-50 border-stone-100' },
};

interface Notification {
  _id: string; type: string; title: string; body: string;
  read: boolean; createdAt: string;
}

export default function NotificationsPage() {
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['notifications-all'],
    queryFn: () => notificationsApi.getAll({ limit: 50 }),
    select: (r) => r.data,
  });

  const notifications: Notification[] = data?.data ?? [];
  const unread: number = data?.meta?.totalUnread ?? 0;

  const markOne = useMutation({
    mutationFn: (id: string) => notificationsApi.markOneRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications-all'] }),
  });

  const markAll = useMutation({
    mutationFn: () => notificationsApi.markAllRead(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications-all'] }),
  });

  const del = useMutation({
    mutationFn: (id: string) => notificationsApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications-all'] }),
  });

  return (
    <main className="min-h-screen bg-stone-50 pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-stone-900 flex items-center gap-2">
              <Bell className="w-6 h-6 text-amber-500" /> Notifications
            </h1>
            {unread > 0 && (
              <p className="text-sm text-stone-400 mt-0.5">{unread} unread</p>
            )}
          </div>
          {unread > 0 && (
            <button
              onClick={() => markAll.mutate()}
              disabled={markAll.isPending}
              className="flex items-center gap-1.5 text-sm text-amber-600 font-medium hover:underline disabled:opacity-50"
            >
              {markAll.isPending
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : <CheckCheck className="w-4 h-4" />}
              Mark all read
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-stone-300" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-20">
            <Bell className="w-10 h-10 text-stone-200 mx-auto mb-3" />
            <p className="text-stone-400">No notifications yet</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {notifications.map((n) => {
              const style = TYPE_STYLES[n.type] ?? TYPE_STYLES.SYSTEM;
              return (
                <li
                  key={n._id}
                  className={`flex items-start gap-4 rounded-2xl border px-5 py-4 transition-all ${
                    n.read ? 'bg-white border-stone-100' : style.color
                  }`}
                >
                  <span className="text-2xl shrink-0 mt-0.5">{style.icon}</span>

                  <div
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => { if (!n.read) markOne.mutate(n._id); }}
                  >
                    <p className={`text-sm font-semibold ${n.read ? 'text-stone-600' : 'text-stone-900'}`}>
                      {n.title}
                      {!n.read && <span className="ml-2 inline-block w-2 h-2 rounded-full bg-amber-500 align-middle" />}
                    </p>
                    <p className="text-xs text-stone-400 mt-0.5 line-clamp-2">{n.body}</p>
                    <p className="text-xs text-stone-300 mt-1.5">
                      {new Date(n.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <button
                    onClick={() => del.mutate(n._id)}
                    className="shrink-0 p-1.5 text-stone-300 hover:text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
}
