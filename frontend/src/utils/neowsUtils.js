
export function getLatestNeowsData(neowsData) {
  if (!neowsData || neowsData.length === 0) {
    return { count: 0, date: 'N/A' };
  }
  const latestData = [...neowsData].sort((a, b) => b.date.localeCompare(a.date))[0];
  return {
    count: latestData.total,
    date: latestData.date
  };
} 