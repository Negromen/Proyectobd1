const express = require('express');
const router = express.Router();
const pool = require('../database');

////--------------------------------------------------------REDIRECCCIONAMIENTO--------------------------------------------------

router.get('/registrarVacuna', async(req , res, next) => {
    const Query = await pool.query("select nombrevacuna from vacuna");
    //const Query2 = await pool.query("select cs.nombrecentro from centro_salud as cs, centro_vacunacion as cv where cs.codcentro = cv.codcentro and cs.codestado =cv.codestado and cs.codpais = cv.codpais");
    console.log(Query);
    if((Query))
    res.render("links/registrarVacuna", {Query});
    else
    res.render("links/registrarVacuna");
});

router.post('/registrarVacuna', async (req , res, next) => {

    res.render("links/registrarVacuna");
});

router.get('/verificarRegistro', (req , res) => {
    res.render("links/verificarRegistro");
});

module.exports = router;
