import PlayersIndex from '@/components/POVlib/PlayersIndex';

export const metadata = {
  title: 'CS2 Pro Players | POVlib',
  description: 'Browse and watch POV demos from all CS2 professional players. Filter by team, map, and more.',
}

export default function PlayersPage() {
  return (
    <PlayersIndex />
  );
}