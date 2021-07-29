const mongoose = require("mongoose");
const { Schema } = mongoose;

const articlesSchema = new Schema(
  {
    title: String,
    title: {
      type: String,
      default: "My default title",
      required: true,
    },
    body: String,
    author: String,
    comments: [{ body: String, date: Date }],
    votes: {
      up: Number,
      down: Number,
    },
  },
  {
    timestamps: true,
    versioKey: false,
  }
);

const Article = mongoose.model("Article", articlesSchema);
module.export = Article;
