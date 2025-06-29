/**
 * Get the latest day's NeoWs (Near Earth Object Web Service) data summary.
 * Returns the total asteroid count and date for the most recent entry in the data array.
 *
 * @param {Array} neowsData - Array of NeoWs daily data objects, each with a 'date' and 'total' property.
 * @returns {{ count: number, date: string }}
 *   An object with the latest day's asteroid count and date.
 *   If no data is available, returns { count: 0, date: 'N/A' }.
 */
export function getLatestNeowsData(neowsData) {
  if (!neowsData || neowsData.length === 0) {
    return { count: 0, date: 'N/A' };
  }
  // Sort by date descending and pick the latest entry
  const latestData = [...neowsData].sort((a, b) => b.date.localeCompare(a.date))[0];
  return {
    count: latestData.total,
    date: latestData.date
  };
} 