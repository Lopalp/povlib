// lib/supabase.js - Supabase Client und Datenbank-Hilfsfunktionen
import { createClient } from '@supabase/supabase-js';

// Supabase-Client initialisieren
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Hilfsfunktionen für Demo-Daten

// Demo-Daten in die Supabase-Datenbank initialisieren
// Diese Funktion würdest du nur einmal ausführen, um die Datenbank zu füllen
export async function seedDatabase() {
  try {
    // Pro-Demos
    const proDemos = [
      {
        id: 1,
        title: "sh1ro AWP Setup on Ancient",
        thumbnail: "https://www.rnd.de/resizer/v2/7ZPVUSAZTJCCPNBTCAANTGZZVQ.jpg?auth=872c3046d03f56a91fa0b0a7faedad3feaa83153dc60fdd489e4f43c7903000e&quality=70&width=1441&height=1081&smart=true",
        video_id: "rye2aZKjo_M",
        map: "Ancient",
        positions: ["AWPer"],
        tags: ["AWP", "Setup"],
        players: ["sh1ro"],
        team: "Spirit",
        year: "2024",
        event: "BLAST Premier",
        result: "Win",
        views: 12541,
        likes: 340,
        is_pro: true
      },
      {
        id: 2,
        title: "ZywOo's Perfect AWP Rotation on Inferno",
        thumbnail: "https://www.rnd.de/resizer/v2/7ZPVUSAZTJCCPNBTCAANTGZZVQ.jpg?auth=872c3046d03f56a91fa0b0a7faedad3feaa83153dc60fdd489e4f43c7903000e&quality=70&width=1441&height=1081&smart=true",
        video_id: "rye2aZKjo_M",
        map: "Inferno",
        positions: ["AWPer", "A-Site"],
        tags: ["AWP", "Rotation"],
        players: ["ZywOo"],
        team: "Vitality",
        year: "2024",
        event: "ESL Pro League",
        result: "Win",
        views: 23156,
        likes: 567,
        is_pro: true
      },
      {
        id: 3,
        title: "b1t A Anchor Defense on Mirage",
        thumbnail: "https://www.rnd.de/resizer/v2/7ZPVUSAZTJCCPNBTCAANTGZZVQ.jpg?auth=872c3046d03f56a91fa0b0a7faedad3feaa83153dc60fdd489e4f43c7903000e&quality=70&width=1441&height=1081&smart=true",
        video_id: "rye2aZKjo_M",
        map: "Mirage",
        positions: ["A Anchor"],
        tags: ["Rifle", "Defense"],
        players: ["b1t"],
        team: "Natus Vincere",
        year: "2024",
        event: "Major",
        result: "Win",
        views: 9823,
        likes: 287,
        is_pro: true
      },
      // Weitere Pro-Demos hier hinzufügen...
    ];

    // Community-Demos
    const communityDemos = [
      {
        id: 101,
        title: "Supreme Matchmaking - 30 Bomb on Mirage",
        thumbnail: "https://www.rnd.de/resizer/v2/7ZPVUSAZTJCCPNBTCAANTGZZVQ.jpg?auth=872c3046d03f56a91fa0b0a7faedad3feaa83153dc60fdd489e4f43c7903000e&quality=70&width=1441&height=1081&smart=true",
        video_id: "rye2aZKjo_M",
        map: "Mirage",
        positions: ["A Anchor", "AWPer"],
        tags: ["Matchmaking", "30 Bomb", "AWP"],
        players: ["User123"],
        year: "2025",
        views: 532,
        likes: 48,
        is_pro: false
      },
      // Weitere Community-Demos hier hinzufügen...
    ];

    // Demos in Supabase einfügen
    const { error: demosError } = await supabase
      .from('demos')
      .upsert([...proDemos, ...communityDemos]);

    if (demosError) throw demosError;

    // Filter-Optionen in Supabase speichern
    const maps = ["Mirage", "Inferno", "Dust2", "Nuke", "Overpass", "Vertigo", "Ancient", "Anubis"];
    const teams = ["NAVI", "FaZe", "Vitality", "G2", "Liquid", "MOUZ", "Astralis", "Complexity", "Spirit", "Eternal Fire", "TheMongolz"];
    const years = ["2025", "2024", "2023", "2022", "2021"];
    const events = ["Major", "BLAST Premier", "ESL Pro League", "IEM", "ESL One"];
    const results = ["Win", "Loss"];

    // Positionen nach Map
    const positionsData = [
      { map: "Mirage", positions: ["A-Site", "B-Site", "Mid", "Connector", "Palace", "Apartments", "Window", "Underpass", "Ramp", "B Short", "B Anchor", "A Connect", "A Anchor", "Door", "AWPer"] },
      { map: "Inferno", positions: ["A-Site", "B-Site", "Banana", "Mid", "Apartments", "Pit", "Library", "A Rifle", "B Short", "B Support", "B Aggress", "B Anchor", "Door", "AWPer"] },
      { map: "Dust2", positions: ["A-Site", "B-Site", "Mid", "Long", "Catwalk", "Tunnels", "Middle", "CT", "B Aggress", "A Rifle", "B Support", "B Anchor", "Pit", "AWPer"] },
      { map: "Nuke", positions: ["A-Site", "B-Site", "Outside", "Ramp", "Heaven", "Secret", "Door", "Floor", "A Main", "AWPer"] },
      { map: "Overpass", positions: ["A-Site", "B-Site", "Connector", "Long", "Bank", "Monster", "AWPer"] },
      { map: "Ancient", positions: ["A Anchor", "Middle", "B Cave", "B Anchor", "AWPer"] },
      { map: "Anubis", positions: ["A Anchor", "B Connect", "Long", "Middle", "B Anchor", "AWPer", "CT"] },
      { map: "Train", positions: ["A Popdog", "Door", "Ivy", "A Main", "AWPer"] }
    ];

    // Maps speichern
    const { error: mapsError } = await supabase
      .from('maps')
      .upsert(maps.map(map => ({ name: map })));

    if (mapsError) throw mapsError;

    // Positionen speichern
    const { error: positionsError } = await supabase
      .from('map_positions')
      .upsert(positionsData);

    if (positionsError) throw positionsError;

    // Teams, Years, Events, Results speichern
    // Implementiere ähnliche Funktionen für diese Daten, falls benötigt

    return { success: true, message: 'Database seeded successfully' };
  } catch (error) {
    console.error('Error seeding database:', error);
    return { success: false, message: error.message };
  }
}

