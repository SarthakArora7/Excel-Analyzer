import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement } from "chart.js";
import { Bar, Line, Scatter } from "react-chartjs-2";
import Plot from "react-plotly.js";
import axios from "axios";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement);

export default function ChartBuilder() {
  const { id } = useParams();
  const [upload, setUpload] = useState(null);
  const [xAxis, setXAxis] = useState("");
  const [yAxis, setYAxis] = useState("");
  const [chartType, setChartType] = useState("bar");
  const token = localStorage.getItem("token");

  const saveChart = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/chart/save",
        {
          uploadId: id,
          xAxis: xAxis,
          yAxis: yAxis,
          chartType: chartType,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Chart saved to history!");
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetch(`http://localhost:5000/api/upload/${id}`)
      .then((res) => res.json())
      .then((data) => setUpload(data));
  }, [id]);

  if (!upload) return <div>Loading...</div>;

  const columns = upload.columns || [];
  const dataRows = upload.previewRows || [];

  const labels = dataRows.map(r => r[xAxis]);
  const values = dataRows.map(r => r[yAxis]);

  const chartData = {
    labels,
    datasets: [
      {
        label: `${yAxis} vs ${xAxis}`,
        data: values,
        borderWidth: 1
      }
    ]
  };

  const downloadPNG = () => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "chart.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Chart Builder</h2>

      {/* Dropdowns */}
      <div className="flex gap-4 mb-4">
        <select value={xAxis} onChange={(e) => setXAxis(e.target.value)}>
          <option value="">Select X</option>
          {columns.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select value={yAxis} onChange={(e) => setYAxis(e.target.value)}>
          <option value="">Select Y</option>
          {columns.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={chartType}
          onChange={(e) => setChartType(e.target.value)}
        >
          <option value="bar">Bar</option>
          <option value="line">Line</option>
          <option value="scatter">Scatter</option>
          <option value="3d">3D Scatter</option>
        </select>
      </div>

      {/* Render Chart */}
      {xAxis && yAxis && (
        <div className="mb-4">
          {chartType === "bar" && <Bar data={chartData} />}
          {chartType === "line" && <Line data={chartData} />}
          {chartType === "scatter" && (
            <Scatter
              data={{
                datasets: [
                  {
                    label: `${yAxis} vs ${xAxis}`,
                    data: dataRows.map((r) => ({ x: r[xAxis], y: r[yAxis] })),
                  },
                ],
              }}
            />
          )}
          {chartType === "3d" && (
            <Plot
              data={[
                {
                  x: dataRows.map((r) => r[xAxis]),
                  y: dataRows.map((r) => r[yAxis]),
                  z: dataRows.map((_, i) => i), // fake z-axis for demo
                  mode: "markers",
                  type: "scatter3d",
                },
              ]}
              layout={{ title: "3D Scatter", autosize: true }}
            />
          )}
        </div>
      )}

      {/* Download Button */}
      <button
        onClick={downloadPNG}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Download PNG
      </button>
      <button
        onClick={saveChart}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Save Chart
      </button>
    </div>
  );
}

// -------------------------------------------------------------------------------------------------------------

// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import {
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   LineChart,
//   Line,
//   ScatterChart,
//   Scatter,
//   CartesianGrid,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Legend,
//   ZAxis,
// } from "recharts";
// import Plot from "react-plotly.js";

// export default function ChartBuilder() {
//   const { id } = useParams();
//   const [upload, setUpload] = useState(null);
//   const [xAxis, setXAxis] = useState("");
//   const [yAxis, setYAxis] = useState("");
//   const [chartType, setChartType] = useState("bar");
//   const token = localStorage.getItem("token");

//   const saveChart = async () => {
//     try {
//       await axios.post(
//         "http://localhost:5000/api/chart/save",
//         {
//           uploadId: id,
//           xAxis: xAxis,
//           yAxis: yAxis,
//           chartType: chartType,
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       alert("Chart saved to history!");
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     fetch(`http://localhost:5000/api/upload/${id}`)
//       .then((res) => res.json())
//       .then((data) => setUpload(data));
//   }, [id]);

//   if (!upload) return <div>Loading...</div>;

//   const columns = upload.columns || [];
//   const dataRows = upload.previewRows || [];

//   return (
//     <div className="p-4">
//       <h2 className="text-xl font-bold mb-4">Chart Builder</h2>

//       {/* Dropdowns */}
//       <div className="flex gap-4 mb-4">
//         <select value={xAxis} onChange={(e) => setXAxis(e.target.value)}>
//           <option value="">Select X</option>
//           {columns.map((c) => (
//             <option key={c} value={c}>
//               {c}
//             </option>
//           ))}
//         </select>

//         <select value={yAxis} onChange={(e) => setYAxis(e.target.value)}>
//           <option value="">Select Y</option>
//           {columns.map((c) => (
//             <option key={c} value={c}>
//               {c}
//             </option>
//           ))}
//         </select>

//         <select
//           value={chartType}
//           onChange={(e) => setChartType(e.target.value)}
//         >
//           <option value="bar">Bar</option>
//           <option value="line">Line</option>
//           <option value="scatter">Scatter</option>
//           <option value="3d">3D Scatter</option>
//         </select>
//       </div>

//       {/* Render Chart */}
//       {xAxis && yAxis && (
//         <div className="mb-4">
//           <ResponsiveContainer width="100%" height={400}>
//             {chartType === "bar" && (
//               <BarChart data={dataRows}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey={xAxis} />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Bar dataKey={yAxis} fill="#8884d8" />
//               </BarChart>
//             )}

//             {chartType === "line" && (
//               <LineChart data={dataRows}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey={xAxis} />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Line type="monotone" dataKey={yAxis} stroke="#82ca9d" />
//               </LineChart>
//             )}

//             {chartType === "scatter" && (
//               <ScatterChart>
//                 <CartesianGrid />
//                 <XAxis
//                   dataKey={xAxis}
//                   type={
//                     isNaN(Number(dataRows[0]?.[xAxis])) ? "category" : "number"
//                   }
//                   name={xAxis}
//                 />
//                 <YAxis
//                   dataKey={yAxis}
//                   type={
//                     isNaN(Number(dataRows[0]?.[yAxis])) ? "category" : "number"
//                   }
//                   name={yAxis}
//                 />
//                 <Tooltip cursor={{ strokeDasharray: "3 3" }} />
//                 <Scatter
//                   name={`${yAxis} vs ${xAxis}`}
//                   data={dataRows}
//                   fill="#8884d8"
//                 />
//               </ScatterChart>
//             )}
//           </ResponsiveContainer>

//           {/* Fallback to Plotly for 3D */}
//           {chartType === "3d" && (
//             <Plot
//               data={[
//                 {
//                   x: dataRows.map((r) => r[xAxis]),
//                   y: dataRows.map((r) => r[yAxis]),
//                   z: dataRows.map((_, i) => i), // fake z-axis for now
//                   mode: "markers",
//                   type: "scatter3d",
//                   marker: { size: 4, color: "blue" },
//                 },
//               ]}
//               layout={{ title: "3D Scatter", autosize: true, height: 400 }}
//               style={{ width: "100%" }}
//             />
//           )}
//         </div>
//       )}

//       {/* Action Buttons */}
//       <div className="flex gap-4">
//         <button
//           onClick={saveChart}
//           className="bg-blue-500 text-white px-4 py-2 rounded"
//         >
//           Save Chart
//         </button>
//       </div>
//     </div>
//   );
// }
