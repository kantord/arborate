import Link from "next/link";
import { getTrees } from "@/lib/config";

type Props = {
  params: {
    forestName: string;
  };
};

export default function ForestPage({ params }: Props) {
  const { forestName } = params;
  const trees = getTrees(forestName);

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
          <li key={tree.id}>
            <Link 
              href={`/forests/${forestName}/trees/${tree.id}`}
              className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              {tree.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
} 