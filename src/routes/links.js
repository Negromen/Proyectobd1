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

//BUSCA UNA CEDULA REPETIDA
router.get('/buscarepetido/:cedula', async(req, res, next) => {
    var docidentidad = req.params.cedula;
    const Query3 = await pool.query("select docidentidad from persona where docidentidad = ? ", [docidentidad]);
    console.log(Query3);
    if (Query3)
        res.json(Query3[0]);
});

//BUSCA LAS CANTIDAD DE DOSIS DE UNA VACUNA DADO SU ID
router.get('/buscadosis/:vacuna', async(req, res, next) => {
    var idvacuna = req.params.vacuna;
    const Query3 = await pool.query("select cantdosis from vacuna where idvacuna = ? ", [idvacuna]);
    if (Query3)
        res.json(Query3[0]);
});

//BUSCA PERSONAL DE SALUD DADO UN CODIGO DE CENTRO
router.get('/buscapersonal/:centro', async(req, res, next) => {
    var codcentro = req.params.centro;
    const Query3 = await pool.query("select p.docidentidad ,p.nombreper, p.apellidoper from persona as p, asignado as a where a.codcentro= ? and a.docidentidad=p.docidentidad; ", [codcentro]);
    if (Query3)
        res.json(Query3);
});

//BUSCA ESTADO A TRAVES DE UN CODIGO DE PAIS
router.get('/buscaestado/:pais', async(req, res, next) => {
    var codpais = req.params.pais;
    const Query3 = await pool.query("select codestado, nombreestado from estado_provincia where codpais= ? ; ", [codpais]);
    if (Query3)
        res.json(Query3);
});

//BUSCA MUNICIPIOS A TRAVES DE UN CODIGO DE ESTADO 
router.get('/buscamunicipio/:estado', async(req, res, next) => {
    var codestado = req.params.estado;
    const Query3 = await pool.query("select codmunicipio, nombremunicipio from municipio where codestado= ? ; ", [codestado]);
    if (Query3)
        res.json(Query3);
});

//BUSCA EL CENTRO A TRAVES DE UN CODIGO DE CENTRO Y MANDA LA INFORMACION NECESARIA
router.get('/buscamecentro/:codcentro', async(req, res, next) => {
    var codcentro = req.params.codcentro;
    console.log(codcentro);
    const Query3 = await pool.query("select * from centro_salud where codcentro = ? ", [codcentro]);
    const Query4 = await pool.query("select nombreestado from estado_provincia where codestado = ? and codpais = ?", [Query3[0].codestado, Query3[0].codpais]);
    const Query5 = await pool.query("select nombrepais from pais where codpais = ?", [Query3[0].codpais]);
    const Query6 = await pool.query("select nombreper,apellidoper from persona where docidentidad =?", [Query3[0].docidentidad]);
    centro = { tipo: "Hospitalizacion" };
    const Query7 = await pool.query("select * from centro_vacunacion where codcentro = ? ", [Query3[0].codcentro ,Query3[0].codestado,Query3[0].codpais]);
    if ((Object.keys(Query7).length) !== 0) { centro.tipo = "Vacunacion"; }
    Query3[0].fechaEncargado = moment(Query3[0].fechaEncargado).format('YYYY-MM-DD');
    Query3[0] = Object.assign(Query3[0], Query4[0]);
    Query3[0] = Object.assign(Query3[0], Query5[0]);
    Query3[0] = Object.assign(Query3[0], Query6[0]);
    Query3[0] = Object.assign(Query3[0], centro);
    console.log(Query3);
    if (Query3)
        res.json(Query3);
});

/*PARA BORRAR UN CENTRO DE SALUD 
router.get('/borrarCentro/:codcentro', async(req, res, next) => {
    const codcentro = req.params.codcentro;
    const Query1= await pool.query("select * from centro_vacunacion where codcentro =?",[codcentro]);
    if((Object.keys(Query1).length)== 0){
        await pool.query("delete from centro_hospitalizacion where codcentro=?",[codcentro]);
    }
    await pool.query("delete from centro_salud where codcentro = ? ",[codcentro]);
    res.render('links/controlCentroSalud');
});
*/

////--------------------------------------------------------------------------------------------------------------------------------

router.get('/verificarRegistro', (req, res) => {
    res.render("links/verificarRegistro");
});

router.post('/verificarRegistro', async(req, res, next) => {
    res.render("links/verificarRegistro");
});

