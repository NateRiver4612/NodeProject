const http = require("http");
const mongoose = require("mongoose");
// const { uploadDssv } = require("./models/user.model");

const app = require("./app");
const port = process.env.PORT;
const MONGO_URL =
  "mongodb+srv://519h0127:d99BPAOmLKqVYfkP@final-project.srtxh.mongodb.net/final-project?retryWrites=true&w=majority";

mongoose.connection.once("open", () => {
  console.log("MongoDB connection is ready");
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});

const server = http.createServer(app);

async function runServer() {
  await mongoose.connect(MONGO_URL);
  //   await uploadDssv();
  server.listen(port, () => {
    console.log(`Listening on port: ${port}`);
  });
}

runServer();
