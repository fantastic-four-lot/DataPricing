"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Edit, Trash2, TrendingUp, Database, AlertCircle } from "lucide-react"
import api from "../lib/api"
import Link from "next/link"

const fmt = (n: number) => (Number.isFinite(n) ? n.toFixed(2) : "0.00")


type DataSource =  {
  _id: string
  name: string
  availableData: number
  buyingPrice: number
  sellingPrice: number

  description?: string
  createdAt?: string
  updatedAt?: string
}

export default function DataSourcesList() {
  const [sources, setSources] = useState<DataSource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadSources = async () => {
    try {
      setLoading(true)
      await api.get("/api/sources/")
      .then((res: { data: React.SetStateAction<DataSource[]> }) => {setSources(res.data)
      // .catch(() => setError("Failed to load sources."));
      // setSources(data)
      console.log(res.data);
      
      setError("")})
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

  if (sources.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <Database className="h-12 w-12 text-muted mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Data Sources Found</h3>
          <p className="text-muted mb-4">Get started by adding your first data source.</p>
          <Button asChild>
            <a href="/add-data">Add Data Source</a>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {sources.map((source) => {
        const profitMargin = ((source.sellingPrice - source.buyingPrice) / source.sellingPrice) * 100

        return (
          <Card key={source._id} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold text-balance">{source.name}</CardTitle>
              <Database className="h-5 w-5 text-muted" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {source.description && <p className="text-sm text-muted text-pretty">{source.description}</p>}

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted">Available Data</span>
                  <Badge variant="secondary">{source.availableData}</Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted">Buying Price</span>
                    <p className="font-semibold">${fmt(source.buyingPrice)}</p>
                  </div>
                  <div>
                    <span className="text-muted">Selling Price</span>
                    <p className="font-semibold">${fmt(source.sellingPrice)}</p>
                  </div>
                </div>

                

                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-chart-5" />
                  <span className="text-muted">Profit Margin:</span>
                  <span className="font-semibold text-chart-5">{fmt(profitMargin)}%</span>
                </div>

                <div className="flex gap-2 pt-2">
                   <Link href={`/add-data?id=${source._id}`} className="flex-1 bg-transparent">
             <Button variant="outline" size="sm" className="flex items-center gap-2 w-full justify-center">
                   
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                    
                  </Button></Link>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive bg-transparent hover:bg-destructive"
                    onClick={() => handleDelete(source._id, source.name)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
