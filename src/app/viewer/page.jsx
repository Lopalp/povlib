"use client";
import React, { useState, useEffect, useRef } from 'react';
import {
    ChevronUp,
    ChevronDown,
    Play,
    Pause,
    Users,
    Shield,
    Heart,
    Bomb,
    Skull,
    ListVideo,
    DollarSign,
    Crosshair,
    ShieldCheck,
    BarChart,
    Flame,
    Cloud,
    Zap,
} from 'lucide-react';

// --- THEME & CONFIGURATION ---
const theme = {
    colors: {
        background: '#101114',
        panel: 'rgba(10, 10, 10, 0.7)',
        panelBorder: 'rgba(255, 255, 255, 0.08)',
        textPrimary: '#F0F0F0',
        textSecondary: '#A0A0A0',
        accent: '#FBBF24',
        teamA: '#3B82F6',
        teamB: '#F97316',
        killEvent: '#EF4444',
        plantEvent: '#F59E0B',
        success: '#22C55E',
        money: '#84CC16',
        mapWall: 'rgba(200, 200, 220, 0.3)',
        mapBackground: '#1A1D23',
    },
    font: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
};

// --- KARTEN-GEOMETRIE ---
const mapGeometry = {
    walls: [
        { x: 450, y: 650, w: 100, h: 10 }, 
        { x: 400, y: 550, w: 10, h: 100 },
        { x: 500, y: 500, w: 50, h: 50 },  
        { x: 1200, y: 300, w: 10, h: 200 },
        { x: 1100, y: 250, w: 200, h: 10 },
        { x: 1150, y: 400, w: 80, h: 80 }, 
    ]
};


// --- ERWEITERTE MOCK-DATEN ---
const staticPlayers = [
    ...Array.from({ length: 5 }, (_, i) => ({ id: i + 1, name: `NexusPlayer${i + 1}`, team: 'teamA' })),
    ...Array.from({ length: 5 }, (_, i) => ({ id: i + 6, name: `GunsPlayer${i + 1}`, team: 'teamB' })),
];

const generateRoundData = (roundNumber) => {
    const playersThisRound = staticPlayers.map((p, i) => ({ 
        ...p, 
        isAlive: Math.random() > 0.3 * (roundNumber / 24),
        health: Math.floor(Math.random() * 101),
        armor: Math.random() > 0.4 ? Math.floor(Math.random() * 101) : 0,
        money: Math.floor(Math.random() * 5000) + 800,
        stats: { k: Math.floor(Math.random() * (roundNumber/2)), a: Math.floor(Math.random() * (roundNumber/3)), d: Math.floor(Math.random() * (roundNumber/4))},
        equipment: {
            defuseKit: p.team === 'teamA' && Math.random() > 0.5,
            bomb: p.team === 'teamB' && i === Math.floor(Math.random()*5),
        },
        position: { x: 200 + Math.random() * 1200, y: 200 + Math.random() * 600 },
        viewAngle: Math.random() * 360,
    }));
    return {
        roundNumber,
        winner: Math.random() > 0.5 ? 'teamA' : 'teamB',
        events: Array.from({ length: Math.floor(Math.random() * 8) + 2 }, (_, i) => {
            const alivePlayers = playersThisRound.filter(p => p.isAlive);
            if (alivePlayers.length < 2) return null;
            const killer = alivePlayers[Math.floor(Math.random() * alivePlayers.length)];
            const victim = alivePlayers.find(p => p.team !== killer.team);
            return {
                id: i,
                time: Math.floor(Math.random() * 115),
                type: Math.random() > 0.8 ? 'bomb_plant' : 'kill',
                killer: killer.name,
                victim: victim?.name || 'Unknown',
                killerTeam: killer.team,
                victimTeam: victim?.team || 'teamA',
            };
        }).filter(Boolean).sort((a,b) => a.time - b.time),
        utility: [
            { type: 'smoke', team: 'teamA', count: Math.floor(Math.random() * 5) },
            { type: 'flash', team: 'teamA', count: Math.floor(Math.random() * 8) },
            { type: 'molotov', team: 'teamB', count: Math.floor(Math.random() * 3) },
        ],
        players: playersThisRound,
    };
};

const replayData = {
    mapName: 'de_inferno',
    totalRounds: 24,
    teams: {
        teamA: { name: 'Nexus', color: theme.colors.teamA, players: staticPlayers.filter(p => p.team === 'teamA') },
        teamB: { name: 'GUNS', color: theme.colors.teamB, players: staticPlayers.filter(p => p.team === 'teamB') },
    },
    rounds: Array.from({ length: 24 }, (_, i) => generateRoundData(i + 1)),
};


