import { User } from '../models/User';

/**
 * Generates a unique member number in the format: OCA-YYYY-NNNN
 * e.g. OCA-2026-0042
 */
export async function generateMemberNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const count = await User.countDocuments({
    memberNumber: { $exists: true, $ne: null },
  });
  const padded = String(count + 1).padStart(4, '0');
  return `OCA-${year}-${padded}`;
}
