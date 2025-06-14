import { supabase } from './client';

export async function getFilterOptions() {
  try {
    const { data: maps, error: mapsError } = await supabase
      .from('maps')
      .select('name');
    if (mapsError) throw mapsError;

    const { data: positionsData, error: positionsError } = await supabase
      .from('map_positions')
      .select('map, positions');
    if (positionsError) throw positionsError;
    const positions = {};
    positionsData.forEach((item) => {
      positions[item.map] = item.positions;
    });

    const { data: demos, error: demosError } = await supabase
      .from('demos')
      .select('players');
    if (demosError) throw demosError;
    const players = new Set();
    demos.forEach((demo) => {
      if (demo.players) demo.players.forEach((p) => players.add(p));
    });

    const { data: teams } = await supabase.from('teams').select('name');
    const { data: years } = await supabase.from('years').select('value');
    const { data: events } = await supabase.from('events').select('name');
    const { data: results } = await supabase.from('results').select('value');

    return {
      maps: maps.map((m) => m.name),
      positions,
      teams: teams?.map((t) => t.name) || [],
      years: years?.map((y) => y.value) || [],
      events: events?.map((e) => e.name) || [],
      results: results?.map((r) => r.value) || [],
      players: Array.from(players),
    };
  } catch (error) {
    console.error('Error fetching filter options:', error);
    throw error;
  }
}

export async function getAllMaps() {
  try {
    const { data, error } = await supabase
      .from('demos')
      .select('map')
      .order('map');
    if (error) throw error;
    return [...new Set(data.map((d) => d.map))];
  } catch (error) {
    console.error('Error fetching maps:', error);
    return [];
  }
}
