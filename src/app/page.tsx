import Link from "next/link";
import { getForests } from "@/lib/forests";
import { initializeCompilation } from "@/lib/startup";

// Initialize compilation on server side
if (typeof window === 'undefined') {
  initializeCompilation();
}

export default function Home() {
  const forests = getForests();

  return (
    <main className="min-h-screen p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Arborate</h1>
        <p className="text-lg text-gray-600">Test Forest Management</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {forests.map((forest) => (
          <Link 
            key={forest.name}
            href={`/forests/${forest.name}`}
            className="block bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-200 border border-gray-100"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-xl font-bold text-gray-900">{forest.name}</h3>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                {forest.treeCount} trees
              </span>
            </div>
            
            <div className="text-sm text-gray-500 font-mono">
              {forest.path}
            </div>
            
            <div className="mt-4 text-sm text-gray-600">
              Target: {forest.target}
            </div>
          </Link>
        ))}
      </div>
      
      {forests.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🌳</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No forests found</h3>
          <p className="text-gray-600">
            Configure forests in arborate.yml to get started.
          </p>
        </div>
      )}
    </main>
  );
} 