import { notFound } from 'next/navigation';
import MapPage from '@/components/POVlib/MapPage';

// Generate metadata for the page
export async function generateMetadata({ params }) {
  const mapName = params.mapName;
  
  // Format map name for display (capitalize first letter)
  const formattedMapName = mapName.charAt(0).toUpperCase() + mapName.slice(1);
  
  return {
    title: `${formattedMapName} POVs | CS2 Map Strategies | POVlib`,
    description: `Watch CS2 POV demos on ${formattedMapName}. Learn pro strategies and positions for ${formattedMapName} from the best players.`,
  };
}

export default function MapPageRoute({ params }) {
  const mapName = params.mapName;
  
  if (!mapName) {
    return notFound();
  }

  return (
    <MapPage mapName={mapName} />
  );
}