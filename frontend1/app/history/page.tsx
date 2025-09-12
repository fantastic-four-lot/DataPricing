import Header from "@/components/Header"
import TransactionHistory from "@/components/TransactionHistory"

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground text-balance">Transaction History</h1>
          <p className="mt-2 text-muted text-pretty">
            View all your data transactions, pricing calculations, and purchase history.
          </p>
        </div>
        <TransactionHistory />
      </main>
    </div>
  )
}
