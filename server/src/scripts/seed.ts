/**
 * OCA-EU Database Seed Script
 * ---------------------------------
 * Run: npm run seed
 *
 * What it does:
 *   1. Seeds all OCA-EU chapters
 *   2. Creates the SUPER_ADMIN account (idempotent — safe to re-run)
 *
 * Credentials are read from server/.env:
 *   SEED_ADMIN_EMAIL    (required)
 *   SEED_ADMIN_PASSWORD (required — min 8 chars, 1 uppercase, 1 number)
 */

import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { env } from '../config/env';
import { User } from '../models/User';
import { Chapter } from '../models/Chapter';
import { Role, MemberStatus } from '../types/enums';

// ── Chapter definitions (match existing branch slugs in the frontend) ─────────
const CHAPTERS = [
  { name: 'France',      slug: 'france',      country: 'France' },
  { name: 'Belgium',     slug: 'belgium',      country: 'Belgium' },
  { name: 'United Kingdom', slug: 'uk',        country: 'United Kingdom' },
  { name: 'Finland',     slug: 'finland',      country: 'Finland' },
  { name: 'Italy',       slug: 'italy',        country: 'Italy' },
  { name: 'Germany',     slug: 'germany',      country: 'Germany' },
  { name: 'Ireland',     slug: 'ireland',      country: 'Ireland' },
  { name: 'Cameroon',    slug: 'cameroon',     country: 'Cameroon' },
];

async function seedChapters(): Promise<void> {
  console.log('\n📂 Seeding chapters...');
  let created = 0;

  for (const ch of CHAPTERS) {
    const exists = await Chapter.findOne({ slug: ch.slug });
    if (!exists) {
      await Chapter.create({ ...ch, isActive: true });
      console.log(`   ✅ Created: ${ch.name}`);
      created++;
    } else {
      console.log(`   ↩️  Already exists: ${ch.name}`);
    }
  }

  console.log(`   ${created} chapter(s) created, ${CHAPTERS.length - created} already present`);
}

async function seedSuperAdmin(): Promise<void> {
  console.log('\n👤 Seeding SUPER_ADMIN...');

  const email    = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!email || !password) {
    console.error('\n❌ Missing required env vars: SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD');
    console.error('   Add them to server/.env and re-run: npm run seed\n');
    process.exit(1);
  }

  if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
    console.error('\n❌ SEED_ADMIN_PASSWORD must be ≥8 chars, contain 1 uppercase and 1 number');
    process.exit(1);
  }

  const existing = await User.findOne({ role: Role.SUPER_ADMIN });
  if (existing) {
    console.log(`   ↩️  SUPER_ADMIN already exists: ${existing.email}`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await User.create({
    firstName: 'Super',
    lastName:  'Admin',
    email:     email.toLowerCase(),
    passwordHash,
    country:   'France',
    role:       Role.SUPER_ADMIN,
    status:     MemberStatus.ACTIVE,
    emailVerified: true,
    memberNumber: 'OCA-ADMIN-0001',
    joinedAt:   new Date(),
    approvedAt: new Date(),
  });

  console.log(`   ✅ SUPER_ADMIN created`);
  console.log(`   📧 Email:    ${admin.email}`);
  console.log(`   🔑 Password: (set in SEED_ADMIN_PASSWORD)`);
  console.log(`   🆔 ID:       ${admin._id}`);
}

async function main(): Promise<void> {
  console.log('🌱 OCA-EU Seed Script Starting...');
  console.log(`   Connecting to: ${env.MONGODB_URI.replace(/:([^:@]{8})[^:@]*@/, ':****@')}`);

  await mongoose.connect(env.MONGODB_URI, {
    maxPoolSize: 5,
    serverSelectionTimeoutMS: 10000,
  });
  console.log('✅ Connected to MongoDB');

  await seedChapters();
  await seedSuperAdmin();

  console.log('\n✅ Seed complete.\n');
}

main()
  .catch((err) => {
    console.error('\n❌ Seed failed:', err);
    process.exit(1);
  })
  .finally(() => mongoose.disconnect());
