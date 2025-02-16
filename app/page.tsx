import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-purple-500">
      <h1 className="text-4xl font-bold text-white mb-8">Welcome to BMI Motivator</h1>
      <p className="text-xl text-white mb-8">Achieve a healthier BMI with motivation and tracking</p>
      <Button asChild>
        <Link href="/dashboard">Get Started</Link>
      </Button>
    </div>
  )
}

