"use client"

import { Key, useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { History, Search, Download, TrendingUp, TrendingDown } from "lucide-react"
import  api from "@/lib/api"

const fmt = (n: number) => (Number.isFinite(n) ? n.toFixed(2) : "0.00")

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-chart-5 text-white"
    case "pending":
      return "bg-chart-4 text-white"
    case "failed":
      return "bg-destructive text-destructive-foreground"
    default:
      return "bg-muted text-muted-foreground"
  }
}
type Transaction = {
  timestamp: string | number | Date
  _id: Key | null | undefined
  sourceId: string
  sourceName: string
  volume: number
  buyingPrice: number
  sellingPrice: number
  enrichmentCost: number
  duplicancyDiscount: number
  totalCost: number
  profit: number
  status: string
}


export default function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("timestamp")

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        // const data = await api.transactions.getAll()

        setTransactions(data)
        setFilteredTransactions(data)
      } catch (err) {
        console.error("Failed to load transactions:", err)
      } finally {
        setLoading(false)
      }
    }

    loadTransactions()
  }, [])

  useEffect(() => {
    let filtered = transactions

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((transaction) =>
        transaction.sourceName.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((transaction) => transaction.status === statusFilter)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "timestamp":
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        case "volume":
          return b.volume - a.volume
        case "profit":
          return b.profit - a.profit
        case "cost":
          return b.totalCost - a.totalCost
        default:
          return 0
      }
    })

    setFilteredTransactions(filtered)
  }, [transactions, searchTerm, statusFilter, sortBy])

  const totalTransactions = transactions.length
  const completedTransactions = transactions.filter((t) => t.status === "completed").length
  const totalProfit = transactions.filter((t) => t.status === "completed").reduce((sum, t) => sum + t.profit, 0)
  const totalVolume = transactions.filter((t) => t.status === "completed").reduce((sum, t) => sum + t.volume, 0)

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="pt-6">
                <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-6 bg-muted rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="animate-pulse">
          <CardContent className="pt-6">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-muted rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted">Total Transactions</p>
                <p className="text-2xl font-bold">{totalTransactions}</p>
              </div>
              <History className="h-8 w-8 text-muted" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted">Completed</p>
                <p className="text-2xl font-bold text-chart-5">{completedTransactions}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-chart-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted">Total Profit</p>
                <p className="text-2xl font-bold text-chart-5">${fmt(totalProfit)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-chart-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted">Records Processed</p>
                <p className="text-2xl font-bold">{totalVolume.toLocaleString()}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-muted" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Transaction History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted" />
              <Input
                placeholder="Search by data source..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="timestamp">Date</SelectItem>
                <SelectItem value="volume">Volume</SelectItem>
                <SelectItem value="profit">Profit</SelectItem>
                <SelectItem value="cost">Cost</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          {/* Transactions Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data Source</TableHead>
                  <TableHead className="text-right">Volume</TableHead>
                  <TableHead className="text-right">Total Cost</TableHead>
                  <TableHead className="text-right">Profit</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted">
                      No transactions found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <TableRow key={transaction._id}>
                      <TableCell className="font-medium">
                        <div>
                          <p className="font-semibold">{transaction.sourceName}</p>
                          {transaction.enrichmentCost > 0 && <p className="text-xs text-muted">+ Enrichment</p>}
                          {transaction.duplicancyDiscount > 0 && (
                            <p className="text-xs text-muted">{transaction.duplicancyDiscount}% discount</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{transaction.volume.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-semibold">${fmt(transaction.totalCost)}</TableCell>
                      <TableCell className="text-right">
                        <span
                          className={`font-semibold ${transaction.profit >= 0 ? "text-chart-5" : "text-destructive"}`}
                        >
                          ${fmt(transaction.profit)}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={getStatusColor(transaction.status)}>{transaction.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right text-sm text-muted">
                        {formatDate(transaction.timestamp)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
