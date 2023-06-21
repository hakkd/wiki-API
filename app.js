import express from "express";
import bodyParser from "body-parser";
import ejs from "ejs";
import mongoose from "mongoose";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/wikiDB');

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model('Article', articleSchema);

app.get("/articles", (req, res) => {
    Article.find({}).then((articles) => {
        res.send(articles);
    }).catch((err) => {res.send(err);});
});

app.post("/articles", (req, res) => {
    const title = req.body.title;
    const content = req.body.content;

    const newArticle = new Article({title: title, content: content});

    newArticle.save();

});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});