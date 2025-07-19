import Link from "next/link";

// Fake data for trees
const trees = [
  "oak",
  "maple",
  "pine",
  "birch",
  "willow",
  "cherry"
];

type Props = {
  params: {
    forestName: string;
  };
};

export default function ForestPage({ params }: Props) {
  const { forestName } = params;

  return (
    <main className="min-h-screen p-8">
      <div className="mb-8">
        <Link 
          href="/"
          className="text-blue-600 hover:underline mb-4 inline-block"
        >
          ← Back to Forests
        </Link>
        <h1 className="text-3xl font-bold">Forest: {forestName}</h1>
      </div>
      
      <ul className="space-y-2">
        {trees.map((tree) => (
          <li key={tree}>
            <Link 
              href={`/forests/${forestName}/trees/${tree}`}
              className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              {tree}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
} 