import mongoose, { Schema, Document } from "mongoose";

export interface ISource extends Document {
  name: string;
  availableData: number;
  buyingPrice: number;
  // sellingPrice: number;

  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const SourceSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    availableData: { type: Number, required: true },
    buyingPrice: { type: Number, required: true },
    // sellingPrice: { type: Number, required: true },
    description: { type: String },                  // optional
  },
  { timestamps: true } // ✅ this auto-adds createdAt & updatedAt
);

export default mongoose.model<ISource>("sources", SourceSchema);
