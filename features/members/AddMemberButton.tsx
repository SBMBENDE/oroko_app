'use client';

import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { AddMemberModal } from '@/features/members/AddMemberModal';

export function AddMemberButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-lg transition"
      >
        <UserPlus size={16} />
        Join OCA-EU
      </button>

      {open && <AddMemberModal onClose={() => setOpen(false)} />}
    </>
  );
}
