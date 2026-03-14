import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile, mkdir } from 'fs/promises';
import path from 'path';

const SUBMISSIONS_PATH = path.join(process.cwd(), 'data', 'member-submissions.json');

interface MemberSubmission {
  id: string;
  name: string;
  role: string;
  profession: string;
  country: string;
  branchSlug: string;
  bio: string;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    website?: string;
  };
  avatar?: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

async function readSubmissions(): Promise<MemberSubmission[]> {
  try {
    const raw = await readFile(SUBMISSIONS_PATH, 'utf-8');
    return JSON.parse(raw) as MemberSubmission[];
  } catch {
    return [];
  }
}

async function writeSubmissions(submissions: MemberSubmission[]): Promise<void> {
  await mkdir(path.dirname(SUBMISSIONS_PATH), { recursive: true });
  await writeFile(SUBMISSIONS_PATH, JSON.stringify(submissions, null, 2), 'utf-8');
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as Partial<MemberSubmission>;

    // Validate required fields
    const required = ['name', 'role', 'profession', 'country', 'branchSlug', 'bio'] as const;
    for (const field of required) {
      const value = body[field];
      if (!value || typeof value !== 'string' || value.trim().length === 0) {
        return NextResponse.json(
          { error: `Field "${field}" is required.` },
          { status: 400 },
        );
      }
    }

    // Sanitise string fields (prevent XSS)
    const sanitise = (s: string) => s.trim().slice(0, 500);
    const sanitiseUrl = (s?: string) => {
      if (!s) return undefined;
      const trimmed = s.trim().slice(0, 300);
      // Only allow http/https or relative # links
      if (trimmed === '#' || trimmed === '') return undefined;
      if (!/^https?:\/\//i.test(trimmed)) return undefined;
      return trimmed;
    };

    const allowedBranches = ['france', 'uk', 'belgium', 'italy', 'finland', 'germany'];
    const branchSlug = sanitise(body.branchSlug ?? '').toLowerCase();
    if (!allowedBranches.includes(branchSlug)) {
      return NextResponse.json(
        { error: 'Invalid branch selected.' },
        { status: 400 },
      );
    }

    const submission: MemberSubmission = {
      id: `sub-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: sanitise(body.name ?? ''),
      role: sanitise(body.role ?? ''),
      profession: sanitise(body.profession ?? ''),
      country: sanitise(body.country ?? ''),
      branchSlug,
      bio: sanitise(body.bio ?? ''),
      socialLinks: {
        linkedin: sanitiseUrl(body.socialLinks?.linkedin),
        twitter: sanitiseUrl(body.socialLinks?.twitter),
        instagram: sanitiseUrl(body.socialLinks?.instagram),
        website: sanitiseUrl(body.socialLinks?.website),
      },
      avatar: sanitiseUrl(body.avatar),
      submittedAt: new Date().toISOString(),
      status: 'pending',
    };

    const existing = await readSubmissions();
    existing.push(submission);
    await writeSubmissions(existing);

    return NextResponse.json(
      { success: true, id: submission.id, message: 'Application received! We will review it shortly.' },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 },
    );
  }
}

export async function GET() {
  // Returns pending submissions count (for future admin dashboard)
  const submissions = await readSubmissions();
  return NextResponse.json({ count: submissions.length, submissions });
}
