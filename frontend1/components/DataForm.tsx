// "use client"

// import { useEffect, useState } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { Badge } from "@/components/ui/badge"
// import { Calculator, TrendingUp, AlertCircle } from "lucide-react"
// import api from "@/lib/api"

// // type SourceSummary = { _id: string; name: string }
// type DataSource =  {
//   _id: string
//   name: string
//   availableData: number
//   buyingPrice: number
//   sellingPrice: number
//   description?: string
//   createdAt?: string
//   updatedAt?: string
// }

// const fmt = (n: number) => (Number.isFinite(n) ? n.toFixed(2) : "0.00")

// export default function DataForm() {
//   // const [source, setSources] = useState<SourceSummary[]>([])
//   const [selectedId, setSelectedId] = useState<string>("")
//   const [source, setSource] = useState<DataSource[]>([])

//   const [noOfData, setNoOfData] = useState<number>(0)
//   const [includeEnrichment, setIncludeEnrichment] = useState<boolean>(false)
//   const [userEnrichment, setUserEnrichment] = useState<number>(0)

//   const [totalCost, setTotalCost] = useState<number>(0)
//   const [profit, setProfit] = useState<number>(0)
//   const [error, setError] = useState<string>("")
//   const [delicacy, setDelicacy] = useState<number>(0)
//   const [loading, setLoading] = useState(false)

//   useEffect(() => {
//     const loadSources = async () => {
//       try {
//         // const data = await api.dataSources.getAll()
//         await api.get("/api/source/")
//               .then((res: { data: React.SetStateAction<DataSource[]> }) => {setSource(res.data)
//               // .catch(() => setError("Failed to load source."));
//               // setSources(data)
//               console.log(res.data);
              
//               setError("")})

//       } catch (err) {
//         setError("Failed to load source.")
//       }
//     }
//     loadSources()
//   }, [])

//   useEffect(() => {
//     if (!selectedId) {
//       setSource([])
//       setNoOfData(0)
//       setIncludeEnrichment(false)
//       setUserEnrichment(0)
//       setTotalCost(0)
//       setProfit(0)
//       setError("")
//       return
//     }

//     const loadSourceDetails = async () => {
//       setLoading(true)
//       try {
//        const res = await api.get(`/api/source/${selectedId}`)
//         if (res.data) {
//           setSource(res.data)
//           setNoOfData(0)
//           setIncludeEnrichment(false)
//           setUserEnrichment(0)
//           setTotalCost(0)
//           setProfit(0)
//           setError("")
//         } else {
//           setError("Source not found.")
//         }
//       } catch (err) {
//         setError("Failed to load source details.")
//       } finally {
//         setLoading(false)
//       }
//     }

//     loadSourceDetails()
//   }, [selectedId])

//   useEffect(() => {
//     if (!source) return

//     if (noOfData < 0) {
//       setError("Number of data cannot be negative.")
//       return
//     } else if (noOfData > source[0].availableData) {
//       setError("Requested number exceeds available data.")
//     } else {
//       setError("")
//     }

//     const sp = source[0].sellingPrice
//     const bp = source[0].buyingPrice
//     const ep = includeEnrichment ? userEnrichment : 0
//     const units = noOfData

//     let cost = includeEnrichment ? (sp + ep) * units : sp * units

//     // Apply delicacy discount if selected
//     if (delicacy > 0) {
//       const discount = (cost * delicacy) / 100
//       cost = cost - discount
//     }

//     setTotalCost(cost)

//     const revenue = includeEnrichment ? (sp + userEnrichment - bp) * units : (sp - bp) * units
//     setProfit(revenue)
//   }, [source, noOfData, includeEnrichment, userEnrichment, delicacy])

//   const handleSubmit = async () => {
//     if (!selectedId || noOfData <= 0 || !source) {
//       setError("Please select a source and enter valid data volume.")
//       return
//     }

//     setLoading(true)
//     try {
//       const newAvailableData = source[0].availableData - noOfData

//       // Create transaction record
//       const transactionData: Omit<Transaction, "_id" | "timestamp"> = {
//         sourceId: selectedId,
//         sourceName: source[0].name,
//         volume: noOfData,
//         buyingPrice: source[0].buyingPrice,
//         sellingPrice: source[0].sellingPrice,
//         enrichmentCost: includeEnrichment ? userEnrichment : 0,
//         duplicancyDiscount: delicacy,
//         totalCost,
//         profit,
//         status: "completed",
//       }

//       await api.transactions.create(transactionData)

//       // Update source availability
//       const updatedSource = await api.dataSources.update(selectedId, {
//         availableData: newAvailableData,
//       })

//       setSource(updatedSource)
//       setError("")

