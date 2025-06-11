"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Settings, Maximize2, Volume2, ChevronLeft, ChevronRight, Shield, Heart, DollarSign, Skull, Target, Bomb, Timer, Users, TrendingUp, Award, Zap, Package, AlertCircle, Crosshair, FlameIcon, Sparkles, CloudIcon, Menu, X, Activity, Eye, Percent, Clock, MapPin, Swords } from 'lucide-react';

// Erweiterte Spielerdaten-Generierung
const generateDetailedPlayers = () => {
  const ctNames = ['nitr0', 'Stewie2K', 'NAF', 'Twistzz', 'EliGE'];
  const tNames = ['Magisk', 'device', 'Xyp9x', 'dupreeh', 'gla1ve'];
  const weapons = ['ak47', 'm4a4', 'awp', 'deagle', 'usp', 'glock', 'mp9', 'mac10'];
  const positions = ['Entry', 'Support', 'AWPer', 'Lurker', 'IGL'];
  
  const generatePlayerStats = (name, team, index) => {
    const isAwper = Math.random() > 0.7;
    const kills = Math.floor(Math.random() * 25 + 5);
    const deaths = Math.floor(Math.random() * 20 + 5);
    const hs = Math.floor(Math.random() * kills * 0.6);
    
    return {
      id: team === 'ct' ? index + 1 : index + 6,
      name,
      team,
      position: positions[index % positions.length],
      x: team === 'ct' ? 350 + Math.random() * 100 : 150 + Math.random() * 100,
      y: team === 'ct' ? 250 + Math.random() * 100 : 350 + Math.random() * 100,
      health: Math.floor(Math.random() * 40 + 60),
      armor: Math.random() > 0.3 ? 100 : 0,
      money: Math.floor(Math.random() * 10000 + 2000),
      
      // Basis Stats
      kills,
      deaths,
      assists: Math.floor(Math.random() * 10),
      
      // Erweiterte Stats
      adr: (Math.random() * 50 + 60).toFixed(1),
      kast: (Math.random() * 20 + 65).toFixed(1),
      rating: (Math.random() * 0.8 + 0.7).toFixed(2),
      hsp: deaths > 0 ? ((hs / kills) * 100).toFixed(1) : '0.0',
      kd: deaths > 0 ? (kills / deaths).toFixed(2) : kills.toFixed(2),
      kpr: (kills / 20).toFixed(2), // Kills per round (assuming 20 rounds)
      dpr: (deaths / 20).toFixed(2), // Deaths per round
      
      // Detaillierte Stats
      firstKills: Math.floor(Math.random() * 8),
      firstDeaths: Math.floor(Math.random() * 6),
      clutches: Math.floor(Math.random() * 4),
      clutchAttempts: Math.floor(Math.random() * 8),
      multiKills: {
        '2k': Math.floor(Math.random() * 6),
        '3k': Math.floor(Math.random() * 3),
        '4k': Math.floor(Math.random() * 2),
        'ace': Math.random() > 0.9 ? 1 : 0
      },
      
      // Waffen Stats
      weapon: isAwper ? 'awp' : weapons[Math.floor(Math.random() * weapons.length)],
      weaponKills: {
        ak47: Math.floor(Math.random() * 10),
        m4a4: Math.floor(Math.random() * 8),
        awp: isAwper ? Math.floor(Math.random() * 15) : Math.floor(Math.random() * 3),
        deagle: Math.floor(Math.random() * 5),
        other: Math.floor(Math.random() * 5)
      },
      
      // Utility Usage
      nades: ['flash', 'smoke', 'he', 'molotov'].filter(() => Math.random() > 0.5),
      utilityDamage: Math.floor(Math.random() * 200),
      enemiesFlashed: Math.floor(Math.random() * 15),
      flashAssists: Math.floor(Math.random() * 5),
      smokesThrown: Math.floor(Math.random() * 20),
      
      // Positional Heat Map Data
      positions: Array.from({ length: 10 }, () => ({
        x: Math.random() * 800,
        y: Math.random() * 480,
        kills: Math.floor(Math.random() * 3)
      }))
    };
  };
  
  return [
    ...ctNames.map((name, i) => generatePlayerStats(name, 'ct', i)),
    ...tNames.map((name, i) => generatePlayerStats(name, 't', i))
  ];
};

