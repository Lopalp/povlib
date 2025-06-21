"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Settings, Maximize2, Volume2, ChevronLeft, ChevronRight, Shield, Heart, DollarSign, Skull, Target, Bomb, Timer, Users, TrendingUp, Award, Zap, Package, AlertCircle, Crosshair, FlameIcon, Sparkles, CloudIcon, Menu, X, Activity, Eye, Percent, Clock, MapPin, Swords, Search, Database, ZoomIn, ZoomOut, Move, BarChart, Trophy, Lightbulb } from 'lucide-react';

// Erweiterte Spielerdaten-Generierung mit verschiedenen Stat-Zeiträumen
const generateDetailedPlayers = () => {
  const ctNames = ['nitr0', 'Stewie2K', 'NAF', 'Twistzz', 'EliGE'];
  const tNames = ['Magisk', 'device', 'Xyp9x', 'dupreeh', 'gla1ve'];
  const weapons = ['ak47', 'm4a4', 'awp', 'deagle', 'usp', 'glock', 'mp9', 'mac10'];
  const positions = ['Entry', 'Support', 'AWPer', 'Lurker', 'IGL'];
  
  const generatePlayerStats = (name, team, index) => {
    const isAwper = Math.random() > 0.7;
    
    // Generate different stats for different time periods
    const roundStats = {
      kills: Math.floor(Math.random() * 4),
      deaths: Math.random() > 0.7 ? 1 : 0,
      assists: Math.floor(Math.random() * 2),
      damage: Math.floor(Math.random() * 300),
      enemiesFlashed: Math.floor(Math.random() * 3),
      utilityDamage: Math.floor(Math.random() * 100)
    };
    
    const gameStats = {
      kills: Math.floor(Math.random() * 20 + 5),
      deaths: Math.floor(Math.random() * 15 + 5),
      assists: Math.floor(Math.random() * 8),
      adr: (Math.random() * 50 + 60).toFixed(1),
      kast: (Math.random() * 20 + 65).toFixed(1),
      rating: (Math.random() * 0.8 + 0.7).toFixed(2),
      firstKills: Math.floor(Math.random() * 6),
      firstDeaths: Math.floor(Math.random() * 4),
      clutches: Math.floor(Math.random() * 3),
      clutchAttempts: Math.floor(Math.random() * 6)
    };
    
    const endStats = {
      kills: Math.floor(Math.random() * 30 + 10),
      deaths: Math.floor(Math.random() * 20 + 8),
      assists: Math.floor(Math.random() * 12),
      adr: (Math.random() * 40 + 70).toFixed(1),
      kast: (Math.random() * 15 + 70).toFixed(1),
      rating: (Math.random() * 0.6 + 0.9).toFixed(2),
      firstKills: Math.floor(Math.random() * 10),
      firstDeaths: Math.floor(Math.random() * 8),
      clutches: Math.floor(Math.random() * 5),
      clutchAttempts: Math.floor(Math.random() * 10),
      mvps: Math.floor(Math.random() * 8)
    };
    
    const hs = Math.floor(gameStats.kills * (Math.random() * 0.4 + 0.3));
    
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
      
      // Stats for different time periods
      roundStats,
      gameStats,
      endStats,
      
      // Current displayed stats (will switch based on toggle)
      kills: gameStats.kills,
      deaths: gameStats.deaths,
      assists: gameStats.assists,
      adr: gameStats.adr,
      kast: gameStats.kast,
      rating: gameStats.rating,
      hsp: gameStats.deaths > 0 ? ((hs / gameStats.kills) * 100).toFixed(1) : '0.0',
      kd: gameStats.deaths > 0 ? (gameStats.kills / gameStats.deaths).toFixed(2) : gameStats.kills.toFixed(2),
      kpr: (gameStats.kills / 20).toFixed(2),
      dpr: (gameStats.deaths / 20).toFixed(2),
      
      firstKills: gameStats.firstKills,
      firstDeaths: gameStats.firstDeaths,
      clutches: gameStats.clutches,
      clutchAttempts: gameStats.clutchAttempts,
      
      multiKills: {
        '2k': Math.floor(Math.random() * 6),
        '3k': Math.floor(Math.random() * 3),
        '4k': Math.floor(Math.random() * 2),
        'ace': Math.random() > 0.9 ? 1 : 0
      },
      
      weapon: isAwper ? 'awp' : weapons[Math.floor(Math.random() * weapons.length)],
      weaponKills: {
        ak47: Math.floor(Math.random() * 10),
        m4a4: Math.floor(Math.random() * 8),
        awp: isAwper ? Math.floor(Math.random() * 15) : Math.floor(Math.random() * 3),
        deagle: Math.floor(Math.random() * 5),
        other: Math.floor(Math.random() * 5)
      },
      
      nades: ['flash', 'smoke', 'he', 'molotov'].filter(() => Math.random() > 0.5),
      utilityDamage: Math.floor(Math.random() * 200),
      enemiesFlashed: Math.floor(Math.random() * 15),
      flashAssists: Math.floor(Math.random() * 5),
      smokesThrown: Math.floor(Math.random() * 20),
      
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

// Pro Demo Finder - Erweiterte Situationen
const generateProDemos = () => {
  const situations = [
    {
      id: 1,
      player: 's1mple',
      team: 'NAVI',
      map: 'dust2',
      event: '1v3 clutch A site',
      similarity: 92,
      date: '2024-03-15',
      round: 28,
      tournament: 'IEM Katowice 2024',
      score: '14-14',
      economy: 'Force buy',
      video_id: 'abc123',
      description: 'Similar positioning, low HP, same site control'
    },
    {
      id: 2,
      player: 'ZywOo',
      team: 'Vitality', 
      map: 'dust2',
      event: 'AWP 4k hold A long',
      similarity: 87,
      date: '2024-02-20',
      round: 15,
      tournament: 'BLAST Premier',
      score: '12-3',
      economy: 'Full buy',
      video_id: 'def456',
      description: 'Same angle, similar timing, CT side'
    },
    {
      id: 3,
      player: 'NiKo',
      team: 'G2',
      map: 'dust2',
      event: 'Deagle ace eco',
      similarity: 78,
      date: '2024-01-10',
      round: 5,
      tournament: 'ESL Pro League',
      score: '3-2',
      economy: 'Eco round',
      video_id: 'ghi789',
      description: 'Force buy situation, similar stack positions'
    },
    {
      id: 4,
      player: 'device',
      team: 'Astralis',
      map: 'dust2',
      event: 'B site retake 2v4',
      similarity: 75,
      date: '2024-03-01',
      round: 20,
      tournament: 'PGL Major',
      score: '10-10',
      economy: 'Full buy',
      video_id: 'jkl012',
      description: 'Post-plant situation, similar utility usage'
    },
    {
      id: 5,
      player: 'sh1ro',
      team: 'Cloud9',
      map: 'dust2',
      event: 'AWP wallbang triple',
      similarity: 71,
      date: '2024-02-05',
      round: 11,
      tournament: 'IEM Cologne',
      score: '8-3',
      economy: 'Full buy',
      video_id: 'mno345',
      description: 'Mid control, wallbang opportunity'
    }
  ];
  
  return situations;
};

// Event-Generierung
const generateDetailedRoundEvents = (roundNum, players) => {
  const events = [];
  const roundDuration = 115;
  
  events.push({ 
    time: 0, 
    type: 'round_start', 
    round: roundNum,
    description: `Round ${roundNum} Start`
  });
  
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

// Match-Historie
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
      mvp: Math.floor(Math.random() * 10 + 1),
      side: i <= 15 ? 'first' : 'second'
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

export default function Analytics2DViewer() {
  const [players] = useState(generateDetailedPlayers());
  const [matchHistory] = useState(generateMatchHistory());
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [roundEvents, setRoundEvents] = useState([]);
  const [showKillFeed, setShowKillFeed] = useState(true);
  const [proDemos] = useState(generateProDemos());
  const [statsView, setStatsView] = useState('game'); // 'round', 'game', 'end'
  
  // Pan & Zoom states
  const [mapOffset, setMapOffset] = useState({ x: 0, y: 0 });
  const [mapScale, setMapScale] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  
  const canvasRef = useRef(null);
  const timelineRef = useRef(null);
  const mapContainerRef = useRef(null);

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

  // Pan & Zoom handlers
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && !isPanning) {
        e.preventDefault();
        setIsPanning(true);
        document.body.style.cursor = 'grab';
      }
    };
    
    const handleKeyUp = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsPanning(false);
        document.body.style.cursor = 'default';
      }
    };
    
    const handleWheel = (e) => {
      if (mapContainerRef.current && mapContainerRef.current.contains(e.target)) {
        e.preventDefault();
        const delta = e.deltaY * -0.001;
        const newScale = Math.min(Math.max(0.5, mapScale + delta), 3);
        setMapScale(newScale);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('wheel', handleWheel);
      document.body.style.cursor = 'default';
    };
  }, [isPanning, mapScale]);

  // Mouse move handler for panning
  const handleMouseMove = (e) => {
    if (isPanning) {
      const deltaX = e.clientX - panStart.x;
      const deltaY = e.clientY - panStart.y;
      setMapOffset({
        x: mapOffset.x + deltaX,
        y: mapOffset.y + deltaY
      });
      setPanStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseDown = (e) => {
    if (isPanning) {
      setPanStart({ x: e.clientX, y: e.clientY });
      document.body.style.cursor = 'grabbing';
    }
  };

  const handleMouseUp = () => {
    if (isPanning) {
      document.body.style.cursor = 'grab';
    }
  };

  // Draw map
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const MAP_WIDTH = canvas.width;
    const MAP_HEIGHT = canvas.height;
    
    // Clear and save context
    ctx.save();
    ctx.clearRect(0, 0, MAP_WIDTH, MAP_HEIGHT);
    
    // Apply transformations
    ctx.translate(MAP_WIDTH / 2, MAP_HEIGHT / 2);
    ctx.scale(mapScale, mapScale);
    ctx.translate(-MAP_WIDTH / 2 + mapOffset.x, -MAP_HEIGHT / 2 + mapOffset.y);
    
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
    
    ctx.restore();
  }, [players, selectedPlayer, roundEvents, currentTime, mapOffset, mapScale]);

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

  const getPlayerStats = (player) => {
    if (!player) return null;
    
    switch(statsView) {
      case 'round':
        return {
          kills: player.roundStats.kills,
          deaths: player.roundStats.deaths,
          assists: player.roundStats.assists,
          damage: player.roundStats.damage,
          enemiesFlashed: player.roundStats.enemiesFlashed,
          utilityDamage: player.roundStats.utilityDamage
        };
      case 'game':
        return player.gameStats;
      case 'end':
        return player.endStats;
      default:
        return player.gameStats;
    }
  };

  const currentScore = matchHistory[currentRound - 1]?.score || { ct: 0, t: 0 };

  return (
    <div className="bg-black min-h-screen text-white flex flex-col">
      {/* Extra space at top */}
      <div className="h-8 bg-gray-950"></div>
      
      <div className="flex-1 flex flex-col max-h-[calc(100vh-2rem)]">
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
                <button 
                  onClick={() => setRightPanelOpen(!rightPanelOpen)}
                  className="p-1.5 sm:p-2 hover:bg-gray-800 rounded transition-colors"
                >
                  <Lightbulb className="w-4 h-4" />
                </button>
                <button className="p-1.5 sm:p-2 hover:bg-gray-800 rounded transition-colors">
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Map Container */}
            <div 
              ref={mapContainerRef}
              className="flex-1 relative p-2 sm:p-4"
              onMouseMove={handleMouseMove}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
            >
              <div className="h-full bg-gray-950 rounded-lg border border-gray-800 p-2 sm:p-4 relative overflow-hidden">
                {/* Map Controls */}
                <div className="absolute top-2 left-2 z-10 flex flex-col gap-2">
                  <button
                    onClick={() => setMapScale(Math.min(3, mapScale + 0.2))}
                    className="p-2 bg-gray-900/90 backdrop-blur rounded hover:bg-gray-800 transition-colors"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setMapScale(Math.max(0.5, mapScale - 0.2))}
                    className="p-2 bg-gray-900/90 backdrop-blur rounded hover:bg-gray-800 transition-colors"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setMapScale(1);
                      setMapOffset({ x: 0, y: 0 });
                    }}
                    className="p-2 bg-gray-900/90 backdrop-blur rounded hover:bg-gray-800 transition-colors"
                  >
                    <Crosshair className="w-4 h-4" />
                  </button>
                </div>

                {/* Pan indicator */}
                {isPanning && (
                  <div className="absolute top-2 right-2 bg-yellow-400/20 text-yellow-400 px-3 py-1 rounded text-sm flex items-center gap-2">
                    <Move className="w-4 h-4" />
                    Panning Mode
                  </div>
                )}

                <canvas
                  ref={canvasRef}
                  width={800}
                  height={480}
                  className="w-full h-full object-contain rounded cursor-pointer"
                  style={{ cursor: isPanning ? 'grab' : 'pointer' }}
                  onClick={(e) => {
                    if (isPanning) return;
                    
                    const rect = e.currentTarget.getBoundingClientRect();
                    const scaleX = 800 / rect.width;
                    const scaleY = 480 / rect.height;
                    const x = (e.clientX - rect.left) * scaleX;
                    const y = (e.clientY - rect.top) * scaleY;
                    
                    // Adjust for pan and zoom
                    const adjustedX = (x - 400) / mapScale + 400 - mapOffset.x;
                    const adjustedY = (y - 240) / mapScale + 240 - mapOffset.y;
                    
                    const clickedPlayer = players.find(
                      (p) => Math.sqrt((p.x - adjustedX) ** 2 + (p.y - adjustedY) ** 2) < 25 / mapScale
                    );
                    setSelectedPlayer(clickedPlayer);
                  }}
                />
              </div>

              {/* Instructions */}
              <div className="absolute bottom-2 left-2 text-xs text-gray-500 bg-gray-900/80 backdrop-blur px-2 py-1 rounded">
                Hold <kbd className="px-1 py-0.5 bg-gray-800 rounded text-xs">Space</kbd> to pan • Scroll to zoom
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

          {/* Left Sidebar */}
          <div className={`${sidebarOpen ? 'w-96' : 'w-0'} lg:w-96 transition-all duration-300 border-l border-gray-800 bg-gray-950/50 backdrop-blur overflow-hidden`}>
            <div className="w-96 h-full overflow-y-auto">
              {/* Selected Player with Stats Toggle */}
              {selectedPlayer ? (
                <div className="p-4 space-y-4">
                  {/* Header with Stats Toggle */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{selectedPlayer.name}</h3>
                        <p className="text-xs text-gray-400">{selectedPlayer.position}</p>
                      </div>
                      <button
                        onClick={() => setSelectedPlayer(null)}
                        className="p-1 hover:bg-gray-800 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {/* Stats View Toggle */}
                    <div className="flex gap-1 p-1 bg-gray-900 rounded-lg">
                      {[
                        { value: 'round', label: 'Round', icon: <Timer className="w-3 h-3" /> },
                        { value: 'game', label: 'Game', icon: <BarChart className="w-3 h-3" /> },
                        { value: 'end', label: 'Final', icon: <Trophy className="w-3 h-3" /> }
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setStatsView(option.value)}
                          className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded text-xs font-medium transition-colors ${
                            statsView === option.value
                              ? 'bg-yellow-400 text-black'
                              : 'text-gray-400 hover:text-white hover:bg-gray-800'
                          }`}
                        >
                          {option.icon}
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Stats Display based on toggle */}
                  {statsView === 'round' ? (
                    // Round Stats
                    <div className="space-y-4">
                      <div className="bg-gray-900 rounded p-3">
                        <h4 className="text-xs text-gray-400 mb-2">ROUND {currentRound} PERFORMANCE</h4>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="text-center">
                            <div className="text-lg font-bold">{selectedPlayer.roundStats.kills}</div>
                            <div className="text-xs text-gray-400">Kills</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold">{selectedPlayer.roundStats.deaths}</div>
                            <div className="text-xs text-gray-400">Deaths</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold">{selectedPlayer.roundStats.damage}</div>
                            <div className="text-xs text-gray-400">Damage</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between py-1 text-sm">
                          <span className="text-gray-400">Enemies Flashed</span>
                          <span>{selectedPlayer.roundStats.enemiesFlashed}</span>
                        </div>
                        <div className="flex justify-between py-1 text-sm">
                          <span className="text-gray-400">Utility Damage</span>
                          <span>{selectedPlayer.roundStats.utilityDamage}</span>
                        </div>
                      </div>
                    </div>
                  ) : statsView === 'game' ? (
                    // Game Stats (Current)
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-2">
                        <div className="bg-gray-900 rounded p-2 text-center">
                          <div className="text-xs text-gray-400">K/D</div>
                          <div className="text-lg font-bold">{selectedPlayer.gameStats.kills}/{selectedPlayer.gameStats.deaths}</div>
                          <div className="text-xs text-yellow-400">{selectedPlayer.kd}</div>
                        </div>
                        <div className="bg-gray-900 rounded p-2 text-center">
                          <div className="text-xs text-gray-400">ADR</div>
                          <div className="text-lg font-bold">{selectedPlayer.gameStats.adr}</div>
                          <div className="text-xs text-gray-500">dmg/r</div>
                        </div>
                        <div className="bg-gray-900 rounded p-2 text-center">
                          <div className="text-xs text-gray-400">Rating</div>
                          <div className="text-lg font-bold text-yellow-400">★{selectedPlayer.gameStats.rating}</div>
                          <div className="text-xs text-gray-500">2.0</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-gray-900/50 rounded p-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-400">HS%</span>
                            <span className="text-sm font-medium text-yellow-400">{selectedPlayer.hsp}%</span>
                          </div>
                        </div>
                        <div className="bg-gray-900/50 rounded p-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-400">KAST</span>
                            <span className="text-sm font-medium">{selectedPlayer.gameStats.kast}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // End Stats (Final)
                    <div className="space-y-4">
                      <div className="bg-gray-900 rounded p-3">
                        <h4 className="text-xs text-gray-400 mb-2">FINAL MATCH STATS</h4>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="text-center">
                            <div className="text-lg font-bold">{selectedPlayer.endStats.kills}/{selectedPlayer.endStats.deaths}</div>
                            <div className="text-xs text-gray-400">K/D</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold">{selectedPlayer.endStats.adr}</div>
                            <div className="text-xs text-gray-400">ADR</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-yellow-400">★{selectedPlayer.endStats.rating}</div>
                            <div className="text-xs text-gray-400">Rating</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-900/50 rounded p-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-400">MVPs</span>
                          <span className="text-sm font-medium text-yellow-400">{selectedPlayer.endStats.mvps}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400">Clutches</span>
                          <span className="text-sm font-medium">{selectedPlayer.endStats.clutches}/{selectedPlayer.endStats.clutchAttempts}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Common Stats */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gray-900 rounded p-2">
                      <div className="flex items-center gap-1 text-xs text-gray-400 mb-0.5">
                        <Heart className="w-3 h-3" /> Health/Armor
                      </div>
                      <div className="text-lg font-semibold">{selectedPlayer.health}/{selectedPlayer.armor}</div>
                    </div>
                    <div className="bg-gray-900 rounded p-2">
                      <div className="flex items-center gap-1 text-xs text-gray-400 mb-0.5">
                        <DollarSign className="w-3 h-3" /> Money
                      </div>
                      <div className="text-lg font-semibold text-green-400">${selectedPlayer.money}</div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Players Overview */
                <div className="p-4">
                  <h3 className="text-sm font-medium text-gray-400 mb-3">PLAYERS OVERVIEW</h3>
                  
                  {/* CT Team */}
                  <div className="mb-4">
                    <div className="text-xs text-blue-400 mb-2">Counter-Terrorists</div>
                    <div className="space-y-1">
                      {players.filter(p => p.team === 'ct').map((player) => (
                        <button
                          key={player.id}
                          onClick={() => setSelectedPlayer(player)}
                          className="w-full p-2 bg-gray-900 hover:bg-gray-800 rounded transition-colors text-left"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="text-sm font-medium">{player.name}</div>
                              <div className="text-xs text-gray-500">{player.position}</div>
                            </div>
                            <div className="flex items-center gap-3 text-xs">
                              <span>{player.kills}/{player.deaths}</span>
                              <span className="text-yellow-400">★{player.rating}</span>
                              <span className="text-green-400">${player.money}</span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* T Team */}
                  <div>
                    <div className="text-xs text-red-400 mb-2">Terrorists</div>
                    <div className="space-y-1">
                      {players.filter(p => p.team === 't').map((player) => (
                        <button
                          key={player.id}
                          onClick={() => setSelectedPlayer(player)}
                          className="w-full p-2 bg-gray-900 hover:bg-gray-800 rounded transition-colors text-left"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="text-sm font-medium">{player.name}</div>
                              <div className="text-xs text-gray-500">{player.position}</div>
                            </div>
                            <div className="flex items-center gap-3 text-xs">
                              <span>{player.kills}/{player.deaths}</span>
                              <span className="text-yellow-400">★{player.rating}</span>
                              <span className="text-green-400">${player.money}</span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Pro Situations */}
          <div className={`${rightPanelOpen ? 'w-80' : 'w-0'} transition-all duration-300 border-l border-gray-800 bg-gray-950/50 backdrop-blur overflow-hidden`}>
            <div className="w-80 h-full overflow-y-auto">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-yellow-400" />
                    Pro Insights
                  </h3>
                  <button
                    onClick={() => setRightPanelOpen(false)}
                    className="p-1 hover:bg-gray-800 rounded lg:hidden"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Current Situation Analysis */}
                <div className="bg-gray-900 rounded-lg p-3 mb-4">
                  <h4 className="text-xs font-medium text-gray-400 mb-2">CURRENT SITUATION</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Players Alive</span>
                      <span>
                        <span className="text-blue-400">{players.filter(p => p.team === 'ct' && !roundEvents.some(e => e.type === 'kill' && e.victimId === p.id && e.time <= currentTime)).length}</span>
                        <span className="text-gray-600"> vs </span>
                        <span className="text-red-400">{players.filter(p => p.team === 't' && !roundEvents.some(e => e.type === 'kill' && e.victimId === p.id && e.time <= currentTime)).length}</span>
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Round Time</span>
                      <span>{formatTime(currentTime)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Economy Type</span>
                      <span className="text-green-400">Full Buy</span>
                    </div>
                  </div>
                </div>

                {/* Similar Pro Situations */}
                <div className="space-y-2">
                  <h4 className="text-xs font-medium text-gray-400 mb-2">SIMILAR PRO PLAYS</h4>
                  {proDemos.map((demo) => (
                    <div
                      key={demo.id}
                      className="group relative bg-gray-900 hover:bg-gray-800 rounded-lg p-3 cursor-pointer transition-all hover:scale-[1.02]"
                    >
                      {/* Similarity Badge */}
                      <div className="absolute top-2 right-2 bg-yellow-400/20 text-yellow-400 text-xs px-2 py-0.5 rounded font-medium">
                        {demo.similarity}% match
                      </div>
                      
                      {/* Player & Event */}
                      <div className="mb-2">
                        <div className="font-medium text-sm">{demo.player}</div>
                        <div className="text-xs text-gray-400">{demo.team} • {demo.event}</div>
                      </div>
                      
                      {/* Match Info */}
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                        <span>{demo.tournament}</span>
                        <span>•</span>
                        <span>Round {demo.round}</span>
                        <span>•</span>
                        <span>{demo.score}</span>
                      </div>
                      
                      {/* Description */}
                      <div className="text-xs text-gray-400 italic">
                        "{demo.description}"
                      </div>
                      
                      {/* Watch Button */}
                      <button className="mt-2 w-full py-1 bg-gray-800 hover:bg-gray-700 rounded text-xs font-medium transition-colors flex items-center justify-center gap-1">
                        <Play className="w-3 h-3" />
                        Watch Clip
                      </button>
                    </div>
                  ))}
                </div>

                {/* Learning Tips */}
                <div className="mt-4 bg-yellow-400/10 border border-yellow-400/20 rounded-lg p-3">
                  <h4 className="text-xs font-medium text-yellow-400 mb-1">PRO TIP</h4>
                  <p className="text-xs text-gray-300">
                    In similar situations, pros often use utility to cut off rotations before executing. 
                    Consider smoking CT spawn and flashing over A site.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline - Increased Height */}
        <div className="h-56 border-t border-gray-800 bg-gray-950 flex-shrink-0">
          <div className="h-full flex flex-col">
            {/* Round Timeline - More Vertical Space */}
            <div className="h-32 px-4 py-3 overflow-x-auto border-b border-gray-800" ref={timelineRef}>
              <div className="h-full flex items-center gap-1 min-w-max">
                {matchHistory.map((round, i) => (
                  <div key={i} className="relative group h-full">
                    {/* Halftime marker */}
                    {round.round === 16 && (
                      <div className="absolute -left-3 top-0 bottom-0 w-1 bg-yellow-400 rounded">
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-sm text-yellow-400 whitespace-nowrap font-bold">
                          HALFTIME
                        </span>
                      </div>
                    )}
                    
                    <button
                      onClick={() => setCurrentRound(round.round)}
                      className={`relative h-full w-16 flex flex-col items-center justify-center border-2 rounded-lg transition-all ${
                        round.round === currentRound 
                          ? 'border-yellow-400 bg-yellow-400/10 scale-110 shadow-lg' 
                          : 'border-gray-800 hover:border-gray-700 hover:bg-gray-900'
                      }`}
                    >
                      {/* Round number */}
                      <span className="text-sm text-gray-400 font-medium mb-1">R{round.round}</span>
                      
                      {/* Winner indicator */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold mb-1 ${
                        round.winner === 'ct' 
                          ? 'bg-blue-500/20 text-blue-400 border-2 border-blue-500/50' 
                          : 'bg-red-500/20 text-red-400 border-2 border-red-500/50'
                      }`}>
                        {round.winner.toUpperCase()}
                      </div>
                      
                      {/* Score */}
                      <span className="text-xs text-gray-500 font-medium">
                        {round.score.ct}-{round.score.t}
                      </span>
                      
                      {/* End reason icon */}
                      <div className="absolute -bottom-3 text-xs text-gray-600">
                        {round.endReason === 'bomb' ? '💣' :
                         round.endReason === 'defuse' ? '✓' :
                         round.endReason === 'time' ? '⏱' : '☠'}
                      </div>
                      
                      {/* MVP indicator */}
                      {round.mvp === selectedPlayer?.id && (
                        <div className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                          ★
                        </div>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Event Timeline */}
            <div className="flex-1 px-4 py-2">
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
                        <div className={`p-1 rounded-full ${
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
            <div className="h-12 border-t border-gray-800 px-4 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button className="p-1.5 hover:bg-gray-800 rounded transition-colors">
                  <SkipBack className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-1.5 bg-yellow-400 hover:bg-yellow-500 rounded text-black transition-colors"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button className="p-1.5 hover:bg-gray-800 rounded transition-colors">
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>{formatTime(currentTime)}</span>
                <span>/</span>
                <span>{formatTime(matchHistory[currentRound - 1]?.duration || 120)}</span>
              </div>

              <div className="flex-1" />

              <select
                value={playbackSpeed}
                onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                className="bg-transparent text-sm text-gray-400 focus:outline-none"
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