const express = require('express');
const router = express.Router();
const pool = require('../database');
const moment = require('moment');

////--------------------------------------------------------FUNCIONES------------------------------------------------------------

////-------------------------------------------REDIRECCCIONAMIENTO REGISTRO VACUNA--------------------------------------------------

//PROCEDIMIENTO PARA ABRIR LA INTERFAZ DE REGISTRAR PERSONA Y SU VACUNA POR PRIMERA VEZ
router.get('/registrarVacuna', async(req, res, next) => {
    const Query = await pool.query("select idvacuna,nombrevacuna from vacuna");
    const Query2 = await pool.query("select cs.codcentro ,cs.nombrecentro from centro_salud as cs, centro_vacunacion as cv where cs.codcentro = cv.codcentro and cs.codestado =cv.codestado and cs.codpais = cv.codpais");
    const Query3 = await pool.query("select DISTINCT p.codpais,p.nombrepais from pais as p,estado_provincia as e where p.codpais=e.codpais;");
    if ((Query) && (Query2) && (Query3))
        res.render("links/registrarVacuna", { Query, Query2, Query3 });
    else
        res.render("links/registrarVacuna");
});

//PROCEDIMIENTO PARA INSERTAR EN LA BASE DE DATOS UNA PERSONA CON SU VACUNA POR PRIMERA VEZ
router.post('/registrarVacuna', async(req, res, next) => {
    const varr = req.body;
    let cedula = varr.tipoCedula + "-" + varr.cedula;
    let riesgo = false;
    var actual = new Date();
    var recibido = new Date(varr.fechanac);
    if ((actual.getFullYear() - recibido.getFullYear()) >= 60) riesgo = true;
    actual = moment(actual).format('YYYY-MM-DD');

    const Query = await pool.query("select docidentidad from persona where docidentidad = ? ", [cedula]);
    console.log(Query);
    if (Object.keys(Query).length == 0) {
        await pool.query("INSERT INTO persona set ? ", {
            docidentidad: cedula,
            nombreper: varr.nombre,
            apellidoper: varr.apellido,
            fechanacimiento: varr.fechanac,
            sexo: varr.genero,
            altoriesgo: riesgo
        });

        await pool.query("INSERT INTO paciente set ? ", {
            docidentidad: cedula
        });

        await pool.query("INSERT INTO reside set ? ", {
            docidentidad: cedula,
            codmunicipio: parseInt(varr.municipio),
            codestado: parseInt(varr.estado),
            codpais: parseInt(varr.pais),
            fecharesidencia: actual
        });

        const Query1 = await pool.query("select codestado,codpais from centro_vacunacion where codcentro = ? ", [parseInt(varr.centroSalud)]);
        const Query2 = await pool.query("select codpais from vacuna where idvacuna = ? ", [parseInt(varr.vacuna)])
        await pool.query("INSERT INTO vacunada set ? ", {
            idvacuna: parseInt(varr.vacuna),
            codpais: Query2[0].codpais,
            docidentidad: cedula,
            codcentro: parseInt(varr.centroSalud),
            codestado: Query1[0].codestado,
            codpais1: Query1[0].codpais,
            docidentidad1: varr.personalSalud,
            dosis: parseInt(varr.numDosis),
            fechavacuna: varr.fechaVac
        });
    }
});



////-------------------------------------------EVENTOS-----------------------------------------------------------------------------

router.get('/buscarepetido/:cedula', async(req, res, next) => {
    var docidentidad = req.params.cedula;
    const Query3 = await pool.query("select docidentidad from persona where docidentidad = ? ", [docidentidad]);
    console.log(Query3);
    if (Query3)
        res.json(Query3[0]);
});

router.get('/buscadosis/:vacuna', async(req, res, next) => {
    var idvacuna = req.params.vacuna;
    const Query3 = await pool.query("select cantdosis from vacuna where idvacuna = ? ", [idvacuna]);
    if (Query3)
        res.json(Query3[0]);
});

router.get('/buscapersonal/:centro', async(req, res, next) => {
    var codcentro = req.params.centro;
    const Query3 = await pool.query("select p.docidentidad ,p.nombreper, p.apellidoper from persona as p, asignado as a where a.codcentro= ? and a.docidentidad=p.docidentidad; ", [codcentro]);
    if (Query3)
        res.json(Query3);
});

router.get('/buscaestado/:pais', async(req, res, next) => {
    var codpais = req.params.pais;
    const Query3 = await pool.query("select codestado, nombreestado from estado_provincia where codpais= ? ; ", [codpais]);
    if (Query3)
        res.json(Query3);
});

router.get('/buscamunicipio/:estado', async(req, res, next) => {
    var codestado = req.params.estado;
    const Query3 = await pool.query("select codmunicipio, nombremunicipio from municipio where codestado= ? ; ", [codestado]);
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

router.get('/registrarSoloVacuna', async(req, res) => {
    const varr=req.body;
    console.log("ENTRANDO AL GET");
    console.log(varr);
    /*const Query = await pool.query("select * from persona where docidentidad = ? ",[docidentidad]);
    if (Query[0].sexo === 'M') Query[0].sexo = 'Masculino';
    if (Query[0].sexo === 'F') Query[0].sexo = 'Femenino';
    else Query[0].sexo = 'No aplica';
    console.log(Query[0]);
    if (Query)
        res.render("links/registrarSoloVacuna", { Query });
    else
*/
    res.render("links/registrarSoloVacuna");
});

router.post('/registrarSoloVacuna', async(req, res, next) => {
    res.render("links/registrarSoloVacuna");
});

module.exports = router;