import express, { Application, Request, Response } from "express";
import cors from "cors";
import fs from "fs";
import path from "path";


const app: Application = express();
app.use(cors());

// Define the root  
const ROOT_DIR = "/";


app.get("/api/files", (req: Request, res: Response): void => {
    const dirPath = path.join(ROOT_DIR, req.query.path as string || "");

    if (!fs.existsSync(dirPath)) {
        res.status(404).json({ error: "Directory not found" });
        return;
    }

    if (!fs.lstatSync(dirPath).isDirectory()) {
        res.status(400).json({ error: "Path is not a directory" });
        return;
    }

    try {
        const items = fs.readdirSync(dirPath).map(item => {
            const itemPath = path.join(dirPath, item);
            const stats = fs.statSync(itemPath);

            return {
                name: item,
                type: stats.isDirectory() ? "directory" : "file",
                size: stats.isFile() ? stats.size : null,
                createdAt: stats.birthtime,
                modifiedAt: stats.mtime,
            };
        });

        res.json(items);
    } catch (error) {
        res.status(500).json({ error: "Unable to read directory" });
    }
});


app.get("/api/file", (req: Request, res: Response): void => {
    const filePath = path.join(ROOT_DIR, req.query.path as string || "");

    if (!fs.existsSync(filePath)) {
        res.status(404).json({ error: "File or directory not found" });
        return;
    }

    try {
        const stats = fs.statSync(filePath);
        res.json({
            name: path.basename(filePath),
            type: stats.isDirectory() ? "directory" : "file",
            size: stats.isFile() ? stats.size : null,
            createdAt: stats.birthtime,
            modifiedAt: stats.mtime,
        });
    } catch (error) {
        res.status(500).json({ error: "Unable to retrieve file information" });
    }
});


const PORT = 5001;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
