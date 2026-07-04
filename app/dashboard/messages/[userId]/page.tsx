'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Send, Loader2, Trash2 } from 'lucide-react';
import { messagesApi } from '@/lib/api/messages.api';
import { membersApi } from '@/lib/api/members.api';
import { useAuthStore } from '@/lib/store/authStore';

interface Message {
  _id: string; content: string; read: boolean; createdAt: string;
  sender: { _id: string; firstName: string; lastName: string };
}

export default function ThreadPage() {
  const { userId } = useParams<{ userId: string }>();
  const router = useRouter();
  const { user } = useAuthStore();
  const qc = useQueryClient();
  const [text, setText] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  // Fetch partner profile
  const { data: partner } = useQuery({
    queryKey: ['member', userId],
    queryFn: () => membersApi.getById(userId),
    select: (r) => r.data.data,
  });

  // Fetch message thread
  const { data: threadData, isLoading } = useQuery({
    queryKey: ['thread', userId],
    queryFn: () => messagesApi.getThread(userId, { limit: 50 }),
    select: (r) => r.data.data as Message[],
    refetchInterval: 5000, // Poll every 5s
  });

  const messages = threadData ?? [];

  // Mark thread as read on open
  useEffect(() => {
    messagesApi.markRead(userId).catch(() => {});
    qc.invalidateQueries({ queryKey: ['conversations'] });
  }, [userId, qc]);

  // Scroll to bottom when messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMutation = useMutation({
    mutationFn: () => messagesApi.send(userId, text.trim()),
    onSuccess: () => {
      setText('');
      qc.invalidateQueries({ queryKey: ['thread', userId] });
      qc.invalidateQueries({ queryKey: ['conversations'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (msgId: string) => messagesApi.delete(msgId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['thread', userId] }),
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    sendMutation.mutate();
  };

  return (
    <main className="min-h-screen bg-stone-50 flex flex-col pt-20">
      {/* Header */}
      <div className="bg-white border-b border-stone-100 px-4 sm:px-6 py-4 flex items-center gap-4 sticky top-16 z-10">
        <button onClick={() => router.back()} className="p-1.5 rounded-lg hover:bg-stone-100 transition-colors">
          <ArrowLeft className="w-5 h-5 text-stone-500" />
        </button>
        {partner && (
          <>
            {partner.profilePhoto ? (
              <Image src={partner.profilePhoto} alt={partner.firstName} width={36} height={36}
                className="w-9 h-9 rounded-xl object-cover" unoptimized />
            ) : (
              <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-white font-bold text-sm">
                {partner.firstName?.[0]}{partner.lastName?.[0]}
              </div>
            )}
            <div>
              <p className="text-sm font-semibold text-stone-900">{partner.firstName} {partner.lastName}</p>
              {partner.profession && <p className="text-xs text-stone-400">{partner.profession}</p>}
            </div>
          </>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-3 max-w-2xl mx-auto w-full">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-stone-300" />
          </div>
        ) : messages.length === 0 ? (
          <p className="text-center text-stone-400 text-sm py-10">No messages yet. Say hello!</p>
        ) : (
          messages.map((m) => {
            const mine = m.sender._id === user?._id;
            return (
              <div key={m._id} className={`flex items-end gap-2 ${mine ? 'justify-end' : 'justify-start'}`}>
                <div className={`group relative max-w-[75%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                  mine
                    ? 'bg-amber-500 text-white rounded-br-md'
                    : 'bg-white text-stone-900 border border-stone-100 rounded-bl-md'
                }`}>
                  <p className="leading-relaxed">{m.content}</p>
                  <p className={`text-xs mt-1 ${mine ? 'text-amber-200' : 'text-stone-300'}`}>
                    {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {mine && m.read && ' ✓✓'}
                  </p>
                  {mine && (
                    <button
                      onClick={() => deleteMutation.mutate(m._id)}
                      className="absolute -top-2 -right-2 hidden group-hover:flex w-6 h-6 items-center justify-center bg-red-500 text-white rounded-full shadow"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-stone-100 px-4 sm:px-6 py-4 sticky bottom-0">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSend} className="flex items-end gap-3">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(e); } }}
              placeholder="Type a message… (Enter to send)"
              rows={1}
              maxLength={2000}
              className="flex-1 resize-none border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-400 transition-colors max-h-28 overflow-y-auto"
              style={{ minHeight: '44px' }}
            />
            <button
              type="submit"
              disabled={!text.trim() || sendMutation.isPending}
              className="flex items-center justify-center w-11 h-11 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-white rounded-xl transition-colors shrink-0"
            >
              {sendMutation.isPending
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : <Send className="w-4 h-4" />}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