//       // Reset form after successful submission
//       setNoOfData(0)
//       setIncludeEnrichment(false)
//       setUserEnrichment(0)
//       setDelicacy(0)
//     } catch (err) {
//       console.error(err)
//       setError("Failed to process transaction.")
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="space-y-6">
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Calculator className="h-5 w-5" />
//             Data Pricing Calculator
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-6">
//           {/* Source Selection */}
//           <div className="space-y-2">
//             <Label htmlFor="source-select">Source of Data</Label>
//             <Select value={selectedId} onValueChange={setSelectedId}>
//               <SelectTrigger>
//                 <SelectValue placeholder="Select a data source" />
//               </SelectTrigger>
//               <SelectContent>
//                 {source.map((s) => (
//                   <SelectItem key={s._id} value={s._id}>
//                     {s.name}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>

//           {loading && (
//             <div className="flex items-center justify-center py-8">
//               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
//             </div>
//           )}

//           {source && !loading && (
//             <>
//               {/* Source Details */}
//               <Card className="bg-card/50">
//                 <CardHeader>
//                   <CardTitle className="text-lg">Source Details</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                     <div className="space-y-1">
//                       <Label className="text-sm text-muted">Available Data</Label>
//                       <Badge variant="secondary" className="text-sm">
//                         {source[0].availableData}
//                       </Badge>
//                     </div>
//                     <div className="space-y-1">
//                       <Label className="text-sm text-muted">Buying Price</Label>
//                       <p className="font-semibold">${fmt(source[0].buyingPrice)}</p>
//                     </div>
//                     <div className="space-y-1">
//                       <Label className="text-sm text-muted">Selling Price</Label>
//                       <p className="font-semibold">${fmt(source[0].sellingPrice)}</p>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <Checkbox
//                         id="enrichment"
//                         checked={includeEnrichment}
//                         onCheckedChange={(checked) => setIncludeEnrichment(checked as boolean)}
//                       />
//                       <Label htmlFor="enrichment">Include Custom Enrichment</Label>
//                     </div>

//                     {includeEnrichment && (
//                       <div className="ml-6 space-y-2">
//                                         <Label htmlFor="enrichment-cost">Custom Enrichm>Custom Enrichment Cost                     id="enrich                    id= type="number"
//                                              value={userEnrichment}
//                           step={0.01}
//                           min={0}
//                           onChange={(e) => setUserEnrichment(Number(e.target.value))}
//                           placeholder="Enter enrichment cost per record"
//                         />
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 <div className="space-y-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="duplicancy">Duplicancy Discount</Label>
//                     <Select value={delicacy.toString()} onValueChange={(value) => setDelicacy(Number(value))}>
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select discount percentage" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="0">No discount</SelectItem>
//                         {[...Array(10)].map((_, i) => {
//                           const val = (i + 1) * 5
//                           return (
//                             <SelectItem key={val} value={val.toString()}>
//                               {val}% discount
//                             </SelectItem>
//                           )
//                         })}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 </div>
//               </div>

//               {/* Results */}
//               <Card className="bg-accent/5">
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2 text-lg">
//                     <TrendingUp className="h-5 w-5" />
//                     Calculation Results
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="grid md:grid-cols-2 gap-6">
//                     <div className="space-y-3">
//                       <div className="flex justify-between items-center">
//                         <Label className="text-muted">Total Buying Cost</Label>
//                         <span className="text-xl font-bold">${fmt(totalCost)}</span>
//                       </div>
//                       <div className="flex justify-between items-center">
//                         <Label className="text-muted">Expected Profit</Label>
//                         <span className={`text-xl font-bold ${profit >= 0 ? "text-chart-5" : "text-destructive"}`}>
//                           ${fmt(profit)}
//                         </span>
//                       </div>
//                     </div>
//                     <div className="space-y-3">
//                       <div className="flex justify-between items-center">
//                         <Label className="text-muted">Records Selected</Label>
//                         <span className="font-semibold">{noOfData.toLocaleString()}</span>
//                       </div>
//                       <div className="flex justify-between items-center">
//                         <Label className="text-muted">Remaining After Purchase</Label>
//                         <span className="font-semibold">{(source.availableData - noOfData).toLocaleString()}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>

//               {error && (
//                 <Alert variant="destructive">
//                   <AlertCircle className="h-4 w-4" />
//                   <AlertDescription>{error}</AlertDescription>
//                 </Alert>
//               )}

//               <Button
//                 onClick={handleSubmit}
//                 className="w-full"
//                 size="lg"
//                                 disabled={loadirror |              >
//                 {loading ? "Processing..." : "Submit Transaction"}
//               </Button>
//             </>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   )
// }



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

