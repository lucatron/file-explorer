"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const ROOT_DIR = "/";
app.get("/api/files", (req, res) => {
    const dirPath = path_1.default.join(ROOT_DIR, req.query.path || "");
    if (!fs_1.default.existsSync(dirPath)) {
        return res.status(404).json({ error: "Directory not found" });
    }
    if (!fs_1.default.lstatSync(dirPath).isDirectory()) {
        return res.status(400).json({ error: "Path is not a directory" });
    }
    try {
        const items = fs_1.default.readdirSync(dirPath).map(item => {
            const itemPath = path_1.default.join(dirPath, item);
            const stats = fs_1.default.statSync(itemPath);
            return {
                name: item,
                type: stats.isDirectory() ? "directory" : "file",
                size: stats.isFile() ? stats.size : null,
                createdAt: stats.birthtime,
                modifiedAt: stats.mtime,
            };
        });
        res.json(items);
    }
    catch (error) {
        res.status(500).json({ error: "Unable to read directory" });
    }
});
app.get("/api/file", (req, res) => {
    const filePath = path_1.default.join(ROOT_DIR, req.query.path || "");
    if (!fs_1.default.existsSync(filePath)) {
        return res.status(404).json({ error: "File or directory not found" });
    }
    try {
        const stats = fs_1.default.statSync(filePath);
        res.json({
            name: path_1.default.basename(filePath),
            type: stats.isDirectory() ? "directory" : "file",
            size: stats.isFile() ? stats.size : null,
            createdAt: stats.birthtime,
            modifiedAt: stats.mtime,
        });
    }
    catch (error) {
        res.status(500).json({ error: "Unable to retrieve file information" });
    }
});
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
