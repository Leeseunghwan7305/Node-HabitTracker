const express = require("express");
const app = express();
let bodyParser = require("body-parser");
require("dotenv").config();
const e = require("cors");
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
const MongoClient = require("mongodb").MongoClient;
let db;
MongoClient.connect(process.env.DB_URL, function (error, client) {
  //연결되면 할일
  if (error) {
    return console.log(error);
  }
  db = client.db("TODO");

  app.listen(process.env.PORT, function () {
    console.log("성공");
  });
});

app.get("/board", (req, res, next) => {
  db.collection("DATA")
    .find()
    .toArray((req, data) => {
      res.send(data);
    });
});
app.post("/board", (req, res, next) => {
  let post = req.body;
  console.log(post);
  db.collection("counter").findOne(
    { name: "게시물갯수" },
    function (error, result) {
      console.log(result);
      let totalNumber = result.totalPost;
      db.collection("DATA").insertOne(
        {
          _id: totalNumber + 1,
          input: false,
          todo: req.body.todo,
          date: req.body.date,
        },
        function (erorr, result) {
          console.log("저장완료");
          db.collection("counter").updateOne(
            { name: "게시물갯수" },
            { $inc: { totalPost: 1 } },
            function (error, result) {
              if (error) {
                return console.log(error);
              }
            }
          );
        }
      );
    }
  );
  res.send(post);
}); //생성했을때 text, todo 받아오기
app.put("/board/:id", (req, res, next) => {
  req.params.id = parseInt(req.params.id);
  console.log(req.params.id);
  db.collection("DATA").findOne(
    { _id: req.params.id },
    function (error, result) {
      console.log(result);
      db.collection("DATA").updateOne(
        {
          _id: req.params.id,
        },
        { $set: { input: !result.input } },
        function (error, result) {
          db.collection("DATA")
            .find()
            .toArray((req, data) => {
              res.send(data);
            });
        }
      );
    }
  );
});
app.delete("/board", (req, res, next) => {
  req.body._id = parseInt(req.body._id);
  console.log(req.body);
  db.collection("DATA").deleteOne(req.body, function (error, result) {
    console.log("삭제완료!");
    res.status(200).send({ message: "성공했습니다" });
  });
}); //아이디를 가져와서 삭제하기
