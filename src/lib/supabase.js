import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Holt alle Demos inkl. der zugehörigen Positionen (über demo_positions) und Tags (über demo_tags).
 */
export async function getAllDemos() {
  const { data, error } = await supabase
    .from('demos')
    .select(`
      *,
      demo_positions (
        positions (*)
      ),
      demo_tags (
        tags (*)
      )
    `)
    .order('created_at', { ascending: false });
  if (error) {
    console.error('getAllDemos error:', error);
    throw error;
  }
  return data;
}

/**
 * Holt Demos, die über join-Tabellen (map_positions, demo_positions) zu einer bestimmten Map gehören.
 * 1) Ermittele alle position_ids, die zu der Map gehören.
 * 2) Ermittele dann alle demo_ids, die diese Positionen enthalten.
 * 3) Lade die Demos inkl. der join-Daten.
 */
export async function getDemosByMap(mapId) {
  // 1) Alle Positionen ermitteln, die zu der Map gehören (über map_positions)
  const { data: mapPosData, error: mapPosError } = await supabase
    .from('map_positions')
    .select('position_id')
    .eq('map_id', mapId);
  if (mapPosError) {
    console.error('getDemosByMap map_positions error:', mapPosError);
    throw mapPosError;
  }
  if (!mapPosData || mapPosData.length === 0) return [];
  const positionIds = mapPosData.map(mp => mp.position_id);

  // 2) Demo-IDs ermitteln, die diese Positionen nutzen
  const { data: demoPosData, error: demoPosError } = await supabase
    .from('demo_positions')
    .select('demo_id')
    .in('position_id', positionIds);
  if (demoPosError) {
    console.error('getDemosByMap demo_positions error:', demoPosError);
    throw demoPosError;
  }
  if (!demoPosData || demoPosData.length === 0) return [];
  const demoIds = [...new Set(demoPosData.map(dp => dp.demo_id))];

  // 3) Demos inkl. join-Daten laden
  const { data: demosData, error: demosError } = await supabase
    .from('demos')
    .select(`
      *,
      demo_positions (
        positions (*)
      ),
      demo_tags (
        tags (*)
      )
    `)
    .in('id', demoIds)
    .order('created_at', { ascending: false });
  if (demosError) {
    console.error('getDemosByMap demos error:', demosError);
    throw demosError;
  }
  return demosData;
}

/**
 * Holt Demos, in denen eine bestimmte Position genutzt wird.
 */
export async function getDemosByPosition(positionId) {
  const { data: demoPosData, error: demoPosError } = await supabase
    .from('demo_positions')
    .select('demo_id')
    .eq('position_id', positionId);
  if (demoPosError) {
    console.error('getDemosByPosition demo_positions error:', demoPosError);
    throw demoPosError;
  }
  if (!demoPosData || demoPosData.length === 0) return [];
  const demoIds = [...new Set(demoPosData.map(dp => dp.demo_id))];

  const { data: demosData, error: demosError } = await supabase
    .from('demos')
    .select(`
      *,
      demo_positions (
        positions (*)
      ),
      demo_tags (
        tags (*)
      )
    `)
    .in('id', demoIds)
    .order('created_at', { ascending: false });
  if (demosError) {
    console.error('getDemosByPosition demos error:', demosError);
    throw demosError;
  }
  return demosData;
}

/**
 * Holt die Demos mit den meisten Views.
 */
export async function getTrendingDemos(limit = 5) {
  const { data, error } = await supabase
    .from('demos')
    .select(`
      *,
      demo_positions (
        positions (*)
      ),
      demo_tags (
        tags (*)
      )
    `)
    .order('views', { ascending: false })
    .limit(limit);
  if (error) {
    console.error('getTrendingDemos error:', error);
    throw error;
  }
  return data;
}

/**
 * Holt die neuesten Demos.
 */
export async function getLatestDemos(limit = 5) {
  const { data, error } = await supabase
    .from('demos')
    .select(`
      *,
      demo_positions (
        positions (*)
      ),
      demo_tags (
        tags (*)
      )
    `)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) {
    console.error('getLatestDemos error:', error);
    throw error;
  }
  return data;
}

/**
 * Filtert Demos anhand übergebener Kriterien.
 * Hier als Beispiel: Filter nach position, tag und Demo-Name (Search).
 */
