// Angepasste Version basierend auf neuer relationaler Datenbankstruktur
// Supabase verwendet jetzt echte Relationen für maps, players, teams, events usw.

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// --------------------------
// DEMO-FUNKTIONEN
// --------------------------

export async function getAllDemos(type = 'all') {
  let query = supabase.from('demos').select(
    *,
    players:nickname,
    teams(name),
    maps(name),
    events(name)
  );

  if (type === 'pro') {
    query = query.eq('is_pro', true);
  } else if (type === 'community') {
    query = query.eq('is_pro', false);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getFilteredDemos(filters = {}, type = 'all') {
  let query = supabase.from('demos').select('*');

  if (type === 'pro') query = query.eq('is_pro', true);
  if (type === 'community') query = query.eq('is_pro', false);

  if (filters.map) query = query.eq('map_id', filters.map);
  if (filters.player) query = query.eq('player_id', filters.player);
  if (filters.team) query = query.eq('team_id', filters.team);
  if (filters.event) query = query.eq('event_id', filters.event);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getTrendingDemos(limit = 5, type = 'all') {
  let query = supabase.from('demos').select('*');
  if (type === 'pro') query = query.eq('is_pro', true);
  if (type === 'community') query = query.eq('is_pro', false);

  const { data, error } = await query.order('views', { ascending: false }).limit(limit);
  if (error) throw error;
  return data;
}

export async function getLatestDemos(limit = 5, type = 'all') {
  let query = supabase.from('demos').select('*');
  if (type === 'pro') query = query.eq('is_pro', true);
  if (type === 'community') query = query.eq('is_pro', false);

  const { data, error } = await query.order('created_at', { ascending: false }).limit(limit);
  if (error) throw error;
  return data;
}

export async function updateDemoStats(demoId, field, increment = 1) {
  const { data: demo, error: fetchError } = await supabase
    .from('demos')
    .select('*')
    .eq('id', demoId)
    .single();

  if (fetchError) throw fetchError;

  const updatedValue = (demo[field] || 0) + increment;

  const { data, error: updateError } = await supabase
    .from('demos')
    .update({ [field]: updatedValue })
    .eq('id', demoId)
    .select()
    .single();

  if (updateError) throw updateError;
  return data;
}

export async function getDemoRounds(demoId) {
  const { data, error } = await supabase
    .from('demo_rounds')
    .select('*')
    .eq('demo_id', demoId)
    .order('round_number');

  if (error) throw error;
  return data;
}

export async function getDemosByMap(mapId) {
  const { data, error } = await supabase
    .from('demos')
    .select('*')
    .eq('map_id', mapId);

  if (error) throw error;
  return data;
}

export async function getDemosByPosition(positionId) {
  const { data, error } = await supabase
    .from('demo_positions')
    .select('demo_id')
    .eq('position_id', positionId);

  if (error) throw error;
  return data;
}

export async function updateDemoTags(demoId, tagIds) {
  await supabase.from('demo_tags').delete().eq('demo_id', demoId);
  const insertData = tagIds.map(tagId => ({ demo_id: demoId, tag_id: tagId }));
  const { error } = await supabase.from('demo_tags').insert(insertData);
  if (error) throw error;
  return true;
}

export async function updateDemoPositions(demoId, positionIds) {
  await supabase.from('demo_positions').delete().eq('demo_id', demoId);
  const insertData = positionIds.map(pid => ({ demo_id: demoId, position_id: pid }));
  const { error } = await supabase.from('demo_positions').insert(insertData);
  if (error) throw error;
  return true;
}

export async function getFilterOptions() {
  const [mapsRes, positionsRes, teamsRes, eventsRes, tagsRes] = await Promise.all([
    supabase.from('maps').select('id, name'),
    supabase.from('positions').select('id, name, map_id'),
    supabase.from('teams').select('id, name'),
    supabase.from('events').select('id, name'),
    supabase.from('tags').select('id, name')
  ]);

  const positionsByMap = {};
  (positionsRes.data || []).forEach(pos => {
    if (!positionsByMap[pos.map_id]) {
      positionsByMap[pos.map_id] = [];
    }
    positionsByMap[pos.map_id].push({ id: pos.id, name: pos.name });
  });

  return {
    maps: mapsRes.data || [],
    positions: positionsByMap,
    teams: teamsRes.data || [],
    events: eventsRes.data || [],
    tags: tagsRes.data || []
  };
}

export async function getAllPlayers(limit = 100) {
  const { data, error } = await supabase
    .from('players')
    .select('*, teams(name, logo_url)')
    .limit(limit);

  if (error) throw error;
  return data;
}

export async function getPlayerInfo(playerId) {
  const { data, error } = await supabase
    .from('players')
    .select('*, team:teams(name, logo_url), demos:demos(id, title, map_id, rating, views)')
    .eq('id', playerId)
    .single();

  if (error) throw error;
  return data;
}

export async function getRelatedPlayers(playerId, limit = 5) {
  const { data: player, error: playerError } = await supabase
    .from('players')
    .select('team_id')
    .eq('id', playerId)
    .single();

  if (playerError || !player?.team_id) return [];

  const { data, error } = await supabase
    .from('players')
    .select('*')
    .eq('team_id', player.team_id)
    .neq('id', playerId)
    .limit(limit);

  if (error) throw error;
  return data;
}

export async function getDemosByPlayer(playerId) {
  const { data, error } = await supabase
    .from('demos')
    .select('*')
    .eq('player_id', playerId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}
