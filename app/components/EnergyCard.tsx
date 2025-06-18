type Props = {
  title: string;
  value: string;
};

export default function EnergyCard({ title, value }: Props) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow">
      <h2 className="text-lg font-medium">{title}</h2>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}