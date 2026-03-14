'use client';

import { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { X, ChevronRight, ChevronLeft, CheckCircle, User, Briefcase, MapPin, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormData {
  name: string;
  role: string;
  profession: string;
  country: string;
  branchSlug: string;
  bio: string;
  linkedin: string;
  twitter: string;
  instagram: string;
  website: string;
}

const BRANCHES = [
  { slug: 'france', label: 'France 🇫🇷' },
  { slug: 'uk', label: 'United Kingdom 🇬🇧' },
  { slug: 'belgium', label: 'Belgium 🇧🇪' },
  { slug: 'italy', label: 'Italy 🇮🇹' },
  { slug: 'finland', label: 'Finland 🇫🇮' },
  { slug: 'germany', label: 'Germany 🇩🇪' },
];

const EMPTY: FormData = {
  name: '', role: '', profession: '', country: '',
  branchSlug: '', bio: '',
  linkedin: '', twitter: '', instagram: '', website: '',
};

interface Props {
  onClose: () => void;
}

export function AddMemberModal({ onClose }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const stepRef = useRef<HTMLDivElement>(null);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [form, setForm] = useState<FormData>(EMPTY);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState('');

  // Mount animation
  useEffect(() => {
    gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25 });
    gsap.fromTo(
      dialogRef.current,
      { opacity: 0, y: 40, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: 'back.out(1.4)' },
    );
  }, []);

  // Step slide animation
  const animateStep = (direction: 'forward' | 'back') => {
    const x = direction === 'forward' ? -24 : 24;
    gsap.fromTo(
      stepRef.current,
      { opacity: 0, x },
      { opacity: 1, x: 0, duration: 0.3, ease: 'power2.out' },
    );
  };

  const handleClose = () => {
    gsap.to(dialogRef.current, { opacity: 0, y: 20, scale: 0.97, duration: 0.2 });
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.2, onComplete: onClose });
  };

  const set = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  // ── Step 1 validation ────────────────────────────────────────────────────────
  const validateStep1 = () => {
    const e: Partial<FormData> = {};
    if (!form.name.trim()) e.name = 'Full name is required.';
    if (!form.role.trim()) e.role = 'Role/title is required.';
    if (!form.profession.trim()) e.profession = 'Profession is required.';
    if (!form.country.trim()) e.country = 'Country of residence is required.';
    if (!form.branchSlug) e.branchSlug = 'Please select a branch.';
    if (!form.bio.trim()) e.bio = 'A short bio is required.';
    else if (form.bio.trim().length < 20) e.bio = 'Bio must be at least 20 characters.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const goNext = () => {
    if (step === 1 && !validateStep1()) return;
    setStep((s) => (s + 1) as 1 | 2 | 3);
    animateStep('forward');
  };

  const goBack = () => {
    setStep((s) => (s - 1) as 1 | 2 | 3);
    animateStep('back');
  };

  const handleSubmit = async () => {
    setLoading(true);
    setServerError('');
    try {
      const res = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          role: form.role,
          profession: form.profession,
          country: form.country,
          branchSlug: form.branchSlug,
          bio: form.bio,
          socialLinks: {
            linkedin: form.linkedin || undefined,
            twitter: form.twitter || undefined,
            instagram: form.instagram || undefined,
            website: form.website || undefined,
          },
        }),
      });
      const data = await res.json() as { success?: boolean; error?: string };
      if (!res.ok) {
        setServerError(data.error ?? 'Submission failed. Please try again.');
        return;
      }
      setSubmitted(true);
      gsap.fromTo(
        '.modal-success',
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)', delay: 0.1 },
      );
    } catch {
      setServerError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Input helper ─────────────────────────────────────────────────────────────
  const Field = ({
    label, name, placeholder, type = 'text', required = false, as,
  }: {
    label: string;
    name: keyof FormData;
    placeholder?: string;
    type?: string;
    required?: boolean;
    as?: 'textarea';
  }) => (
    <div>
      <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wide mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {as === 'textarea' ? (
        <textarea
          value={form[name]}
          onChange={(e) => set(name, e.target.value)}
          placeholder={placeholder}
          rows={3}
          className={cn(
            'w-full px-3 py-2 text-sm border rounded-lg resize-none outline-none transition',
            'focus:ring-2 focus:ring-amber-400 focus:border-transparent',
            errors[name] ? 'border-red-400 bg-red-50' : 'border-stone-200 bg-white',
          )}
        />
      ) : (
        <input
          type={type}
          value={form[name]}
          onChange={(e) => set(name, e.target.value)}
          placeholder={placeholder}
          className={cn(
            'w-full px-3 py-2 text-sm border rounded-lg outline-none transition',
            'focus:ring-2 focus:ring-amber-400 focus:border-transparent',
            errors[name] ? 'border-red-400 bg-red-50' : 'border-stone-200 bg-white',
          )}
        />
      )}
      {errors[name] && <p className="mt-1 text-xs text-red-500">{errors[name]}</p>}
    </div>
  );

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === overlayRef.current && handleClose()}
    >
      <div
        ref={dialogRef}
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Apply to join OCA-EU"
      >
        {/* Header */}
        <div className="bg-linear-to-r from-stone-900 to-stone-700 px-6 py-5 flex items-start justify-between">
          <div>
            <p className="text-amber-400 text-xs font-semibold uppercase tracking-widest">Community</p>
            <h2 className="text-white text-xl font-bold mt-0.5">Apply to Join OCA-EU</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-white/60 hover:text-white transition mt-1"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Progress bar */}
        {!submitted && (
          <div className="h-1 bg-stone-100">
            <div
              className="h-full bg-amber-400 transition-all duration-500"
              style={{ width: `${(step / 2) * 100}%` }}
            />
          </div>
        )}

        {/* Body */}
        <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
          {/* ── Success ──────────────────────────────────────────────────────────── */}
          {submitted ? (
            <div className="modal-success text-center py-8">
              <CheckCircle className="mx-auto text-green-500 mb-4" size={56} />
              <h3 className="text-xl font-bold text-stone-900 mb-2">Application Submitted!</h3>
              <p className="text-stone-500 text-sm leading-relaxed">
                Thank you, <strong>{form.name}</strong>! Your application to join the{' '}
                <strong className="capitalize">{form.branchSlug}</strong> chapter has been received.
                Our team will review it and contact you shortly.
              </p>
              <button
                onClick={handleClose}
                className="mt-6 px-6 py-2.5 bg-stone-900 text-white rounded-lg text-sm font-semibold hover:bg-stone-700 transition"
              >
                Close
              </button>
            </div>
          ) : (
            <div ref={stepRef}>
              {/* ── Step 1: Personal Info ───────────────────────────────────────── */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <User size={16} className="text-amber-500" />
                    <span className="text-sm font-semibold text-stone-700">Personal Information</span>
                    <span className="ml-auto text-xs text-stone-400">Step 1 of 2</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Field label="Full Name" name="name" placeholder="e.g. Amara Diallo" required />
                    </div>
                    <Field label="Role / Title" name="role" placeholder="e.g. Member, Volunteer" required />
                    <Field label="Profession" name="profession" placeholder="e.g. Software Engineer" required />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Country of Residence" name="country" placeholder="e.g. France" required />
                    <div>
                      <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wide mb-1">
                        Chapter Branch <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={form.branchSlug}
                        onChange={(e) => set('branchSlug', e.target.value)}
                        className={cn(
                          'w-full px-3 py-2 text-sm border rounded-lg outline-none transition bg-white',
                          'focus:ring-2 focus:ring-amber-400 focus:border-transparent',
                          errors.branchSlug ? 'border-red-400 bg-red-50' : 'border-stone-200',
                        )}
                      >
                        <option value="">Select branch…</option>
                        {BRANCHES.map((b) => (
                          <option key={b.slug} value={b.slug}>{b.label}</option>
                        ))}
                      </select>
                      {errors.branchSlug && (
                        <p className="mt-1 text-xs text-red-500">{errors.branchSlug}</p>
                      )}
                    </div>
                  </div>

                  <Field
                    label="Short Bio"
                    name="bio"
                    placeholder="Tell us a little about yourself and your connection to the diaspora community…"
                    required
                    as="textarea"
                  />
                </div>
              )}

              {/* ── Step 2: Social Links ────────────────────────────────────────── */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Globe size={16} className="text-amber-500" />
                    <span className="text-sm font-semibold text-stone-700">Online Presence</span>
                    <span className="ml-auto text-xs text-stone-400">Step 2 of 2</span>
                  </div>
                  <p className="text-xs text-stone-400 -mt-2 mb-2">All fields optional — provide full URLs (e.g. https://linkedin.com/in/…)</p>

                  <Field label="LinkedIn" name="linkedin" placeholder="https://linkedin.com/in/yourname" type="url" />
                  <Field label="Twitter / X" name="twitter" placeholder="https://twitter.com/yourhandle" type="url" />
                  <Field label="Instagram" name="instagram" placeholder="https://instagram.com/yourhandle" type="url" />
                  <Field label="Personal Website" name="website" placeholder="https://yourwebsite.com" type="url" />

                  {/* Summary card */}
                  <div className="mt-4 p-4 bg-stone-50 rounded-xl border border-stone-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                        <Briefcase size={16} className="text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-stone-900">{form.name}</p>
                        <p className="text-xs text-stone-500">{form.role} · {form.profession}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-stone-500">
                      <MapPin size={12} />
                      <span>{form.country}</span>
                      <span className="capitalize">· {BRANCHES.find((b) => b.slug === form.branchSlug)?.label}</span>
                    </div>
                  </div>

                  {serverError && (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                      {serverError}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer nav */}
        {!submitted && (
          <div className="px-6 py-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
            {step > 1 ? (
              <button
                onClick={goBack}
                className="flex items-center gap-1 text-sm text-stone-600 hover:text-stone-900 transition"
              >
                <ChevronLeft size={16} /> Back
              </button>
            ) : (
              <div />
            )}

            {step < 2 ? (
              <button
                onClick={goNext}
                className="flex items-center gap-2 px-5 py-2.5 bg-stone-900 text-white rounded-lg text-sm font-semibold hover:bg-stone-700 transition"
              >
                Next <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-white rounded-lg text-sm font-semibold hover:bg-amber-600 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Submitting…
                  </>
                ) : (
                  <>Submit Application</>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
