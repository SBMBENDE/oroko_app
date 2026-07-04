'use client';

import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { Camera, Save, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/lib/store/authStore';
import { membersApi, chaptersApi } from '@/lib/api/members.api';

interface Chapter { _id: string; name: string; }

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    firstName: user?.firstName ?? '',
    lastName:  user?.lastName ?? '',
    country:   user?.country ?? '',
    bio: '', profession: '', company: '', phone: '', whatsapp: '',
    linkedin: '', facebook: '', instagram: '', website: '',
    languages: '', skills: '', interests: '',
  });

  const { data: chaptersData } = useQuery({
    queryKey: ['chapters'],
    queryFn: () => chaptersApi.getAll(),
    select: (r) => r.data.data as Chapter[],
  });

  const { data: meData } = useQuery({
    queryKey: ['me'],
    queryFn: () => membersApi.getMe(),
    select: (r) => r.data.data as Record<string, unknown>,
  });

  // Populate form once data arrives
  useEffect(() => {
    if (!meData) return;
    setForm({
      firstName:  String(meData.firstName ?? ''),
      lastName:   String(meData.lastName ?? ''),
      country:    String(meData.country ?? ''),
      bio:        String(meData.bio ?? ''),
      profession: String(meData.profession ?? ''),
      company:    String(meData.company ?? ''),
      phone:      String(meData.phone ?? ''),
      whatsapp:   String(meData.whatsapp ?? ''),
      linkedin:   String(meData.linkedin ?? ''),
      facebook:   String(meData.facebook ?? ''),
      instagram:  String(meData.instagram ?? ''),
      website:    String(meData.website ?? ''),
      languages:  (meData.languages as string[] ?? []).join(', '),
      skills:     (meData.skills as string[] ?? []).join(', '),
      interests:  (meData.interests as string[] ?? []).join(', '),
    });
  }, [meData]);

  const saveMutation = useMutation({
    mutationFn: () => membersApi.updateProfile({
      ...form,
      languages: form.languages.split(',').map((s) => s.trim()).filter(Boolean),
      skills:    form.skills.split(',').map((s) => s.trim()).filter(Boolean),
      interests: form.interests.split(',').map((s) => s.trim()).filter(Boolean),
    }),
    onSuccess: ({ data }) => {
      setUser(data.data);
      setSaved(true);
      qc.invalidateQueries({ queryKey: ['me'] });
      setTimeout(() => setSaved(false), 3000);
    },
  });

  const avatarMutation = useMutation({
    mutationFn: (file: File) => membersApi.updateAvatar(file),
    onSuccess: ({ data }) => {
      setUser({ ...user!, profilePhoto: data.data.profilePhoto });
    },
  });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const inputCls = "w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-400 transition-colors bg-white";

  return (
    <main className="min-h-screen bg-stone-50 pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
        <h1 className="text-2xl font-bold text-stone-900 mb-8">Edit Profile</h1>

        {/* Avatar */}
        <div className="bg-white rounded-2xl border border-stone-100 p-6 mb-6 flex items-center gap-5">
          <div className="relative shrink-0">
            {user?.profilePhoto ? (
              <Image src={user.profilePhoto} alt="avatar" width={80} height={80} className="w-20 h-20 rounded-2xl object-cover" unoptimized />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-amber-500 flex items-center justify-center text-white text-2xl font-bold">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
            )}
            {avatarMutation.isPending && (
              <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center">
                <Loader2 className="w-5 h-5 text-white animate-spin" />
              </div>
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-stone-900 mb-1">Profile Photo</p>
            <p className="text-xs text-stone-400 mb-3">JPEG, PNG or WebP · Max 5 MB</p>
            <button onClick={() => fileRef.current?.click()}
              className="flex items-center gap-1.5 text-sm text-amber-600 font-medium hover:underline">
              <Camera className="w-4 h-4" /> Change photo
            </button>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) avatarMutation.mutate(f); }} />
          </div>
        </div>

        {/* Profile form */}
        <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(); }}
          className="bg-white rounded-2xl border border-stone-100 p-6 space-y-5">

          {saveMutation.isError && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
              {(saveMutation.error as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Save failed'}
            </div>
          )}
          {saved && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3">✅ Profile saved!</div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1.5">First Name</label>
              <input value={form.firstName} onChange={(e) => set('firstName', e.target.value)} className={inputCls} required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1.5">Last Name</label>
              <input value={form.lastName} onChange={(e) => set('lastName', e.target.value)} className={inputCls} required />
            </div>
          </div>

          {[
            { key: 'country', label: 'Country' },
            { key: 'bio', label: 'Bio', multiline: true },
            { key: 'profession', label: 'Profession' },
            { key: 'company', label: 'Company' },
            { key: 'phone', label: 'Phone' },
            { key: 'whatsapp', label: 'WhatsApp (with country code)' },
            { key: 'linkedin', label: 'LinkedIn URL' },
            { key: 'facebook', label: 'Facebook URL' },
            { key: 'instagram', label: 'Instagram URL' },
            { key: 'website', label: 'Website URL' },
            { key: 'languages', label: 'Languages (comma-separated)' },
            { key: 'skills', label: 'Skills (comma-separated)' },
            { key: 'interests', label: 'Interests (comma-separated)' },
          ].map(({ key, label, multiline }) => (
            <div key={key}>
              <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1.5">{label}</label>
              {multiline ? (
                <textarea rows={3} value={form[key as keyof typeof form]}
                  onChange={(e) => set(key, e.target.value)}
                  className={inputCls + ' resize-none'} />
              ) : (
                <input value={form[key as keyof typeof form]}
                  onChange={(e) => set(key, e.target.value)} className={inputCls} />
              )}
            </div>
          ))}

          <button type="submit" disabled={saveMutation.isPending}
            className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-white font-semibold rounded-xl py-3 transition-colors">
            {saveMutation.isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : <><Save className="w-4 h-4" /> Save Changes</>}
          </button>
        </form>
      </div>
    </main>
  );
}
