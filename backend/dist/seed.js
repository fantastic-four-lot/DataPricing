"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const Source_1 = __importDefault(require("./models/Source"));
dotenv_1.default.config();
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/datapricing";
async function seed() {
    await mongoose_1.default.connect(MONGO_URI);
    const count = await Source_1.default.countDocuments();
    if (count > 0) {
        console.log("Sources already exist.");
        process.exit(0);
    }
    const docs = [
        { name: "Source A", availableData: 10000, buyingPrice: 2.0, sellingPrice: 5.0 },
        { name: "Source B", availableData: 5000, buyingPrice: 1.2, sellingPrice: 3.5 }
    ];
    await Source_1.default.insertMany(docs);
    console.log("Seeded:", docs);
    await mongoose_1.default.disconnect();
    process.exit(0);
}
seed().catch((err) => {
    console.error(err);
    process.exit(1);
});
