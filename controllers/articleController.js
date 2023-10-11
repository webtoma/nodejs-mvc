const { getArticles } = require('../models/articleModel');
const { getArticleById } = require('../models/articleModel');
const { addArticle } = require('../models/articleModel');
const { deleteArticle } = require('../models/articleModel');
const { updateArticle } = require('../models/articleModel');

exports.getAllArticles = (req, res) => {
    const articles = getArticles();
    res.render('index', { articles });
};
exports.getArticle = (req, res) => {
  const article = getArticleById(parseInt(req.params.id));
  if (!article) {
    return res.status(404).send('Article not found');
  }
  res.render('article', { article });
};
exports.addArticle = (req, res) => {
    if (req.body.title && req.body.content) {
        addArticle({
            id: parseInt(Date.now()),
            title: req.body.title,
            content: req.body.content
        });
        res.redirect('/');
    } else {
        res.render('addarticle');
    }
};
exports.updateArticle = (req, res) => {
    if (req.body.title && req.body.content) {
        article = {
            id: parseInt(req.params.id),
            title: req.body.title,
            content: req.body.content
        }
        updateArticle(parseInt(req.params.id), article);
        res.redirect('/articles/' + parseInt(req.params.id));
    } else {
        res.render('updatearticle', {article: getArticleById(parseInt(req.params.id))});
    }
};
exports.deleteArticle = (req, res) => {
  deleteArticle(parseInt(req.params.id));
  res.redirect('/');
};