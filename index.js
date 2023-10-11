const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');
const articleRoutes = require('./router');
app.use('/', articleRoutes);

const PORT = process.env.PORT || 4111;
app.listen(PORT, console.log("Server has started at port " + PORT))