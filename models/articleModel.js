const fs = require('fs');
const path = require('path');

const articlesPath = path.join(__dirname, 'data/articles.json');
//console.log(articlesPath)
const getArticles = () => {
  let data = fs.readFileSync(articlesPath);
  data = JSON.parse(data.toString());
  return data;
};
const getArticleById = (id) => {
  const articles = getArticles();
  return articles.find(article => article.id === id);
};

const addArticle = (newArticle) => {
  const articles = getArticles();
  articles.push(newArticle);
  fs.writeFileSync(articlesPath, JSON.stringify(articles, null, 2));
};

const deleteArticle = (id) => {
  let articles = getArticles();
  articles = articles.filter(article => article.id !== parseInt(id));
  fs.writeFileSync(articlesPath, JSON.stringify(articles, null, 2));
};
const updateArticle = (id, article) => {
    // get all articles and replace the article with the given id by the new content, then write in the json file
    let articles = getArticles();
    
    const articleIndex = articles.findIndex(article => article.id == id);
    // Check if an article with the specified id exists
    if(articleIndex !== -1) {
      // Update the article
      articles[articleIndex] = { ...articles[articleIndex], ...article };
      fs.writeFileSync(articlesPath, JSON.stringify(articles, null, 2));
      
    } else {
      console.log('Error');
    }
};

module.exports = {
  getArticles,
  getArticleById,
  addArticle,
  updateArticle,
  deleteArticle
};
