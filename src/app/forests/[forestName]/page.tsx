import Link from "next/link";
import { getTrees } from "@/lib/trees";

type Props = {
  params: Promise<{
    forestName: string;
  }>;
};

export default async function ForestPage({ params }: Props) {
  const { forestName } = await params;
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
              <div className="font-medium">{tree.title}</div>
              <div className="text-sm text-gray-500">{forestName}/trees/{tree.id}.yml</div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
} 