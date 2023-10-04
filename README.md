# Building and Structuring a Node.js MVC Application

## Introduction

In this exercise, we'll be exploring the principles of MVC (Model-View-Controller) and learning how to structure a Node.js application using the MVC pattern.

## Objectives

- Understand the concept of MVC and its benefits.
- Set up a Node.js project.
- Structure your Node.js application with MVC architecture.
- Develop a basic CRUD application using the MVC pattern.

## Prerequisites

- Basic understanding of Node.js.
- [Node.js](https://nodejs.org/en/download/) installed on your system.
- A code editor (like [VSCode](https://code.visualstudio.com/download)).

# Step-by-step Instructions

## 1. Project Initialization:

1. Create a new directory for your project:
   ```
   mkdir node-mvc-app
   cd node-mvc-app
   ```

2. Initialize a new Node.js application:
   ```
   npm init
   ```

## 2. Install Required Packages:

1. Using npm, install the necessary packages:
    ```
    npm install express body-parser fs ejs
    ```

## 3. Organize the MVC structure
```bash
node-mvc-app
│
├── models/
├── views/
├── controllers/
└── server.js
```

## 4. Develop the Model with JSON Files:

Instead of using Mongoose and MongoDB to store our data, we will utilize JSON files as our "database". This can be a straightforward method for handling data in smaller applications or for educational purposes.

### Step 4.1: Directory and File Setup
- Inside your `models` directory, create a JSON file that will store your data. For instance, `articles.json`:
  ```json
  [
    {
      "id": 1,
      "title": "Article 1",
      "content": "Content of the first article."
    },
    {
      "id": 2,
      "title": "Article 2",
      "content": "Content of the second article."
    }
  ]
    ```
### Step 4.2: Data Handling Module
- Create a JavaScript file that will act as a model and manage data interactions (fetching, adding, deleting) with your JSON file, say, `articleModel.js`.

- Here's a basic example with functionalities to get all articles, get a specific article, add an article, and delete an article:

```javascript
const fs = require('fs');
const path = require('path');

const articlesPath = path.join(__dirname, 'articles.json');

const getArticles = () => {
  const data = fs.readFileSync(articlesPath);
  return JSON.parse(data);
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
  articles = articles.filter(article => article.id !== id);
  fs.writeFileSync(articlesPath, JSON.stringify(articles, null, 2));
};

module.exports = {
  getArticles,
  getArticleById,
  addArticle,
  deleteArticle
};

```
#### Explanation:
- `fs (File System)` module is used to interact with the file system and manipulate (read/write) files.
- `path module` provides utilities for working with file and directory paths.
- `articlesPath` gets the path to your JSON file.
- `getArticles` fetches all articles from the JSON file.
- `getArticleById` retrieves a specific article by its ID.
- `addArticle` writes a new article to the JSON file.
- `deleteArticle` removes an article with a specific ID from the JSON file.

## 5. Design the Views:
Within the views directory, design your templates. You can use EJS or any template engine of your choice.

### Step 5.1: Setup EJS
In your server.js, set EJS as the view engine for your Express application:
```javascript
const express = require('express');
const app = express();

app.set('view engine', 'ejs');
```

### Step 5.2: Designing Basic Views
Inside your views directory, create EJS templates. Common templates might include a homepage, a form for adding new articles, and a detail view for reading articles.

Here is the `index.ejs` file: 
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Articles</title>
</head>
<body>
    <h1>All Articles</h1>
    <ul>
        <% articles.forEach(article => { %>
            <li>
                <a href="/articles/<%= article.id %>"><%= article.title %></a>
            </li>
        <% }); %>
    </ul>
    <a href="/articles/new">Add New Article</a>
</body>
</html>

```
... the `article.ejs`...
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><%= article.title %></title>
</head>
<body>
    <h1><%= article.title %></h1>
    <p><%= article.content %></p>
    <a href="/">Back to Homepage</a>
</body>
</html>

```

and the `addarticle.ejs`:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Add Article</title>
</head>
<body>
    <h1>Add New Article</h1>
    <form action="/articles" method="POST">
        <label for="title">Title:</label>
        <input type="text" name="title" required><br>
        <label for="content">Content:</label>
        <textarea name="content" required></textarea><br>
        <button type="submit">Add Article</button>
    </form>
</body>
</html>
```
#### Explanation: 
- EJS templates use <%= %> to output data and <% %> for logic like loops or conditionals.
- Ensure to setup your routes and controllers to render these views, pass the necessary data to them, and handle form submissions.
- Remember to provide navigation options, like links to go back or to add new articles, enhancing user experience.
- Optionally, include CSS or Bootstrap to style your pages and make them more visually appealing.

## 6. Implement the Controller:
### Step 6.1: Basic Controller Setup
- In your controllers directory, create a JavaScript file, such as `articleController.js`.
- Your controller will export methods that handle various HTTP requests. Each method interacts with the model, possibly renders a view, and returns an HTTP response.

### Step 6.2: Implementing Controller Methods
#### Get All Articles 
- Implement a method to fetch and display all articles:
```javascript
const { getArticles } = require('../models/articleModel');

exports.getAllArticles = (req, res) => {
  const articles = getArticles();
  res.render('index', { articles });
};
```
- `getArticles` is imported from the model to retrieve all articles.
- `res.render('index', { articles })` renders the `index.ejs` view and passes the articles to it.

#### Get a Specific Article
- Implement a method to fetch and display a single article:
```javascript
const { getArticleById } = require('../models/articleModel');

exports.getArticle = (req, res) => {
  const article = getArticleById(parseInt(req.params.id));
  if (!article) {
    return res.status(404).send('Article not found');
  }
  res.render('detail', { article });
};
```
- `getArticleById` is used to retrieve a specific article by ID.
- If the article isn't found, a 404 response is sent.
- If found, the `detail.ejs` view is rendered and passed the article.

#### Add a New Article
- Implement a method to add a new article:
```javascript
const { addArticle } = require('../models/articleModel');

exports.addArticle = (req, res) => {
  const newArticle = {
    id: Date.now(),
    title: req.body.title,
    content: req.body.content
  };
  addArticle(newArticle);
  res.redirect('/');
};
```
- `newArticle` object gathers data from `req.body` (form data should be parsed using middleware, e.g., express.urlencoded()).
- `addArticle` is used to add the new article to the JSON file.
- After adding, it redirects to the homepage.


#### Delete an Article
- Implement a method to delete an article:
```javascript
const { deleteArticle } = require('../models/articleModel');

exports.deleteArticle = (req, res) => {
  deleteArticle(parseInt(req.params.id));
  res.redirect('/');
};
```
- `deleteArticle` is used to remove the article from the JSON file based on its ID.
- It redirects to the homepage after deletion.

### Step 6.3: Error Handling
Ensure to implement basic error handling, for instance, if data needed to render a view is not available, handle such scenarios gracefully by rendering an error page or redirecting with an error message.

#### Notes:
- Ensure your controller methods are appropriately hooked up to your routes.
- Be mindful of HTTP status codes and return appropriate ones for different scenarios.
- Implement validation and sanitize user inputs in methods handling POST requests to prevent potential issues.


## 7. Bring it all together in server.js:

In an Express.js application, routes define the endpoints and HTTP methods that the application should respond to. Routes pass the incoming requests to the specified controller methods which manage the underlying business logic.

### Step 7.1: Set Up Routing File
- Create a routes directory and create a routing file inside it, for example, `articleRoutes.js`.
- This file will import your controller methods and define your application’s endpoints.

### Step 7.2: Basic Routing
#### Import Dependencies and Controller
- In `articleRoutes.js`, import Express and your controller.
```javascript
const express = require('express');
const {
  getAllArticles,
  getArticle,
  addArticle,
  deleteArticle
} = require('../controllers/articleController');
```

#### Instantiate a router object:
```javascript
const router = express.Router();
```
#### Define Routes
- Map your HTTP methods and endpoints to specific controller methods.
#### Get All Articles
- Route to get and display all articles.
```javascript
router.get('/', getAllArticles);
```
- It maps GET requests to the application’s root ('/') to the `getAllArticles` method.

#### Get a Specific Article
- Route to get and display a single article.
```javascript
router.get('/articles/:id', getArticle);
```
- `:id` is a route parameter, allowing you to access the specified ID via `req.params.id` in your controller.

#### Add a New Article
- Route to add a new article.
```javascript
router.post('/articles', addArticle);
```
- It maps POST requests to `/articles` to the `addArticle` method.

#### Delete an Article
- Route to delete an article.
```javascript
router.delete('/articles/:id', deleteArticle);
```
- It maps DELETE requests to `/articles/:id` to the `deleteArticle` method.

### Step 7.3: Middleware for Parsing Request Bodies
- Ensure that your application is set to parse incoming request bodies, which is necessary for POST and PUT requests.
```javascript
// In your main server file (e.g., app.js or server.js):
const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
```
- `express.urlencoded()` is middleware to parse URL-encoded bodies, commonly sent by HTML forms.
- `express.json()` is middleware to parse incoming JSON payloads.

### Step 7.4: Integrate Routes into App
- Import and use your routes in your main server file.
```javascript
const articleRoutes = require('./routes/articleRoutes');
app.use('/', articleRoutes);
```
- It makes your application use the defined routes for incoming requests.


#### Notes:
- Ensure your routes are modular and maintainable, especially for larger applications.
- Be mindful of HTTP status codes and potential error handling within your routes and controllers.
- Protect routes as necessary (e.g., with middleware for authentication and authorization).
- Always validate and sanitize incoming data, especially if it’s used to interact with a data store.



## 8. Run the Application:
With everything in place, run your Node.js application:
```javascript
node server.js
```
- Visit the application in your web browser at [http://localhost:YOUR_PORT_NUMBER](http://localhost:YOUR_PORT_NUMBER).



## Challenges (Optional)
- Implement user authentication.
- Add more models and relationships (e.g., users and their articles).
- Add input validation and error handling.


## Further Reading
- [Express documentation](https://expressjs.com/)
- [EJS documentation](https://ejs.co/#docs)

## Conclusion
By the end of this exercise, you should have a functional CRUD application structured using the MVC pattern in Node.js. This architecture will make it easier for you to maintain and scale your application.