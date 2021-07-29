const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Article = require("./models/article.js");

/*
  We create an express app calling
  the express function.
*/
const app = express();

/*
  We setup middleware to:
  - parse the body of the request to json for us
  https://expressjs.com/en/guide/using-middleware.html

  Application Level Middleware
*/

app.use(cors());
app.use(express.json());
app.use(function logRequests(req, res, next) {
  console.log(new Date().toString());
  console.log(`${req.method} ${req.url}`);
  next();
});

/* CUSTOM MIDDLEWARE */
function validateRequest(req, res, next) {
  if (!req.body.title) {
    res.status(400).json({
      error: "Request body must contain a title property",
    });
    return;
  }
  if (!req.body.body) {
    res.status(400).json({
      error: "Request body must contain a body property",
    });
    return;
  }

  next();
}

/*
  Endpoint to handle GET requests to the root URI "/"
*/
app.get("/", (req, res) => {
  res.json({
    "/articles": "read and create new articles",
    "/articles/:id": "read, update and delete an individual article",
  });
});

app.get("/articles", (req, res) => {
  Article.find({})
    .then((articles) => {
      res.send(articles);
    })
    .catch(() => {
      res.status(500);
      res.json({
        error: "Something went wrong, please try again later",
      });
    });
});

app.post("/articles", validateRequest, (req, res) => {
  Article.create(req.body)
    .then((newArticle) => {
      res.status(201).send(newArticle);
    })
    .catch((error) => {
      console.log("Nohooo", error);
      res.status(500);
      res.json(error);
    });
  // db.insert(req.body)
  //   .then((newArticle) => {
  //     res.status(201).send(newArticle);
  //   })
  //   .catch(() => {
  //     res.status(500);
  //     res.json({
  //       error: "Something went wrong, please try again later",
  //     });
  //   });
});

app.get("/articles/:id", (req, res) => {
  const { id } = req.params;
  Article.findById(id)
    .then((article) => {
      if (!article) {
        res.status(404).end();
        return;
      }
      res.send(article);
    })
    .catch(() => {
      res.status(500);
      res.json({
        error: "Something went wrong, please try again later",
      });
    });
});

app.patch("/articles/:id", (req, res) => {
  const { id } = req.params;

  // db.updateById(id, req.body)
  // Article.updateOne({ _id: id }, req.body)
  Article.findByIdAndUpdate(id, req.body, { new: true })
    .then((updatedPost) => {
      if (!updatedPost) {
        res.status(404).end();
        return;
      }
      res.send(updatedPost);
    })
    .catch(() => {
      res.status(500);
      res.json({
        error: "Something went wrong, please try again later",
      });
    });
});

app.delete("/articles/:id", (req, res) => {
  const { id } = req.params;

  // db.deleteById(id)
  Article.findByIdAndDelete(id)
    .then(() => {
      res.status(204).end();
    })
    .catch(() => {
      res.status(500);
      res.json({
        error: "Something went wrong, please try again later",
      });
    });
});

/*
  We have to start the server. We make it listen on the port 4000

*/
mongoose
  .connect("mongodb://localhost:27017/blog-api", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Connecteed to mongo");
    app.listen(4000, () => {
      console.log("Listening on http://localhost:4000");
    });
  })
  .catch((error) => {
    console.error(error);
  });
