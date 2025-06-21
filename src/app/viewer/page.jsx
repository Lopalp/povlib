"use client";
import React, { useState, useEffect, useRef } from 'react';
import {
    Play, Pause, Users, Shield, Heart, Bomb, Crosshair, ShieldCheck, ListVideo,
    DollarSign, BarChart, Flame, Cloud, Zap, Map,
    Thermometer, Footprints, X, ChevronDown
} from 'lucide-react';

// --- THEME & CONFIGURATION ---
const theme = {
    colors: {
        background: '#101114', panel: 'rgba(18, 18, 20, 0.7)',
        panelBorder: 'rgba(255, 255, 255, 0.1)', textPrimary: '#F0F0F0',
        textSecondary: '#A0A0A0', accent: '#FBBF24', teamA: '#3B82F6',
        teamB: '#E5E7EB', killEvent: '#FBBF24', plantEvent: '#FBBF24',
        mapWall: 'rgba(200, 200, 220, 0.3)', mapBackground: '#1A1D23',
    },
    font: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
};

// --- KARTEN-GEOMETRIE ---
const mapGeometry = { walls: [ { x: 450, y: 650, w: 100, h: 10 }, { x: 400, y: 550, w: 10, h: 100 }, { x: 500, y: 500, w: 50, h: 50 }, { x: 1200, y: 300, w: 10, h: 200 }, { x: 1100, y: 250, w: 200, h: 10 }, { x: 1150, y: 400, w: 80, h: 80 } ] };

// --- ERWEITERTE MOCK-DATEN (MIT PFADEN) ---
const staticPlayers = [ ...Array.from({ length: 5 }, (_, i) => ({ id: i + 1, name: `NexusPlayer${i + 1}`, team: 'teamA' })), ...Array.from({ length: 5 }, (_, i) => ({ id: i + 6, name: `GunsPlayer${i + 1}`, team: 'teamB' })) ];
const roundDuration = 115;

const generateRoundData = (roundNumber) => {
    const events = [];
    const playersThisRound = staticPlayers.map((p, i) => {
        const startPos = { x: p.team === 'teamA' ? 300 + Math.random()*200 : 1100 + Math.random()*200, y: 450 + Math.random() * 200 };
        const path = [{ t: 0, ...startPos }];
        let currentPos = { ...startPos };
        for (let t = 1; t <= roundDuration; t++) {
            currentPos.x += (Math.random() - 0.5) * 15;
            currentPos.y += (Math.random() - 0.5) * 15;
            path.push({ t, x: currentPos.x, y: currentPos.y });
        }
        return { ...p, isAlive: true, health: 100, armor: Math.random() > 0.4 ? 100 : 0, money: Math.floor(Math.random() * 4000) + 800, stats: { k: 0, a: 0, d: 0 }, equipment: { defuseKit: p.team === 'teamA' && Math.random() > 0.5, bomb: p.team === 'teamB' && i === 5 }, path, };
    });

    for (let i = 0; i < Math.floor(Math.random() * 8) + 2; i++) {
        const alivePlayers = playersThisRound.filter(p => p.isAlive);
        if (alivePlayers.length < 2) continue;
        const killer = alivePlayers[Math.floor(Math.random() * alivePlayers.length)];
        const victimPool = alivePlayers.filter(p => p.team !== killer.team && p.isAlive);
        if (victimPool.length === 0) continue;
        const victim = victimPool[Math.floor(Math.random() * victimPool.length)];
        const time = Math.floor(Math.random() * roundDuration);
        
        victim.isAlive = false;
        victim.health = 0;
        killer.stats.k++;
        victim.stats.d++;

        events.push({ id: events.length, time, type: 'kill', killer: killer.name, victim: victim.name, killerTeam: killer.team, victimTeam: victim.team, position: victim.path.find(pos => pos.t >= time) || victim.path[victim.path.length-1], });
    }
    events.sort((a,b) => a.time - b.time);
    
    // Update player stats based on events
    replayData.rounds.slice(0, roundNumber - 1).forEach(prevRound => {
        playersThisRound.forEach(p => {
            const playerInPrevRound = prevRound.players.find(pp => pp.id === p.id);
            if (playerInPrevRound) {
                p.stats.k += playerInPrevRound.stats.k;
                p.stats.a += playerInPrevRound.stats.a;
                p.stats.d += playerInPrevRound.stats.d;
            }
        });
    });

    return { roundNumber, winner: Math.random() > 0.5 ? 'teamA' : 'teamB', events, players: playersThisRound, utility: [ { type: 'smoke', team: 'teamA', count: Math.floor(Math.random() * 5) }, { type: 'flash', team: 'teamA', count: Math.floor(Math.random() * 8) }, { type: 'molotov', team: 'teamB', count: Math.floor(Math.random() * 3) } ], };
};

