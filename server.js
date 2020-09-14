const express = require("express");
const app = express();
const http = require("http").Server(app);
const port = process.env.PORT || 2002;

app.use(express.static("public"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

http.listen(port, () => {
  console.log("listening on " + port);
});