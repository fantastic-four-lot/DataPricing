"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, AlertCircle, CheckCircle } from "lucide-react"
import api from "@/lib/api"

type NewDataSource = {
  name: string
  availableData: number
  buyingPrice: number
  sellingPrice: number
  enrichmentPrice?: number
  description?: string
}

export default function AddDataForm({id}: {id:string}) {
  const router = useRouter()
  const [formData, setFormData] = useState<NewDataSource>({
    name: "",
    availableData: 0,
    buyingPrice: 0,
    sellingPrice: 0,
    description: "",
  })
  // console.log("Received ID prop:", id.id);
  //   const searchParams = useSearchParams()
  // const id = searchParams.get("id") ?? ""
  // const id = uid.id;

  
    // You can use useEffect to fetch and set the data source details here
    useEffect(() => {
      const fetchDataSource = async () => {
        try {
           if(!id){
    setFormData({
      name: "",
      availableData: 0,
      buyingPrice: 0,
      sellingPrice: 0,
      description: "",
    })
  } else{
          const response = await api.get(`/api/sources/${id}`);
          const source = response.data;
          setFormData({
            name: source.name,
            availableData: source.availableData,
            buyingPrice: source.buyingPrice,
            sellingPrice: source.sellingPrice,
            description: source.description || "",
          });}
        } catch (error) {
          console.error("Failed to fetch data source details:", error);
        }
      };
      fetchDataSource();
    }, [id]);



  console.log("Editing ID:", id)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleInputChange = (field: keyof NewDataSource, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
    setError("")
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Data source name is required")
      return false
    }
    if (formData.availableData <= 0) {
      setError("Available data must be greater than 0")
      return false
    }
    if (formData.buyingPrice < 0) {
      setError("Buying price cannot be negative")
      return false
    }
    if (formData.sellingPrice <= 0) {
      setError("Selling price must be greater than 0")
      return false
    }
    if (formData.sellingPrice <= formData.buyingPrice) {
      setError("Selling price must be higher than buying price")
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)
    setError("")

    try {
      const data =id?( await api.put(`/api/sources/${id}`,formData)):( await api.post("/api/sources/",formData))
      console.log("Created data source:", data)
      setSuccess(true)

      // Reset form after successful submission
      setTimeout(() => {
        router.push("/")
      }, 2000)
    } catch (err) {
      setError("Failed to create data source. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const profitMargin =
    formData.sellingPrice > 0 && formData.buyingPrice >= 0
      ? ((formData.sellingPrice - formData.buyingPrice) / formData.sellingPrice) * 100
      : 0

  if (success) {
    return (
      <Card className="border-chart-5">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <CheckCircle className="h-12 w-12 text-chart-5 mx-auto" />
          <h3 className="text-lg font-semibold">{id?"Data Source Updated Successfully!":"Data Source Created Successfully!"}</h3>
            <p className="text-muted">Redirecting to data sources list...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
   <>
   

     <Card className="">
      <CardHeader>
        {/* <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add New Data Source
        </CardTitle> */}
        
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-8">
            <h3 className="text-lg font-semibold">Basic Information</h3>

            <div className="space-y-2">
              <Label htmlFor="name">Data Source Name<span className="text-destructive">*</span> </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="e.g., Customer Demographics, Market Research Data"
                className="placeholder:text-gray-500" // 👈 control placeholder color
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Brief description of the data source..."
                className="placeholder:text-gray-500" // 👈 control placeholder color
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="availableData">Available Data Records <span className="text-destructive">*</span></Label>
              <Input
                id="availableData"
                type="number"
                value={formData.availableData}
                onChange={(e) => handleInputChange("availableData", Number(e.target.value))}
                placeholder="Number of available records"
                min={1}
                required
              />
            </div>
          </div>

          {/* Pricing Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Pricing Information</h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="buyingPrice">Buying Price per Record <span className="text-destructive">*</span></Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted">$</span>
                  <Input
                    id="buyingPrice"
                    type="number"
                    value={formData.buyingPrice}
                    onChange={(e) => handleInputChange("buyingPrice", Number(e.target.value))}
                    placeholder="0.00"
                    step={0.01}
                    min={0}
                    className="pl-8"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sellingPrice">Selling Price per Record <span className="text-destructive">*</span></Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted">$</span>
                  <Input
                    id="sellingPrice"
                    type="number"
                    value={formData.sellingPrice}
                    onChange={(e) => handleInputChange("sellingPrice", Number(e.target.value))}
                    placeholder="0.00"
                    step={0.01}
                    min={0}
                    className="pl-8"
                    required
                  />
                </div>
              </div>
            </div>

            {/* <div className="space-y-2">
              <Label htmlFor="enrichmentPrice">Enrichment Price per Record (Optional)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted">$</span>
                <Input
                  id="enrichmentPrice"
                  type="number"
                  value={formData.enrichmentPrice || ""}
                  onChange={(e) => handleInputChange("enrichmentPrice", Number(e.target.value))}
                  placeholder="0.00"
                  step={0.01}
                  min={0}
                  className="pl-8"
                />
              </div>
            </div> */}
          </div>

          {/* Profit Calculation Preview */}
          {formData.sellingPrice > 0 && formData.buyingPrice >= 0 && (
            <Card className="bg-accent/5">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted">Estimated Profit Margin</span>
                  <span className={`font-semibold ${profitMargin > 0 ? "text-chart-5" : "text-destructive"}`}>
                    {profitMargin.toFixed(2)}%
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-muted">Profit per Record</span>
                  <span className={`font-semibold ${profitMargin > 0 ? "text-chart-5" : "text-destructive"}`}>
                    ${(formData.sellingPrice - formData.buyingPrice).toFixed(2)}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={() => router.push("/")} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {id?(loading ? "Updating..." : "Update Data Source"):(loading ? "Creating..." : "Create Data Source")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  
   
   </>
  )
}
