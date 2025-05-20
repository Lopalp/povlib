jsx
'use client'

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import YouTube from 'react-youtube';
import BackButton from '@/components/buttons/BackButton';
import LoadingFullscreen from '@/components/loading/LoadingFullscreen';
import TaggingModal from '@/components/POVlib/TaggingModal';

const VideoPlayerPage = ({ videoId, demoData }) => {
  const [video, setVideo] = useState(null);
  const [player, setPlayer] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [taggingModalOpen, setTaggingModalOpen] = useState(false);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVideo() {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('video_id', videoId)
        .single();

      if (error) {
        console.error('Error fetching video:', error);
      } else {
        setVideo(data);
      }
      setLoading(false);
    }
    fetchVideo();
  }, [videoId]);

  useEffect(() => {
    async function fetchChapters() {
      if (video) {
        const { data, error } = await supabase
          .from('chapters')
          .select('*')
          .eq('video_id', video.id)
          .order('timestamp', { ascending: true });

        if (error) {
          console.error('Error fetching chapters:', error);
        } else {
          setChapters(data);
        }
      }
    }
    fetchChapters();
  }, [video]);

  const onReady = (event) => {
    setPlayer(event.target);
  };

  const onStateChange = (event) => {
    if (event.data === 1) { // Playing
      startTrackingTime();
    } else {
      stopTrackingTime();
    }
  };

  const startTrackingTime = () => {
    const intervalId = setInterval(() => {
      if (player && player.getCurrentTime) {
        setCurrentTime(player.getCurrentTime());
      }
    }, 1000); // Update every second
    player.__intervalId = intervalId; // Store interval ID on player object
  };

  const stopTrackingTime = () => {
    if (player && player.__intervalId) {
      clearInterval(player.__intervalId);
      player.__intervalId = null;
    }
  };

  const seekTo = (timestamp) => {
    if (player && player.seekTo) {
      player.seekTo(timestamp, true);
    }
  };

  const openTaggingModal = () => {
    setTaggingModalOpen(true);
  };

  const closeTaggingModal = () => {
    setTaggingModalOpen(false);
  };

  if (loading) {
    return <LoadingFullscreen />;
  }

  if (!video) {
    return <div className="text-white">Video not found.</div>;
  }

  const opts = {
    height: '390',
    width: '640',
    playerVars: {
      autoplay: 1,
    },
  };

  return (
    <div className="container mx-auto p-4 text-white">
      <BackButton />
      <h1 className="text-2xl font-bold mb-4">{video.title}</h1>
      <div className="flex flex-wrap lg:flex-nowrap gap-4">
        <div className="w-full lg:w-2/3">
          <YouTube videoId={videoId} opts={opts} onReady={onReady} onStateChange={onStateChange} />
        </div>
        <div className="w-full lg:w-1/3">
          <div className="bg-gray-800 p-4 rounded-md">
            <h2 className="text-xl font-semibold mb-2">Chapters</h2>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-md mb-4"
              onClick={openTaggingModal}
            >
              Add Chapter
            </button>
            <ul>
              {chapters.map((chapter) => (
                <li key={chapter.id} className="mb-2">
                  <button onClick={() => seekTo(chapter.timestamp)} className="text-blue-400 hover:underline">
                    {Math.floor(chapter.timestamp / 60)}:{(chapter.timestamp % 60).toLocaleString('en-US', { minimumIntegerDigits: 2 })} - {chapter.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {taggingModalOpen && (
        <TaggingModal
          isOpen={taggingModalOpen}
          onClose={closeTaggingModal}
          currentTime={currentTime}
          videoId={video.id}
          demoData={demoData}
        />
      )}
    </div>
  );
};

export default VideoPlayerPage;