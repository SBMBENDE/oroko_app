import type { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'News — OCA-EU',
  description: 'Latest news and updates from OCA-EU and our branches across Europe.',
};

// Static news articles — replace with CMS/API in production
const articles = [
  {
    id: 'news-1',
    title: 'OCA-EU Expands to Portugal with New Lisbon Chapter',
    excerpt:
      'We are thrilled to announce the launch of our newest chapter in Lisbon, Portugal — bringing OCA-EU\'s network to seven countries.',
    date: '2026-02-14',
    category: 'Announcement',
    author: 'OCA-EU Communications',
    image: '/images/news/lisbon-chapter.jpg',
  },
  {
    id: 'news-2',
    title: '2025 Annual Report: Growth, Impact, and Community',
    excerpt:
      'Our 2025 annual report highlights a record year for OCA-EU — over 800 members, 60+ events, and expanded outreach across six countries.',
    date: '2026-01-30',
    category: 'Report',
    author: 'OCA-EU Board',
    image: '/images/news/annual-report-2025.jpg',
  },
  {
    id: 'news-3',
    title: 'OROKO UK Wins Community Impact Award 2025',
    excerpt:
      'The OROKO UK chapter has been recognised with the prestigious Community Impact Award for its mentorship and entrepreneurship initiatives.',
    date: '2025-12-10',
    category: 'Award',
    author: 'OROKO UK Chapter',
    image: '/images/news/uk-award.jpg',
  },
  {
    id: 'news-4',
    title: 'New Youth Programme Launches Across All Branches',
    excerpt:
      'OCA-EU is proud to launch the OROKO Youth Initiative — a structured programme supporting diaspora youth aged 18–30 in education and career development.',
    date: '2025-11-05',
    category: 'Programme',
    author: 'OCA-EU',
    image: '/images/news/youth-programme.jpg',
  },
];

export default function NewsPage() {
  return (
    <main>
      {/* Header */}
      <Section className="bg-stone-950 text-white pt-20 md:pt-20" tight>
        <div className="max-w-2xl py-12">
          <p className="text-amber-400 text-sm font-medium uppercase tracking-widest mb-3">
            Latest
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">News & Updates</h1>
          <p className="text-stone-300 text-lg leading-relaxed">
            Stay informed about announcements, reports, awards, and stories from
            across the OCA-EU network.
          </p>
        </div>
      </Section>

      <Section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {articles.map((article, i) => (
            <Card key={article.id} className={i === 0 ? 'md:col-span-2' : ''}>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Badge>{article.category}</Badge>
                  <span className="text-xs text-stone-400">{formatDate(article.date)}</span>
                </div>
                <h2 className={`font-bold text-stone-900 leading-snug mb-3 ${i === 0 ? 'text-2xl md:text-3xl' : 'text-xl'}`}>
                  {article.title}
                </h2>
                <p className="text-stone-500 leading-relaxed mb-4">{article.excerpt}</p>
                <p className="text-xs text-stone-400">By {article.author}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>
    </main>
  );
}