// Alle Demos abrufen
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

// Gefilterte Demos abrufen
export async function getFilteredDemos(filters = {}, type = 'all') {
  let query = supabase.from('demos').select('*');

  // Pro vs Community Filter
  if (type === 'pro') {
    query = query.eq('is_pro', true);
  } else if (type === 'community') {
    query = query.eq('is_pro', false);
  }

  // Filter anwenden
  if (filters.map) {
    query = query.eq('map', filters.map);
  }

  if (filters.position) {
    query = query.contains('positions', [filters.position]);
  }

  if (filters.player) {
    query = query.contains('players', [filters.player]);
  }

  if (filters.team) {
    query = query.eq('team', filters.team);
  }

  if (filters.year) {
    query = query.eq('year', filters.year);
  }

  if (filters.event) {
    query = query.eq('event', filters.event);
  }

  if (filters.result) {
    query = query.eq('result', filters.result);
  }

  // Suche implementieren
  if (filters.search) {
    const searchTerm = `%${filters.search}%`;
    query = query.or(`title.ilike.${searchTerm},tags.cs.{${searchTerm}},players.cs.{${searchTerm}},map.ilike.${searchTerm}`);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching filtered demos:', error);
    throw error;
  }

  return data;
}

// Demos nach Map abrufen
export async function getDemosByMap(map) {
  const { data, error } = await supabase
    .from('demos')
    .select('*')
    .eq('map', map);

  if (error) {
    console.error(`Error fetching demos for map ${map}:`, error);
    throw error;
  }

  return data;
}

// Demos nach Position abrufen
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

// Trending Demos abrufen (nach Views sortiert)
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

// Neueste Demos abrufen
export async function getLatestDemos(limit = 5, type = 'all') {
  let query = supabase.from('demos').select('*');

  if (type === 'pro') {
    query = query.eq('is_pro', true);
  } else if (type === 'community') {
    query = query.eq('is_pro', false);
  }

  // Hier können wir nach Jahr oder nach created_at sortieren
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

// Demo Views/Likes aktualisieren
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

// Tags aktualisieren
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

// Positionen aktualisieren
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

// Filter-Optionen abrufen
export async function getFilterOptions() {
  try {
    // Maps abrufen
    const { data: maps, error: mapsError } = await supabase
      .from('maps')
      .select('name');

    if (mapsError) throw mapsError;

    // Positionen abrufen
    const { data: positionsData, error: positionsError } = await supabase
      .from('map_positions')
      .select('map, positions');

    if (positionsError) throw positionsError;

    // Positionen nach Map strukturieren
    const positions = {};
    positionsData.forEach(item => {
      positions[item.map] = item.positions;
    });

    // Weitere Filter-Optionen abrufen (Teams, Jahre, Events, etc.)
    // Hier könntest du weitere Abfragen für diese Daten implementieren

    // Alle vorhandenen Player aus den Demos extrahieren
    const { data: demos, error: demosError } = await supabase
      .from('demos')
      .select('players');

    if (demosError) throw demosError;

    const players = new Set();
    demos.forEach(demo => {
      if (demo.players) {
        demo.players.forEach(player => players.add(player));
      }
    });

    // Weitere Filter-Optionen aus der Datenbank abrufen
    const { data: teams, error: teamsError } = await supabase
      .from('teams')
      .select('name');

    const { data: years, error: yearsError } = await supabase
      .from('years')
      .select('value');

    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('name');

    const { data: results, error: resultsError } = await supabase
      .from('results')
      .select('value');

    return {
      maps: maps.map(item => item.name),
      positions,
      teams: teams?.map(item => item.name) || [],
      years: years?.map(item => item.value) || [],
      events: events?.map(item => item.name) || [],
      results: results?.map(item => item.value) || [],
      players: Array.from(players)
    };
  } catch (error) {
    console.error('Error fetching filter options:', error);
    throw error;
  }
}