const replayData = {
    mapName: 'de_inferno', totalRounds: 16,
    teams: { teamA: { name: 'Nexus', color: theme.colors.teamA, players: staticPlayers.filter(p => p.team === 'teamA') }, teamB: { name: 'GUNS', color: theme.colors.teamB, players: staticPlayers.filter(p => p.team === 'teamB') } },
    rounds: [], // Will be populated dynamically
};
replayData.rounds = Array.from({ length: 16 }, (_, i) => generateRoundData(i + 1));


// --- UI-KOMPONENTEN ---
const IconButton = ({ children, onClick, className = '', tooltip = '' }) => (<button onClick={onClick} className={`p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 ${className}`} title={tooltip}>{children}</button>);
const formatTime = (time) => `${Math.floor(time/60)}:${(Math.floor(time%60)+'').padStart(2,'0')}`;

const KillFeed = ({ events, currentTime }) => (
    <div className="absolute top-24 right-4 w-72 z-20 space-y-1.5 pointer-events-none">
        {events .filter(e => e.type === 'kill' && e.time <= currentTime && e.time > currentTime - 5) .slice(-4) .map((event) => ( <div key={`${event.id}-${event.killer}`} className="bg-gray-950/70 backdrop-blur-sm rounded-md px-3 py-1.5 flex items-center justify-between text-sm shadow-lg animate-fade-in-right"> <span style={{ color: replayData.teams[event.killerTeam].color }} className="font-semibold">{event.killer}</span> <Crosshair className="w-4 h-4 text-gray-500"/> <span style={{ color: replayData.teams[event.victimTeam].color }} className="opacity-70">{event.victim}</span> </div> ))}
    </div>
);

