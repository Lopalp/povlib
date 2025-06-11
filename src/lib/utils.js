/**
 * Maps raw demo data from the database to the expected frontend format
 * @param {Object} demo - Raw demo data from database
 * @returns {Object} - Formatted demo object
 */
export const mapDemoData = (demo) => ({
  id: demo.id,
  title: demo.title,
  thumbnail: demo.thumbnail,
  videoId: demo.video_id,
  map: demo.map,
  positions: demo.positions || [],
  tags: demo.tags || [],
  players: demo.players || [],
  team: demo.team,
  year: demo.year,
  event: demo.event,
  result: demo.result,
  views: demo.views || 0,
  likes: demo.likes || 0,
  isPro: demo.is_pro,
});

/**
 * Finds related demos based on map, players, or positions
 * @param {Object} targetDemo - The demo to find related demos for
 * @param {Array} allDemos - Array of all available demos
 * @param {number} limit - Maximum number of related demos to return
 * @returns {Array} - Array of related demos
 */
export const findRelatedDemos = (targetDemo, allDemos, limit = 10) => {
  const related = allDemos.filter(
    (demo) =>
      demo.id !== targetDemo.id &&
      (demo.map === targetDemo.map ||
        demo.players.some((player) => targetDemo.players.includes(player)) ||
        demo.positions.some((position) =>
          targetDemo.positions.includes(position)
        ))
  );
  return related.slice(0, limit);
};

/**
 * Filters demos based on search query
 * @param {Array} demos - Array of demos to filter
 * @param {string} searchQuery - Search query string
 * @returns {Array} - Filtered demos array
 */
export const filterDemosBySearchQuery = (demos, searchQuery) => {
  if (!searchQuery.trim()) {
    return demos;
  }

  const query = searchQuery.toLowerCase();
  return demos.filter(
    (demo) =>
      demo.title.toLowerCase().includes(query) ||
      demo.map.toLowerCase().includes(query) ||
      demo.players.some((player) => player.toLowerCase().includes(query)) ||
      (demo.team && demo.team.toLowerCase().includes(query)) ||
      demo.positions.some((position) =>
        position.toLowerCase().includes(query)
      ) ||
      demo.tags.some((tag) => tag.toLowerCase().includes(query))
  );
};

/**
 * Updates a specific demo in an array of demos
 * @param {Array} demos - Array of demos
 * @param {string} demoId - ID of the demo to update
 * @param {Object} updatedFields - Fields to update
 * @returns {Array} - Updated demos array
 */
export const updateDemoInArray = (demos, demoId, updatedFields) => {
  return demos.map((demo) =>
    demo.id === demoId ? { ...demo, ...updatedFields } : demo
  );
};

/**
 * Creates initial filter state
 * @param {string} searchQuery - Current search query
 * @returns {Object} - Initial filter state object
 */
export const createInitialFilterState = (searchQuery = "") => ({
  map: "",
  position: "",
  player: "",
  team: "",
  year: "",
  event: "",
  result: "",
  search: searchQuery,
});

/**
 * Checks if any filters are applied (excluding search)
 * @param {Object} filtersApplied - Current filter state
 * @returns {boolean} - True if any filters are applied
 */
export const hasActiveFilters = (filtersApplied) => {
  return Object.entries(filtersApplied).some(
    ([key, value]) => key !== "search" && value !== ""
  );
};
