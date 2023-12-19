const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

const app =  express();

//Seteamos el motor de plantillas
app.set('view engine', 'ejs');

//seteamos la carpeta Public para archivos estáticos
app.use(express.static('public'));

//para poder procesar datos enviados desde forms
app.use(express.urlencoded({extended:true}));
app.use(express.json());
//Seteamos las variables de entorno
dotenv.config({path: './env/.env'});

//Para poder trabajar con las cookies
app.use(cookieParser());

//Llamar al router
app.use('/', require('./routes/router.js'));

app.listen(3000, ()=>{
    console.log("Escuchando en puerto 3000");
} )