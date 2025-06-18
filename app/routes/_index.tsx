import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import EnergyCard from "../components/EnergyCard";
import EnergyChart from "../components/EnergyChart";
import Filters from "../components/filters";

// Simulated API data
export const loader: LoaderFunction = async () => {
  return json({
    totalConsumption: 12600,
    peakLoad: 3420,
    cost: 5100,
    chartData: [
      { time: "00:00", value: 120 },
      { time: "06:00", value: 300 },
      { time: "12:00", value: 500 },
      { time: "18:00", value: 700 },
    ],
  });
};

export default function Dashboard() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Energy Dashboard</h1>
      <Filters />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <EnergyCard title="Total Consumption" value={`${data.totalConsumption} kWh`} />
        <EnergyCard title="Peak Load" value={`${data.peakLoad} W`} />
        <EnergyCard title="Cost" value={`$${data.cost}`} />
      </div>
      <div className="mt-6">
        <EnergyChart data={data.chartData} />
      </div>
    </div>
  );
}