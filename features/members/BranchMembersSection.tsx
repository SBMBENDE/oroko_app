"use client";
import { useState } from "react";
import { Section, SectionHeading } from "@/components/ui/Section";
import { MemberCard } from "@/features/members/MemberCard";
import type { Member } from "@/lib/types";

interface BranchMembersSectionProps {
  members: Member[];
  branchName: string;
}

export default function BranchMembersSection({ members, branchName }: BranchMembersSectionProps) {
  const [showAll, setShowAll] = useState(false);
  return (
    <Section>
      <SectionHeading
        title="Members"
        subtitle={`Meet the ${members.length} members driving ${branchName} forward.`}
        centered
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {(showAll ? members : members.slice(0, 4)).map((member, idx) => (
          <div
            key={member.id}
            className={!showAll ? `block ${idx > 1 ? 'hidden md:block' : ''}` : ''}
          >
            <MemberCard member={{ ...member, isLeader: false }} />
          </div>
        ))}
      </div>
      {!showAll && (
        <div className="flex justify-center mt-6">
          <button
            className="px-6 py-2 rounded bg-amber-600 text-white font-semibold hover:bg-amber-700 transition-colors"
            onClick={() => setShowAll(true)}
          >
            See all members
          </button>
        </div>
      )}
    </Section>
  );
}
