// import React, { useEffect, useState } from "react";
// import api from "../api";

// type SourceSummary = { _id: string; name: string };
// type SourceDetails = {
//   _id: string;
//   name: string;
//   availableData: number;
//   buyingPrice: number;
//   enrichmentPrice: number;
//   sellingPrice: number;
// };

// const fmt = (n: number) => (Number.isFinite(n) ? n.toFixed(2) : "0.00");

// export default function DataForm() {
//   const [sources, setSources] = useState<SourceSummary[]>([]);
//   const [selectedId, setSelectedId] = useState<string>("");
//   const [source, setSource] = useState<SourceDetails | null>(null);

//   const [noOfData, setNoOfData] = useState<number>(0);
//   const [includeEnrichment, setIncludeEnrichment] = useState<boolean>(false);

//   const [totalCost, setTotalCost] = useState<number>(0);
//   const [profit, setProfit] = useState<number>(0);
//   const [error, setError] = useState<string>("");

//   useEffect(() => {
//     api.get("/api/sources")
//       .then((res: { data: React.SetStateAction<SourceSummary[]>; }) => setSources(res.data))
//       .catch(() => setError("Failed to load sources."));
//   }, []);

//   useEffect(() => {
//     if (!selectedId) {
//       setSource(null);
//       setNoOfData(0);
//       setIncludeEnrichment(false);
//       setTotalCost(0);
//       setProfit(0);
//       setError("");
//       return;
//     }
//     api.get(`/api/sources/${selectedId}`)
//       .then((res: { data: React.SetStateAction<SourceDetails | null>; }) => {
//         setSource(res.data);
//         setNoOfData(0);
//         setIncludeEnrichment(false);
//         setTotalCost(0);
//         setProfit(0);
//         setError("");
//       })
//       .catch(() => setError("Failed to load source details."));
//   }, [selectedId]);

//   useEffect(() => {
//     if (!source) return;

//     if (noOfData < 0) {
//       setError("Number of data cannot be negative.");
//       return;
//     } else if (noOfData > source.availableData) {
//       setError("Requested number exceeds available data.");
//     } else {
//       setError("");
//     }
// console.log(source)
//     const sp = source.sellingPrice;
//     const ep = source.enrichmentPrice;
//     const bp = source.buyingPrice;
//     const units = noOfData;

//     const cost = includeEnrichment ? (sp + ep) * units : sp * units;
//     setTotalCost(cost);

//     const revenue = sp * units;
//     console.log("revenue"+revenue)
//     console.log("cost"+cost)
//     setProfit((sp-bp)*units );
//   }, [source, noOfData, includeEnrichment]);

//   return (
//     <div style={{
//       maxWidth: 720,
//       border: "1px solid #ddd",
//       padding: 16,
//       borderRadius: 8,
//       background: "#fafafa"
//     }}>
//       <div style={{ marginBottom: 12 }}>
//         <label>Source of Data</label>
//         <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
//           <option value="">-- select source --</option>
//           {sources.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
//         </select>
//       </div>

//       {source && (
//         <>
//           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
//             <div>
//               <label>Available No. of Data</label>
//               <div>{source.availableData}</div>
//             </div>
//             <div>
//               <label>Buying Price</label>
//               <div>{fmt(source.buyingPrice)}</div>
//             </div>
//             <div>
//               <label>Enrichment Price</label>
//               <div>
//                 {fmt(source.enrichmentPrice)}{" "}
//                 <input
//                   type="checkbox"
//                   checked={includeEnrichment}
//                   onChange={(e) => setIncludeEnrichment(e.target.checked)}
//                 /> Include
//               </div>
//             </div>
//             <div>
//               <label>Selling Price</label>
//               <div>{fmt(source.sellingPrice)}</div>
//             </div>
//           </div>

//           <div style={{ marginTop: 16 }}>
//             <label>No. of Data</label>
//             <input
//               type="number"
//               value={noOfData}
//               min={0}
//               onChange={(e) => setNoOfData(Number(e.target.value))}
//             />
//           </div>

//           <div style={{ marginTop: 16 }}>
//             <label>Total Buying Cost</label>
//             <div>{fmt(totalCost)}</div>
//           </div>

//           <div>
//             <label>Profit</label>
//             <div>{fmt(profit)}</div>
//           </div>

//           {error && <div style={{ color: "red" }}>{error}</div>}
//         </>
//       )}
//     </div>
//   );
// }












import React, { useEffect, useState } from "react";
import api from "../api";

type SourceSummary = { _id: string; name: string };
type SourceDetails = {
  _id: string;
  name: string;
  availableData: number;
  buyingPrice: number;
  enrichmentPrice: number;
  sellingPrice: number;
};

const fmt = (n: number) => (Number.isFinite(n) ? n.toFixed(2) : "0.00");

