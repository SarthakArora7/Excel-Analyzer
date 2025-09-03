// import { useEffect, useState } from "react";
// import axios from "axios";
// import { Card, CardContent } from "@/components/ui/card";
// import {
//   ResponsiveContainer,
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
// } from "recharts";

// export default function UserDashboard() {
//   const [uploads, setUploads] = useState([]);
//   const [charts, setCharts] = useState([]);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const headers = { Authorization: `Bearer ${token}` };

//     axios
//       .get("http://localhost:5000/api/user/uploads", { headers })
//       .then((res) => setUploads(res.data))
//       .catch((err) => console.error(err));

//     axios
//       .get("http://localhost:5000/api/user/charts", { headers })
//       .then((res) => setCharts(res.data))
//       .catch((err) => console.error(err));
//   }, []);

//   return (
//     <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
//       {/* Upload History */}
//       <Card className="shadow-xl">
//         <CardContent>
//           <h2 className="text-xl font-bold mb-4">Your Uploads</h2>
//           <ul className="space-y-2">
//             {uploads.map((u) => (
//               <li key={u._id} className="border p-2 rounded-lg">
//                 <p>
//                   <strong>File:</strong> {u.filename}
//                 </p>
//                 <p className="text-gray-500 text-sm">
//                   Uploaded: {new Date(u.createdAt).toLocaleString()}
//                 </p>
//               </li>
//             ))}
//           </ul>
//         </CardContent>
//       </Card>

//       {/* Chart History */}
//       <Card className="shadow-xl">
//         <CardContent>
//           <h2 className="text-xl font-bold mb-4">Your Chart History</h2>
//           <ResponsiveContainer width="100%" height={300}>
//             <LineChart data={charts}>
//               <XAxis
//                 dataKey="createdAt"
//                 tickFormatter={(time) => new Date(time).toLocaleDateString()}
//               />
//               <YAxis />
//               <Tooltip />
//               <Line
//                 type="monotone"
//                 dataKey="data.value"
//                 stroke="#8884d8"
//                 strokeWidth={2}
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// -----------------------------------------------------------------------------------------------------------


import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function UserDashboard() {
  const [uploads, setUploads] = useState([]);
  const [charts, setCharts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    axios
      .get("http://localhost:5000/api/user/uploads", { headers })
      .then((res) => setUploads(res.data))
      .catch((err) => console.error(err));

    axios
      .get("http://localhost:5000/api/user/charts", { headers })
      .then((res) => setCharts(res.data))
      .catch((err) => console.error(err));
  }, []);

  // 🔹 Helper to render small preview of chart
  const renderChartPreview = (chart) => {
    const upload = uploads.find((u) => u._id === chart.uploadId);
    if (!upload || !upload.previewRows) {
      return <p className="text-gray-500">Preview not available</p>;
    }

    const sampleData = upload.previewRows.slice(0, 10); // only show first 10 points for preview

    switch (chart.chartType) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={sampleData}>
              <XAxis dataKey={chart.xAxis} hide />
              <YAxis hide />
              <Tooltip />
              <Bar dataKey={chart.yAxis} fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        );
      case "line":
        return (
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={sampleData}>
              <XAxis dataKey={chart.xAxis} hide />
              <YAxis hide />
              <Tooltip />
              <Line
                type="monotone"
                dataKey={chart.yAxis}
                stroke="#82ca9d"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      case "scatter":
        return (
          <ResponsiveContainer width="100%" height={150}>
            <ScatterChart>
              <XAxis dataKey={chart.xAxis} hide />
              <YAxis dataKey={chart.yAxis} hide />
              <Tooltip />
              <Scatter data={sampleData} fill="#ff7300" />
            </ScatterChart>
          </ResponsiveContainer>
        );
      default:
        return <p className="text-gray-500">Preview not available</p>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Upload History */}
      <Card className="shadow-xl">
        <CardContent>
          <h2 className="text-xl font-bold mb-4">Your Uploads</h2>
          <ul className="space-y-2">
            {uploads.map((u) => (
              <li key={u._id} className="border p-2 rounded-lg">
                <p>
                  <strong>File:</strong> {u.filename}
                </p>
                <p className="text-gray-500 text-sm">
                  Uploaded: {new Date(u.createdAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Chart History */}
      <Card className="shadow-xl">
        <CardContent>
          <h2 className="text-xl font-bold mb-4">Your Chart History</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {charts.length === 0 && (
              <p className="text-gray-500">No charts saved yet.</p>
            )}
            {charts.map((chart) => (
              <div
                key={chart._id}
                className="border rounded-lg p-3 shadow-sm bg-gray-50"
              >
                <h3 className="font-semibold text-sm mb-2">
                  {chart.chartType.toUpperCase()} Chart
                </h3>
                {/* <p className="text-xs text-gray-600">
                  Dataset: {chart.datasetName}
                </p> */}
                <p className="text-xs text-gray-600">
                  X: {chart.xAxis} | Y: {chart.yAxis}
                </p>
                <p className="text-xs text-gray-400 mb-2">
                  Saved: {new Date(chart.createdAt).toLocaleString()}
                </p>

                {/* Mini Preview */}
                {renderChartPreview(chart)}

                {/* Actions */}
                <div className="flex gap-2 mt-2">
                  <Button size="sm" variant="destructive">
                    View
                  </Button>
                  {/* <Button size="sm">Download</Button>
                  <Button size="sm" variant="destructive">
                    Delete
                  </Button> */}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