// Types
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
  // list of available sources returned by initial GET
  const [sources, setSources] = useState<DataSource[]>([])
  // selected source id from Select
  const [selectedId, setSelectedId] = useState<string>("")
  // details of the selected source
  const [selectedSource, setSelectedSource] = useState<DataSource | null>(null)

  const [noOfData, setNoOfData] = useState<number>(0)
  const [includeEnrichment, setIncludeEnrichment] = useState<boolean>(false)
  const [userEnrichment, setUserEnrichment] = useState<number>(0)

  const [totalCost, setTotalCost] = useState<number>(0)
  const [profit, setProfit] = useState<number>(0)
  const [error, setError] = useState<string>("")
  const [delicacy, setDelicacy] = useState<number>(0) // duplicacy discount percent
  const [loading, setLoading] = useState(false)

  // load list of sources on mount
  useEffect(() => {
    console.log("Loading sources...") 
    let cancelled = false
    const loadSources = async () => {
      setLoading(true)
      try {
        const res = await api.get("/api/sources/")
        if (!cancelled) {
          // expecting an array
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

  // when selectedId changes, load that source's details
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

  // Calculation effect
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

    // Apply delicacy discount if selected
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

      // create transaction (adjust endpoint if your api differs)
      await api.post("/api/history", transactionData)

      // update source availability (adjust if your api uses different path)
      const updated = await api.put(`/api/sources/${selectedId}`, { availableData: newAvailableData })

      // reflect update locally
      if (updated?.data) {
        setSelectedSource(updated.data)
        // also update list copy
        setSources((prev) => prev.map((p) => (p._id === selectedId ? updated.data : p)))
      }

      setError("")
      // Reset form
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
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Data Pricing Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Source Selection */}
          <div className="space-y-2">
            <Label htmlFor="source-select">Source of Data</Label>
            <Select value={selectedId} onValueChange={(val) => setSelectedId(val)}>
                <SelectTrigger className="h-16 text-sm border-2 border-border data-[placeholder]:text-gray-500 text-black [&_svg:not([class*='text-'])]:text-gray-500 hover:border-primary/50 transition-all duration-200 bg-input">
    <SelectValue 
      placeholder="Select a data source"
      className="text-gray-500"   // 👈 this styles the placeholder
    />
  </SelectTrigger>
  <SelectContent>
    {sources.map((s) => (
      <SelectItem key={s._id} value={s._id}>
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
              {/* Source Details */}
              <Card className="bg-card/50">
                <CardHeader>
                  <CardTitle className="text-lg">Source Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <Label className="text-sm text-muted">Available Data</Label>
                      <Badge variant="secondary" className="text-sm">
                        {selectedSource.availableData}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm text-muted">Buying Price</Label>
                      <p className="font-semibold">${fmt(selectedSource.buyingPrice)}</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm text-muted">Selling Price</Label>
                      <p className="font-semibold">${fmt(selectedSource.sellingPrice)}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="enrichment"
                        checked={includeEnrichment}
                        onCheckedChange={(checked) => setIncludeEnrichment(checked as boolean)}
                      />
                      <Label htmlFor="enrichment">Include Custom Enrichment</Label>
                    </div>

                    {includeEnrichment && (
                      <div className="ml-6 space-y-2 col-span-2">
                        <Label htmlFor="enrichment-cost">Custom Enrichment Cost</Label>
                        <Input
                          id="enrichment-cost"
                          type="number"
                          value={userEnrichment}
                          step={0.01}
                          min={0}
                          onChange={(e) => setUserEnrichment(Number(e.target.value))}
                          placeholder="Enter enrichment cost per record"
                        />
                      </div>
                    )}

                    <div className="col-span-2 space-y-2">
                      <Label htmlFor="records">Records to Purchase</Label>
                      <Input
                        id="records"
                        type="number"
                        value={noOfData}
                        min={0}
                        onChange={(e) => setNoOfData(Number(e.target.value))}
                        placeholder="Enter number of records"
                      />
                    </div>

                    <div className="space-y-4 col-span-2 md:col-span-1">
                      <Label htmlFor="duplicancy">Duplicancy Discount</Label>
                      <Select value={delicacy.toString()} onValueChange={(val) => setDelicacy(Number(val))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select discount percentage" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">No discount</SelectItem>
                          {[...Array(10)].map((_, i) => {
                            const val = (i + 1) * 5
                            return (
                              <SelectItem key={val} value={val.toString()}>
                                {val}% discount
                              </SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>

                <div className="p-4">
                  {/* Results summary small row inside the card footer area if needed */}
                </div>
              </Card>

              {/* Results */}
              <Card className="bg-accent/5">
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
                        <span className="font-semibold">{(selectedSource.availableData - noOfData).toLocaleString()}</span>
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
                className="w-full"
                size="lg"
                disabled={
                  loading || !selectedSource || noOfData <= 0 || noOfData > (selectedSource?.availableData ?? 0)
                }
              >
                {loading ? "Processing..." : "Submit Transaction"}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

