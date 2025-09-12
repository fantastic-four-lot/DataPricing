import Header from "@/components/Header"
import DataSourcesList from "@/components/DataSourcesList"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground text-balance">Data Sources</h1>
          <p className="mt-2 text-muted text-pretty">
            Manage your data sources, view pricing information, and track availability.
          </p>
        </div>
        <DataSourcesList />
      </main>
    </div>
  )
}