const PlayerRow = ({ player, team, isAlive }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    return (
        <div className={`rounded-lg transition-all duration-300 overflow-hidden ${isAlive ? 'opacity-100' : 'opacity-40 grayscale'}`} style={{ backgroundColor: 'rgba(0,0,0,0.2)', border: isExpanded ? `1px solid ${team.color}` : '1px solid transparent' }}>
            <div className="flex items-center justify-between px-3 py-2 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 rounded-full" style={{ backgroundColor: team.color }}></div>
                    <span className="font-medium text-white">{player.name}</span>
                </div>
                <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1.5 text-yellow-400"><Heart className="w-3.5 h-3.5" /> {player.health}</div>
                    <div className="flex items-center gap-1.5 text-blue-300"><Shield className="w-3.5 h-3.5" /> {player.armor}</div>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
            </div>
            {isExpanded && (
                <div className="px-3 pb-3 mt-1 border-t border-white/5">
                    <div className="grid grid-cols-3 gap-2 text-center text-xs mt-2">
                        <div className="flex flex-col items-center gap-1 p-1 bg-black/20 rounded-md">
                            <span className="text-gray-400">K/A/D</span>
                            <span className="font-mono text-white text-sm">{`${player.stats.k}/${player.stats.a}/${player.stats.d}`}</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 p-1 bg-black/20 rounded-md">
                            <DollarSign className="w-4 h-4 text-yellow-400"/>
                            <span className="font-mono text-white text-sm">${player.money}</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 p-1 bg-black/20 rounded-md">
                            <span className="text-gray-400">Util</span>
                            <div className="flex gap-2 h-5 items-center">
                                {player.equipment.bomb && <Bomb className="w-4 h-4 text-yellow-400"/>}
                                {player.equipment.defuseKit && <ShieldCheck className="w-4 h-4 text-blue-300"/>}
                                {!player.equipment.bomb && !player.equipment.defuseKit && <span className="text-gray-500">-</span>}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const UtilityTracker = ({ utility, teams }) => (
    <div className="p-2 space-y-1 rounded-xl bg-gray-950/80 backdrop-blur-sm border border-white/10">
        <h3 className="font-semibold px-3 py-1 text-sm text-gray-300">Utility Count</h3>
        {utility.map((util, i) => (
                 <div key={i} className="flex items-center justify-between px-3 py-1.5 text-sm rounded-md bg-black/20">
                    <div className="flex items-center gap-2" style={{color: teams[util.team].color}}>
                        {util.type === 'smoke' && <Cloud className="w-4 h-4" />}
                        {util.type === 'flash' && <Zap className="w-4 h-4" />}
                        {util.type === 'molotov' && <Flame className="w-4 h-4" />}
                        <span className="capitalize font-medium">{util.type}</span>
                    </div>
                    <span className="font-mono font-bold text-base">{util.count}</span>
                </div>
        ))}
    </div>
);

const Scoreboard = ({ replayData, onClose }) => {
    const allPlayers = staticPlayers.map(p => {
        const totalStats = replayData.rounds.reduce((acc, round) => { const playerInRound = round.players.find(rp => rp.id === p.id); if (playerInRound) { acc.k += playerInRound.stats.k; acc.a += playerInRound.stats.a; acc.d += playerInRound.stats.d; } return acc; }, {k: 0, a: 0, d: 0});
        return { ...p, ...totalStats };
    });
    const totalScore = replayData.rounds.reduce((acc, r) => { if(r.winner) acc[r.winner]++; return acc; }, { teamA: 0, teamB: 0 });
    return (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-8" onClick={onClose}>
            <div className="bg-gray-900/80 border border-gray-700 rounded-2xl w-full max-w-4xl p-6 animate-fade-in-up" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6"> <h1 className="text-3xl font-bold text-white">Match Scoreboard</h1> <IconButton onClick={onClose}><X /></IconButton> </div>
                <div className="flex items-center justify-center gap-6 mb-8"> <span className="font-bold text-3xl" style={{ color: theme.colors.teamA }}>{replayData.teams.teamA.name}</span> <span className="text-5xl font-mono bg-black/30 px-6 py-2 rounded-md text-white">{totalScore.teamA} : {totalScore.teamB}</span> <span className="font-bold text-3xl" style={{ color: theme.colors.teamB }}>{replayData.teams.teamB.name}</span> </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    {[ 'teamA', 'teamB' ].map(teamId => ( <div key={teamId} className="space-y-2"> <h3 className="font-semibold text-xl px-2" style={{color: replayData.teams[teamId].color}}>{replayData.teams[teamId].name}</h3> <div className="bg-black/20 rounded-lg p-2 space-y-1"> {allPlayers.filter(p => p.team === teamId).sort((a,b) => b.k - a.k).map(p => ( <div key={p.id} className="grid grid-cols-4 items-center p-2 rounded-md hover:bg-white/5"> <span className="col-span-2 font-medium">{p.name}</span> <span className="text-center font-mono">{`${p.k}/${p.a}/${p.d}`}</span> <span className="text-center font-mono text-yellow-400">{/* ADR */}</span> </div> ))} </div> </div> ))}
                </div>
            </div>
        </div>
    );
};

const MapCanvas = ({ players, geometry, showHeatmap, showPaths, events, currentTime, isMultiRound }) => {
    const canvasRef = useRef(null);
    useEffect(() => {
        const canvas = canvasRef.current; if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();

        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

        ctx.clearRect(0, 0, rect.width, rect.height);
        
        const mapAspectRatio = 16 / 9;
        let scale = Math.min(rect.width / 1600, rect.height / 900);
        let offsetX = (rect.width - 1600 * scale) / 2;
        let offsetY = (rect.height - 900 * scale) / 2;

        ctx.save();
        ctx.fillStyle = theme.colors.mapBackground;
        ctx.fillRect(0, 0, rect.width, rect.height);
        ctx.translate(offsetX, offsetY);
        ctx.scale(scale, scale);

        ctx.fillStyle = theme.colors.mapWall;
        geometry.walls.forEach(wall => ctx.fillRect(wall.x, wall.y, wall.w, wall.h));
        
        if (showHeatmap) {
            events.filter(e => e.type === 'kill').forEach(event => {
                const g = ctx.createRadialGradient(event.position.x, event.position.y, 10, event.position.x, event.position.y, 80);
                g.addColorStop(0, 'rgba(251, 191, 36, 0.3)');
                g.addColorStop(1, 'rgba(251, 191, 36, 0)');
                ctx.fillStyle = g;
                ctx.fillRect(event.position.x - 80, event.position.y - 80, 160, 160);
            });
        }
        
        players.forEach(p => {
            const playerPos = isMultiRound ? p.path[p.path.length-1] : p.path.find(pos => pos.t >= currentTime) || p.path[0];
            if (showPaths) {
                ctx.beginPath();
                ctx.moveTo(p.path[0].x, p.path[0].y);
                const pathToShow = isMultiRound ? p.path : p.path.filter(pos => pos.t <= currentTime);
                pathToShow.forEach(pos => ctx.lineTo(pos.x, pos.y));
                ctx.strokeStyle = p.team === 'teamA' ? theme.colors.teamA : theme.colors.teamB;
                ctx.lineWidth = 2;
                ctx.globalAlpha = 0.4;
                ctx.stroke();
                ctx.globalAlpha = 1;
            }
            ctx.beginPath();
            ctx.arc(playerPos.x, playerPos.y, 12, 0, 2 * Math.PI);
            ctx.fillStyle = p.team === 'teamA' ? theme.colors.teamA : theme.colors.teamB;
            ctx.globalAlpha = isMultiRound || p.isAlive ? 1.0 : 0.3;
            ctx.fill();
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 1.5;
            ctx.stroke();
            if ((isMultiRound && !p.isAlive) || (!isMultiRound && !p.isAlive)) {
                const skullPos = p.path[p.path.length-1];
                ctx.fillStyle = '#FFF';
                ctx.font = 'bold 18px sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('💀', skullPos.x, skullPos.y);
            }
        });
        
        ctx.restore(); 
    }, [players, geometry, showHeatmap, showPaths, events, currentTime, isMultiRound]);
    
    return <canvas ref={canvasRef} className="w-full h-full" />;
};


// --- HAUPTKOMPONENTE ---
const TacticalReplayViewer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [isHovering, setIsHovering] = useState(true);
    const [isMultiRound, setIsMultiRound] = useState(false);
    const [selectedRounds, setSelectedRounds] = useState([1]);
    const [isScoreboardVisible, setIsScoreboardVisible] = useState(false);
    const [isHeatmapVisible, setIsHeatmapVisible] = useState(false);
    const [arePathsVisible, setArePathsVisible] = useState(false);
    const [isPlayersExpanded, setIsPlayersExpanded] = useState(true);
    const [isUtilityExpanded, setIsUtilityExpanded] = useState(true);

    const containerRef = useRef(null);
    const areControlsVisible = !isPlaying || isHovering || isMultiRound;
    
    const visibleRoundsData = replayData.rounds.filter(r => selectedRounds.includes(r.roundNumber));
    const aggregatedPlayers = visibleRoundsData.flatMap(r => r.players);
    const aggregatedEvents = visibleRoundsData.flatMap(r => r.events);
    const singleRoundData = replayData.rounds.find(r => r.roundNumber === selectedRounds[0]);
    const scoreToCurrentRound = replayData.rounds.slice(0, singleRoundData ? singleRoundData.roundNumber - 1 : 0).reduce((acc, r) => { if(r.winner) acc[r.winner]++; return acc; }, { teamA: 0, teamB: 0 });

    useEffect(() => { setCurrentTime(0); setIsPlaying(false); }, [selectedRounds, isMultiRound]);
    useEffect(() => { let timer; if (isPlaying && currentTime < roundDuration && !isMultiRound) { timer = setInterval(() => setCurrentTime(prev => prev + 0.5), 100); } if (currentTime >= roundDuration) setIsPlaying(false); return () => clearInterval(timer); }, [isPlaying, currentTime, isMultiRound]);

    const handleRoundSelect = (roundNumber) => { if (isMultiRound) { setSelectedRounds(prev => prev.includes(roundNumber) ? (prev.length > 1 ? prev.filter(r => r !== roundNumber) : prev) : [...prev, roundNumber] ); } else { setSelectedRounds([roundNumber]); } };
    
    return (
        <div ref={containerRef} className="w-full min-h-screen font-sans text-gray-200 bg-gray-950" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)} >
            <style>{`
                .accent-color { accent-color: ${theme.colors.accent}; }
                .animate-fade-in-up { animation: fade-in-up 0.3s ease-out forwards; }
                @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fade-in-right { animation: fade-in-right 0.3s ease-out forwards; }
                @keyframes fade-in-right { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
                .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 10px; border: 2px solid transparent; background-clip: content-box; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.4); }
            `}</style>
            
            {isScoreboardVisible && <Scoreboard replayData={replayData} onClose={() => setIsScoreboardVisible(false)} />}
            
            <main className="container mx-auto max-w-7xl px-4 py-24">
                <div className="flex flex-col gap-8">
                    <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center">
                        <MapCanvas players={isMultiRound ? aggregatedPlayers : singleRoundData?.players || []} geometry={mapGeometry} showHeatmap={isHeatmapVisible} showPaths={arePathsVisible} events={aggregatedEvents} currentTime={currentTime} isMultiRound={isMultiRound} />
                        
                        {!isMultiRound && singleRoundData && (
                            <header className={`absolute top-0 left-1/2 -translate-x-1/2 p-4 z-30 transition-all duration-300 ${areControlsVisible ? 'opacity-100' : 'opacity-0 -translate-y-4'}`}>
                                <div className="p-3 px-6 rounded-xl bg-black/40 backdrop-blur-sm border border-white/10 flex items-center gap-4 shadow-lg">
                                    <span className="font-bold text-lg" style={{ color: theme.colors.teamA }}>{replayData.teams.teamA.name}</span>
                                    <span className="text-2xl font-mono bg-black/30 px-3 py-1 rounded-md text-white">{scoreToCurrentRound.teamA} : {scoreToCurrentRound.teamB}</span>
                                    <span className="font-bold text-lg" style={{ color: theme.colors.teamB }}>{replayData.teams.teamB.name}</span>
                                </div>
                                <div className="text-center text-sm text-gray-400 mt-2"> Round <span className="text-white font-bold">{selectedRounds[0]}</span> </div>
                            </header>
                        )}
                        
                        <div className={`absolute top-0 right-0 z-30 transition-opacity duration-300 ${areControlsVisible ? 'opacity-100' : 'opacity-0'}`}>
                            <div className="bg-gray-950/70 backdrop-blur-sm rounded-bl-2xl">
                                <div className="flex items-center justify-end p-2 gap-1">
                                     <IconButton onClick={() => setIsScoreboardVisible(v => !v)} className={`${isScoreboardVisible ? 'bg-yellow-400/20 text-yellow-400' : ''}`} tooltip="Scoreboard"><ListVideo className="h-5 w-5" /></IconButton>
                                     <IconButton onClick={() => setIsHeatmapVisible(v => !v)} className={`${isHeatmapVisible ? 'bg-yellow-400/20 text-yellow-400' : ''}`} tooltip="Heatmap"><Thermometer className="h-5 w-5" /></IconButton>
                                     <IconButton onClick={() => setArePathsVisible(v => !v)} className={`${arePathsVisible ? 'bg-yellow-400/20 text-yellow-400' : ''}`} tooltip="Pfade anzeigen"><Footprints className="h-5 w-5" /></IconButton>
                                     <IconButton onClick={() => setIsUtilityExpanded(v => !v)} className={`${isUtilityExpanded ? 'bg-yellow-400/20 text-yellow-400' : ''}`} tooltip="Utility-Verlauf"><BarChart className="h-5 w-5" /></IconButton>
                                     <IconButton onClick={() => setIsPlayersExpanded(v => !v)} className={`${isPlayersExpanded ? 'bg-yellow-400/20 text-yellow-400' : ''}`} tooltip="Spielerliste"><Users className="h-5 w-5" /></IconButton>
                                </div>
                            </div>
                        </div>

                        {!isMultiRound && singleRoundData && <KillFeed events={singleRoundData.events} currentTime={currentTime} />}
                        
                        <aside className={`absolute top-1/2 -translate-y-1/2 left-4 w-60 z-20 transition-all duration-300 ease-in-out ${isUtilityExpanded && !isMultiRound ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'}`}>
                            {singleRoundData && <UtilityTracker utility={singleRoundData.utility} teams={replayData.teams} />}
                        </aside>
                        
                        <aside className={`absolute top-1/2 -translate-y-1/2 right-4 w-80 z-20 transition-all duration-300 ease-in-out ${isPlayersExpanded && !isMultiRound ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'}`}>
                             {singleRoundData && (
                                <div className="p-2 space-y-1 rounded-xl bg-gray-950/80 backdrop-blur-sm border border-white/10 max-h-[70vh] overflow-y-auto custom-scrollbar">
                                    {['teamA', 'teamB'].map(teamId => (
                                        <div key={teamId} className="mb-2">
                                            <h3 className="font-semibold px-3 py-1" style={{color: replayData.teams[teamId].color}}>{replayData.teams[teamId].name}</h3>
                                            {singleRoundData.players.filter(p => p.team === teamId).map(p => (
                                                <PlayerRow key={p.id} player={p} team={replayData.teams[teamId]} isAlive={p.isAlive} />
                                            ))}
                                        </div>
                                    ))}
                                </div>
                             )}
                        </aside>

                        <footer className={`absolute bottom-0 left-0 right-0 z-30 transition-all duration-300 ${areControlsVisible ? 'opacity-100' : 'opacity-0 translate-y-4'}`}>
                             <div className="bg-gradient-to-t from-black/80 via-black/60 to-transparent">
                                <div className="bg-gray-900/60 backdrop-blur-sm border-t border-gray-700/50 p-3 space-y-3">
                                    <div className="flex items-center justify-center px-4 pt-2">
                                        <label className="flex items-center cursor-pointer">
                                            <span className="mr-3 text-sm font-medium text-gray-300">Einzelrunde</span>
                                            <div className="relative"> <input type="checkbox" checked={isMultiRound} onChange={() => setIsMultiRound(v => !v)} className="sr-only peer" /> <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div> </div>
                                            <span className="ml-3 text-sm font-medium text-gray-300">Multi-Runden-Analyse</span>
                                        </label>
                                    </div>
                                     <div className="relative overflow-x-auto custom-scrollbar">
                                         <div className="flex justify-start min-w-max gap-4 p-2 px-4">
                                            {replayData.rounds.map((r) => ( <button key={r.roundNumber} onClick={() => handleRoundSelect(r.roundNumber)} className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-medium border-2 hover:border-yellow-400 transition-all transform hover:scale-105 ${selectedRounds.includes(r.roundNumber) ? 'bg-yellow-400/20 border-yellow-400 text-yellow-400 scale-110' : 'bg-gray-800 border-gray-700 text-gray-300'}`} > {r.roundNumber} </button> ))}
                                         </div>
                                     </div>
                                    <div className="flex items-center gap-3 text-white pt-2 border-t border-gray-700/50">
                                        {!isMultiRound ? (
                                            <IconButton onClick={() => setIsPlaying(!isPlaying)}>
                                                {isPlaying ? <Pause /> : <Play />}
                                            </IconButton>
                                        ) : (
                                            <div className="w-10 h-10 flex-shrink-0" />
                                        )}
                                        <span className="text-sm font-mono w-14 text-center">
                                            {isMultiRound ? "N/A" : formatTime(currentTime)}
                                        </span>
                                        <div className="w-full h-2 bg-white/10 rounded-lg relative group">
                                             <div 
                                                className="absolute h-full bg-yellow-400 rounded-lg" 
                                                style={{ width: isMultiRound ? '0%' : `${(currentTime / roundDuration) * 100}%`}}
                                            ></div>
                                             <input 
                                                type="range" 
                                                min="0" 
                                                max={roundDuration} 
                                                value={isMultiRound ? 0 : currentTime} 
                                                disabled={isMultiRound}
                                                onChange={(e) => setCurrentTime(parseFloat(e.target.value))} 
                                                className={`w-full h-full bg-transparent appearance-none absolute inset-0 z-10 accent-color ${isMultiRound ? 'cursor-default' : 'cursor-pointer'}`}
                                            />
                                             {(isMultiRound ? aggregatedEvents : singleRoundData?.events || []).map((event, index) => (
                                                 <div
                                                     key={`${event.id}-${index}`}
                                                     className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full pointer-events-none group-hover:scale-150 transition-transform"
                                                     style={{
                                                         left: `${(event.time / roundDuration) * 100}%`,
                                                         backgroundColor: theme.colors.killEvent,
                                                     }}
                                                 />
                                             ))}
                                         </div>
                                        <span className="text-sm font-mono w-14 text-center">{formatTime(roundDuration)}</span>
                                    </div>
                                </div>
                            </div>
                        </footer>
                    </div>
                    
                    <div className="w-full space-y-6">
                        <h1 className="text-3xl lg:text-4xl font-bold text-white">
                            Analyse: {replayData.teams.teamA.name} vs. {replayData.teams.teamB.name} auf <span className="capitalize">{replayData.mapName.replace('de_', '')}</span>
                        </h1>
                    
                        <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                            {staticPlayers.map((player) => (
                                <div key={player.id} className="flex-shrink-0 flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition-all group border border-transparent hover:border-gray-700 cursor-pointer">
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-gray-900 font-bold text-base shadow-lg" style={{backgroundColor: player.team === 'teamA' ? theme.colors.teamA : theme.colors.teamB}}>
                                        {player.name.charAt(0)}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-white font-semibold text-base">{player.name}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
                             <div className="flex items-center justify-between mb-4">
                                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-400 text-sm">
                                    <div>{replayData.totalRounds} Runden</div>
                                    <div>Match-Analyse</div>
                                </div>
                            </div>
                            <p className="text-gray-300 leading-relaxed">
                                Detaillierte Analyse des Matches. Nutzen Sie die Werkzeuge oben und unten, um einzelne oder mehrere Runden zu untersuchen, Spielerpfade zu verfolgen und Kill-Hotspots auf der Karte zu visualisieren.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TacticalReplayViewer;