export async function getFilteredDemos({ positionId, tagId, search = '' } = {}) {
  let demoIdsByPosition = null;
  let demoIdsByTag = null;

  if (positionId) {
    const { data, error } = await supabase
      .from('demo_positions')
      .select('demo_id')
      .eq('position_id', positionId);
    if (error) throw error;
    demoIdsByPosition = data?.map(x => x.demo_id) || [];
    if (demoIdsByPosition.length === 0) return [];
  }

  if (tagId) {
    const { data, error } = await supabase
      .from('demo_tags')
      .select('demo_id')
      .eq('tag_id', tagId);
    if (error) throw error;
    demoIdsByTag = data?.map(x => x.demo_id) || [];
    if (demoIdsByTag.length === 0) return [];
  }

  // Schnittmenge bilden, wenn beide Filter aktiv sind
  let finalDemoIds = null;
  if (demoIdsByPosition && demoIdsByTag) {
    finalDemoIds = demoIdsByPosition.filter(id => demoIdsByTag.includes(id));
    if (finalDemoIds.length === 0) return [];
  } else {
    finalDemoIds = demoIdsByPosition || demoIdsByTag;
  }

  // Query auf demos mit optionalem Search (Name)
  let query = supabase
    .from('demos')
    .select(`
      *,
      demo_positions (
        positions (*)
      ),
      demo_tags (
        tags (*)
      )
    `)
    .order('created_at', { ascending: false });

  if (finalDemoIds) {
    query = query.in('id', finalDemoIds);
  }
  if (search) {
    query = query.ilike('name', `%${search}%`);
  }

  const { data, error } = await query;
  if (error) {
    console.error('getFilteredDemos error:', error);
    throw error;
  }
  return data;
}

/**
 * Erhöht einen statistischen Wert (z. B. views oder likes) für eine Demo.
 */
export async function updateDemoStats(demoId, field, increment = 1) {
  const { data: demo, error: fetchError } = await supabase
    .from('demos')
    .select('*')
    .eq('id', demoId)
    .single();
  if (fetchError) {
    console.error('updateDemoStats fetch error:', fetchError);
    throw fetchError;
  }
  const updatedValue = (demo[field] || 0) + increment;
  const { data, error: updateError } = await supabase
    .from('demos')
    .update({ [field]: updatedValue })
    .eq('id', demoId)
    .select('*')
    .single();
  if (updateError) {
    console.error('updateDemoStats update error:', updateError);
    throw updateError;
  }
  return data;
}

/**
 * Aktualisiert die Tags einer Demo: Bestehende Beziehungen in demo_tags löschen,
 * anschließend neue Beziehungen einfügen und die aktualisierte Demo zurückgeben.
 */
export async function updateDemoTags(demoId, tagIds) {
  const { error: delError } = await supabase
    .from('demo_tags')
    .delete()
    .eq('demo_id', demoId);
  if (delError) {
    console.error('updateDemoTags delete error:', delError);
    throw delError;
  }
  const rowsToInsert = tagIds.map(tagId => ({ demo_id: demoId, tag_id: tagId }));
  const { error: insError } = await supabase
    .from('demo_tags')
    .insert(rowsToInsert);
  if (insError) {
    console.error('updateDemoTags insert error:', insError);
    throw insError;
  }
  // Rückladen der Demo mit aktualisierten Tags
  const { data, error: demoError } = await supabase
    .from('demos')
    .select(`
      *,
      demo_tags (
        tags (*)
      )
    `)
    .eq('id', demoId)
    .single();
  if (demoError) {
    console.error('updateDemoTags demo reload error:', demoError);
    throw demoError;
  }
  return { success: true, demo: data };
}

/**
 * Aktualisiert die Positionen einer Demo analog zu updateDemoTags.
 */
export async function updateDemoPositions(demoId, positionIds) {
  const { error: delError } = await supabase
    .from('demo_positions')
    .delete()
    .eq('demo_id', demoId);
  if (delError) {
    console.error('updateDemoPositions delete error:', delError);
    throw delError;
  }
  const rowsToInsert = positionIds.map(pid => ({ demo_id: demoId, position_id: pid }));
  const { error: insError } = await supabase
    .from('demo_positions')
    .insert(rowsToInsert);
  if (insError) {
    console.error('updateDemoPositions insert error:', insError);
    throw insError;
  }
  const { data, error: demoError } = await supabase
    .from('demos')
    .select(`
      *,
      demo_positions (
        positions (*)
      )
    `)
    .eq('id', demoId)
    .single();
  if (demoError) {
    console.error('updateDemoPositions demo reload error:', demoError);
    throw demoError;
  }
  return { success: true, demo: data };
}

/**
 * Holt Filteroptionen aus den Tabellen maps, positions und tags.
 */
export async function getFilterOptions() {
  const [mapsRes, positionsRes, tagsRes] = await Promise.all([
    supabase.from('maps').select('*'),
    supabase.from('positions').select('*'),
    supabase.from('tags').select('*')
  ]);
  if (mapsRes.error) throw mapsRes.error;
  if (positionsRes.error) throw positionsRes.error;
  if (tagsRes.error) throw tagsRes.error;

  return {
    maps: mapsRes.data || [],
    positions: positionsRes.data || [],
    tags: tagsRes.data || []
  };
}
