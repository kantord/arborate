import { ReactNode } from "react"

type Props = {
  children: ReactNode
}

export default function EditLayout({ children }: Props) {
  return (
    <>
      <nav className="fixed top-2 left-2 right-2 h-10 bg-gray-50/30 backdrop-blur-md border-1 border-black/15 z-20 rounded-md p-1 shadow-lg">
        hello
      </nav>
      {children}
    </>
  )
} 
