import { supabase } from './client';

export async function getPlayerInfo(playerName) {
  try {
    let { data: playerData, error: playerError } = await supabase
      .from('players')
      .select('*')
      .eq('name', playerName)
      .single();
    if (playerError) {
      const { data: demos, error: demosError } = await supabase
        .from('demos')
        .select('*')
        .contains('players', [playerName]);
      if (demosError) throw demosError;
      if (demos && demos.length > 0) {
        const teamCounts = {};
        demos.forEach((demo) => {
          if (demo.team) {
            teamCounts[demo.team] = (teamCounts[demo.team] || 0) + 1;
          }
        });
        const team = Object.entries(teamCounts)
          .sort((a, b) => b[1] - a[1])
          .map(([t]) => t)[0];
        const totalViews = demos.reduce((sum, d) => sum + (d.views || 0), 0);
        playerData = {
          name: playerName,
          team,
          avatar: null,
          bio: null,
          stats: {
            totalDemos: demos.length,
            totalViews,
            avgRating: demos.some((d) => d.rating)
              ? (
                  demos.reduce((sum, d) => sum + (d.rating || 0), 0) /
                  demos.filter((d) => d.rating).length
                ).toFixed(2)
              : null,
          },
        };
      } else {
        return null;
      }
    }
    return playerData;
  } catch (error) {
    console.error('Error fetching player info:', error);
    throw error;
  }
}

export async function getDemosByPlayer(
  playerName,
  type = 'all',
  page = 1,
  pageSize = 12,
  filters = {}
) {
  try {
    let query = supabase
      .from('demos')
      .select('*')
      .contains('players', [playerName]);
    if (type === 'pro') {
      query = query.eq('is_pro', true);
    } else if (type === 'community') {
      query = query.eq('is_pro', false);
    }
    if (filters.map) query = query.eq('map', filters.map);
    if (filters.position) query = query.contains('positions', [filters.position]);
    if (filters.team) query = query.eq('team', filters.team);
    if (filters.year) query = query.eq('year', filters.year);
    if (filters.event) query = query.eq('event', filters.event);
    if (filters.result) query = query.eq('result', filters.result);
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.order('views', { ascending: false }).range(from, to);
    const { data, error } = await query;
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    console.error(`Error fetching demos for player ${playerName}:`, error);
    throw error;
  }
}

export async function getRelatedPlayers(playerName, limit = 5) {
  try {
    const { data: player } = await getPlayerInfo(playerName);
    if (!player || !player.team) {
      const { data: demos } = await supabase
        .from('demos')
        .select('players')
        .contains('players', [playerName])
        .limit(10);
      const relatedPlayers = new Set();
      demos.forEach((demo) => {
        demo.players.forEach((p) => {
          if (p !== playerName) relatedPlayers.add(p);
        });
      });
      return Array.from(relatedPlayers).slice(0, limit);
    }
    const { data: teamPlayers, error } = await supabase
      .from('demos')
      .select('players')
      .eq('team', player.team)
      .limit(20);
    if (error) throw error;
    const relatedPlayers = new Set();
    teamPlayers.forEach((demo) => {
      demo.players.forEach((p) => {
        if (p !== playerName) relatedPlayers.add(p);
      });
    });
    return Array.from(relatedPlayers).slice(0, limit);
  } catch (error) {
    console.error(`Error fetching related players for ${playerName}:`, error);
    throw error;
  }
}

export async function getAllPlayers(
  type = 'pro',
  page = 1,
  pageSize = 20,
  filters = {}
) {
  try {
    let { data: playersData, error: playersError } = await supabase
      .from('players')
      .select('*');
    if (playersError || !playersData || playersData.length === 0) {
      let query = supabase.from('demos').select('*');
      if (type === 'pro') {
        query = query.eq('is_pro', true);
      } else if (type === 'community') {
        query = query.eq('is_pro', false);
      }
      if (filters.team) query = query.eq('team', filters.team);
      const { data: demos, error: demosError } = await query;
      if (demosError) throw demosError;
      const playerMap = {};
      demos.forEach((demo) => {
        if (!demo.players) return;
        demo.players.forEach((playerName) => {
          if (!playerMap[playerName]) {
            const playerDemos = demos.filter(
              (d) => d.players && d.players.includes(playerName)
            );
            const teamCounts = {};
            playerDemos.forEach((d) => {
              if (d.team) teamCounts[d.team] = (teamCounts[d.team] || 0) + 1;
            });
            const team = Object.entries(teamCounts)
              .sort((a, b) => b[1] - a[1])
              .map(([t]) => t)[0];
            const totalViews = playerDemos.reduce(
              (sum, d) => sum + (d.views || 0),
              0
            );
            playerMap[playerName] = {
              name: playerName,
              team,
              avatar: null,
              bio: null,
              stats: { totalDemos: playerDemos.length, totalViews },
            };
          }
        });
      });
      playersData = Object.values(playerMap);
    }
    playersData.sort(
      (a, b) => (b.stats?.totalViews || 0) - (a.stats?.totalViews || 0)
    );
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    const paginatedData = playersData.slice(from, to);
    return paginatedData;
  } catch (error) {
    console.error('Error fetching players:', error);
    throw error;
  }
}
