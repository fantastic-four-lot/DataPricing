import mongoose, { Schema, Document } from "mongoose";

export interface ISource extends Document {
  name: string;
  availableData: number;
  buyingPrice: number;
  enrichmentPrice: number;
  sellingPrice: number;
}

const SourceSchema: Schema = new Schema({
  name: { type: String, required: true },
  availableData: { type: Number, required: true },
  buyingPrice: { type: Number, required: true },
  enrichmentPrice: { type: Number, required: true },
  sellingPrice: { type: Number, required: true }
});

export default mongoose.model<ISource>("Source", SourceSchema);
