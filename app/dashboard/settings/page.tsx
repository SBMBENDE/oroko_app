'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/store/authStore';
import { membersApi } from '@/lib/api/members.api';

type PrivacyKey = 'showPhone' | 'showWhatsapp' | 'showEmail' | 'showProfession' | 'allowMessages' | 'allowNetworking';

const PRIVACY_FIELDS: { key: PrivacyKey; label: string; desc: string }[] = [
  { key: 'showEmail',       label: 'Show email',        desc: 'Display your email on your public profile' },
  { key: 'showPhone',       label: 'Show phone',         desc: 'Display your phone number publicly' },
  { key: 'showWhatsapp',    label: 'Show WhatsApp',      desc: 'Display your WhatsApp number publicly' },
  { key: 'showProfession',  label: 'Show profession',    desc: 'Show your job title, company and skills' },
  { key: 'allowMessages',   label: 'Allow messages',     desc: 'Let other members send you private messages' },
  { key: 'allowNetworking', label: 'Allow networking',   desc: 'Show your bio and social links publicly' },
];

export default function SettingsPage() {
  const { user, setUser } = useAuthStore();
  const [privacy, setPrivacy] = useState({ ...(user?.privacy ?? {}) });
  const [saved, setSaved] = useState(false);

  const mutation = useMutation({
    mutationFn: () => membersApi.updatePrivacy(privacy as Record<string, boolean>),
    onSuccess: () => {
      if (user) setUser({ ...user, privacy: privacy as typeof user.privacy });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    },
  });

  const toggle = (key: PrivacyKey) =>
    setPrivacy((p) => ({ ...p, [key]: !p[key] }));

  return (
    <main className="min-h-screen bg-stone-50 pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-lg">
        <h1 className="text-2xl font-bold text-stone-900 mb-2">Privacy Settings</h1>
        <p className="text-stone-500 text-sm mb-8">Control what other members can see about you.</p>

        <div className="bg-white rounded-2xl border border-stone-100 divide-y divide-stone-50">
          {PRIVACY_FIELDS.map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between px-6 py-4 gap-4">
              <div>
                <p className="text-sm font-semibold text-stone-900">{label}</p>
                <p className="text-xs text-stone-400 mt-0.5">{desc}</p>
              </div>
              <button
                onClick={() => toggle(key)}
                className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors ${
                  privacy[key] ? 'bg-amber-500' : 'bg-stone-200'
                }`}
              >
                <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform mt-0.5 ${
                  privacy[key] ? 'translate-x-5' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
          ))}
        </div>

        {saved && (
          <div className="mt-4 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3 text-center">
            ✅ Privacy settings saved
          </div>
        )}

        <button
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
          className="mt-6 w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-white font-semibold rounded-xl py-3 transition-colors"
        >
          {mutation.isPending ? 'Saving…' : 'Save Privacy Settings'}
        </button>
      </div>
    </main>
  );
}
