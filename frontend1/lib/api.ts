// // Mock API client for demonstration
// // In a real application, this would connect to your actual backend


import axios from "axios";

const baseURL =  "http://localhost:5000";

export default axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" }
});

// export type DataSource = {
//   _id: string
//   name: string
//   availableData: number
//   buyingPrice: number
//   sellingPrice: number
//   enrichmentPrice?: number
//   description?: string
//   createdAt?: string
//   updatedAt?: string
// }

// export type Transaction = {
//   _id: string
//   sourceId: string
//   sourceName: string
//   volume: number
//   buyingPrice: number
//   sellingPrice: number
//   enrichmentCost: number
//   duplicancyDiscount: number
//   totalCost: number
//   profit: number
//   timestamp: string
//   status: "completed" | "pending" | "failed"
// }

// // Mock data storage (in a real app, this would be your database)
// const mockDataSources: DataSource[] = [
//   {
//     _id: "1",
//     name: "Customer Demographics",
//     availableData: 50000,
//     buyingPrice: 0.05,
//     sellingPrice: 0.12,
//     enrichmentPrice: 0.03,
//     description: "Comprehensive customer demographic data including age, location, and preferences",
//     createdAt: "2024-01-01T00:00:00Z",
//     updatedAt: "2024-01-01T00:00:00Z",
//   },
//   {
//     _id: "2",
//     name: "Market Research Data",
//     availableData: 25000,
//     buyingPrice: 0.08,
//     sellingPrice: 0.18,
//     enrichmentPrice: 0.05,
//     description: "Market trends and consumer behavior analysis data",
//     createdAt: "2024-01-02T00:00:00Z",
//     updatedAt: "2024-01-02T00:00:00Z",
//   },
//   {
//     _id: "3",
//     name: "Social Media Analytics",
//     availableData: 75000,
//     buyingPrice: 0.03,
//     sellingPrice: 0.09,
//     enrichmentPrice: 0.02,
//     description: "Social media engagement and sentiment analysis data",
//     createdAt: "2024-01-03T00:00:00Z",
//     updatedAt: "2024-01-03T00:00:00Z",
//   },
// ]

// const mockTransactions: Transaction[] = [
//   {
//     _id: "1",
//     sourceId: "1",
//     sourceName: "Customer Demographics",
//     volume: 1000,
//     buyingPrice: 0.05,
//     sellingPrice: 0.12,
//     enrichmentCost: 0.03,
//     duplicancyDiscount: 10,
//     totalCost: 135,
//     profit: 70,
//     timestamp: "2024-01-15T10:30:00Z",
//     status: "completed",
//   },
//   {
//     _id: "2",
//     sourceId: "2",
//     sourceName: "Market Research Data",
//     volume: 500,
//     buyingPrice: 0.08,
//     sellingPrice: 0.18,
//     enrichmentCost: 0,
//     duplicancyDiscount: 0,
//     totalCost: 90,
//     profit: 50,
//     timestamp: "2024-01-14T15:45:00Z",
//     status: "completed",
//   },
//   {
//     _id: "3",
//     sourceId: "3",
//     sourceName: "Social Media Analytics",
//     volume: 2000,
//     buyingPrice: 0.03,
//     sellingPrice: 0.09,
//     enrichmentCost: 0.02,
//     duplicancyDiscount: 15,
//     totalCost: 187,
//     profit: 120,
//     timestamp: "2024-01-13T09:15:00Z",
//     status: "completed",
//   },
// ]

// // Simulate network delay
// const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// export const api = {
//   // Data Sources API
//   dataSources: {
//     getAll: async (): Promise<DataSource[]> => {
//       await delay(300)
//       return [...mockDataSources]
//     },

//     getById: async (id: string): Promise<DataSource | null> => {
//       await delay(200)
//       return mockDataSources.find((source) => source._id === id) || null
//     },

//     create: async (data: Omit<DataSource, "_id" | "createdAt" | "updatedAt">): Promise<DataSource> => {
//       await delay(500)
//       const newSource: DataSource = {
//         ...data,
//         _id: Date.now().toString(),
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString(),
//       }
//       mockDataSources.push(newSource)
//       return newSource
//     },

//     update: async (id: string, data: Partial<DataSource>): Promise<DataSource> => {
//       await delay(400)
//       const index = mockDataSources.findIndex((source) => source._id === id)
//       if (index === -1) {
//         throw new Error("Data source not found")
//       }

//       mockDataSources[index] = {
//         ...mockDataSources[index],
//         ...data,
//         updatedAt: new Date().toISOString(),
//       }

//       return mockDataSources[index]
//     },

//     delete: async (id: string): Promise<void> => {
//       await delay(300)
//       const index = mockDataSources.findIndex((source) => source._id === id)
//       if (index === -1) {
//         throw new Error("Data source not found")
//       }
//       mockDataSources.splice(index, 1)
//     },
//   },

//   // Transactions API
//   transactions: {
//     getAll: async (): Promise<Transaction[]> => {
//       await delay(400)
//       return [...mockTransactions].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
//     },

//     create: async (data: Omit<Transaction, "_id" | "timestamp">): Promise<Transaction> => {
//       await delay(600)
//       const newTransaction: Transaction = {
//         ...data,
//         _id: Date.now().toString(),
//         timestamp: new Date().toISOString(),
//       }
//       mockTransactions.push(newTransaction)
//       return newTransaction
//     },

//     getBySourceId: async (sourceId: string): Promise<Transaction[]> => {
//       await delay(300)
//       return mockTransactions.filter((transaction) => transaction.sourceId === sourceId)
//     },
//   },
// }

// // export default api
