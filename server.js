const express = require("express");
const app = express();

app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

const fs = require("fs");
const { MongoClient } = require("mongodb");

let db;
const url = fs.readFileSync("secret/dbURL.txt", "utf8");
new MongoClient(url)
  .connect()
  .then((client) => {
    console.log("DB연결성공");
    db = client.db("forum");
    app.listen(8080, () => {
      console.log("http://localhost:8080 에서 서버 실행중");
    });
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", (요청, 응답) => {
  응답.sendFile(__dirname + "/index.html");
});

app.get("/news", (요청, 응답) => {
  응답.send("오늘 비옴");
});

app.get("/list", async (요청, 응답) => {
  let result = await db.collection("post").find().toArray();
  응답.render("list.ejs", { posts: result });
});

app.get("/time", (요청, 응답) => {
  const date = new Date();
  응답.render("time.ejs", {
    h: date.getHours(),
    m: date.getMinutes(),
    s: date.getSeconds(),
  });
});