// Event-Generierung mit mehr Details
const generateDetailedRoundEvents = (roundNum, players) => {
  const events = [];
  const roundDuration = 115;
  
  events.push({ 
    time: 0, 
    type: 'round_start', 
    round: roundNum,
    description: `Round ${roundNum} Start`
  });
  
  // Mehr verschiedene Event-Typen
  const eventTypes = ['kill', 'flash', 'smoke', 'damage', 'bomb_plant', 'defuse_start', 'nade_damage', 'flash_assist', 'trade_kill'];
  const numEvents = Math.floor(Math.random() * 20 + 15);
  
  for (let i = 0; i < numEvents; i++) {
    const time = Math.floor(Math.random() * (roundDuration - 10) + 5);
    const type = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    const attacker = players[Math.floor(Math.random() * players.length)];
    const victim = players.filter(p => p.team !== attacker.team)[Math.floor(Math.random() * 5)];
    
    const event = {
      time,
      type,
      round: roundNum,
      playerId: attacker.id
    };
    
    switch (type) {
      case 'kill':
        event.killer = attacker.name;
        event.victim = victim.name;
        event.weapon = attacker.weapon;
        event.headshot = Math.random() > 0.6;
        event.wallbang = Math.random() > 0.9;
        event.noscope = attacker.weapon === 'awp' && Math.random() > 0.95;
        event.killerId = attacker.id;
        event.victimId = victim.id;
        event.distance = Math.floor(Math.random() * 50 + 5);
        break;
      case 'flash':
        event.player = attacker.name;
        event.enemiesFlashed = Math.floor(Math.random() * 3 + 1);
        event.duration = (Math.random() * 2 + 0.5).toFixed(1);
        break;
      case 'smoke':
        event.player = attacker.name;
        event.location = ['A Site', 'B Site', 'Mid', 'Long', 'Connector'][Math.floor(Math.random() * 5)];
        break;
      case 'damage':
        event.attacker = attacker.name;
        event.victim = victim.name;
        event.damage = Math.floor(Math.random() * 80 + 20);
        event.hitgroup = ['head', 'chest', 'stomach', 'leg'][Math.floor(Math.random() * 4)];
        event.attackerId = attacker.id;
        event.victimId = victim.id;
        break;
      case 'nade_damage':
        event.attacker = attacker.name;
        event.victim = victim.name;
        event.damage = Math.floor(Math.random() * 50 + 10);
        event.nadeType = ['he', 'molotov'][Math.floor(Math.random() * 2)];
        break;
      case 'trade_kill':
        event.killer = attacker.name;
        event.victim = victim.name;
        event.traded = players[Math.floor(Math.random() * players.length)].name;
        event.timeToTrade = (Math.random() * 3 + 0.5).toFixed(1);
        break;
    }
    
    events.push(event);
  }
  
  const winner = Math.random() > 0.5 ? 'ct' : 't';
  events.push({
    time: roundDuration,
    type: 'round_end',
    round: roundNum,
    winner,
    reason: ['elimination', 'bomb', 'defuse', 'time'][Math.floor(Math.random() * 4)]
  });
  
  return events.sort((a, b) => a.time - b.time);
};

// Match-Historie generieren
const generateMatchHistory = () => {
  const history = [];
  let ctScore = 0;
  let tScore = 0;
  
  for (let i = 1; i <= 30; i++) {
    const winner = Math.random() > 0.5 ? 'ct' : 't';
    if (winner === 'ct') ctScore++;
    else tScore++;
    
    history.push({
      round: i,
      winner,
      score: { ct: ctScore, t: tScore },
      endReason: ['elimination', 'bomb', 'defuse', 'time'][Math.floor(Math.random() * 4)],
      duration: Math.floor(Math.random() * 60 + 60),
      mvp: Math.floor(Math.random() * 10 + 1)
    });
    
    if (ctScore === 16 || tScore === 16) break;
  }
  
  return history;
};

// Event Icons
const getEventIcon = (type) => {
  switch(type) {
    case 'kill': return <Skull className="w-3 h-3" />;
    case 'bomb_plant': return <Bomb className="w-3 h-3" />;
    case 'defuse_start': return <Shield className="w-3 h-3" />;
    case 'flash': return <Sparkles className="w-3 h-3" />;
    case 'smoke': return <CloudIcon className="w-3 h-3" />;
    case 'damage': return <Target className="w-3 h-3" />;
    case 'nade_damage': return <FlameIcon className="w-3 h-3" />;
    case 'trade_kill': return <Swords className="w-3 h-3" />;
    case 'round_end': return <Timer className="w-3 h-3" />;
    default: return <AlertCircle className="w-3 h-3" />;
  }
};

