import { create } from 'zustand';
import { CommitteeMember } from '@/app/lib/definitions';

interface CommitteeMemberState {
  committeeMembers: CommitteeMember[];
  setCommitteeMembers: (committeeMembers: CommitteeMember[]) => void;
}

export const useCommitteeMemberStore = create<CommitteeMemberState>()(
  (set) => ({
    committeeMembers: [],
    setCommitteeMembers: (committeeMembers) => set({ committeeMembers }),
  })
);
