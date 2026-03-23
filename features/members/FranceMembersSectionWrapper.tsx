"use client";
import { FranceMembersSection } from "./FranceMembersSection";
import type { Member } from "@/lib/types";

interface FranceMembersSectionWrapperProps {
  members: Member[];
}

export default function FranceMembersSectionWrapper({ members }: FranceMembersSectionWrapperProps) {
  return <FranceMembersSection members={members} />;
}
