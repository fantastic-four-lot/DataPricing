import mongoose from "mongoose";
import dotenv from "dotenv";
import Source from "./models/Source";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/datapricing";

async function seed() {
  await mongoose.connect(MONGO_URI);
  const count = await Source.countDocuments();
  if (count > 0) {
    console.log("Sources already exist.");
    process.exit(0);
  }

  const docs = [
    { name: "Source A", availableData: 10000, buyingPrice: 2.0, enrichmentPrice: 1.5, sellingPrice: 5.0 },
    { name: "Source B", availableData: 5000, buyingPrice: 1.2, enrichmentPrice: 0.8, sellingPrice: 3.5 }
  ];

  await Source.insertMany(docs);
  console.log("Seeded:", docs);
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
