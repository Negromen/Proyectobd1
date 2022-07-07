const express = require('express');
const router = express.Router();
const pool = require('../database');

////--------------------------------------------------------FUNCIONES------------------------------------------------------------


async function elegirDosis() {
    let vacuna = document.getElementById('inputVacuna');
    let idvacuna = vacuna.value;
    const Query = await pool.query("select cantdosis from vacuna where idvacuna = ? ", [idvacuna]);
    console.log("este es el query", Query);
    document.getElementById('inputDosis').value = 4;
    const valor = 4;
    const select = document.getElementById('inputDosis');
    for (var i = 1; i <= valor; i++) {
        const option = document.createElement('option');
        option.text = i;
        select.appendChild(option);
    }
    document.getElementById('divDosis').style.display = 'block';
};


////--------------------------------------------------------REDIRECCCIONAMIENTO--------------------------------------------------

router.get('/registrarVacuna', async(req, res, next) => {
    const Query = await pool.query("select idvacuna,nombrevacuna from vacuna");
    //const Query2 = await pool.query("select cs.nombrecentro from centro_salud as cs, centro_vacunacion as cv where cs.codcentro = cv.codcentro and cs.codestado =cv.codestado and cs.codpais = cv.codpais");
    console.log(Query);
    if ((Query))
        res.render("links/registrarVacuna", { Query });
    else
        res.render("links/registrarVacuna");
});

router.post('/registrarVacuna', async(req, res, next) => {
    res.render("links/registrarVacuna");
});

router.get('/buscadosis/:vacuna', async(req, res, next) => {
    var idvacuna = req.params.vacuna;
    const Query3 = await pool.query("select cantdosis from vacuna where idvacuna = ? ", [idvacuna]);
    console.log(Query3);
    if(Query3)
    res.json(Query3[0]);
});



router.get('/verificarRegistro', (req, res) => {
    res.render("links/verificarRegistro");
});

router.post('/verificarRegistro', async(req, res, next) => {

    res.render("links/verificarRegistro");
});

module.exports = router;