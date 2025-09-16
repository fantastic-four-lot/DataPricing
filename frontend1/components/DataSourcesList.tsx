"use client"

import { useEffect, useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Edit, Trash2, TrendingUp, Database, AlertCircle, ChevronDown, Search } from "lucide-react"
import api from "../lib/api"
import Link from "next/link"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "./ui/label"

const fmt = (n: number) => (Number.isFinite(n) ? n.toFixed(2) : "0.00")

type DataSource =  {
  _id: string
  name: string
  availableData: number
  buyingPrice: number
  // sellingPrice: number
  description?: string
  createdAt?: string
  updatedAt?: string
}

export default function DataSourcesList() {
  const [sources, setSources] = useState<DataSource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")
  const [sortField, setSortField] = useState("name") 

  const loadSources = async () => {
    try {
      setLoading(true)
      const res = await api.get("/api/sources/")
      setSources(res.data)
      setError("")
    } catch (err) {
      setError("Failed to load data sources.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSources()
  }, [])

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return
    }
    // Implement deletion logic here
  try {
    setLoading(true);
    await api.delete(`/api/sources/${id}`);
    // reload the list after deletion
    await loadSources();
    setError("");
  } catch (err) {
    setError("Failed to delete source.");
    console.error(err);
  } finally {
    setLoading(false);
  }
  }


  const filteredSources = useMemo(() => {
    return sources
      .filter(source =>
        source.name.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => {
        if (sortField === "buyingPrice") {
          return a.buyingPrice - b.buyingPrice
        } 
        // else if (sortField === "sellingPrice") {
        //   return a.sellingPrice - b.sellingPrice
        // } else if (sortField === "profitMargin") {
        //   const profitA = ((a.sellingPrice - a.buyingPrice) / a.sellingPrice) * 100
        //   const profitB = ((b.sellingPrice - b.buyingPrice) / b.sellingPrice) * 100
        //   return profitA - profitB
        // }
         else {
          return a.name.localeCompare(b.name)
        }
      })
  }, [sources, search, sortField])

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="h-3 bg-muted rounded"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div>
      <div className="mb-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        {/* <Input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border-1 border-gray-300 rounded px-3 py-2 w-full md:w-1/3 placeholder:text-gray-700 bg-blue-50 shadow-lg"
        /> */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted" />
          <Input
            placeholder="Search by name . . ."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-blue-50 placeholder:text-muted w-md h-9 md:text-md"
          />
        </div>

        <div className="flex items-center gap-2">
          <Label className="text-sm text-black">Sort By:</Label>
          <Select value={sortField} onValueChange={setSortField}>
            <SelectTrigger className="w-[180px] border rounded px-3 py-2 bg-blue-50">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem  value="name">Name</SelectItem>
              <SelectItem  value="buyingPrice">Buying Price</SelectItem>
              {/* <SelectItem  value="sellingPrice">Selling Price</SelectItem>
              <SelectItem  value="profitMargin">Profit Margin</SelectItem> */}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredSources.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <Database className="h-12 w-12 text-muted mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Data Sources Found</h3>
            <p className="text-muted mb-4">Try adjusting your search or add new sources.</p>
            <Button asChild>
              <Link href="/add-data">Add Data Source</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredSources.map((source) => {
            // const profitMargin = ((source.sellingPrice - source.buyingPrice) / source.sellingPrice) * 100

            return (
              <Card key={source._id} className="hover:shadow-md transition-shadow pt-0">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 py-2 bg-blue-100 rounded-t-xl">
                  <CardTitle className="text-lg font-semibold text-balance">{source.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {source.description && <p className="text-sm text-muted text-pretty h-10">{source.description}</p>}

                    <div className="flex items-center justify-between">
                      <span className="text-md font-semibold text-gray-700">Available Data:</span>
                      <Badge variant="secondary" className="bg-chart-5 text-md">{source.availableData}</Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm mt-6">
                      <div>
                        <span className="text-muted">Buying Price</span>
                        <p className="font-semibold">${fmt(source.buyingPrice)}</p>
                      </div>
                      {/* <div>
                        <span className="text-muted">Selling Price</span>
                        <p className="font-semibold">${fmt(source.sellingPrice)}</p>
                      </div> */}
                    </div>

                    {/* <div className="flex items-center gap-2 text-sm">
                      <TrendingUp className="h-4 w-4 text-chart-5" />
                      <span className="text-muted">Profit Margin:</span>
                      <span className="font-semibold text-chart-5">{fmt(profitMargin)}%</span>
                    </div> */}

                    <div className="flex gap-2 pt-2">
                      <Link href={`/add-data?id=${source._id}`} className="flex-1 bg-transparent">
                        <Button variant="outline" size="sm" className="flex items-center gap-2 w-full justify-center hover:bg-chart-5">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:bg-chart-5"
                        onClick={() => handleDelete(source._id, source.name)}
                      >
                        <Trash2 className="h-4 w-4 hover:bg-white" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
