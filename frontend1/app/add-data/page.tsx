"use client"

import Header from "@/components/Header"
import AddDataForm from "@/components/AddDataForm"
import { useSearchParams } from "next/navigation"
import { use } from "react"

export default function AddDataPage() {

      const searchParams = useSearchParams()
  const id = searchParams.get("id") ?? ""

  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground text-balance">{id?"Update Data Source":"Add New Data Source"}</h1>
            <p className="mt-2 text-muted text-pretty">
              {id?"Update data source with pricing information and availability details":" Create a new data source with pricing information and availability details."}
            </p>
          </div>
            <AddDataForm id={id as string} />
        </main>
    </div>
  )
}
