import { supabase } from './client';

export async function seedDatabase() {
  try {
    const proDemos = [
      {
        id: 1,
        title: 'sh1ro AWP Setup on Ancient',
        thumbnail:
          'https://www.rnd.de/resizer/v2/7ZPVUSAZTJCCPNBTCAANTGZZVQ.jpg?auth=872c3046d03f56a91fa0b0a7faedad3feaa83153dc60fdd489e4f43c7903000e&quality=70&width=1441&height=1081&smart=true',
        video_id: 'rye2aZKjo_M',
        map: 'Ancient',
        positions: ['AWPer'],
        tags: ['AWP', 'Setup'],
        players: ['sh1ro'],
        team: 'Spirit',
        year: '2024',
        event: 'BLAST Premier',
        result: 'Win',
        views: 12541,
        likes: 340,
        is_pro: true,
      },
    ];
    const { error: demoErr } = await supabase.from('demos').upsert(proDemos);
    if (demoErr) throw demoErr;

    const maps = [
      'Ancient',
      'Inferno',
      'Mirage',
      'Nuke',
      'Train',
    ];
    const positionsData = [
      {
        map: 'Ancient',
        positions: ['B Main', 'A Site', 'B Site'],
      },
    ];
    const { error: mapsError } = await supabase
      .from('maps')
      .upsert(maps.map((name) => ({ name })));
    if (mapsError) throw mapsError;
    const { error: positionsError } = await supabase
      .from('map_positions')
      .upsert(positionsData);
    if (positionsError) throw positionsError;
    return { success: true, message: 'Database seeded successfully' };
  } catch (error) {
    console.error('Error seeding database:', error);
    return { success: false, message: error.message };
  }
}
