const express = require('express');
const {
  getAllArticles,
  getArticle,
  addArticle,
  updateArticle,
  deleteArticle
} = require('./controllers/articleController');

const router = express.Router();

router.get('/', getAllArticles);

router.get('/articles/new', addArticle);
router.post('/articles/new', addArticle);

router.get('/articles/:id', getArticle);

router.get('/articles/update/:id', updateArticle);
router.post('/articles/update/:id', updateArticle);

router.get('/articles/delete/:id', deleteArticle);

module.exports = router;