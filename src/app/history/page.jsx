"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { createSupabaseBrowserClient } from '@/lib/supabaseClient'; // Korrigierter Import
import { getFilteredDemos } from '@/lib/db/demos'; // Korrigierter Import
import { Trash2, Search, Pause, MoreVertical, History } from 'lucide-react';

// ============================================================================
// NEUE KOMPONENTE: Sidebar im YouTube-Stil
// ============================================================================
const HistorySidebar = ({ onClear }) => {
  return (
    <aside className="w-full lg:w-1/4 xl:w-1/5 p-4 lg:p-0 lg:pr-8">
      <div className="bg-gray-800/50 rounded-xl p-4 sticky top-24">
        <h2 className="text-lg font-bold mb-4">Verlauf</h2>
        
        <div className="relative mb-4">
          <input 
            type="text" 
            placeholder="Verlauf durchsuchen"
            className="w-full bg-gray-900 border border-gray-700 rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        </div>
        
        <div className="space-y-2">
          <button 
            onClick={onClear}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Trash2 size={20} />
            <span>Gesamten Wiedergabeverlauf löschen</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-lg transition-colors">
            <Pause size={20} />
            <span>Wiedergabeverlauf pausieren</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

// ============================================================================
// NEUE KOMPONENTE: Horizontale Videokarte im YouTube-Listen-Stil
// ============================================================================
const HistoryVideoCard = ({ video, onSelectDemo }) => {
  const handleClick = () => onSelectDemo(video);

  return (
    <div className="group flex gap-4 cursor-pointer items-start" onClick={handleClick}>
      {/* Thumbnail */}
      <div className="w-48 flex-shrink-0">
        <img
          src={video.thumbnail || '/img/v2.png'}
          alt={video.title}
          className="w-full aspect-video object-cover rounded-lg"
        />
      </div>

      {/* Video Details */}
      <div className="flex-1 pt-1 relative">
        <h3 className="text-white text-base font-medium leading-snug mb-1 line-clamp-2">
          {video.title}
        </h3>
        <p className="text-gray-400 text-sm mb-2">
          {video.channel} • {video.views}
        </p>
        <p className="text-gray-400 text-sm line-clamp-1">
           {/* Wir verwenden Tags als eine Art Beschreibung für die Demo */}
           {video.tags?.join(', ') || 'Ein spannendes Demo aus einem Pro-Match.'}
        </p>
        <button className="absolute top-0 right-0 p-1 rounded-full opacity-0 group-hover:opacity-100 hover:bg-gray-700 transition-opacity">
          <MoreVertical size={20} className="text-gray-300" />
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// HAUPTKOMPONENTE: HistoryPage
// ============================================================================
const HistoryPage = () => {
  const [groupedDemos, setGroupedDemos] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadDemoData = async () => {
      setIsLoading(true);
      
      // Wir laden 20 Demos, um eine gute Verlaufsliste zu simulieren
      const demos = await getFilteredDemos({}, 20);

      // ----- Logik zur Gruppierung nach Datum (simuliert) -----
      const today = new Date();
      const demosWithDate = demos.map((demo, index) => {
        const watchedDate = new Date();
        // Wir subtrahieren Tage, um eine chronologische Historie zu faken
        const daysAgo = Math.floor(index / 5); // 5 Videos pro Tag
        watchedDate.setDate(today.getDate() - daysAgo);
        return { ...demo, watchedAt: watchedDate };
      });

      const grouped = demosWithDate.reduce((acc, demo) => {
        const date = new Intl.DateTimeFormat('de-DE', { dateStyle: 'full' }).format(demo.watchedAt);
        const todayStr = new Intl.DateTimeFormat('de-DE', { dateStyle: 'full' }).format(new Date());
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = new Intl.DateTimeFormat('de-DE', { dateStyle: 'full' }).format(yesterday);
        
        let displayDate = date;
        if (date === todayStr) displayDate = 'Heute';
        if (date === yesterdayStr) displayDate = 'Gestern';

        if (!acc[displayDate]) {
          acc[displayDate] = [];
        }
        acc[displayDate].push(demo);
        return acc;
      }, {});
      
      setGroupedDemos(grouped);
      setIsLoading(false);
    };

    loadDemoData();
  }, []);

  const onSelectDemo = (demo) => {
    router.push(`/demos/${demo.id}`); // ID direkt verwenden
  };

  const handleClearHistory = () => {
    setGroupedDemos({});
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-gray-600 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Linke Sidebar */}
          <HistorySidebar onClear={handleClearHistory} />

          {/* Rechter Hauptinhalt */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-6 hidden lg:block">Wiedergabeverlauf</h1>

            {Object.keys(groupedDemos).length > 0 ? (
              <div className="space-y-8">
                {Object.entries(groupedDemos).map(([date, demos]) => (
                  <section key={date}>
                    <h2 className="text-xl font-bold text-white mb-4">{date}</h2>
                    <div className="space-y-5">
                      {demos.map(demo => (
                        <HistoryVideoCard
                          key={demo.id}
                          video={{ // Wir mappen die Demo-Daten auf das von der Karte erwartete Format
                            id: demo.id,
                            title: demo.title,
                            thumbnail: demo.thumbnail,
                            channel: demo.players?.[0] || "Pro Player",
                            views: `${demo.views || 0} Views`,
                            tags: demo.tags,
                          }}
                          onSelectDemo={() => onSelectDemo(demo)}
                        />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            ) : (
              // Leerzustand
              <div className="text-center py-20 flex flex-col items-center">
                <History size={64} className="text-gray-600 mb-4" />
                <h2 className="text-2xl font-semibold text-gray-300">Dein Wiedergabeverlauf ist leer.</h2>
                <p className="text-gray-500 mt-2 max-w-md">Hier werden Videos angezeigt, die du dir angesehen hast. Starte jetzt und entdecke neue Demos!</p>
                <Link href="/" legacyBehavior>
                  <a className="mt-6 inline-block bg-brand-yellow text-gray-900 font-bold py-2 px-5 rounded-full hover:bg-yellow-400 transition-colors">
                    Demos durchsuchen
                  </a>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default HistoryPage;