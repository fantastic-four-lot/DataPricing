import mongoose, { Schema, Document } from "mongoose";

export interface ITransaction extends Document {
  sourceId: string;
  sourceName: string;
  volume: number;
  buyingPrice: number;
  sellingPrice: number;
  enrichmentCost: number;
  duplicancyDiscount: number;
  totalCost: number;
  profit: number;
  status: string; // "completed" | "pending" etc.
  createdAt?: Date;
}

const TransactionSchema: Schema = new Schema(
  {
    sourceId: { type: String, required: true },
    sourceName: { type: String, required: true },
    volume: { type: Number, required: true },
    buyingPrice: { type: Number, required: true },
    sellingPrice: { type: Number, required: true },
    enrichmentCost: { type: Number, default: 0 },
    duplicancyDiscount: { type: Number, default: 0 },
    totalCost: { type: Number, required: true },
    profit: { type: Number, required: true },
    status: { type: String, default: "completed" }
  },
  { timestamps: true } // ✅ adds createdAt & updatedAt
);

export default mongoose.model<ITransaction>("Transaction", TransactionSchema);
