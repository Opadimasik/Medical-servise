const express = require('express');
const app = express();
const path = require('path');
const handlebars = require('express-handlebars');
const host = 'localhost';
const port= 7000;
app.use(express.static('js'));
app.use(express.static('styles'));
app.use(express.static('images'));
app.use(express.static('embeddedHTML'));
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
app.get('/profile/', (req, res) => {
    res.render('profile', {
        title:'Профиль' 
    });
});
app.get('/patients/', (req, res) => {
    res.render('patients', {
        title:'Пациенты' 
    });
});
app.get('/patient/:id', (req, res) => {
    res.render('patient', {
        title:'Карта пациента' ,
        id: req.params.id
    });
});
app.get('/inspection/create', (req, res) => {
    res.render('inspectionCreate', {
        title:'Создание осмотра' 
    });
});
app.get('/consultations', (req, res) => {
    res.render('consultations', {
        title:'Конссультации' 
    });
});
app.get('/inspection/:id', (req, res) => {
    res.render('inspection', {
        title:'Осмотр' ,
        id: req.params.id
    });
});
app.listen(port,host, function () {
    console.log(`Server listens http://${host}:${port}`);
});