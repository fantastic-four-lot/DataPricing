import Header from "@/components/Header"
import DataForm from "@/components/DataForm"

export default function CalculatorPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground text-balance">Pricing Calculator</h1>
          <p className="mt-2 text-muted text-pretty">
            Calculate costs, profits, and pricing for your data.
          </p>
        </div>
          <DataForm />
      </main>
    </div>
  )
}
