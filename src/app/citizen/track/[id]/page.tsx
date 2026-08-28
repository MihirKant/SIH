import ChallengeTrackClient from '@/components/ChallengeTrackClient';
import { INITIAL_CHALLENGES } from '@/lib/mockData';

export function generateStaticParams() {
  return INITIAL_CHALLENGES.map((challenge) => ({
    id: challenge.id,
  }));
}

export default function ChallengeTrackPage({ params }: { params: { id: string } }) {
  return <ChallengeTrackClient challengeId={params.id} />;
}
