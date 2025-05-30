import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Eye, Heart, Tag, Share2, Flag, Bookmark, X,
  ThumbsUp, ChevronDown, ChevronRight, MapPin, Shield, Play
} from 'lucide-react';
import YouTubeEmbed from './YouTubeEmbed';
import Navbar from './Navbar';
import Footer from './Footer';
import MatchTimeline from '../../components/POVlib/MatchTimeline';

const demoMatchData = {
  rounds: [
    {
      roundNumber: 1,
      events: [
        { type: 'utility', time: 10, player: 'PlayerA' },
        { type: 'kill', time: 45, player: 'PlayerB' },
        { type: 'death', time: 46, player: 'PlayerA' },
      ],
    },
    {
      roundNumber: 2,
      events: [
        { type: 'utility', time: 5, player: 'PlayerC' },
        { type: 'kill', time: 30, player: 'PlayerA' },
        { type: 'death', time: 30, player: 'PlayerB' },
      ],
    },
    // weitere Runden …
  ],
};

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
  const [showMatchroomSubmit, setShowMatchroomSubmit] = useState(true);
  const [matchroomSubmitStatus, setMatchroomSubmitStatus] = useState('initial'); // 'initial', 'submitted'

  if (!selectedDemo) return null;

  // Generate dynamic description
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
            {/* Video + Info Column */}
            <div className="lg:w-10/12">
              {/* Video embed */}
              <div className="rounded-lg overflow-hidden bg-black shadow-[0_0_30px_rgba(0,0,0,0.3)] mb-6">
                <YouTubeEmbed 
                  videoId={selectedDemo.video_id} 
                  title={selectedDemo.title}
                  autoplay
                  controls
                  showInfo={false}
                  style={{ width: '100%', height: 'calc(100% + 20%)' }}
                />
              </div>

              {/* Title */}
              <h1 className="text-3xl font-bold text-white mb-4">{selectedDemo.title}</h1>

              {/* Stats & Actions */}
              <div className="flex justify-between items-center mb-4">
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

              {/* Tags (styled like on Start Page) */}
              {selectedDemo.tags?.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mb-6">
                  {selectedDemo.tags.map(tag => (
                    <button
                      key={tag}
                      className="px-3 py-1 bg-gray-800 rounded-full text-sm hover:bg-yellow-400/20 transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              )}

              {/* Description Section */}
              <section className="bg-gradient-to-br from-gray-800 to-gray-850 rounded-lg p-6 mb-8 border border-gray-700">
                <h2 className="text-xl font-semibold text-white mb-3">Description</h2>
                <p className={`${showFullDescription ? '' : 'line-clamp-4'} text-gray-300 text-sm`}>
                  {description}
                </p>
                {description.length > 240 && !showFullDescription && (
                  <button onClick={() => setShowFullDescription(true)} className="mt-2 flex items-center text-yellow-400 hover:text-yellow-300 text-sm">
                    Show more <ChevronDown className="ml-1 h-4 w-4" />
                  </button>
                )}
              </section>

              {/* Match Timeline Section */}
              <section className="bg-gradient-to-br from-gray-800 to-gray-850 rounded-lg p-6 mb-8 border border-gray-700">
                <h2 className="text-xl font-semibold text-white mb-3">Match Timeline</h2>
                <MatchTimeline matchData={demoMatchData} />
              </section>

              {/* Matchroom Submit Section */}
              {showMatchroomSubmit && (
                <section className="bg-gradient-to-br from-gray-800 to-gray-850 rounded-lg p-6 mb-8 border border-gray-700 relative">
                  {matchroomSubmitStatus === 'initial' ? (
                    <>
                      <button onClick={() => setShowMatchroomSubmit(false)} className="absolute top-3 right-3 text-gray-400 hover:text-white">
                        <X className="h-5 w-5" />
                      </button>
                      <h2 className="text-xl font-semibold text-white mb-3">Submit Matchroom</h2>
                      <p className="text-gray-300 text-sm mb-4">
                        Help us improve! If you can find the matchroom for this demo, we'll grant you 1 credit to create a video from your own demo.
                      </p>
                      <div className="flex gap-3">
                        <input 
                          type="text" 
                          placeholder="Enter Matchroom Link" 
                          className="flex-1 px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400" 
                        />
                        <button 
                          onClick={() => setMatchroomSubmitStatus('submitted')} 
                          className="px-6 py-2 bg-yellow-400 text-gray-900 font-bold rounded-lg hover:bg-yellow-300 transition-colors"
                        >
                          Submit
                        </button>
                      </div>
                    </>
                  ) : (
                    <p className="text-gray-300 text-sm">
                      Thanks for your support! Once the link has been verified by our admins, you will receive a notification and the credit will be added to your account. Please note that this process might take a while.
                    </p>
                  )}
                </section>
              )}

              {/* Additional Features */}
              <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-gray-700">
                <h3 className="text-white font-medium mb-4 flex items-center text-base">
                  <Tag className="h-5 w-5 mr-2 text-yellow-400" /> Additional Features
                </h3>
                <div className="flex flex-col md:flex-row gap-4">
                  <a
                    href={selectedDemo.video_url}
                    download
                    className="flex-1 flex items-center justify-center bg-yellow-400 text-gray-900 font-bold py-2 rounded-lg hover:bg-yellow-300 transition-colors text-sm"
                  >
                    Download Video
                  </a>
                  <a
                    href={selectedDemo.dem_url}
                    download
                    className="flex-1 flex items-center justify-center bg-yellow-400 text-gray-900 font-bold py-2 rounded-lg hover:bg-yellow-300 transition-colors text-sm"
                  >
                    Download Demo
                  </a>
                  <a
                    href={selectedDemo.matchroom_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center bg-gray-700 hover:bg-gray-600 transition-colors rounded-lg py-2 text-sm"
                  >
                    <img src="/images/faceit-logo.png" alt="Faceit" className="h-5 w-5 mr-2" />
                    Go to Matchroom
                  </a>
                </div>
              </div>

              {/* Utilities Section */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-850 rounded-lg p-4 mb-8 border border-gray-700">
                <h3 className="text-white font-medium mb-3 text-base">Utilities</h3>
                <ul className="list-disc list-inside text-xs text-gray-300 space-y-1">
                  <li>Utility 1</li>
                  <li>Utility 2</li>
                  <li>Utility 3</li>
                </ul>
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
