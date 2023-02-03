const http = require("http");
const mongoose = require("mongoose");
// const { uploadDssv } = require("./models/user.model");
const { saveCard } = require("../src/models/card.model");
const { createAdmin } = require("../src/models/admin.model");
const app = require("../app");
const port = process.env.PORT;
const MONGO_URL =
  "mongodb+srv://519h0127:d99BPAOmLKqVYfkP@final-project.srtxh.mongodb.net/final-project?retryWrites=true&w=majority";

mongoose.connection.once("open", () => {
  console.log("MongoDB connection is ready");
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});

const card1 = {
  cvv: "411",
  expired: "2022-10-10",
  note: "Không giới hạn số lần nạp và số tiền mỗi lần nạp.",
  card_number: "111111",
};

const card2 = {
  cvv: "443",
  expired: "2022-11-11",
  note: "Không giới hạn số lần nạp nhưng chỉ được nạp tối đa 1 triệu/lần",
  card_number: "222222",
};

const card3 = {
  cvv: "577",
  expired: "2022-12-12",
  note: "Khi nạp bằng thẻ này thì luôn nhận được thông báo là “thẻ hết tiền”",
  card_number: "333333",
};

async function loadCards() {
  await saveCard(card1);
  await saveCard(card2);
  await saveCard(card3);
}

const server = http.createServer(app);

async function runServer() {
  await mongoose.connect(MONGO_URL);
  server.listen(port, () => {
    console.log(`Listening on port: ${port}`);
  });

  await createAdmin();
  console.log("Create admin");
  await loadCards();
}

runServer();
