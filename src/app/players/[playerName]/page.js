import { notFound } from 'next/navigation';
import PlayerPage from '@/components/POVlib/PlayerPage';

// Generate metadata for the page
export async function generateMetadata({ params }) {
  const playerName = params.playerName;
  
  return {
    title: `${playerName} - CS2 POVs | POVlib`,
    description: `Watch all CS2 POV demos for ${playerName}. Analyze positioning, setup and gameplay.`,
  };
}

export default function PlayerPageRoute({ params }) {
  const playerName = params.playerName;
  
  if (!playerName) {
    return notFound();
  }

  return (
    <PlayerPage playerName={playerName} />
  );
}