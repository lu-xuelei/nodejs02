let express = require("express");

const app = express();

/**
 * app.get will listen to get requests
 */
app.get("/", (req, res) => {
  res.status(200).send("Hello Express");
});

app.get("/api/numbers", (req, res) => {
  res.status(200).send([1, 2, 3, 4, 5]);
});

app.listen(3000, () => console.log("Listening to port 3000"));
