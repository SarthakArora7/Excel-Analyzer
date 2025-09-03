import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  const onFileChange = (e) => setFile(e.target.files?.[0] || null);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setStatus("Please select an .xls or .xlsx file.");
    try {
      setStatus("Uploading and parsing...");
      const form = new FormData();
      form.append("file", file);

      // attach userId
      const token = localStorage.getItem("token");
    //   if (token) form.append("userId", token);

      const { data } = await API.post("/upload", form, {
        headers: { 
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}` 
        },
      });
      setResult(data);
      setStatus("Done.");
    } catch (err) {
      const msg = err?.response?.data?.error || err.message;
      setStatus(`Error: ${msg}`);
    }
  };

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "40px auto",
        fontFamily: "Inter, system-ui",
      }}
    >
      <h1>Upload Excel</h1>
      <form
        onSubmit={onSubmit}
        style={{ border: "1px solid #ddd", padding: 20, borderRadius: 12 }}
      >
        <input type="file" accept=".xls,.xlsx" onChange={onFileChange} />
        <button type="submit" style={{ marginLeft: 12 }}>
          Upload
        </button>
      </form>

      {status && <p style={{ marginTop: 12 }}>{status}</p>}

      {result && (
        <div style={{ marginTop: 24 }}>
          <h3>Parsed Info</h3>
          <p>
            <b>Upload ID:</b> {result.uploadId}
          </p>
          <p>
            <b>Sheets:</b> {result.sheetNames.join(", ")}
          </p>
          <p>
            <b>Columns:</b> {result.columns.join(", ")}
          </p>
          <p>
            <b>Rows:</b> {result.rowCount}
          </p>

          <h4>Preview (first {result.previewRows.length} rows)</h4>
          <div
            style={{
              overflowX: "auto",
              border: "1px solid #eee",
              borderRadius: 8,
            }}
          >
            <table style={{ borderCollapse: "collapse", width: "100%" }}>
              <thead>
                <tr>
                  {result.columns.map((c, i) => (
                    <th
                      key={i}
                      style={{
                        borderBottom: "1px solid #ddd",
                        textAlign: "left",
                        padding: 8,
                      }}
                    >
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.previewRows.map((row, rIdx) => (
                  <tr key={rIdx}>
                    {result.columns.map((c, cIdx) => (
                      <td
                        key={cIdx}
                        style={{
                          borderBottom: "1px solid #f0f0f0",
                          padding: 8,
                        }}
                      >
                        {row?.[c]?.toString?.() ?? ""}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            style={{ marginTop: 16 }}
            onClick={() => navigate(`/chart/${result.uploadId}`)}
          >
            Continue to Chart Builder →
          </button>
        </div>
      )}
    </div>
  );
}
