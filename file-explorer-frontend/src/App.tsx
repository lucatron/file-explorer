import { useState, useEffect } from "react";

interface FileItem {
  name: string;
  type: "file" | "directory";
  size: number | null;
  createdAt: string;
  modifiedAt: string;
}

export default function App() {
  const [path, setPath] = useState("");
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selected, setSelected] = useState<FileItem | null>(null);

  useEffect(() => {
    fetch(`http://localhost:5001/api/files?path=${path}`)
      .then((res) => res.json())
      .then(setFiles)
      .catch(console.error);
  }, [path]);

  const handleSelect = (name: string) => {
    fetch(`http://localhost:5001/api/file?path=${path}/${name}`)
      .then((res) => res.json())
      .then(setSelected)
      .catch(console.error);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600">

      <div className="w-full max-w-lg bg-white shadow-xl rounded-2xl p-8">

        <h1 className="text-3xl font-extrabold text-gray-800 text-center mb-6">
          📂 File Explorer
        </h1>


        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setPath(path.split("/").slice(0, -1).join("/"))}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            disabled={!path}
          >
            ⬅️ Back
          </button>
          <span className="font-semibold text-gray-700">{path || "/"}</span>
        </div>


        <div className="border rounded-lg p-4 bg-gray-50 shadow-md h-60 overflow-y-auto">
          {files.length > 0 ? (
            <ul className="space-y-2">
              {files.map((file) => (
                <li
                  key={file.name}
                  className="p-3 rounded-lg hover:bg-blue-200 transition cursor-pointer flex items-center text-lg font-medium"
                  onClick={() =>
                    file.type === "directory"
                      ? setPath(`${path}/${file.name}`)
                      : handleSelect(file.name)
                  }
                >
                  {file.type === "directory" ? "📁" : "📄"}{" "}
                  <span className="ml-3">{file.name}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-lg text-center">No files found.</p>
          )}
        </div>


        {selected && (
          <div className="mt-6 border p-5 rounded-lg bg-white shadow-md text-left">
            <h2 className="font-bold text-xl text-gray-900">{selected.name}</h2>
            <p className="text-gray-600">📌 Type: {selected.type}</p>
            {selected.size !== null && <p>📏 Size: {selected.size} bytes</p>}
            <p>📅 Created: {new Date(selected.createdAt).toLocaleString()}</p>
            <p>🔄 Modified: {new Date(selected.modifiedAt).toLocaleString()}</p>
          </div>
        )}
      </div>
    </div>
  );
}
