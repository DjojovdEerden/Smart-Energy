import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

type Props = {
  data: { time: string; value: number }[];
};

export default function EnergyChart({ data }: Props) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow">
      <h2 className="text-lg font-medium mb-4">Energy Usage Over Time</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#0ea5e9" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}