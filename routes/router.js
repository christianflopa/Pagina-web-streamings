const express = require('express');
const router = express.Router();

//Requerimos el controlador
const authController =  require('../controllers/authController.js');

//Router para las VISTAS
router.get('/', authController.isAuthenticated, (req, res)=>{
    res.render('index.ejs');
})

router.get('/login', (req, res)=>{
    res.render('login.ejs', {alert:false});
})

router.get('/register', (req, res)=>{
    res.render('register.ejs');
})

router.get('/stream',authController.isAuthenticated, (req, res)=>{
    res.render('stream.ejs');
})
//Router para los MÉTODOS del CONTROLLER
router.post('/register', authController.register)
router.post('/login', authController.login)
router.get('/logout', authController.logout)
module.exports = router;