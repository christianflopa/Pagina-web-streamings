const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const conexion = require('../database/db.js');
const {promisify} =  require('util');
const { redirect } = require('express/lib/response.js');

exports.register = async (req, res)=>{
    try {
        const name = req.body.name
        const user = req.body.user
        const email = req.body.email
        const password = req.body.password
        let passwordHash =  await bcryptjs.hash(password, 8);  
        
        conexion.query('INSERT INTO users SET ?', {nombre: name, usuario: user, email: email, password: passwordHash}, (error, results)=>{
            if(error){console.log(error)}
            res.redirect('/')
        })
    } catch (error) {
        console.log(error);
    }
}

exports.login = async (req, res)=>{
    try {
        const user = req.body.user
        const password =  req.body.password
        
        if(!user || !password){
            res.render('login', {
                alert:true,
                alertTitle: 'Advertencia',
                alertMessage: 'Debe ingresar un Usuario y Contraseña',
                ruta: 'login'
            })
        } else {
            conexion.query('SELECT *  FROM users WHERE usuario = ?', [user], async (error, results)=>{
                if(results.length == 0 || !(await bcryptjs.compare(password, results[0].password))){
                    res.render('login', {
                        alert:true,
                        alertTitle: 'Error',
                        alertMessage: 'Usuario y/o Contraseña son incorrectos',
                        ruta: 'login'
                    })
                } else {
                    //Inicio de sesión OK
                    const id = results[0].id
                    const token = jwt.sign({id:id}, process.env.JWT_SECRETO, {
                        expiresIn: process.env.JWT_TIEMPO_EXPIRA,
                    })
                    const cookiesOptions = {
                        maxAge: process.env.JWT_COOKIE_EXPIRA * 24 * 60 * 60 * 1000, // Duración en milisegundos
                        httpOnly: true,
                      };
                    res.cookie('jwt', token, cookiesOptions)
                    res.render('login',{
                        alert:true,
                        alertTitle: 'Conexión Exitosa',
                        alertMessage: 'Ingresaste a tu cuenta',
                        ruta: ''
                    })
                }
            })
        }
    } catch (error) {
        console.log(error);
    }
}

exports.isAuthenticated =  async(req, res, next)=>{
    if(req.cookies.jwt){
        try {
            const decodificada =  await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO)
            conexion.query('SELECT * FROM users WHERE id = ?', [decodificada.id], (error, results)=>{
                if(!results){return next()}
                req.user =  results[0]
                return next()
            })
        } catch (error) {
            console.log(error)
            return next()
        }
    } else {
        res.redirect('/login')
    }
}

exports.logout = (req, res) =>{
    res.clearCookie('jwt')
    return res.redirect('/login')
}