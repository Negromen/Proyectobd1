const express = require('express');
const router = express.Router();
const pool = require('../database');
var mensaje = 0;

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


////-------------------------------------------REDIRECCCIONAMIENTO REGISTRO VACUNA--------------------------------------------------

router.get('/registrarVacuna', async(req, res, next) => {
    const Query = await pool.query("select idvacuna,nombrevacuna from vacuna");
    const Query2 = await pool.query("select cs.codcentro ,cs.nombrecentro from centro_salud as cs, centro_vacunacion as cv where cs.codcentro = cv.codcentro and cs.codestado =cv.codestado and cs.codpais = cv.codpais");
    const Query3 = await pool.query("select codpais, nombrepais from pais ");
    //RECUERDA PONER QUERY2 EN EL IF
    if ((Query) && (Query2) && (Query3))
        res.render("links/registrarVacuna", { Query, Query2, Query3 });
    else
        res.render("links/registrarVacuna");
});


router.post('/registrarVacuna', async(req, res, next) => {
    const Query = await pool.query("select idvacuna,nombrevacuna from vacuna");
    const Query2 = await pool.query("select cs.codcentro ,cs.nombrecentro from centro_salud as cs, centro_vacunacion as cv where cs.codcentro = cv.codcentro and cs.codestado =cv.codestado and cs.codpais = cv.codpais");
    const Query3 = await pool.query("select codpais, nombrepais from pais ");
    const varr = req.body;
    //console.log(varr);

    await pool.query("INSERT INTO persona set ? ", {
        docidentidad: parseInt(varr.cedula),
        nombreper: varr.nombre,
        apellidoper: varr.apellido,
        fechanacimiento: varr.fechanac,
        sexo: varr.genero,
        altoriesgo: true
    });
    await pool.query("INSERT INTO vacunada set ? ", {
        idvacuna: parseInt(varr.vacuna),
        codpais: parseInt(varr.pais),
        docidentidad: parseInt(varr.cedula),
        codcentro: parseInt(varr.centroSalud),
        codestado: parseInt(varr.estado),
        codpais1: 1,
        docidentidad1: parseInt(varr.personalSalud),
        dosis: parseInt(varr.numDosis),
        fechavacuna: varr.fechaVac
    });
});



////-------------------------------------------EVENTOS-----------------------------------------------------------------------------

router.get('/buscadosis/:vacuna', async(req, res, next) => {
    var idvacuna = req.params.vacuna;
    const Query3 = await pool.query("select cantdosis from vacuna where idvacuna = ? ", [idvacuna]);
    console.log(Query3);
    if (Query3)
        res.json(Query3[0]);
});

router.get('/buscapersonal/:centro', async(req, res, next) => {
    var codcentro = req.params.centro;
    const Query3 = await pool.query("select p.docidentidad ,p.nombreper, p.apellidoper from persona as p, asignado as a where a.codcentro= ? and a.docidentidad=p.docidentidad; ", [codcentro]);
    console.log(Query3);
    if (Query3)
        res.json(Query3);
});

router.get('/buscaestado/:pais', async(req, res, next) => {
    var codpais = req.params.pais;
    const Query3 = await pool.query("select codestado, nombreestado from estado_provincia where codpais= ? ; ", [codpais]);
    console.log(Query3);
    if (Query3)
        res.json(Query3);
});

router.get('/buscamunicipio/:estado', async(req, res, next) => {
    var codestado = req.params.estado;
    const Query3 = await pool.query("select codmunicipio, nombremunicipio from municipio where codestado= ? ; ", [codestado]);
    console.log(Query3);
    if (Query3)
        res.json(Query3);
});

////--------------------------------------------------------------------------------------------------------------------------------

router.get('/verificarRegistro', (req, res) => {
    res.render("links/verificarRegistro");
});

router.post('/verificarRegistro', async(req, res, next) => {
    res.render("links/verificarRegistro");
});

router.get('/vacuna', (req, res) => {
    res.render("links/registrarSoloVacuna");
});

router.post('/vacuna', async(req, res, next) => {
    res.render("links/registrarSoloVacuna");
});

module.exports = router;