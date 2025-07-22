import { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { CircleArrowLeft } from "lucide-react"
import Link from "next/link"

type Props = {
  children: ReactNode
  params: Promise<{
    forestName: string;
  }>;
}

export default async function EditLayout({ children, params }: Props) {
  const { forestName } = await params;

  return (
    <>
      <nav className="fixed top-2 left-2 right-2 bg-gray-50/30 backdrop-blur-md border-1 border-black/15 z-20 rounded-md p-2 shadow-lg">
        <Link href={`/forests/${forestName}`}>
          <Button size="sm" variant="outline">
            <CircleArrowLeft />
            Back
          </Button>
        </Link>
      </nav>
      {children}
    </>
  )
} 
