import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Eye, Heart, Tag, Share2, Flag, Bookmark, 
  ThumbsUp, ChevronDown, ChevronRight, MapPin, Shield, Play
} from 'lucide-react';
import YouTubeEmbed from './YouTubeEmbed';
import Navbar from './Navbar';
import Footer from './Footer';

const VideoPlayerPage = ({ 
  selectedDemo, 
  relatedDemos = [], 
  onClose, 
  onLike, 
  onOpenTagModal,
  onSelectRelatedDemo,
  demoType = 'pro',
  setDemoType = () => {},
  searchActive = false,
  setSearchActive = () => {},
  isMenuOpen = false,
  setIsMenuOpen = () => {}
}) => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  if (!selectedDemo) return null;

  const generateDescription = () => {
    let desc = `Experience top-tier CS2 gameplay featuring ${selectedDemo.players.join(', ')} on ${selectedDemo.map}. `;
    if (selectedDemo.team) desc += `Watch how ${selectedDemo.team} players demonstrate professional `;
    else desc += 'Watch professional ';
    if (selectedDemo.positions?.length) desc += `positioning for ${selectedDemo.positions.join(' and ')} roles. `;
    else desc += 'positioning and game sense. ';
    if (selectedDemo.tags?.length) desc += `This POV highlights ${selectedDemo.tags.join(', ')} techniques that can elevate your gameplay.`;
    else desc += 'Learn strategies and techniques directly from the pros.';
    return desc;
  };

  const description = generateDescription();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 text-gray-200">
      <Navbar 
        demoType={demoType}
        onSwitchDemoType={setDemoType}
        searchActive={searchActive}
        setSearchActive={setSearchActive}
        setIsMenuOpen={setIsMenuOpen}
        isMenuOpen={isMenuOpen}
      />

      <div className="bg-gray-900 pt-16">
        <div className="container mx-auto px-4 pb-12">
          <div className="flex items-center gap-4 mb-6">
            <button onClick={onClose} className="flex items-center text-gray-400 hover:text-yellow-400">
              <ArrowLeft className="h-5 w-5 mr-2" /> Back to Browse
            </button>
            <Link href="/videoplaypagecopy">
              <a className="text-gray-400 hover:text-yellow-400">Go to Copy Page</a>
            </Link>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Video + Info Column (Text 10/12) */}
            <div className="lg:w-10/12">
              {/* Video embed */}
              <div className="rounded-lg overflow-hidden bg-black shadow-[0_0_30px_rgba(0,0,0,0.3)] mb-6" style={{ height: 'calc(56.25vw * 1.2)' }}>
                <YouTubeEmbed 
                  videoId={selectedDemo.video_id} 
                  title={selectedDemo.title}
                  autoplay
                  controls
                  showInfo={false}
                />
              </div>

              {/* Title */}
              <h1 className="text-3xl font-bold text-white mb-4">{selectedDemo.title}</h1>

              {/* Stats & Actions */}
              <div className="flex justify-between items-center mb-6">
                {/* Stats */}
                <div className="flex items-center space-x-4 text-gray-400">
                  <div className="flex items-center">
                    <Eye className="h-5 w-5 mr-1" />
                    <span>{selectedDemo.views?.toLocaleString()} views</span>
                  </div>
                  <span>{selectedDemo.year}</span>
                  {selectedDemo.event && <span className="text-yellow-400">{selectedDemo.event}</span>}
                </div>
                {/* Actions */}
                <div className="flex items-center space-x-4 text-gray-400">
                  <button onClick={() => onLike(selectedDemo.id)} className="flex items-center">
                    <ThumbsUp className="h-5 w-5" /> <span className="ml-1">{selectedDemo.likes}</span>
                  </button>
                  <button onClick={onOpenTagModal} className="flex items-center">
                    <Tag className="h-5 w-5" /> <span className="ml-1">Tag</span>
                  </button>
                  <button className="flex items-center">
                    <Share2 className="h-5 w-5" /> <span className="ml-1">Share</span>
                  </button>
                  <button className="flex items-center">
                    <Bookmark className="h-5 w-5" /> <span className="ml-1">Save</span>
                  </button>
                  <button className="flex items-center hover:text-red-500">
                    <Flag className="h-5 w-5" /> <span className="ml-1">Report</span>
                  </button>
                </div>
              </div>

              {/* Description Section */}
              <section className="bg-gradient-to-br from-gray-800 to-gray-850 rounded-lg p-6 mb-8 border border-gray-700">
                <h2 className="text-xl font-semibold text-white mb-3">Description</h2>
                <p className={`${showFullDescription ? '' : 'line-clamp-4'} text-gray-300 text-sm`}>{description}</p>
                {description.length > 240 && !showFullDescription && (
                  <button onClick={() => setShowFullDescription(true)} className="mt-2 flex items-center text-yellow-400 hover:text-yellow-300 text-sm">
                    Show more <ChevronDown className="ml-1 h-4 w-4" />
                  </button>
                )}
              </section>

              {/* Additional Features & Featured Players */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Additional Features */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-850 rounded-lg p-4 border border-gray-700">
                  <h3 className="text-white font-medium mb-3 flex items-center text-sm">
                    <Tag className="h-4 w-4 mr-2 text-yellow-400" /> Additional Features
                  </h3>
                  <div className="space-y-2 text-xs">
                    <button className="w-full flex items-center justify-between bg-gray-700 text-white font-bold py-1 px-3 rounded hover:bg-gray-600">
                      <span>Download .dem</span>
                      <ChevronRight className="h-3 w-3 text-gray-500" />
                    </button>
                    <button className="w-full flex items-center justify-between bg-gray-700 text-white font-bold py-1 px-3 rounded hover:bg-gray-600">
                      <span>Go to Matchroom</span>
                      <ChevronRight className="h-3 w-3 text-gray-500" />
                    </button>
                  </div>
                  <p className="text-gray-400 text-xs mt-3">Utilities Used: Placeholder</p>
                </div>

                {/* Featured Players */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-850 rounded-lg p-4 border border-gray-700">
                  <h3 className="text-white font-medium mb-3 flex items-center text-sm">
                    <Shield className="h-4 w-4 mr-2 text-yellow-400" /> Featured Players
                  </h3>
                  <div className="space-y-3 text-xs">
                    {selectedDemo.players.map((player, idx) => (
                      <Link key={idx} href={`/players/${player.replace(/\s+/g, '-').toLowerCase()}`}>
                        <a className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-700/50 transition-colors">
                          <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-yellow-400 font-bold text-xs">
                            {player.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <p className="text-white font-medium">{player}</p>
                            {selectedDemo.team && <p className="text-gray-400 text-xs">{selectedDemo.team}</p>}
                          </div>
                          <ChevronRight className="ml-auto h-3 w-3 text-gray-500" />
                        </a>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Related Videos Column */}
            <div className="lg:w-2/12 mt-6 lg:mt-0">
              <div className="bg-gradient-to-br from-gray-800 to-gray-850 rounded-lg p-4 border border-gray-700">
                <h2 className="text-white font-bold mb-4 flex items-center text-sm">
                  <span className="w-1 h-4 bg-yellow-400 mr-2" /> Related POVs
                </h2>
                <div className="space-y-4">
                  {relatedDemos.length ? relatedDemos.map(d => (
                    <div key={d.id} className="flex gap-3 cursor-pointer hover:bg-gray-800/50 p-2 rounded-lg transition-colors" onClick={() => onSelectRelatedDemo(d)}>
                      <div className="w-40 h-24 relative overflow-hidden rounded-lg group flex-shrink-0">
                        <img src={d.thumbnail} alt={d.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <div className="rounded-full bg-yellow-400/80 p-2"><Play className="h-4 w-4 text-gray-900" fill="currentColor" /></div>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-medium text-sm line-clamp-2">{d.title}</h3>
                        <div className="text-gray-400 text-xs mt-1">{d.players.join(', ')}</div>
                        <div className="flex items-center text-gray-500 text-xs mt-2">
                          <span>{d.views.toLocaleString()} views</span><span className="mx-1">•</span><span>{d.map}</span>
                          <div className="ml-auto flex items-center text-yellow-400"><Heart className="h-3 w-3 mr-1" /><span>{d.likes}</span></div>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="text-gray-400 text-center py-8">No related videos available</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default VideoPlayerPage;
