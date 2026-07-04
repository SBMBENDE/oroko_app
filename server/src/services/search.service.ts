import mongoose from 'mongoose';
import { Chapter } from '../models/Chapter';
import { MemberStatus, Role } from '../types/enums';

export interface MemberSearchParams {
  search?: string;
  country?: string;
  chapter?: string;       // slug or ObjectId string
  profession?: string;
  skills?: string;        // comma-separated
  languages?: string;     // comma-separated
  role?: Role;
  status?: MemberStatus;
  page?: number | string;
  limit?: number | string;
}

/** Escape a string for safe use inside a RegExp */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Build a Mongoose filter object from search parameters.
 * Always restricts to Active members for public endpoints.
 */
export async function buildMemberFilter(
  params: MemberSearchParams,
  publicOnly = true
): Promise<Record<string, unknown>> {
  const filter: Record<string, unknown> = {};

  // Public directory always shows Active members only
  if (publicOnly) {
    filter.status = MemberStatus.ACTIVE;
  } else if (params.status) {
    filter.status = params.status;
  }

  // Role filter
  if (params.role) {
    filter.role = params.role;
  }

  // Country filter (case-insensitive)
  if (params.country) {
    filter.country = { $regex: new RegExp(`^${escapeRegex(params.country)}$`, 'i') };
  }

  // Chapter filter — accept slug or ObjectId
  if (params.chapter) {
    if (mongoose.isValidObjectId(params.chapter)) {
      filter.chapter = new mongoose.Types.ObjectId(params.chapter);
    } else {
      const ch = await Chapter.findOne({ slug: params.chapter.toLowerCase() });
      if (ch) {
        filter.chapter = ch._id;
      } else {
        // No chapter matches — return empty result
        filter.chapter = null;
      }
    }
  }

  // Profession filter (regex, partial match)
  if (params.profession) {
    filter.profession = { $regex: new RegExp(escapeRegex(params.profession), 'i') };
  }

  // Skills filter — any of the comma-separated values
  if (params.skills) {
    const skillList = params.skills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    if (skillList.length > 0) {
      filter.skills = {
        $elemMatch: {
          $in: skillList.map((s) => new RegExp(escapeRegex(s), 'i')),
        },
      };
    }
  }

  // Languages filter — any of the comma-separated values
  if (params.languages) {
    const langList = params.languages
      .split(',')
      .map((l) => l.trim())
      .filter(Boolean);
    if (langList.length > 0) {
      filter.languages = {
        $elemMatch: {
          $in: langList.map((l) => new RegExp(escapeRegex(l), 'i')),
        },
      };
    }
  }

  // Full-text search across name, profession, bio, skills, languages
  if (params.search) {
    const escaped = escapeRegex(params.search.trim());
    const regex = new RegExp(escaped, 'i');
    filter.$or = [
      { firstName: regex },
      { lastName: regex },
      { profession: regex },
      { bio: regex },
      { skills: { $elemMatch: { $regex: escaped, $options: 'i' } } },
      { languages: { $elemMatch: { $regex: escaped, $options: 'i' } } },
    ];
  }

  return filter;
}
