import { RequestListener } from "http";
import path from "path";
import { readFile } from "fs/promises";

const PUBLIC_PATH = "dist/public";

const mimeTypes: { [index: string]: string } = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript"
};

const serveStaticFiles: RequestListener = (req, res) => {
  const filename = path.basename(req.url!) || "index.html";
  const filepath = path.join(PUBLIC_PATH, path.dirname(req.url!), filename);
  readFile(filepath)
    .then((data) => {
      res.writeHead(200, {
        "Content-Type": mimeTypes[path.extname(filepath)] || "text/plain"
      });
      res.end(data);
    })
    .catch(() => {
      res.writeHead(404);
      res.end("File not found");
    });
};

export default serveStaticFiles;