//PARA PINTAR DATOS EN LA INTERFAZ QUE PERMITE AGREGAR UNA VACUNACION
router.get('/registrarSoloVacuna', async(req, res) => {
    const varr = req.query;
    console.log(varr);
    var docidentidad = varr.buscarTipoCedula + "-" + varr.buscarCedula;
    const Query = await pool.query("select * from persona where docidentidad = ? ", [docidentidad]);
    if (Object.keys(Query).length !== 0) {
        if (Query[0].sexo == 'M')
            Query[0].sexo = 'Masculino';
        else
        if (Query[0].sexo == 'F')
            Query[0].sexo = 'Femenino';
        else
        if ((Query[0].sexo !== 'F') && (Query[0].sexo !== 'M'))
            Query[0].sexo = 'No aplica';
        Query[0].fechanacimiento = moment(Query[0].fechanacimiento).format('YYYY-MM-DD');
        const Query2 = await pool.query("SELECT m.codmunicipio,m.nombremunicipio,m.codestado,m.codpais FROM municipio as m,reside as r WHERE m.codmunicipio=r.codmunicipio and m.codestado=r.codestado and m.codpais=r.codpais and r.docidentidad= ? ", [docidentidad]);
        const Query3 = await pool.query("SELECT e.codestado,e.nombreestado,e.codpais FROM estado_provincia as e WHERE e.codestado= ? and e.codpais= ? ", [Query2[0].codestado, Query2[0].codpais]);
        const Query4 = await pool.query("select p.codpais,p.nombrepais from pais as p where p.codpais= ?", [Query3[0].codpais]);
        const Query5 = await pool.query("select idvacuna,nombrevacuna from vacuna");
        const Query6 = await pool.query("select cs.codcentro ,cs.nombrecentro from centro_salud as cs, centro_vacunacion as cv where cs.codcentro = cv.codcentro and cs.codestado =cv.codestado and cs.codpais = cv.codpais");
        const Query7 = await pool.query("select * from vacunada where docidentidad = ?", [docidentidad]);
        var listica = [];
        for (let i = 0; i <= ((Object.keys(Query7).length) - 1); i++) {
            var Query8 = await pool.query("select nombrevacuna,tipo from vacuna where idvacuna = ? and codpais = ? ", [Query7[i].idvacuna, Query7[i].codpais]);
            var Query9 = await pool.query("select nombrecentro from centro_salud where codcentro = ? and codestado = ? and codpais = ?", [Query7[i].codcentro, Query7[i].codestado, Query7[i].codpais1]);
            var Query10 = await pool.query("select nombreper,apellidoper from persona where docidentidad = ?", [Query7[i].docidentidad1]);
            let objeto = {
                numdosis: Query7[i].dosis,
                fechavac: moment(Query7[i].fechavacuna).format('YYYY-MM-DD')
            };
            objeto = Object.assign(objeto, Query8[0]);
            objeto = Object.assign(objeto, Query9[0]);
            objeto = Object.assign(objeto, Query10[0]);
            listica.push(objeto);
        };
        var fechita = new Date();
        const lacedula = {
            tipocedula: varr.buscarTipoCedula,
            cedula: varr.buscarCedula,
            hoy: moment(fechita).format('YYYY-MM-DD')
        };
        Query[0] = Object.assign(Query[0], lacedula);
        Query[0] = Object.assign(Query[0], Query2[0]);
        Query[0] = Object.assign(Query[0], Query3[0]);
        Query[0] = Object.assign(Query[0], Query4[0]);
        Query[0] = Object.assign(Query[0], fechita);
        if ((Query) && (Query5) && (Query6))
            res.render("links/registrarSoloVacuna", { Query, Query5, Query6, listica });
        else
            res.render("links/registrarSoloVacuna");
    } else {
        res.render("links/registrarVacuna");
    }
});

//PARA INSERTAR EN LA BD LA NUEVA VACUNACION
router.post('/registrarSoloVacuna', async(req, res, next) => {
    console.log(req.query);

    const varr = req.body;
    let cedula = varr.tipoCedula + "-" + varr.cedula;
    console.log(varr);
    const Query = await pool.query("select idvacuna,dosis from vacunada where idvacuna= ? and dosis= ? and docidentidad= ? ", [parseInt(varr.vacuna), parseInt(varr.numDosis), cedula]);
    console.log(Object.keys(Query).length);
    if ((Object.keys(Query).length) == 0) {
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
    /*ARREGLAR ERROR DE QUE DEBE REDIRECCIONAR A LA MISMA INTERFAZ CON MENSAJE CUANDO HAY UN ERROR*/
    res.render('links/index');
});

/*----------------------------------------------CENTROS DE SALUD-------------------------------------------------------------*/

router.get('/controlCentroSalud', (req, res) => {
    res.render("links/controlCentroSalud");
});

/*
router.post('/controlCentroSalud', async(req, res, next) => {
    res.render("links/controlCentroSalud");
});
*/

/*----------------------------------------------PERSONAL DE SALUD-------------------------------------------------------------*/
router.get('/controlPersonalSalud', (req, res) => {
    res.render("links/controlPersonalSalud");
});

router.post('/controlPersonalSalud', async(req, res, next) => {
    res.render("links/controlPersonalSalud");
});





module.exports = router;