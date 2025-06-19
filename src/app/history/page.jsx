import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { createSupabaseBrowserClient } from '../lib/supabaseClient';
import { getFilteredDemos } from '../lib/db/demos'; // Wir importieren die gleiche Funktion wie die Startseite
import { Trash2 } from 'lucide-react';

// Es ist am besten, diese Komponente in eine eigene Datei auszulagern: /components/VideoCard.js
function VideoCard({ video, onSelectDemo }) {
  const handleClick = () => onSelectDemo(video);

  // Fallback-Bilder, falls keine vorhanden sind
  const VIDEO_THUMBNAIL_POOL = ["/img/1.png", "/img/2.png", "/img/3.png", "/img/4.png", "/img/5.png", "/img/6.png"];
  const randomThumbnail = () => VIDEO_THUMBNAIL_POOL[Math.floor(Math.random() * VIDEO_THUMBNAIL_POOL.length)];

  return (
    <div className="group cursor-pointer" onClick={handleClick}>
      <div className="space-y-3">
        {/* Thumbnail */}
        <div className="relative w-full">
          <img
            src={video.thumbnail || randomThumbnail()}
            alt={video.title}
            className="w-full aspect-video object-cover rounded-xl"
          />
          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded font-medium">
            {video.duration}
          </div>
           {/* Der rote Balken signalisiert "angesehen" */}
           <div className="absolute bottom-0 left-0 w-full h-1 bg-red-500 rounded-b-xl" />
        </div>
        
        {/* Content */}
        <div className="space-y-2">
          <div className="flex gap-3">
            <img
              src={video.channelAvatar || randomThumbnail()}
              alt={video.channel}
              className="w-9 h-9 rounded-full flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-white text-sm font-medium leading-5 mb-1 group-hover:text-gray-200 transition-colors line-clamp-2">
                {video.title}
              </h3>
              <div className="flex items-center gap-1 text-gray-500 text-xs">
                <span>{video.views}</span>
                <span>•</span>
                <span>{video.uploadDate}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


const HistoryPage = () => {
  const [demoHistory, setDemoHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  // Schritt 1: Prüfen, ob ein Benutzer angemeldet ist. Eine Verlaufsseite ist benutzerspezifisch.
  useEffect(() => {
    const fetchUserAndData = async () => {
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
            setUser(session.user);
            // Schritt 2: Da es keinen echten Verlauf gibt, laden wir zufällige Demos.
            // Wir holen 12 Demos, um die Seite zu füllen.
            const randomDemos = await getFilteredDemos({}, 12);

            // Schritt 3: Wir mappen die zufälligen Demos in das Video-Format.
            const mappedDemos = randomDemos.map(demo => ({
                type: "video",
                demoId: demo.id,
                title: demo.title,
                thumbnail: demo.thumbnail,
                duration: `${Math.floor(Math.random() * 10) + 1}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}`,
                views: `${demo.views || 0} views`,
                uploadDate: demo.year || "2024",
                channel: demo.players?.[0] || "Unknown Player",
                channelAvatar: null, // Wird durch Fallback in VideoCard behandelt
                watched: true, // Alle werden als "angesehen" markiert
                id: `video-${demo.id}`,
            }));
            setDemoHistory(mappedDemos);
        } else {
            // Optional: Wenn kein Benutzer da ist, kann man ihn zum Login leiten
            // oder einfach einen leeren Verlauf anzeigen.
            // router.push('/login'); 
        }
        setIsLoading(false);
    };

    fetchUserAndData();
  }, [router, supabase.auth]);
  
  const onSelectDemo = (demo) => {
    router.push(`/demos/${demo.demoId}`);
  };

  // Diese Funktion simuliert das Löschen des Verlaufs, indem sie den State leert.
  const handleClearHistory = () => {
    const isConfirmed = window.confirm("Are you sure you want to clear your watch history? (This is a demo)");
    
    if (isConfirmed) {
      // In der echten Version würde hier der Datenbankaufruf erfolgen.
      // Für die Demo leeren wir einfach das Array.
      setDemoHistory([]);
    }
  };


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-gray-600 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading Watch History...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="flex justify-between items-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Watch History</h1>
          {/* Zeige den "Löschen"-Button nur an, wenn Videos im Demo-Verlauf sind */}
          {demoHistory.length > 0 && (
             <button
              onClick={handleClearHistory}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-white/5 text-gray-300 hover:bg-white/10 transition-colors"
            >
              <Trash2 size={16} />
              <span className="hidden sm:inline">Clear History</span>
            </button>
          )}
        </div>
        
        {/* Bedingtes Rendern: Entweder das Gitter mit Videos oder die Leerzustands-Nachricht */}
        {demoHistory.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8 lg:gap-x-5 lg:gap-y-10">
            {demoHistory.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                onSelectDemo={onSelectDemo}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 rounded-xl bg-gray-900">
            <h2 className="text-xl font-semibold text-gray-300">Your watch history is empty.</h2>
            <p className="text-gray-500 mt-2">Watched videos will appear here.</p>
            <Link href="/" legacyBehavior>
              <a className="mt-6 inline-block bg-brand-yellow text-gray-900 font-bold py-2 px-5 rounded-full hover:bg-yellow-400 transition-colors">
                Browse Demos
              </a>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
};

export default HistoryPage;