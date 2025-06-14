import { supabase } from './client';

export async function getAllDemos(type = 'all') {
  let query = supabase.from('demos').select('*');
  if (type === 'pro') {
    query = query.eq('is_pro', true);
  } else if (type === 'community') {
    query = query.eq('is_pro', false);
  }
  const { data, error } = await query;
  if (error) {
    console.error('Error fetching demos:', error);
    throw error;
  }
  return data;
}

export async function getFilteredDemos(filters = {}, type = 'all') {
  let query = supabase.from('demos').select('*');
  if (type === 'pro') {
    query = query.eq('is_pro', true);
  } else if (type === 'community') {
    query = query.eq('is_pro', false);
  }
  if (filters.map) query = query.eq('map', filters.map);
  if (filters.position) query = query.contains('positions', [filters.position]);
  if (filters.player) query = query.contains('players', [filters.player]);
  if (filters.team) query = query.eq('team', filters.team);
  if (filters.year) query = query.eq('year', filters.year);
  if (filters.event) query = query.eq('event', filters.event);
  if (filters.result) query = query.eq('result', filters.result);
  if (filters.search) {
    const searchTerm = `%${filters.search}%`;
    query = query.or(
      `title.ilike.${searchTerm},tags.cs.{${searchTerm}},players.cs.{${searchTerm}},map.ilike.${searchTerm}`
    );
  }
  const { data, error } = await query;
  if (error) {
    console.error('Error fetching filtered demos:', error);
    throw error;
  }
  return data;
}

export async function getDemoById(id) {
  try {
    const { data, error } = await supabase
      .from('demos')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching demo:', error);
    return null;
  }
}

export async function getDemosByMap(mapName) {
  try {
    const { data, error } = await supabase
      .from('demos')
      .select('*')
      .eq('map', mapName)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching demos:', error);
    return [];
  }
}

export async function getDemosByPosition(position) {
  const { data, error } = await supabase
    .from('demos')
    .select('*')
    .contains('positions', [position]);
  if (error) {
    console.error(`Error fetching demos for position ${position}:`, error);
    throw error;
  }
  return data;
}

export async function getTrendingDemos(limit = 5, type = 'all') {
  let query = supabase.from('demos').select('*');
  if (type === 'pro') {
    query = query.eq('is_pro', true);
  } else if (type === 'community') {
    query = query.eq('is_pro', false);
  }
  const { data, error } = await query
    .order('views', { ascending: false })
    .limit(limit);
  if (error) {
    console.error('Error fetching trending demos:', error);
    throw error;
  }
  return data;
}

export async function getLatestDemos(limit = 5, type = 'all') {
  let query = supabase.from('demos').select('*');
  if (type === 'pro') {
    query = query.eq('is_pro', true);
  } else if (type === 'community') {
    query = query.eq('is_pro', false);
  }
  const { data, error } = await query
    .order('year', { ascending: false })
    .order('id', { ascending: false })
    .limit(limit);
  if (error) {
    console.error('Error fetching latest demos:', error);
    throw error;
  }
  return data;
}

export async function updateDemoStats(demoId, field, increment = 1) {
  const { data: demo, error: fetchError } = await supabase
    .from('demos')
    .select('*')
    .eq('id', demoId)
    .single();
  if (fetchError) {
    console.error('Error fetching demo:', fetchError);
    return { success: false, message: 'Demo not found' };
  }
  let updatedValue;
  if (field === 'views') {
    updatedValue = demo.views + increment;
  } else if (field === 'likes') {
    updatedValue = demo.likes + increment;
  } else {
    return { success: false, message: 'Invalid field' };
  }
  const { data, error: updateError } = await supabase
    .from('demos')
    .update({ [field]: updatedValue })
    .eq('id', demoId)
    .select()
    .single();
  if (updateError) {
    console.error('Error updating demo stats:', updateError);
    return { success: false, message: updateError.message };
  }
  return { success: true, demo: data };
}

export async function updateDemoTags(demoId, tags) {
  const { data, error } = await supabase
    .from('demos')
    .update({ tags })
    .eq('id', demoId)
    .select()
    .single();
  if (error) {
    console.error('Error updating demo tags:', error);
    return { success: false, message: error.message };
  }
  return { success: true, demo: data };
}

export async function updateDemoPositions(demoId, positions) {
  const { data, error } = await supabase
    .from('demos')
    .update({ positions })
    .eq('id', demoId)
    .select()
    .single();
  if (error) {
    console.error('Error updating demo positions:', error);
    return { success: false, message: error.message };
  }
  return { success: true, demo: data };
}

export async function getRecentDemos(limit = 10) {
  try {
    const { data, error } = await supabase
      .from('demos')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching recent demos:', error);
    return [];
  }
}

export async function getBestDemos(limit = 10) {
  try {
    const { data, error } = await supabase
      .from('demos')
      .select('*')
      .order('rating', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching best demos:', error);
    return [];
  }
}

export async function getRelatedDemos(demo, limit = 5) {
  try {
    const { data, error } = await supabase
      .from('demos')
      .select('*')
      .or(`map.eq.${demo.map},player.eq.${demo.player}`)
      .neq('id', demo.id)
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching related demos:', error);
    return [];
  }
}
