"use client";

import React, { useState, useEffect, useRef } from 'react';
import InteractiveMap from './InteractiveMap';
import Navbar from './Navbar';
import Footer from './Footer';
import FeaturedHero from './FeaturedHero';
function MapPage({ mapName }) {
  const [isLoading, setIsLoading] = useState(true);
  const [mapData, setMapData] = useState(null);
  const mapSectionRef = useRef(null);

  // Map data
  const mapInformation = {
    mirage: { description: "Mirage is a classic and well-balanced map in Counter-Strike. It features a three-lane design with a central mid area connecting two bombsite locations. The map encourages versatile strategies, combining elements of close-quarters combat and long-range engagements. Its iconic locations like A apartments, B apartments, and underpass are known for their tactical depth." },
    ancient: {
      description: "Ancient rewards methodical play and good utility usage. T-side often focuses on gaining mid control before committing to a site, while CT-side relies on crossfires and well-timed rotations. The tight corridors make flashbangs especially effective."
    },
    nuke: {
      description: "Nuke is a unique two-level map set in a nuclear facility, with bombsite A on the upper floor and bombsite B directly below it on the lower floor. The unique vertical gameplay creates complex rotation dynamics and requires specific strategies. The outdoor area offers long sightlines for AWPers."
    },
    overpass: {
      description: "Overpass is CT-sided at higher levels of play. T-side strategies often involve gaining control of connector or water for mid-round rotations. Fast B executes through monster and unique boosts are common tactics on this map."
    },
    anubis: {
      description: "Anubis is one of the newer maps in the competitive pool, featuring an Egyptian theme. It has two bombsites with multiple approaches to each. The layout includes a mix of open areas and tight corridors, with a complex mid section that offers various tactical options."
    },
    vertigo: {
        description: "Vertigo is set atop a skyscraper under construction, featuring tight corridors and exposed edges. It is known for its verticality, where a single misstep can result in a fatal fall. The two bomb sites are located at opposite ends of the structure, connected by narrow walkways and scaffolding."
    },
    dust2: {
      description: "Dust2 is the most iconic Counter-Strike map, featuring a simple but balanced design. It has two bombsites, with A accessible via long doors and short, and B via the famous B tunnels. The mid area connects to both sites and offers crucial control options."
    }
  };

  useEffect(() => {
    const loadMapData = async () => {
      try {
        setIsLoading(true);
        setTimeout(() => {
          if (mapName && mapInformation[mapName]) {
            setMapData(mapInformation[mapName]);
          } else {
            setMapData({ description: "no information for this map" });
          }
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error loading map data:', error);
        setIsLoading(false);
      }
    };

    loadMapData();
  }, [mapName]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!mapData) {
    return <div>No data found for this map.</div>;
  }

  const handleAreaClick = (area) => {
    console.log('Map area clicked:', area);
  };

    const mirageAreas = mapName === 'mirage' ? [
        { name: "A-Site", top: "20%", left: "10%", width: "30%", height: "30%" },
        { name: "Mid", top: "40%", left: "40%", width: "20%", height: "20%" },
        { name: "B-Site", top: "20%", left: "60%", width: "30%", height: "30%" },
    ] : [];

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Navbar />
      <main className="container mx-auto py-8 max-w-7xl">
        <FeaturedHero title={mapName} subtitle={mapData.description} />

        <section ref={mapSectionRef} className="mt-8 mb-16">
          <InteractiveMap
            mapName={mapName}
            handleAreaClick={handleAreaClick}
            areas={mirageAreas}
          />
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Videos related to {mapName}</h2>
          <div className="videos-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Placeholder Video Cards */}
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <div key={index} className="bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                <img
                  src="https://via.placeholder.com/400x225"
                  alt={`Video Thumbnail ${index}`}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">Dummy Video Title {index}</h3>
                  <p className="text-gray-300 text-sm">Short description or uploader name...</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <button className="py-2 px-4 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors duration-300">
              View More Videos
            </button></div></section></main><Footer /></div>);
}export default MapPage;
