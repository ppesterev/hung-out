import { createServer } from "http";

import serveStaticFiles from "./serve-static-files";

const PORT = process.env.PORT || 9001;

const server = createServer((req, res) => {
  return serveStaticFiles(req, res);
});

server.listen(PORT, () => console.log(`Listening on ${PORT}`));
