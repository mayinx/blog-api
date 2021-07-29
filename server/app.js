const express = require("express");
const db = require("./lib/db");
const cors = require("cors");

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
  db.findAll()
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

app.post("/articles", validateRequest, (req, res) => {
  db.insert(req.body)
    .then((newArticle) => {
      res.status(201).send(newArticle);
    })
    .catch(() => {
      res.status(500);
      res.json({
        error: "Something went wrong, please try again later",
      });
    });
});

app.get("/articles/:id", (req, res) => {
  const { id } = req.params;
  db.findById(id)
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

  db.updateById(id, req.body)
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

  db.deleteById(id)
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
app.listen(4000, () => {
  console.log("Listening on http://localhost:4000");
});