// --- UI-KOMPONENTEN ---
const IconButton = ({ children, onClick, className = '', tooltip = '' }) => (
    <button onClick={onClick} className={`p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 ${className}`} title={tooltip}>
        {children}
    </button>
);

const PlayerRow = ({ player, team, roundPlayer, isInitiallyVisible }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div 
            className={`rounded-lg transition-all duration-300 overflow-hidden ${isInitiallyVisible ? 'opacity-100' : 'opacity-40 grayscale'}`} 
            style={{ backgroundColor: 'rgba(0,0,0,0.2)', border: isExpanded ? `1px solid ${team.color}` : '1px solid transparent' }}
        >
            <div className="flex items-center justify-between px-3 py-2 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 rounded-full" style={{ backgroundColor: team.color }}></div>
                    <span className="font-medium text-white">{player.name}</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-xs text-red-400"><Heart className="w-3 h-3" /> {roundPlayer?.health}</div>
                    <div className="flex items-center gap-1.5 text-xs text-blue-400"><Shield className="w-3 h-3" /> {roundPlayer?.armor}</div>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
            </div>
            {isExpanded && (
                <div className="px-3 pb-3 mt-1 border-t border-white/5">
                    <div className="grid grid-cols-3 gap-2 text-center text-xs mt-2">
                        <div className="flex flex-col items-center gap-1 p-1 bg-black/20 rounded">
                            <span className="text-gray-400">KDA</span>
                            <span className="font-mono text-white">{roundPlayer?.stats.k}/{roundPlayer?.stats.d}/{roundPlayer?.stats.a}</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 p-1 bg-black/20 rounded">
                            <DollarSign className="w-4 h-4 text-green-400"/>
                            <span className="font-mono text-white">${roundPlayer?.money}</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 p-1 bg-black/20 rounded">
                            <span className="text-gray-400">Util</span>
                             <div className="flex gap-2">
                               {roundPlayer?.equipment.bomb && <Bomb className="w-4 h-4 text-orange-400"/>}
                               {roundPlayer?.equipment.defuseKit && <ShieldCheck className="w-4 h-4 text-blue-300"/>}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const KillFeed = ({ events, currentTime }) => (
    <div className="absolute top-14 right-4 w-72 z-20 space-y-1.5 pointer-events-none">
        {events
            .filter(e => e.type === 'kill' && e.time <= currentTime)
            .slice(-4)
            .map((event, i) => (
                <div key={i} className="bg-gray-950/70 backdrop-blur-sm rounded-md px-3 py-1.5 flex items-center justify-between text-sm shadow-lg animate-fade-in">
                    <span style={{ color: replayData.teams[event.killerTeam].color }}>{event.killer}</span>
                    <Crosshair className="w-4 h-4 text-gray-500"/>
                    <span style={{ color: replayData.teams[event.victimTeam].color }} className="opacity-70">{event.victim}</span>
                </div>
            ))
        }
    </div>
);

const formatTime = (timeInSeconds) => {
  if (isNaN(timeInSeconds) || timeInSeconds < 0) return "0:00";
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};


const MapCanvas = ({ players, geometry }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        ctx.fillStyle = theme.colors.mapBackground;
        ctx.fillRect(0, 0, width, height);
        
        ctx.fillStyle = theme.colors.mapWall;
        geometry.walls.forEach(wall => {
            ctx.fillRect(wall.x, wall.y, wall.w, wall.h);
        });

        players.forEach(p => {
            ctx.save();
            if (!p.isAlive) {
                ctx.globalAlpha = 0.4;
            }
            
            ctx.beginPath();
            ctx.arc(p.position.x, p.position.y, 8, 0, 2 * Math.PI);
            ctx.fillStyle = p.team === 'teamA' ? theme.colors.teamA : theme.colors.teamB;
            ctx.fill();
            
            const angle = p.viewAngle * (Math.PI / 180);
            ctx.beginPath();
            ctx.moveTo(p.position.x, p.position.y);
            ctx.arc(p.position.x, p.position.y, 25, angle - 0.4, angle + 0.4);
            ctx.closePath();
            ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
            ctx.fill();

            if (!p.isAlive) {
                ctx.fillStyle = '#FFF';
                ctx.font = '12px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('💀', p.position.x, p.position.y + 4);
            }
            ctx.restore();
        });

    }, [players, geometry]);

    return <canvas ref={canvasRef} width={1600} height={900} className="w-full h-full object-contain" />;
};

const UtilityTracker = ({ utility, teams }) => (
    <div className="p-2 space-y-1 rounded-xl bg-gray-950/80 backdrop-blur-sm border border-white/10">
        <h3 className="font-semibold px-3 py-1 text-sm text-gray-300">Utility</h3>
        {utility.map((util, i) => (
             <div key={i} className="flex items-center justify-between px-3 py-1 text-sm rounded-md bg-black/20">
                <div className="flex items-center gap-2" style={{color: teams[util.team].color}}>
                    {util.type === 'smoke' && <Cloud className="w-4 h-4" />}
                    {util.type === 'flash' && <Zap className="w-4 h-4" />}
                    {util.type === 'molotov' && <Flame className="w-4 h-4" />}
                    <span className="capitalize">{util.type}</span>
                </div>
                <span className="font-mono font-semibold">{util.count}</span>
            </div>
        ))}
    </div>
);


// --- HAUPTKOMPONENTE ---
const TacticalReplayViewer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [currentRound, setCurrentRound] = useState(1);
    const [isPlayersExpanded, setIsPlayersExpanded] = useState(true);
    const [isUtilityExpanded, setIsUtilityExpanded] = useState(false);
    const [showKillFeed, setShowKillFeed] = useState(true);
    const [showRoundSelector, setShowRoundSelector] = useState(true);
    const [isHovering, setIsHovering] = useState(false);
    
    const containerRef = useRef(null);
    const activeRoundData = replayData.rounds[currentRound - 1];
    const roundDuration = 115;
    const areControlsVisible = !isPlaying || isHovering;

    const scores = replayData.rounds.slice(0, currentRound).reduce((acc, round) => {
        acc[round.winner]++;
        return acc;
    }, { teamA: 0, teamB: 0 });

    useEffect(() => {
        setCurrentTime(0);
        setIsPlaying(false);
    }, [currentRound]);
    
    useEffect(() => {
        let timer;
        if (isPlaying && currentTime < roundDuration) {
            timer = setInterval(() => setCurrentTime(prev => prev + 1), 200);
        }
        if (currentTime >= roundDuration) {
            setIsPlaying(false);
        }
        return () => clearInterval(timer);
    }, [isPlaying, currentTime]);

    const handleSeek = (e) => {
        const newTime = (e.target.value / 100) * roundDuration;
        setCurrentTime(newTime);
    };

    return (
        <div 
            ref={containerRef}
            className="w-full h-screen flex flex-col items-center justify-center font-sans relative text-gray-200 overflow-hidden" 
            style={{ backgroundColor: theme.colors.background, fontFamily: theme.font }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
             <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.4); }
                @keyframes fade-in {
                    from { opacity: 0; transform: translateX(10px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
             `}</style>
            
            <div className="w-full h-full flex items-center justify-center p-24 transition-all duration-500">
                <MapCanvas players={activeRoundData.players} geometry={mapGeometry} />
            </div>
            
             <header className={`absolute top-0 left-1/2 -translate-x-1/2 p-4 z-30 transition-opacity duration-300 ${areControlsVisible ? 'opacity-100' : 'opacity-0'}`}>
                <div className="p-3 px-6 rounded-xl bg-black/30 backdrop-blur-sm flex items-center gap-4">
                    <span className="font-bold text-lg" style={{ color: theme.colors.teamA }}>{replayData.teams.teamA.name}</span>
                    <span className="text-2xl font-mono bg-black/30 px-3 py-1 rounded-md text-white">{scores.teamA} : {scores.teamB}</span>
                    <span className="font-bold text-lg" style={{ color: theme.colors.teamB }}>{replayData.teams.teamB.name}</span>
                </div>
            </header>
            
            <div className={`absolute top-0 right-0 z-30 transition-opacity duration-300 ${areControlsVisible ? 'opacity-100' : 'opacity-0'}`}>
                <div className="bg-gray-950/70 backdrop-blur-sm rounded-bl-2xl">
                    <div className="flex items-center justify-end p-2 gap-1">
                        <IconButton onClick={() => setIsUtilityExpanded(!isUtilityExpanded)} className={`${isUtilityExpanded ? 'bg-yellow-400/20 text-yellow-400' : 'hover:bg-gray-800'}`} tooltip="Utility-Tracker anzeigen/verbergen"><BarChart className="h-5 w-5" /></IconButton>
                        <IconButton onClick={() => setIsPlayersExpanded(!isPlayersExpanded)} className={`${isPlayersExpanded ? 'bg-yellow-400/20 text-yellow-400' : 'hover:bg-gray-800'}`} tooltip="Spielerliste anzeigen/verbergen"><Users className="h-5 w-5" /></IconButton>
                        <IconButton onClick={() => setShowKillFeed(!showKillFeed)} className={`${showKillFeed ? 'bg-yellow-400/20 text-yellow-400' : 'hover:bg-gray-800'}`} tooltip="Kill-Feed anzeigen/verbergen"><Crosshair className="h-5 w-5" /></IconButton>
                        <IconButton onClick={() => setShowRoundSelector(!showRoundSelector)} className={`${showRoundSelector ? 'bg-yellow-400/20 text-yellow-400' : 'hover:bg-gray-800'}`} tooltip="Rundenauswahl anzeigen/verbergen"><ListVideo className="h-5 w-5" /></IconButton>
                    </div>
                </div>
            </div>

            {showKillFeed && <KillFeed events={activeRoundData.events} currentTime={currentTime} />}
            
             <aside className={`absolute top-14 left-4 w-60 z-20 transition-all duration-300 ease-in-out ${isUtilityExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
                <UtilityTracker utility={activeRoundData.utility} teams={replayData.teams} />
             </aside>

            <aside className={`absolute top-14 right-4 w-80 z-20 transition-all duration-300 ease-in-out ${isPlayersExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
                 <div className="p-2 space-y-1 rounded-xl bg-gray-950/80 backdrop-blur-sm border border-white/10 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    <h3 className="font-semibold px-3 py-1" style={{color: theme.colors.teamA}}>{replayData.teams.teamA.name}</h3>
                    {replayData.teams.teamA.players.map(p => (
                        <PlayerRow 
                            key={p.id} 
                            player={p} 
                            team={replayData.teams.teamA} 
                            roundPlayer={activeRoundData.players.find(rp => rp.id === p.id)}
                            isInitiallyVisible={activeRoundData.players.find(rp => rp.id === p.id)?.isAlive ?? false}
                        />
                    ))}
                     <h3 className="font-semibold pt-2 px-3 py-1" style={{color: theme.colors.teamB}}>{replayData.teams.teamB.name}</h3>
                     {replayData.teams.teamB.players.map(p => (
                         <PlayerRow 
                            key={p.id} 
                            player={p} 
                            team={replayData.teams.teamB} 
                            roundPlayer={activeRoundData.players.find(rp => rp.id === p.id)}
                            isInitiallyVisible={activeRoundData.players.find(rp => rp.id === p.id)?.isAlive ?? false}
                        />
                     ))}
                 </div>
            </aside>

            <footer className={`absolute bottom-0 left-0 right-0 z-30 p-4 transition-opacity duration-300 ${areControlsVisible ? 'opacity-100' : 'opacity-0'}`}>
                <div className="bg-gray-900/60 backdrop-blur-sm border-t border-gray-700/50 rounded-2xl p-3 space-y-3">
                    <div className="flex items-center gap-3 text-white">
                        <IconButton onClick={() => setIsPlaying(!isPlaying)}>
                            {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                        </IconButton>
                        <span className="text-sm font-mono w-14 text-center">{formatTime(currentTime)}</span>
                        
                        <div className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer relative">
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={roundDuration > 0 ? (currentTime / roundDuration) * 100 : 0}
                                onChange={handleSeek}
                                className="w-full h-full bg-transparent appearance-none cursor-pointer absolute inset-0 z-10 accent-yellow-400"
                            />
                            {activeRoundData.events.map(event => (
                                <div
                                    key={event.id}
                                    className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full pointer-events-none"
                                    style={{
                                        left: `${(event.time / roundDuration) * 100}%`,
                                        backgroundColor: event.type === 'kill' ? theme.colors.killEvent : theme.colors.plantEvent,
                                    }}
                                />
                            ))}
                        </div>
                        <span className="text-sm font-mono w-14 text-center">{formatTime(roundDuration)}</span>
                    </div>

                    {showRoundSelector && (
                        <div className="pt-4 border-t border-gray-700/50">
                             <div className="relative overflow-x-auto custom-scrollbar">
                                <div className="flex justify-center min-w-max gap-4 p-2">
                                  {replayData.rounds.map((r) => (
                                    <div key={r.roundNumber} className="flex flex-col items-center flex-shrink-0">
                                      <button onClick={() => setCurrentRound(r.roundNumber)} className={`w-9 h-9 ${currentRound === r.roundNumber ? 'bg-yellow-400 border-yellow-400 text-gray-900 scale-110' : 'bg-gray-800 border-gray-700 text-gray-300'} rounded-full flex items-center justify-center text-xs font-medium border-2 hover:border-yellow-400 hover:bg-gray-700 transition-all cursor-pointer transform hover:scale-105`}>{r.roundNumber}</button>
                                    </div>
                                  ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </footer>
        </div>
    );
};

export default TacticalReplayViewer;
