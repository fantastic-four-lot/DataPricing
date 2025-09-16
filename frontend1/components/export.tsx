"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import * as XLSX from "xlsx"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"


interface Transaction {
  sourceName: string
  volume: number
  buyingPrice: number
  sellingPrice: number
  profit: number
  totalCost: number
  status: string
  createdAt: string
}

export default function ExportButtons({ filteredTransactions }: { filteredTransactions: Transaction[] }) {
  // Export Excel (only filtered/sorted data)
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredTransactions.map(t => ({
        Source: t.sourceName,
        Volume: t.volume,
        "Buying Price": t.buyingPrice,
        "Selling Price": t.sellingPrice,
        Profit: t.profit,
        "Total Cost": t.totalCost,
        Status: t.status,
        Date: new Date(t.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      }))
    )

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions")
    XLSX.writeFile(workbook, "transactions.xlsx")
  }

  // Export PDF (only filtered/sorted data)
  const exportToPDF = () => {
    const doc = new jsPDF()

doc.text("Transactions Report", 14, 10)

autoTable(doc, {
  head: [["Source", "Volume", "Buying Price", "Selling Price", "Profit", "Total Cost", "Status", "Date"]],
  body: filteredTransactions.map((t) => [
    t.sourceName,
    t.volume,
    t.buyingPrice,
    t.sellingPrice,
    t.profit,
    t.totalCost,
    t.status,
    new Date(t.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
  ]),
  startY: 20,
})

doc.save("transactions.pdf")

  }

  return (
    <div className="flex gap-2">
      <Button onClick={exportToExcel} variant="outline" size="sm">
        <Download className="h-4 w-4 mr-2" />
        Excel
      </Button>
      <Button onClick={exportToPDF} variant="outline" size="sm">
        <Download className="h-4 w-4 mr-2" />
        PDF
      </Button>
    </div>
  )
}
