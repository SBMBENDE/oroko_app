import type { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import { Mail, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { branches } from '@/data/branches';

export const metadata: Metadata = {
  title: 'Contact — OCA-EU',
  description:
    'Get in touch with OCA-EU headquarters or contact your local branch directly.',
};

export default function ContactPage() {
  return (
    <main>
      {/* Header */}
      <Section className="bg-stone-950 text-white pt-20 md:pt-20" tight>
        <div className="max-w-2xl py-12">
          <p className="text-amber-400 text-sm font-medium uppercase tracking-widest mb-3">
            Get in Touch
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact OCA-EU</h1>
          <p className="text-stone-300 text-lg leading-relaxed">
            Interested in joining, partnering, or just want to learn more? We&apos;d
            love to hear from you.
          </p>
        </div>
      </Section>

      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact form */}
          <div>
            <h2 className="text-2xl font-bold text-stone-900 mb-6">Send a Message</h2>
            <form className="space-y-5" action="#" method="POST">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-stone-700 mb-1.5">
                    First name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm text-stone-900 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition"
                    placeholder="Jean"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-stone-700 mb-1.5">
                    Last name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm text-stone-900 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition"
                    placeholder="Dupont"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1.5">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm text-stone-900 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-stone-700 mb-1.5">
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm text-stone-900 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition"
                >
                  <option>Membership enquiry</option>
                  <option>Partnership proposal</option>
                  <option>Event collaboration</option>
                  <option>Media & press</option>
                  <option>General enquiry</option>
                </select>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-stone-700 mb-1.5">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm text-stone-900 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition resize-none"
                  placeholder="Tell us how we can help…"
                />
              </div>
              <Button size="lg" className="w-full justify-center">
                Send Message
              </Button>
            </form>
          </div>

          {/* Contact info */}
          <div>
            <h2 className="text-2xl font-bold text-stone-900 mb-6">Our Details</h2>
            <div className="space-y-4 mb-10">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-stone-900">Headquarters</p>
                  <address className="not-italic text-sm text-stone-500 mt-0.5">
                    75 Rue de la Paix, 75002 Paris, France
                  </address>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-amber-600 shrink-0" />
                <a href="mailto:contact@oca-eu.org" className="text-sm text-stone-600 hover:text-amber-700 transition-colors">
                  contact@oca-eu.org
                </a>
              </div>
            </div>

            <h3 className="font-semibold text-stone-900 mb-4">Branch Contacts</h3>
            <div className="space-y-3">
              {branches.map((branch) => (
                <div key={branch.slug} className="flex items-center justify-between py-2 border-b border-stone-100 last:border-0">
                  <div className="flex items-center gap-2">
                    <span>{branch.flag}</span>
                    <span className="text-sm font-medium text-stone-700">{branch.country}</span>
                  </div>
                  <a
                    href={`mailto:${branch.contactEmail}`}
                    className="text-xs text-stone-500 hover:text-amber-700 transition-colors"
                  >
                    {branch.contactEmail}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </main>
  );
}
