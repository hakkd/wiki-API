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

app.route("/articles")
    .get((req, res) => {
        Article.find({})
            .then((articles) => {res.send(articles);})
            .catch((err) => {res.send(err);});
    })
    .post((req, res) => {
        const title = req.body.title;
        const content = req.body.content;
        const newArticle = new Article({title: title, content: content});
        newArticle.save();
    })
    .delete((req, res) => {
        Article.deleteMany({})
            .then(() => res.send("Deleted all articles"))  
            .catch((err) => res.send(err));
    });

app.route("/articles/:articleTitle")
    .get((req, res) => {
        Article.findOne({title: req.params.articleTitle})
            .then((article) => {res.send(article);})
            .catch((err) => {res.send(err);});
    })
    .put((req, res) => {
        Article.updateOne(
            {title: req.params.articleTitle},
            {$set: {title: req.body.title, content: req.body.content}},
            {overwrite : true},
        ).then(() => {res.send("Updated article")}).catch((err) => {res.send(err)});
    })
    .patch((req, res) => {
        Article.updateOne(
            {title: req.params.articleTitle},
            {$set: req.body},
            {overwrite : true},
        ).then(() => {res.send("Updated article")}).catch((err) => res.send(err));
    })
    .delete((req, res) => {
        Article.deleteOne({title: req.params.articleTitle})
            .then(() => res.send("Deleted " + req.params.articleTitle))
            .catch((err) => res.send(err));
    });

app.listen(3000, function() {
  console.log("Server started on port 3000");
});