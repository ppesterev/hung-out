import { RequestListener } from "http";
import path from "path";
import { readFile } from "fs/promises";

import { contentType } from "mime-types";

const PUBLIC_PATH = "dist/public";

const serveStaticFiles: RequestListener = (req, res) => {
  const requestPath = new URL(req.url!, `http://${req.headers.host}`).pathname;

  const filename = path.basename(requestPath) || "index.html";
  const filepath = path.join(PUBLIC_PATH, path.dirname(requestPath), filename);

  const extension = path.extname(filepath);
  const mimeType = contentType(extension) || "application/octet-stream";

  console.log({ requestPath, filename, filepath, extension, mimeType });

  readFile(filepath)
    .then((data) => {
      res.writeHead(200, { "Content-Type": mimeType });
      res.end(data);
    })
    .catch(() => {
      res.writeHead(404);
      res.end("File not found");
    });
};

export default serveStaticFiles;
