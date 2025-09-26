import React, { useCallback, useState } from "react";
import Navbar from "../../components/common/Navbar/Navbar";
import Sidebar from "../../components/common/Siderbar/Sidebar";
import "./Classification.css";
import { useDropzone } from "react-dropzone";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import * as XLSX from "xlsx";

// AG Grid v34+ module registration (ESM/Vite compatible)
import { ModuleRegistry } from "ag-grid-community";
import { ClientSideRowModelModule } from "ag-grid-community";
import { CsvExportModule } from "ag-grid-community";

ModuleRegistry.registerModules([ClientSideRowModelModule, CsvExportModule]);

function Classification() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [error, setError] = useState("");
  const [previewData, setPreviewData] = useState([]);
  const [columnDefs, setColumnDefs] = useState([]);
  const [currentFile, setCurrentFile] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [gridApi, setGridApi] = useState(null);
  const [pageSize] = useState(100); // Always 100 per your request
  const [currentPage, setCurrentPage] = useState(0);

  // Convert file to JSON and use keys for AG Grid columns
  const previewFile = async (fileItem) => {
    try {
      setCurrentFile(fileItem);
      setShowPreview(false);
      let jsonData = [];
      if (fileItem.name.endsWith(".csv")) {
        // Parse CSV as JSON with headers
        const text = await fileItem.file.text();
        const lines = text.split("\n").filter((line) => line.trim());
        if (lines.length === 0) throw new Error("No data found in CSV file");
        const headers = lines[0].split(",").map((h) => h.trim());
        jsonData = lines.slice(1).map((line) => {
          const cells = line.split(",");
          const obj = {};
          headers.forEach((header, idx) => {
            obj[header || `Column${idx + 1}`] = cells[idx] || "";
          });
          return obj;
        });
      } else if (
        fileItem.name.endsWith(".xlsx") ||
        fileItem.name.endsWith(".xls")
      ) {
        // Parse Excel as JSON with headers
        const data = await fileItem.file.arrayBuffer();
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" }); // keys from header row
      } else {
        throw new Error("Unsupported file type");
      }
      if (jsonData.length === 0) throw new Error("No data rows found in file");

      // Use keys from first row for AG Grid columns
      const keys = Object.keys(jsonData[0]);
      const colDefs = keys.map((key) => ({
        field: key,
        headerName: key,
        sortable: true,
        filter: "agTextColumnFilter",
        resizable: true,
        minWidth: 100,
        flex: 1,
      }));

      setColumnDefs(colDefs);
      setPreviewData(jsonData);
      setCurrentPage(0); // Start at first page
      setShowPreview(true);
      setTimeout(() => {
        if (gridApi) {
          gridApi.refreshCells();
          gridApi.sizeColumnsToFit();
        }
      }, 100);
    } catch (error) {
      alert(`Error previewing file: ${error.message}`);
    }
  };

  // Dropzone handler
  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    setError("");
    if (rejectedFiles.length > 0) {
      const rejectedFile = rejectedFiles[0];
      if (
        rejectedFile.errors.some((error) => error.code === "file-invalid-type")
      ) {
        setError("Only Excel files (.xlsx, .xls) and CSV files are allowed!");
      } else if (
        rejectedFile.errors.some((error) => error.code === "file-too-large")
      ) {
        setError("File size must be less than 10MB!");
      } else {
        setError("File upload failed. Please try again.");
      }
      return;
    }
    if (acceptedFiles.length > 0) {
      const newFiles = acceptedFiles.map((file) => ({
        id: Date.now() + Math.random(),
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString(),
      }));
      setUploadedFiles((prev) => [...prev, ...newFiles]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls"],
      "text/csv": [".csv"],
    },
    maxSize: 10 * 1024 * 1024,
    multiple: true,
  });

  const removeFile = (fileId) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId));
    if (currentFile && currentFile.id === fileId) {
      setShowPreview(false);
      setCurrentFile(null);
      setPreviewData([]);
      setColumnDefs([]);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const processFiles = () => {
    if (uploadedFiles.length === 0) {
      alert("Please upload at least one file to process.");
      return;
    }
    alert(`Processing ${uploadedFiles.length} file(s)...`);
    setTimeout(() => {
      alert("Files processed successfully!");
    }, 2000);
  };

  const closePreview = () => {
    setShowPreview(false);
    setCurrentFile(null);
    setPreviewData([]);
    setColumnDefs([]);
  };

  // Test function with sample data
  const testGridWithSampleData = () => {
    const sampleData = [
      { Name: "John", Age: "30", Job: "Engineer", City: "New York" },
      { Name: "Jane", Age: "25", Job: "Designer", City: "Los Angeles" },
      { Name: "Bob", Age: "35", Job: "Manager", City: "Chicago" },
      { Name: "Alice", Age: "28", Job: "Developer", City: "Seattle" },
      { Name: "Charlie", Age: "42", Job: "Director", City: "Boston" },
    ];
    const sampleColumns = Object.keys(sampleData[0]).map((key) => ({
      field: key,
      headerName: key,
      sortable: true,
      filter: "agTextColumnFilter",
      flex: 1,
    }));
    setColumnDefs(sampleColumns);
    setPreviewData(sampleData);
    setShowPreview(true);
    setCurrentFile({ name: "Sample Data Test" });
    setTimeout(() => {
      if (gridApi) {
        gridApi.refreshCells();
        gridApi.sizeColumnsToFit();
      }
    }, 100);
  };

  const onGridReady = (params) => {
    setGridApi(params.api);
    if (previewData.length > 0) {
      setTimeout(() => {
        params.api.sizeColumnsToFit();
      }, 100);
    }
  };

  // Paging logic
  const totalPages = Math.ceil(previewData.length / pageSize);
  const pagedData = previewData.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  return (
    <div className="classification-container">
      <Navbar />
      <Sidebar />
      <main className="classification-content">
        <div className="classification-header">
          <h1>Auto Classification</h1>
          <p>Upload Excel or CSV files for automatic data classification</p>
        </div>

        <div className="classification-main">
          <div className="upload-section">
            <h3>Upload Your Data Files</h3>
            <div
              {...getRootProps()}
              className={`upload-area ${isDragActive ? "drag-active" : ""} ${
                error ? "error" : ""
              }`}
            >
              <input {...getInputProps()} />
              <div className="upload-icon">📊</div>
              {isDragActive ? (
                <p>Drop the files here...</p>
              ) : (
                <div className="upload-text">
                  <p>
                    <strong>Drag and drop Excel/CSV files here</strong>
                  </p>
                  <p>
                    or <span className="upload-link">click to browse</span>
                  </p>
                  <p className="file-types">Supported: .xlsx, .xls, .csv</p>
                  <p className="file-limit">Max file size: 10MB</p>
                </div>
              )}
            </div>

            {error && <div className="error-message">⚠️ {error}</div>}

            {uploadedFiles.length > 0 && (
              <div className="uploaded-files">
                <h4>Uploaded Files ({uploadedFiles.length})</h4>
                <div className="file-list">
                  {uploadedFiles.map((fileItem) => (
                    <div key={fileItem.id} className="file-item">
                      <div className="file-info">
                        <div className="file-icon">
                          {fileItem.name.endsWith(".xlsx") ||
                          fileItem.name.endsWith(".xls")
                            ? "📗"
                            : fileItem.name.endsWith(".csv")
                            ? "📄"
                            : "📊"}
                        </div>
                        <div className="file-details">
                          <div className="file-name">{fileItem.name}</div>
                          <div className="file-meta">
                            {formatFileSize(fileItem.size)} •{" "}
                            {new Date(fileItem.uploadedAt).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                      <div className="file-actions">
                        <button
                          className="preview-btn"
                          onClick={() => previewFile(fileItem)}
                          title="Preview file"
                        >
                          👁️ Preview
                        </button>
                        <button
                          className="remove-file"
                          onClick={() => removeFile(fileItem.id)}
                          title="Remove file"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="process-section">
                  <button className="process-btn" onClick={processFiles}>
                    🚀 Process Files ({uploadedFiles.length})
                  </button>
                </div>
              </div>
            )}
          </div>

          {showPreview && pagedData.length > 0 && columnDefs.length > 0 && (
            <div className="preview-section">
              <div className="preview-header">
                <h3>📋 File Preview: {currentFile?.name}</h3>
                <div className="preview-info">
                  <span>
                    Showing rows {currentPage * pageSize + 1} -{" "}
                    {Math.min((currentPage + 1) * pageSize, previewData.length)}{" "}
                    of {previewData.length}
                  </span>
                  <button className="close-preview" onClick={closePreview}>
                    ✕ Close Preview
                  </button>
                </div>
              </div>
              {/* Pagination Controls */}
              <div
                style={{
                  padding: "1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 0))}
                  disabled={currentPage === 0}
                >
                  ◀ Prev
                </button>
                <span>
                  Page {currentPage + 1} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages - 1))
                  }
                  disabled={currentPage >= totalPages - 1}
                >
                  Next ▶
                </button>
              </div>
              <div className="ag-theme-alpine preview-grid">
                <AgGridReact
                  key={currentPage} // <-- This forces AG Grid to re-render on page change
                  rowData={pagedData}
                  columnDefs={columnDefs}
                  defaultColDef={{
                    sortable: true,
                    filter: "agTextColumnFilter",
                    resizable: true,
                    minWidth: 100,
                    flex: 1,
                  }}
                  pagination={false} // AG Grid pagination off, using custom paging
                  animateRows={true}
                  enableCellTextSelection={true}
                  suppressHorizontalScroll={false}
                  onGridReady={onGridReady}
                  suppressMenuHide={true}
                  enableRangeSelection={true}
                />
              </div>
            </div>
          )}

          <div className="results-section">
            <h3>Classification Results</h3>
            <div className="results-placeholder">
              {uploadedFiles.length > 0 ? (
                <div>
                  <p>📋 {uploadedFiles.length} file(s) ready for processing</p>
                  <p>
                    Click "Preview" to view file contents or "Process Files" to
                    start classification
                  </p>
                </div>
              ) : (
                <div>
                  <p>📈 Results will appear here after processing</p>
                  <p>Upload Excel or CSV files to get started</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Classification;
