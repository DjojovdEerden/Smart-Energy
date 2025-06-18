export default function Filters() {
  return (
    <div className="flex items-center space-x-4">
      <select className="border p-2 rounded">
        <option>Today</option>
        <option>This Week</option>
        <option>This Month</option>
      </select>
    </div>
  );
}