"use client"

import React, { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Calculator, TrendingUp, AlertCircle } from "lucide-react"
import api from "@/lib/api"

type DataSource = {
  _id: string
  name: string
  availableData: number
  buyingPrice: number
  sellingPrice: number
  description?: string
  createdAt?: string
  updatedAt?: string
}

type Transaction = {
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

const fmt = (n: number) => (Number.isFinite(n) ? n.toFixed(2) : "0.00")

export default function DataForm() {
  const [sources, setSources] = useState<DataSource[]>([])

  const [selectedId, setSelectedId] = useState<string>("")

  const [selectedSource, setSelectedSource] = useState<DataSource | null>(null)

  const [noOfData, setNoOfData] = useState<number>(0)
  const [includeEnrichment, setIncludeEnrichment] = useState<boolean>(false)
  const [userEnrichment, setUserEnrichment] = useState<number>(0)

  const [totalCost, setTotalCost] = useState<number>(0)
  const [profit, setProfit] = useState<number>(0)
  const [error, setError] = useState<string>("")
  const [delicacy, setDelicacy] = useState<number>(0)

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // console.log("Loading sources...") 
    let cancelled = false
    const loadSources = async () => {
      setLoading(true)
      try {
        const res = await api.get("/api/sources/")
        if (!cancelled) {
          setSources(Array.isArray(res.data) ? res.data : [])
          console.log(res.data) 
          setError("")
        }
      } catch (err) {
        console.error(err)
        if (!cancelled) setError("Failed to load sources.")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    loadSources()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!selectedId) {
      setSelectedSource(null)
      setNoOfData(0)
      setIncludeEnrichment(false)
      setUserEnrichment(0)
      setTotalCost(0)
      setProfit(0)
      setError("")
      return
    }

    const loadSourceDetails = async () => {
      setLoading(true)
      try {
        const res = await api.get(`/api/sources/${selectedId}`)
        if (res.data) {
          setSelectedSource(res.data)
          setNoOfData(0)
          setIncludeEnrichment(false)
          setUserEnrichment(0)
          setTotalCost(0)
          setProfit(0)
          setError("")
        } else {
          setSelectedSource(null)
          setError("Source not found.")
        }
      } catch (err) {
        console.error(err)
        setSelectedSource(null)
        setError("Failed to load source details.")
      } finally {
        setLoading(false)
      }
    }

    loadSourceDetails()
  }, [selectedId])

  useEffect(() => {
    if (!selectedSource) {
      setTotalCost(0)
      setProfit(0)
      return
    }

    if (noOfData < 0) {
      setError("Number of data cannot be negative.")
      return
    } else if (noOfData > selectedSource.availableData) {
      setError("Requested number exceeds available data.")
    } else {
      setError("")
    }

    const sp = selectedSource.sellingPrice
    const bp = selectedSource.buyingPrice
    const ep = includeEnrichment ? userEnrichment : 0
    const units = noOfData

    let cost = (sp + (includeEnrichment ? ep : 0)) * units

    if (delicacy > 0) {
      const discount = (cost * delicacy) / 100
      cost = cost - discount
    }

    setTotalCost(cost)

    const revenue = (sp + (includeEnrichment ? ep : 0) - bp) * units
    setProfit(revenue)
  }, [selectedSource, noOfData, includeEnrichment, userEnrichment, delicacy])

  const handleSubmit = async () => {
    if (!selectedId || noOfData <= 0 || !selectedSource) {
      setError("Please select a source and enter valid data volume.")
      return
    }

    if (noOfData > selectedSource.availableData) {
      setError("Requested number exceeds available data.")
      return
    }

    setLoading(true)
    try {
      const newAvailableData = selectedSource.availableData - noOfData

      const transactionData: Transaction = {
        sourceId: selectedId,
        sourceName: selectedSource.name,
        volume: noOfData,
        buyingPrice: selectedSource.buyingPrice,
        sellingPrice: selectedSource.sellingPrice,
        enrichmentCost: includeEnrichment ? userEnrichment : 0,
        duplicancyDiscount: delicacy,
        totalCost,
        profit,
        status: "completed",
      }

      await api.post("/api/history", transactionData)

      const updated = await api.put(`/api/sources/${selectedId}`, { availableData: newAvailableData })

      if (updated?.data) {
        setSelectedSource(updated.data)
        setSources((prev) => prev.map((p) => (p._id === selectedId ? updated.data : p)))
      }

      setError("")
      setNoOfData(0)
      setIncludeEnrichment(false)
      setUserEnrichment(0)
      setDelicacy(0)
    } catch (err) {
      console.error(err)
      setError("Failed to process transaction.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader >
          <CardTitle className="flex items-center gap-2" >
            <Calculator className="h-5 w-5" />
            Data Pricing Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-4">
            <Label htmlFor="source-select">Source of Data</Label>
            <Select value={selectedId} onValueChange={(val) => setSelectedId(val)}>
                <SelectTrigger className="data-[placeholder]:text-gray-500 [&_svg:not([class*='text-'])]:text-gray-500 bg-white"  >
                  <SelectValue 
                    placeholder="Select a data source"
                    
                  />
                </SelectTrigger>
                <SelectContent>
                  {sources.map((s) => (
                    <SelectItem  key={s._id} value={s._id}  className="hover:bg-black focus:bg-chart-5 focus:text-white">
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          )}

          {selectedSource && !loading && (
            <>
              <Card className="bg-blue-100">
                <CardHeader>
                  <CardTitle className="text-lg">Source Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 gap-y-10">
                    <div className="space-y-2">
                      <Label className="text-sm text-gray-700">Available Data</Label>
                      <Badge variant="secondary" className="text-sm bg-chart-5">
                        {selectedSource.availableData}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-gray-700">Buying Price</Label>
                      <p className="font-semibold">${fmt(selectedSource.buyingPrice)}</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-gray-700">Selling Price</Label>
                      <p className="font-semibold">${fmt(selectedSource.sellingPrice)}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                      className="border-black border-2 rounded-4xl"
                        id="enrichment"
                        checked={includeEnrichment}
                        onCheckedChange={(checked) => setIncludeEnrichment(checked as boolean)}
                      />
                      <Label htmlFor="enrichment">Include Custom Enrichment</Label>
                    </div>
                    <div className="col-span-1 space-y-2">
                      <Label className="text-sm text-gray-700" htmlFor="records">Records to Purchase</Label>
                      <Input
                        id="records"
                        type="number"
                        value={noOfData}
                        min={0}
                        onChange={(e) => setNoOfData(Number(e.target.value))}
                        placeholder="Enter number of records"
                        className="bg-white"
                      />
                    </div>
                    <div className="space-y-2 col-span-2 md:col-span-1">
                      <Label className="text-sm text-gray-700" htmlFor="duplicancy">Duplicancy</Label>
                      <Select value={delicacy.toString()} onValueChange={(val) => setDelicacy(Number(val))} >
                        <SelectTrigger className="bg-white w-full">
                          <SelectValue placeholder="Select percentage" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0"  className="focus:bg-chart-5 focus:text-white">None</SelectItem>
                          {[...Array(10)].map((_, i) => {
                            const val = (i + 1) * 5
                            return (
                              <SelectItem  className="focus:bg-chart-5 focus:text-white" key={val} value={val.toString()}>
                                {val}% 
                              </SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 col-span-2 md:col-span-1"></div>
                    {includeEnrichment && (
                      <div className="space-y-2 col-span-1">
                        <Label className="text-sm text-gray-700" htmlFor="enrichment-cost">Custom Enrichment Cost</Label>
                        <Input
                          id="enrichment-cost"
                          type="number"
                          value={userEnrichment}
                          step={0.01}
                          min={0}
                          onChange={(e) => setUserEnrichment(Number(e.target.value))}
                          placeholder="Enter enrichment cost per record"
                          className="bg-white"
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-blue-100">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <TrendingUp className="h-5 w-5" />
                    Calculation Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <Label className="text-muted">Total Buying Cost</Label>
                        <span className="text-xl font-bold">${fmt(totalCost)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <Label className="text-muted">Expected Profit</Label>
                        <span className={`text-xl font-bold ${profit >= 0 ? "text-chart-5" : "text-destructive"}`}>
                          ${fmt(profit)}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <Label className="text-muted">Records Selected</Label>
                        <span className="font-semibold">{noOfData.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <Label className="text-muted">Remaining After Purchase</Label>
                        <span className="font-semibold text-chart-5">{(selectedSource.availableData - noOfData).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                onClick={handleSubmit}
                className="w-full hover:bg-black bg-chart-5"
                size="lg"
                disabled={
                  loading || !selectedSource || noOfData <= 0 || noOfData > (selectedSource?.availableData ?? 0)
                }
              >
                {loading ? "Processing..." : "Submit"}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

