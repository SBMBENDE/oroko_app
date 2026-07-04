'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import Image from 'next/image';
import { User, Bell, Settings, Edit, ShieldCheck, Mail } from 'lucide-react';
import { useAuthStore } from '@/lib/store/authStore';
import { notificationsApi } from '@/lib/api/messages.api';

export default function DashboardPage() {
  const { user } = useAuthStore();

  const { data: notifData } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationsApi.getAll({ limit: 5 }),
    select: (r) => r.data,
  });

  const unread: number = notifData?.meta?.totalUnread ?? 0;
  const notifications = notifData?.data ?? [];
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

  return (
    <main className="min-h-screen bg-stone-50 pt-20 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">

        {/* Header */}
        <div className="flex items-start gap-5 mb-10 pt-8">
          <div className="shrink-0">
            {user?.profilePhoto ? (
              <Image src={user.profilePhoto} alt={user.firstName ?? ''} width={72} height={72}
                className="w-18 h-18 rounded-2xl object-cover" unoptimized />
            ) : (
              <div className="w-18 h-18 rounded-2xl bg-amber-500 flex items-center justify-center text-white text-2xl font-bold">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
            )}
          </div>
          <div>
            <p className="text-amber-600 text-xs font-semibold uppercase tracking-widest mb-1">
              {user?.role?.replace(/_/g, ' ')}
            </p>
            <h1 className="text-2xl font-bold text-stone-900">
              Welcome, {user?.firstName}!
            </h1>
            <p className="text-stone-500 text-sm mt-1">
              {user?.memberNumber ? `Member #${user.memberNumber}` : 'Pending member'}
              {user?.chapter && ` · ${(user.chapter as { name: string }).name}`}
            </p>
          </div>
        </div>

        {/* Quick action cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { href: '/dashboard/profile', icon: Edit, label: 'Edit Profile', color: 'text-blue-600 bg-blue-50' },
            { href: '/dashboard/notifications', icon: Bell, label: `Notifications${unread ? ` (${unread})` : ''}`, color: 'text-amber-600 bg-amber-50' },
            { href: '/dashboard/messages', icon: Mail, label: 'Messages', color: 'text-green-600 bg-green-50' },
            { href: '/dashboard/settings', icon: Settings, label: 'Privacy', color: 'text-stone-600 bg-stone-100' },
          ].map(({ href, icon: Icon, label, color }) => (
            <Link key={href} href={href}
              className="flex flex-col items-center gap-2 bg-white rounded-2xl border border-stone-100 px-4 py-5 hover:shadow-md transition-shadow text-center">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-stone-700">{label}</span>
            </Link>
          ))}
        </div>

        {/* Admin shortcut */}
        {isAdmin && (
          <Link href="/admin"
            className="flex items-center gap-4 bg-amber-50 border border-amber-200 rounded-2xl px-6 py-4 mb-8 hover:bg-amber-100 transition-colors">
            <ShieldCheck className="w-6 h-6 text-amber-600 shrink-0" />
            <div>
              <p className="font-semibold text-stone-900 text-sm">Admin Panel</p>
              <p className="text-stone-500 text-xs">Manage members, approvals, chapters</p>
            </div>
            <span className="ml-auto text-amber-600 text-sm font-medium">Open →</span>
          </Link>
        )}

        {/* Recent notifications */}
        <div className="bg-white rounded-2xl border border-stone-100">
          <div className="flex items-center justify-between px-6 py-4 border-b border-stone-50">
            <h2 className="font-semibold text-stone-900 flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-500" /> Recent Notifications
            </h2>
            <Link href="/dashboard/notifications" className="text-xs text-amber-600 hover:underline">View all</Link>
          </div>
          {notifications.length === 0 ? (
            <p className="text-stone-400 text-sm text-center py-10">No notifications yet</p>
          ) : (
            <ul className="divide-y divide-stone-50">
              {notifications.map((n: { _id: string; title: string; body: string; read: boolean; createdAt: string }) => (
                <li key={n._id} className={`px-6 py-4 ${!n.read ? 'bg-amber-50/40' : ''}`}>
                  <p className="text-sm font-medium text-stone-900">{n.title}</p>
                  <p className="text-xs text-stone-500 mt-0.5 line-clamp-1">{n.body}</p>
                  <p className="text-xs text-stone-400 mt-1">{new Date(n.createdAt).toLocaleDateString()}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Membership info */}
        <div className="mt-6 bg-stone-900 text-white rounded-2xl px-6 py-5 flex items-center gap-4">
          <User className="w-8 h-8 text-amber-400 shrink-0" />
          <div>
            <p className="text-sm font-semibold">Membership Status</p>
            <p className="text-stone-300 text-xs mt-0.5 capitalize">{user?.status}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-xs text-stone-400">Member since</p>
            <p className="text-sm font-medium text-amber-400">
              {user?.joinedAt ? new Date(user.joinedAt as string).getFullYear() : '—'}
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}
