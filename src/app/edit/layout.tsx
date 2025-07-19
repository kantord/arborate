import { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { CircleArrowLeft } from "lucide-react"

type Props = {
  children: ReactNode
}

export default function EditLayout({ children }: Props) {
  return (
    <>
      <nav className="fixed top-2 left-2 right-2 bg-gray-50/30 backdrop-blur-md border-1 border-black/15 z-20 rounded-md p-2 shadow-lg">
        <Button size="sm" variant="outline">
          <CircleArrowLeft />
          Back</Button>
      </nav>
      {children}
    </>
  )
} 
