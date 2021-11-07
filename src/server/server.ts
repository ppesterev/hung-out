import { createServer } from "http";

const PORT = process.env.PORT || 9001;

const server = createServer((req, res) => {
  if (req.url === "/api") {
    res.end(JSON.stringify({ hello: "world" }));
    return;
  }
  res.writeHead(404);
  res.end();
});

server.listen(PORT, () => console.log(`Listening on ${PORT}`));
