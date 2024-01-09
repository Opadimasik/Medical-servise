const express = require('express');
const app = express();
const path = require('path');
const handlebars = require('express-handlebars');
const host = 'localhost';
const port= 7000;
app.use(express.static('js'));
app.use(express.static('styles'));
app.engine(
    'handlebars',
    handlebars.engine({ defaultLayout: 'main' })
);
app.set('views', './views');
app.set('view engine', 'handlebars');

app.get('/login/', (req, res) => {
    res.render('login', {
        title:'Вход' 
    });
});
app.get('/register/', (req, res) => {
    res.render('register', {
        title:'Регистрация' 
    });
});
app.listen(port,host, function () {
    console.log(`Server listens http://${host}:${port}`);
});