export default function DataForm() {
  const [sources, setSources] = useState<SourceSummary[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [source, setSource] = useState<SourceDetails | null>(null);

  const [noOfData, setNoOfData] = useState<number>(0);
  const [includeEnrichment, setIncludeEnrichment] = useState<boolean>(false);
  const [userEnrichment, setUserEnrichment] = useState<number>(0); // <-- new state

  const [totalCost, setTotalCost] = useState<number>(0);
  const [profit, setProfit] = useState<number>(0);
  const [error, setError] = useState<string>("");
  const [delicacy, setDelicacy] = useState<number>(0); // <-- new state


  useEffect(() => {
    api.get("/api/sources")
      .then((res: { data: React.SetStateAction<SourceSummary[]> }) => setSources(res.data))
      .catch(() => setError("Failed to load sources."));
  }, []);

  useEffect(() => {
    if (!selectedId) {
      setSource(null);
      setNoOfData(0);
      setIncludeEnrichment(false);
      setUserEnrichment(0);
      setTotalCost(0);
      setProfit(0);
      setError("");
      return;
    }
    api.get(`/api/sources/${selectedId}`)
      .then((res: { data: React.SetStateAction<SourceDetails | null> }) => {
        setSource(res.data);
        setNoOfData(0);
        setIncludeEnrichment(false);
        setUserEnrichment(0);
        setTotalCost(0);
        setProfit(0);
        setError("");
      })
      .catch(() => setError("Failed to load source details."));
  }, [selectedId]);

  useEffect(() => {
    if (!source) return;

    if (noOfData < 0) {
      setError("Number of data cannot be negative.");
      return;
    } else if (noOfData > source.availableData) {
      setError("Requested number exceeds available data.");
    } else {
      setError("");
    }

    const sp = source.sellingPrice;
    const bp = source.buyingPrice;
    const ep = includeEnrichment ? userEnrichment : 0; // <-- use user input if included
    const units = noOfData;

    let cost = includeEnrichment ? (sp + ep) * units : sp * units;

     // Apply delicacy discount if selected
    if (delicacy > 0) {
      const discount = (cost * delicacy) / 100; // delicacy is percentage
      cost = cost - discount;
    }
    // console.log(cost)
    setTotalCost(cost);

    const revenue =includeEnrichment ? ((sp+userEnrichment)-bp)*units :(sp-bp)*units ;
    setProfit(revenue );
  }, [source, noOfData, includeEnrichment, userEnrichment, delicacy]);

 const handleSubmit = async () => {
  if (!selectedId || noOfData <= 0) {
    alert("Please select a source and enter valid data volume.");
    return;
  }
    try {
    const newAvailableData = source ? source.availableData - noOfData : 0;

    // Prepare the updated object
    const updatedSource = { ...source!, availableData: newAvailableData };

    // Update local state
    setSource(updatedSource);
    setSources(prev =>
      prev.map(s =>
        s._id === selectedId ? updatedSource : s
      )
    );

    // Send updated object in PUT request
    const res = await api.put(`/api/sources/${selectedId}`, updatedSource);
    alert("Source updated successfully!");
    console.log(res.data);

  } catch (err) {
    console.error(err);
    alert("Failed to update source.");
  }
};

  


  return (
    <div style={{
      maxWidth: 720,
      border: "1px solid #ddd",
      padding: 16,
      borderRadius: 8,
      background: "#fafafa"
    }}>
      <div style={{ marginBottom: 12 }}>
        <label>Source of Data</label>
        <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
          <option value="">-- select source --</option>
          {sources.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
        </select>
      </div>

      {source && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label>Available No. of Data</label>
              <div>{source.availableData}</div>
            </div>
            <div>
              <label>Buying Price</label>
              <div>{fmt(source.buyingPrice)}</div>
            </div>
            <div>
              <label>Enrichment</label>
              <div>
                <input
                  type="checkbox"
                  checked={includeEnrichment}
                  onChange={(e) => setIncludeEnrichment(e.target.checked)}
                /> Include
                {includeEnrichment && (
                  <input
                  type="number"
                  placeholder="Enter enrichment cost"
                  value={userEnrichment}
                  step={0.5} // <-- increment/decrement by 0.5
                  onChange={(e) => setUserEnrichment(Number(e.target.value))}
                  style={{ marginLeft: 8 }}
                />
                )}
              </div>
            </div>
            <div>
              <label>Selling Price</label>
              <div>{fmt(source.sellingPrice)}</div>
            </div>
          </div>

          {/* Delicacy Dropdown */}
          <div style={{ marginTop: 16 }}>
            <label>Duplicancy</label>
            <select
              value={delicacy}
              onChange={(e) => setDelicacy(Number(e.target.value))}
              style={{ marginLeft: 8 }}
            >
              <option value={0}>-- select --</option>
              {[...Array(10)].map((_, i) => {
                const val = (i + 1) * 5;
                return <option key={val} value={val}>{val}%</option>;
              })}
            </select>
          </div>

          <div style={{ marginTop: 16 }}>
            <label>Volume of Data</label>
            <input
              type="number"
              value={noOfData}
              min={0}
              onChange={(e) => setNoOfData(Number(e.target.value))}
            />
          </div>

          <div style={{ marginTop: 16 }}>
            <label>Total Buying Cost</label>
            <div>{fmt(totalCost)}</div>
          </div>

          <div>
            <label>Profit</label>
            <div>{fmt(profit)}</div>
          </div>

          {error && <div style={{ color: "red" }}>{error}</div>}
        </>
      )}
 <button
            onClick={handleSubmit}
            style={{
              marginTop: 20,
              width: "100%",
              padding: 12,
              borderRadius: 8,
              background: "#4CAF50",
              color: "#fff",
              fontWeight: 600,
              border: "none",
              cursor: "pointer"
            }}
          >
            Submit
          </button>    </div>
  );
}
