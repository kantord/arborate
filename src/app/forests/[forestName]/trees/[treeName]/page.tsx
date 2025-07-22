import { getTree } from "@/lib/trees";
import { notFound } from "next/navigation";
import Graph from "@/components/graph";

interface TreePageProps {
  params: Promise<{
    forestName: string;
    treeName: string;
  }>;
}

export default async function TreePage({ params }: TreePageProps) {
  const { forestName, treeName } = await params;
  const tree = getTree(forestName, treeName);
  
  if (!tree) {
    notFound();
  }

  return (
    <main className="bg-dotted w-screen h-screen">
      <Graph tree={tree} />
    </main>
  );
}
