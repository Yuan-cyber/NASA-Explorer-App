const FilterBar = ({ dateRange, setDateRange, hazardFilter, setHazardFilter, minSize, setMinSize, maxSize, setMaxSize }) => (
  <div className="filter-bar">
    <label>
      Start Date:
      <input type="date" value={dateRange.start} onChange={e => setDateRange(r => ({ ...r, start: e.target.value }))} />
    </label>
    <label>
      End Date:
      <input type="date" value={dateRange.end} onChange={e => setDateRange(r => ({ ...r, end: e.target.value }))} />
    </label>
    <label>
      Hazard:
      <select value={hazardFilter} onChange={e => setHazardFilter(e.target.value)}>
        <option value="all">All</option>
        <option value="hazardous">Hazardous</option>
        <option value="non-hazardous">Non-hazardous</option>
      </select>
    </label>
    <label>
      Min Size (km):
      <input type="number" value={minSize} onChange={e => setMinSize(e.target.value)} />
    </label>
    <label>
      Max Size (km):
      <input type="number" value={maxSize} onChange={e => setMaxSize(e.target.value)} />
    </label>
  </div>
);
export default FilterBar; 