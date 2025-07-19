import Link from "next/link";
import { getForests } from "@/lib/config";

export default function Home() {
  const forests = getForests();
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Forests</h1>
      <ul className="space-y-2">
        {forests.map((forest) => (
          <li key={forest}>
            <Link 
              href={`/forests/${forest}`}
              className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              {forest}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
} 