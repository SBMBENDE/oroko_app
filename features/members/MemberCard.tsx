'use client';

import Image from 'next/image';
import { Linkedin, Twitter, Instagram, Globe } from 'lucide-react';
import type { Member } from '@/lib/types';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';

interface MemberCardProps {
  member: Member;
}

export function MemberCard({ member }: MemberCardProps) {
  return (
    <Card data-card className="h-full">
      <CardContent className="flex flex-col items-center text-center pt-8">
        {/* Avatar */}
        <div className="relative w-20 h-20 rounded-full overflow-hidden bg-stone-200 mb-4 ring-4 ring-white shadow-md">
          <Image
            src={member.avatar}
            alt={member.name}
            fill
            className="object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=d97706&color=fff&size=80`;
            }}
          />
        </div>

        {member.isLeader && (
          <Badge className="mb-3">Leadership</Badge>
        )}

        <h3 className="font-bold text-stone-900 text-base">{member.name}</h3>
        <p className="text-amber-700 text-sm font-medium mt-0.5">{member.role}</p>
        <p className="text-stone-500 text-xs mt-1 mb-3">{member.profession}</p>

        <p className="text-stone-600 text-sm leading-relaxed line-clamp-3 mb-5">
          {member.bio}
        </p>

        {/* Social links */}
        <div className="flex items-center gap-3 mt-auto">
          {member.socialLinks.linkedin && (
            <a
              href={member.socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-400 hover:text-blue-600 transition-colors"
              aria-label={`${member.name} on LinkedIn`}
            >
              <Linkedin className="w-4 h-4" />
            </a>
          )}
          {member.socialLinks.twitter && (
            <a
              href={member.socialLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-400 hover:text-sky-500 transition-colors"
              aria-label={`${member.name} on Twitter`}
            >
              <Twitter className="w-4 h-4" />
            </a>
          )}
          {member.socialLinks.instagram && (
            <a
              href={member.socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-400 hover:text-pink-600 transition-colors"
              aria-label={`${member.name} on Instagram`}
            >
              <Instagram className="w-4 h-4" />
            </a>
          )}
          {member.socialLinks.website && (
            <a
              href={member.socialLinks.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-400 hover:text-amber-600 transition-colors"
              aria-label={`${member.name}'s website`}
            >
              <Globe className="w-4 h-4" />
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