export default function DemoViewer2D() {
  const [players] = useState(generateDetailedPlayers());
  const [matchHistory] = useState(generateMatchHistory());
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [roundEvents, setRoundEvents] = useState([]);
  const [showKillFeed, setShowKillFeed] = useState(true);
  const canvasRef = useRef(null);
  const timelineRef = useRef(null);

  // Generate events for current round
  useEffect(() => {
    const events = generateDetailedRoundEvents(currentRound, players);
    setRoundEvents(events);
    setCurrentTime(0);
  }, [currentRound, players]);

  // Playback timer
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentTime(prev => {
        const maxTime = matchHistory[currentRound - 1]?.duration || 120;
        if (prev >= maxTime) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1000 / playbackSpeed);
    
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, currentRound, matchHistory]);

  // Draw map
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const MAP_WIDTH = canvas.width;
    const MAP_HEIGHT = canvas.height;
    
    // Background
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, MAP_WIDTH, MAP_HEIGHT);
    
    // Grid
    ctx.strokeStyle = '#141414';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= MAP_WIDTH; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, MAP_HEIGHT);
      ctx.stroke();
    }
    for (let i = 0; i <= MAP_HEIGHT; i += 40) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(MAP_WIDTH, i);
      ctx.stroke();
    }
    
    // Map elements
    ctx.fillStyle = '#1a1f2e';
    ctx.fillRect(100, 100, 160, 160);
    ctx.strokeStyle = '#2d3748';
    ctx.lineWidth = 1;
    ctx.strokeRect(100, 100, 160, 160);
    ctx.fillStyle = '#facc15';
    ctx.font = '24px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('A', 180, 185);
    
    ctx.fillStyle = '#1a1f2e';
    ctx.fillRect(540, 340, 160, 160);
    ctx.strokeStyle = '#2d3748';
    ctx.strokeRect(540, 340, 160, 160);
    ctx.fillStyle = '#facc15';
    ctx.fillText('B', 620, 425);
    
    // Draw players
    players.forEach((player) => {
      const isSelected = selectedPlayer?.id === player.id;
      const isDead = roundEvents.some(e => 
        e.type === 'kill' && 
        e.victimId === player.id && 
        e.time <= currentTime
      );
      
      if (isDead) {
        ctx.globalAlpha = 0.3;
      }
      
      ctx.shadowColor = player.team === 'ct' ? '#3b82f6' : '#ef4444';
      ctx.shadowBlur = isSelected ? 20 : 10;
      
      ctx.beginPath();
      ctx.arc(player.x, player.y, 16, 0, 2 * Math.PI);
      ctx.fillStyle = player.team === 'ct' ? '#3b82f6' : '#ef4444';
      ctx.fill();
      
      if (isSelected) {
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
      
      ctx.fillStyle = '#ffffff';
      ctx.font = '11px Inter, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(player.name, player.x, player.y - 22);
      
      const healthWidth = (player.health / 100) * 32;
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(player.x - 16, player.y + 20, 32, 3);
      ctx.fillStyle = player.health > 50 ? '#10b981' : player.health > 25 ? '#f59e0b' : '#ef4444';
      ctx.fillRect(player.x - 16, player.y + 20, healthWidth, 3);
    });
  }, [players, selectedPlayer, roundEvents, currentTime]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getFilteredEvents = () => {
    if (!selectedPlayer) return roundEvents;
    return roundEvents.filter(e => 
      e.playerId === selectedPlayer.id || 
      e.killerId === selectedPlayer.id || 
      e.victimId === selectedPlayer.id ||
      e.attackerId === selectedPlayer.id
    );
  };

  const currentScore = matchHistory[currentRound - 1]?.score || { ct: 0, t: 0 };

  return (
    <div className="bg-black min-h-screen text-white flex flex-col">
      <div className="flex-1 flex flex-col max-h-screen">
        {/* Header */}
        <header className="h-12 sm:h-16 border-b border-gray-800 bg-gray-950/50 backdrop-blur flex-shrink-0">
          <div className="h-full px-3 sm:px-6 flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-6">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-1.5 hover:bg-gray-800 rounded lg:hidden"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-base sm:text-lg font-semibold">Demo Viewer</h1>
              <div className="text-xs sm:text-sm text-gray-400 hidden sm:block">
                Round {currentRound}/{matchHistory.length}
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-8">
              <div className="flex items-center gap-2 sm:gap-6">
                <div className="hidden sm:block text-right">
                  <div className="text-xs text-gray-400">CT</div>
                  <div className="text-xs sm:text-sm font-medium text-blue-400">Team Liquid</div>
                </div>
                <div className="text-2xl sm:text-3xl font-bold tabular-nums">
                  <span className="text-blue-400">{currentScore.ct}</span>
                  <span className="text-gray-600 mx-1 sm:mx-2">:</span>
                  <span className="text-red-400">{currentScore.t}</span>
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs text-gray-400">T</div>
                  <div className="text-xs sm:text-sm font-medium text-red-400">Astralis</div>
                </div>
              </div>
              
              <div className="flex items-center gap-1 sm:gap-2">
                <button className="p-1.5 sm:p-2 hover:bg-gray-800 rounded transition-colors">
                  <Settings className="w-4 h-4" />
                </button>
                <button className="p-1.5 sm:p-2 hover:bg-gray-800 rounded transition-colors hidden sm:block">
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Map Container */}
            <div className="flex-1 relative p-2 sm:p-4">
              <div className="h-full bg-gray-950 rounded-lg border border-gray-800 p-2 sm:p-4">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={480}
                  className="w-full h-full object-contain rounded cursor-pointer"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const scaleX = 800 / rect.width;
                    const scaleY = 480 / rect.height;
                    const x = (e.clientX - rect.left) * scaleX;
                    const y = (e.clientY - rect.top) * scaleY;
                    
                    const clickedPlayer = players.find(
                      (p) => Math.sqrt((p.x - x) ** 2 + (p.y - y) ** 2) < 25
                    );
                    setSelectedPlayer(clickedPlayer);
                  }}
                />
              </div>

              {/* Kill Feed Overlay */}
              {showKillFeed && (
                <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-48 sm:w-64">
                  <div className="space-y-1">
                    {roundEvents
                      .filter(e => e.type === 'kill' && e.time <= currentTime)
                      .slice(-5)
                      .reverse()
                      .map((event, i) => (
                        <div key={i} className="bg-gray-900/90 backdrop-blur border border-gray-800 rounded px-2 sm:px-3 py-1 sm:py-1.5 flex items-center justify-between text-xs sm:text-sm">
                          <span className={`font-medium ${
                            players.find(p => p.name === event.killer)?.team === 'ct' 
                              ? 'text-blue-400' 
                              : 'text-red-400'
                          }`}>
                            {event.killer}
                          </span>
                          <span className="text-gray-600 text-xs">
                            {event.headshot ? '⊕' : event.wallbang ? '▣' : '×'}
                          </span>
                          <span className={`font-medium ${
                            players.find(p => p.name === event.victim)?.team === 'ct' 
                              ? 'text-blue-400' 
                              : 'text-red-400'
                          }`}>
                            {event.victim}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className={`${sidebarOpen ? 'w-80' : 'w-0'} lg:w-80 transition-all duration-300 border-l border-gray-800 bg-gray-950/50 backdrop-blur overflow-hidden`}>
            <div className="w-80 h-full overflow-y-auto">
              {/* Mobile Close Button */}
              <div className="p-4 border-b border-gray-800 flex items-center justify-between lg:hidden">
                <h3 className="text-sm font-medium text-gray-400">Player Details</h3>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 hover:bg-gray-800 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Tab Navigation */}
              {selectedPlayer && (
                <div className="border-b border-gray-800">
                  <div className="flex">
                    {['overview', 'stats', 'weapons', 'utility'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-2 text-xs font-medium capitalize transition-colors ${
                          activeTab === tab
                            ? 'text-yellow-400 border-b-2 border-yellow-400'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Selected Player Content */}
              {selectedPlayer ? (
                <div className="p-4">
                  {/* Player Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{selectedPlayer.name}</h3>
                      <p className="text-xs text-gray-400">{selectedPlayer.position}</p>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded ${
                      selectedPlayer.team === 'ct' 
                        ? 'bg-blue-500/20 text-blue-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {selectedPlayer.team.toUpperCase()}
                    </span>
                  </div>

                  {/* Tab Content */}
                  {activeTab === 'overview' && (
                    <div className="space-y-4">
                      {/* Basic Stats */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-gray-900 rounded p-2">
                          <div className="text-xs text-gray-400 mb-0.5 flex items-center gap-1">
                            <Heart className="w-3 h-3" /> Health
                          </div>
                          <div className="text-lg font-semibold">{selectedPlayer.health}</div>
                        </div>
                        <div className="bg-gray-900 rounded p-2">
                          <div className="text-xs text-gray-400 mb-0.5 flex items-center gap-1">
                            <Shield className="w-3 h-3" /> Armor
                          </div>
                          <div className="text-lg font-semibold">{selectedPlayer.armor}</div>
                        </div>
                      </div>

                      {/* Performance */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-medium text-gray-400">PERFORMANCE</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between py-1">
                            <span className="text-gray-400">K/A/D</span>
                            <span className="font-medium">{selectedPlayer.kills}/{selectedPlayer.assists}/{selectedPlayer.deaths}</span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span className="text-gray-400">K/D Ratio</span>
                            <span className="font-medium">{selectedPlayer.kd}</span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span className="text-gray-400">ADR</span>
                            <span className="font-medium">{selectedPlayer.adr}</span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span className="text-gray-400">HS%</span>
                            <span className="font-medium text-yellow-400">{selectedPlayer.hsp}%</span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span className="text-gray-400">Rating 2.0</span>
                            <span className="font-medium text-yellow-400">★ {selectedPlayer.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'stats' && (
                    <div className="space-y-4">
                      {/* Advanced Stats */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-medium text-gray-400">ROUND STATS</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between py-1">
                            <span className="text-gray-400">KPR</span>
                            <span>{selectedPlayer.kpr}</span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span className="text-gray-400">DPR</span>
                            <span>{selectedPlayer.dpr}</span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span className="text-gray-400">KAST</span>
                            <span>{selectedPlayer.kast}%</span>
                          </div>
                        </div>
                      </div>

                      {/* First Stats */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-medium text-gray-400">OPENING DUELS</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-gray-900 rounded p-2 text-center">
                            <div className="text-lg font-semibold text-green-400">{selectedPlayer.firstKills}</div>
                            <div className="text-xs text-gray-400">First Kills</div>
                          </div>
                          <div className="bg-gray-900 rounded p-2 text-center">
                            <div className="text-lg font-semibold text-red-400">{selectedPlayer.firstDeaths}</div>
                            <div className="text-xs text-gray-400">First Deaths</div>
                          </div>
                        </div>
                      </div>

                      {/* Clutches */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-medium text-gray-400">CLUTCHES</h4>
                        <div className="bg-gray-900 rounded p-3">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-yellow-400">
                              {selectedPlayer.clutches}/{selectedPlayer.clutchAttempts}
                            </div>
                            <div className="text-xs text-gray-400">
                              {selectedPlayer.clutchAttempts > 0 
                                ? `${((selectedPlayer.clutches / selectedPlayer.clutchAttempts) * 100).toFixed(0)}% Success Rate`
                                : 'No clutch attempts'}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Multi-kills */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-medium text-gray-400">MULTI-KILLS</h4>
                        <div className="grid grid-cols-4 gap-1 text-center">
                          <div className="bg-gray-900 rounded p-2">
                            <div className="text-sm font-semibold">{selectedPlayer.multiKills['2k']}</div>
                            <div className="text-xs text-gray-400">2K</div>
                          </div>
                          <div className="bg-gray-900 rounded p-2">
                            <div className="text-sm font-semibold">{selectedPlayer.multiKills['3k']}</div>
                            <div className="text-xs text-gray-400">3K</div>
                          </div>
                          <div className="bg-gray-900 rounded p-2">
                            <div className="text-sm font-semibold">{selectedPlayer.multiKills['4k']}</div>
                            <div className="text-xs text-gray-400">4K</div>
                          </div>
                          <div className="bg-gray-900 rounded p-2">
                            <div className="text-sm font-semibold text-yellow-400">{selectedPlayer.multiKills.ace}</div>
                            <div className="text-xs text-gray-400">ACE</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'weapons' && (
                    <div className="space-y-4">
                      {/* Current Weapon */}
                      <div className="bg-gray-900 rounded p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-400">CURRENT</span>
                          <span className="text-sm font-medium uppercase">{selectedPlayer.weapon}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          ${selectedPlayer.money} available
                        </div>
                      </div>

                      {/* Weapon Stats */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-medium text-gray-400">WEAPON KILLS</h4>
                        <div className="space-y-2">
                          {Object.entries(selectedPlayer.weaponKills).map(([weapon, kills]) => (
                            <div key={weapon} className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-sm capitalize">{weapon}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-24 bg-gray-800 rounded-full h-2">
                                  <div 
                                    className="h-full bg-yellow-400 rounded-full"
                                    style={{ width: `${(kills / Math.max(...Object.values(selectedPlayer.weaponKills))) * 100}%` }}
                                  />
                                </div>
                                <span className="text-sm font-medium w-8 text-right">{kills}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'utility' && (
                    <div className="space-y-4">
                      {/* Current Utility */}
                      <div className="bg-gray-900 rounded p-3">
                        <div className="text-xs text-gray-400 mb-2">CURRENT UTILITY</div>
                        <div className="flex gap-2">
                          {selectedPlayer.nades.map((nade, i) => (
                            <div key={i} className="bg-gray-800 rounded p-2 text-center">
                              <div className="text-lg">
                                {nade === 'flash' ? '✨' : nade === 'smoke' ? '💨' : nade === 'he' ? '💥' : '🔥'}
                              </div>
                              <div className="text-xs text-gray-400 capitalize">{nade}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Utility Stats */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-medium text-gray-400">UTILITY USAGE</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between py-1">
                            <span className="text-gray-400">Utility Damage</span>
                            <span className="font-medium">{selectedPlayer.utilityDamage}</span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span className="text-gray-400">Enemies Flashed</span>
                            <span className="font-medium">{selectedPlayer.enemiesFlashed}</span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span className="text-gray-400">Flash Assists</span>
                            <span className="font-medium">{selectedPlayer.flashAssists}</span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span className="text-gray-400">Smokes Thrown</span>
                            <span className="font-medium">{selectedPlayer.smokesThrown}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => setSelectedPlayer(null)}
                    className="w-full mt-4 py-2 text-xs text-gray-400 hover:text-white transition-colors border border-gray-800 rounded hover:border-gray-700"
                  >
                    Clear Selection
                  </button>
                </div>
              ) : (
                <div className="p-4">
                  <p className="text-sm text-gray-500 text-center mb-4">Select a player to view details</p>
                  
                  {/* Players List */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-medium text-gray-400 mb-3">ALL PLAYERS</h3>
                    <div className="space-y-1.5">
                      {players.map((player) => (
                        <button
                          key={player.id}
                          onClick={() => {
                            setSelectedPlayer(player);
                            setActiveTab('overview');
                          }}
                          className={`w-full p-2 rounded border transition-all text-left text-sm ${
                            selectedPlayer?.id === player.id
                              ? 'border-yellow-400 bg-yellow-400/10'
                              : 'border-gray-800 hover:border-gray-700 hover:bg-gray-900'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className={`w-1.5 h-1.5 rounded-full ${
                                player.team === 'ct' ? 'bg-blue-500' : 'bg-red-500'
                              }`} />
                              <div>
                                <div className="font-medium">{player.name}</div>
                                <div className="text-xs text-gray-500">{player.position}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs font-medium">{player.kills}/{player.deaths}</div>
                              <div className="text-xs text-yellow-400">★ {player.rating}</div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Economy Overview */}
              <div className="p-4 border-t border-gray-800">
                <h3 className="text-xs font-medium text-gray-400 mb-3">ECONOMY</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-gray-900 rounded p-2">
                    <div className="text-xs text-blue-400 mb-0.5">CT</div>
                    <div className="text-base font-semibold">
                      ${players.filter(p => p.team === 'ct').reduce((sum, p) => sum + p.money, 0).toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-gray-900 rounded p-2">
                    <div className="text-xs text-red-400 mb-0.5">T</div>
                    <div className="text-base font-semibold">
                      ${players.filter(p => p.team === 't').reduce((sum, p) => sum + p.money, 0).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="h-32 sm:h-40 border-t border-gray-800 bg-gray-950 flex-shrink-0">
          <div className="h-full flex flex-col">
            {/* Round Timeline */}
            <div className="flex-1 px-2 sm:px-4 py-1 sm:py-2 overflow-x-auto" ref={timelineRef}>
              <div className="h-full flex items-center gap-0.5 min-w-max">
                {matchHistory.map((round, i) => (
                  <div key={i} className="relative group">
                    {round.round === 16 && (
                      <div className="absolute -left-2 top-0 bottom-0 w-0.5 bg-yellow-400">
                        <span className="absolute -top-5 sm:-top-6 left-1/2 -translate-x-1/2 text-xs text-yellow-400 whitespace-nowrap">
                          Halftime
                        </span>
                      </div>
                    )}
                    
                    <button
                      onClick={() => setCurrentRound(round.round)}
                      className={`relative w-10 sm:w-12 h-12 sm:h-16 flex flex-col items-center justify-center border transition-all ${
                        round.round === currentRound 
                          ? 'border-yellow-400 bg-yellow-400/10' 
                          : 'border-gray-800 hover:border-gray-700 hover:bg-gray-900'
                      }`}
                    >
                      <span className="text-xs text-gray-400 mb-0.5 sm:mb-1">{round.round}</span>
                      <div className={`w-5 sm:w-6 h-5 sm:h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        round.winner === 'ct' 
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50' 
                          : 'bg-red-500/20 text-red-400 border border-red-500/50'
                      }`}>
                        {round.winner === 'ct' ? 'CT' : 'T'}
                      </div>
                      <span className="text-[10px] text-gray-500 mt-0.5 sm:mt-1 hidden sm:block">
                        {round.score.ct}-{round.score.t}
                      </span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Event Timeline */}
            <div className="h-12 sm:h-16 border-t border-gray-800 px-2 sm:px-4 py-1 sm:py-2">
              <div className="relative h-full">
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-0.5 bg-gray-800" />
                <div className="relative h-full">
                  {getFilteredEvents().map((event, i) => {
                    const roundDuration = matchHistory[currentRound - 1]?.duration || 120;
                    const position = (event.time / roundDuration) * 100;
                    const isPast = event.time <= currentTime;
                    
                    return (
                      <div
                        key={i}
                        className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all ${
                          isPast ? 'opacity-100' : 'opacity-30'
                        }`}
                        style={{ left: `${position}%` }}
                      >
                        <div className={`p-0.5 sm:p-1 rounded-full ${
                          event.type === 'kill' ? 'bg-red-500/20 text-red-400' :
                          event.type === 'bomb_plant' ? 'bg-orange-500/20 text-orange-400' :
                          event.type === 'defuse_start' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-gray-700/50 text-gray-400'
                        } ${isPast ? '' : 'grayscale'}`}>
                          {getEventIcon(event.type)}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div 
                  className="absolute top-0 bottom-0 w-0.5 bg-yellow-400"
                  style={{ left: `${(currentTime / (matchHistory[currentRound - 1]?.duration || 120)) * 100}%` }}
                />
              </div>
            </div>

            {/* Playback Controls */}
            <div className="h-10 sm:h-12 border-t border-gray-800 px-2 sm:px-4 flex items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-1 sm:gap-2">
                <button className="p-1 sm:p-1.5 hover:bg-gray-800 rounded transition-colors">
                  <SkipBack className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-1 sm:p-1.5 bg-yellow-400 hover:bg-yellow-500 rounded text-black transition-colors"
                >
                  {isPlaying ? <Pause className="w-3 h-3 sm:w-4 sm:h-4" /> : <Play className="w-3 h-3 sm:w-4 sm:h-4" />}
                </button>
                <button className="p-1 sm:p-1.5 hover:bg-gray-800 rounded transition-colors">
                  <SkipForward className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>

              <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-400">
                <span>{formatTime(currentTime)}</span>
                <span>/</span>
                <span>{formatTime(matchHistory[currentRound - 1]?.duration || 120)}</span>
              </div>

              <div className="flex-1" />

              <select
                value={playbackSpeed}
                onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                className="bg-transparent text-xs sm:text-sm text-gray-400 focus:outline-none"
              >
                <option value={0.5}>0.5x</option>
                <option value={1}>1x</option>
                <option value={2}>2x</option>
                <option value={4}>4x</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}