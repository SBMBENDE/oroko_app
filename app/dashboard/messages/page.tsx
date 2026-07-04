'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MessageSquare, Loader2 } from 'lucide-react';
import { messagesApi } from '@/lib/api/messages.api';
import { useAuthStore } from '@/lib/store/authStore';

interface Conversation {
  partner: { _id: string; firstName: string; lastName: string; profilePhoto?: string; role: string };
  lastMessage: { content: string; sender: string; createdAt: string; read: boolean };
  unreadCount: number;
}

export default function MessagesPage() {
  const { user } = useAuthStore();

  const { data, isLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => messagesApi.getConversations(),
    select: (r) => r.data.data as Conversation[],
    refetchInterval: 15000, // Poll every 15s for new messages
  });

  const conversations = data ?? [];
  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  return (
    <main className="min-h-screen bg-stone-50 pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-stone-900 flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-amber-500" /> Messages
            </h1>
            {totalUnread > 0 && (
              <p className="text-sm text-stone-400 mt-0.5">{totalUnread} unread</p>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-stone-300" />
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-20">
            <MessageSquare className="w-10 h-10 text-stone-200 mx-auto mb-3" />
            <p className="text-stone-400 mb-2">No conversations yet</p>
            <p className="text-stone-400 text-sm">
              Visit the{' '}
              <Link href="/members" className="text-amber-500 hover:underline">
                Members directory
              </Link>{' '}
              to start a conversation
            </p>
          </div>
        ) : (
          <ul className="bg-white rounded-2xl border border-stone-100 divide-y divide-stone-50 overflow-hidden">
            {conversations.map((c) => {
              const isUnread = c.unreadCount > 0;
              const isMine = c.lastMessage.sender === user?._id;
              return (
                <li key={c.partner._id}>
                  <Link
                    href={`/dashboard/messages/${c.partner._id}`}
                    className="flex items-center gap-4 px-5 py-4 hover:bg-stone-50 transition-colors"
                  >
                    {c.partner.profilePhoto ? (
                      <Image
                        src={c.partner.profilePhoto}
                        alt={c.partner.firstName}
                        width={44} height={44}
                        className="w-11 h-11 rounded-xl object-cover shrink-0"
                        unoptimized
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-xl bg-amber-500 flex items-center justify-center text-white font-bold shrink-0">
                        {c.partner.firstName[0]}{c.partner.lastName[0]}
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className={`text-sm font-semibold truncate ${isUnread ? 'text-stone-900' : 'text-stone-600'}`}>
                          {c.partner.firstName} {c.partner.lastName}
                        </p>
                        <p className="text-xs text-stone-300 shrink-0">
                          {new Date(c.lastMessage.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <p className={`text-xs mt-0.5 truncate ${isUnread ? 'text-stone-700 font-medium' : 'text-stone-400'}`}>
                        {isMine ? 'You: ' : ''}{c.lastMessage.content}
                      </p>
                    </div>

                    {isUnread && (
                      <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center shrink-0">
                        {c.unreadCount}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
}
