const express = require('express');
const router = express.Router();
const pool = require('../database');
const moment = require('moment');
const { json } = require('express');

////-------------------------------------------REGISTRO VACUNA--------------------------------------------------------------------

//PROCEDIMIENTO PARA ABRIR LA INTERFAZ DE REGISTRAR PERSONA Y SU VACUNA POR PRIMERA VEZ
router.get('/registrarVacuna', async(req, res, next) => {
    const Query = await pool.query("select idvacuna,nombrevacuna from vacuna");
    const Query2 = await pool.query("select cs.codcentro ,cs.nombrecentro from centro_salud as cs, centro_vacunacion as cv where cs.codcentro = cv.codcentro and cs.codestado =cv.codestado and cs.codpais = cv.codpais and cv.borrado=0 ");
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
    //res.json();
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
    const Query3 = await pool.query("select p.docidentidad ,p.nombreper, p.apellidoper from persona as p, asignado as a where a.codcentro= ? and a.docidentidad=p.docidentidad and p.borrado=0 ", [codcentro]);
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

////------------------------------------------REDIRECCCIONAMIENTO VERIFICAR REGISTRO----------------------------------------------------------------------

router.get('/verificarRegistro', (req, res) => {
    res.render("links/verificarRegistro");
});

router.post('/verificarRegistro', async(req, res, next) => {
    res.render("links/verificarRegistro");
});

////-------------------------------------------REDIRECCCIONAMIENTO REGISTRO SOLO VACUNA--------------------------------------------------

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
        const Query6 = await pool.query("select cs.codcentro ,cs.nombrecentro from centro_salud as cs, centro_vacunacion as cv where cs.codcentro = cv.codcentro and cs.codestado =cv.codestado and cs.codpais = cv.codpais and cv.borrado=0");
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

        console.log(Query);
        if ((Query) && (Query5) && (Query6))
            res.render("links/registrarSoloVacuna", { Query, Query5, Query6, listica });
        else
            res.render("links/registrarSoloVacuna");
    } else {
        const mensaje = true;
        res.render("links/verificarRegistro", { mensaje });
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
});

/*----------------------------------------------CENTROS DE SALUD-------------------------------------------------------------*/

router.get('/controlCentroSalud', async(req, res) => {
    const Query = await pool.query("select codcentro from centro_salud where borrado=0");
    res.render("links/controlCentroSalud", { Query });
});

//BUSCA EL CENTRO A TRAVES DE UN CODIGO DE CENTRO Y MANDA LA INFORMACION NECESARIA
router.get('/buscamecentro/:codcentro', async(req, res, next) => {
    var codcentro = req.params.codcentro;
    const Query3 = await pool.query("select cs.codcentro,cs.nombrecentro,cs.direccion,cs.codestado,cs.codpais,cs.fechaencargado,e.nombreestado,p.nombrepais,per.nombreper,per.apellidoper from centro_salud as cs,estado_provincia as e,pais as p,persona as per where cs.codcentro = ? and cs.codestado=e.codestado and cs.codpais=e.codpais and cs.codpais=p.codpais and cs.docidentidad=per.docidentidad", [codcentro]);
    /*const Query4 = await pool.query("select nombreestado from estado_provincia where codestado = ? and codpais = ?", [Query3[0].codestado, Query3[0].codpais]);
    const Query5 = await pool.query("select nombrepais from pais where codpais = ?", [Query3[0].codpais]);
    const Query6 = await pool.query("select nombreper,apellidoper from persona where docidentidad =?", [Query3[0].docidentidad]);*/
    console.log(Query3);
    centro = { tipo: "Hospitalizacion" };
    const Query7 = await pool.query("select * from centro_vacunacion where codcentro = ? ", [Query3[0].codcentro, Query3[0].codestado, Query3[0].codpais]);
    if ((Object.keys(Query7).length) !== 0) { centro.tipo = "Vacunacion"; }
    Query3[0].fechaEncargado = moment(Query3[0].fechaEncargado).format('YYYY-MM-DD');
    /*Query3[0] = Object.assign(Query3[0], Query4[0]);
    Query3[0] = Object.assign(Query3[0], Query5[0]);
    Query3[0] = Object.assign(Query3[0], Query6[0]);*/
    Query3[0] = Object.assign(Query3[0], centro);
    if (Query3)
        res.json(Query3);
});

router.get('/buscadoctores/:codcentro', async(req, res, next) => {
    var codcentro = req.params.codcentro;
    const Query3 = await pool.query("select p.docidentidad, p.nombreper,p.apellidoper from persona as p,medico as m,asignado as a where p.docidentidad=a.docidentidad and p.docidentidad=m.docidentidad and a.codcentro=? and p.borrado=0", [codcentro]);
    if (Query3)
        res.json(Query3);
});

router.get('/buscadoctoresv2/:codestado', async(req, res, next) => {
    const codestado = req.params.codestado;
    const Query3 = await pool.query("select p.docidentidad, p.nombreper,p.apellidoper from persona as p,medico as m, reside as r where p.docidentidad=m.docidentidad and p.docidentidad=r.docidentidad and r.codestado=? and p.borrado=0", [codestado]);
    if (Query3)
        res.json(Query3);
});

//PARA BORRAR UN CENTRO DE SALUD 
router.post('/borrarCentro/', async(req, res, next) => {
    const codcentro = req.body;
    var codigo = parseInt(codcentro.codcentro);
    const Query1 = await pool.query("select * from centro_vacunacion where codcentro =?", [codigo]);
    if ((Object.keys(Query1).length) == 0) {
        await pool.query("update centro_hospitalizacion set `borrado` =1 where codcentro=?", [codigo]);
    } else {
        await pool.query("update centro_vacunacion set `borrado` =1 where codcentro=?", [codigo]);
    }
    await pool.query("update centro_salud set `borrado` =1 where codcentro = ? ", [codigo]);
    res.json();
});

router.post('/GuardarEditarCentro', async(req, res, next) => {
    const varr = req.body;
    const Datos = {
        codcentro: parseInt(varr.codcentro),
        nombrecentro: varr.nombrecentro,
        direccion: varr.direccion,
        codestado: parseInt(varr.codestado),
        codpais: parseInt(varr.codpais),
        docidentidad: varr.docidentidad,
        fechaEncargado: varr.fechaEncargado,
    }
    if ((varr.tipo) == 'Vacunacion') {
        if ((Object.keys(await pool.query("select * from centro_vacunacion where codcentro=? and codestado=? and codpais=?", [Datos.codcentro, Datos.codestado, Datos.codpais])).length) == 0) {
            await pool.query("update centro_hospitalizacion set `borrado` =1  where codcentro=? and codestado=? and codpais=?", [Datos.codcentro, Datos.codestado, Datos.codpais]);
            await pool.query("insert into centro_vacunacion set ?", {
                codcentro: Datos.codcentro,
                codestado: Datos.codestado,
                codpais: Datos.codpais
            });
        }
    } else {
        if ((Object.keys(await pool.query("select * from centro_hospitalizacion where codcentro=? and codestado=? and codpais=?", [parseInt(varr.codcentro), parseInt(varr.codestado), parseInt(varr.codpais)])).length) == 0) {
            await pool.query("update centro_vacunacion set `borrado` =1 where codcentro=? and codestado=? and codpais=?", [Datos.codcentro, Datos.codestado, Datos.codpais]);
            await pool.query("insert into centro_Hospitalizacion set ?", {
                codcentro: Datos.codcentro,
                codestado: Datos.codestado,
                codpais: Datos.codpais
            });
        }
    }
    await pool.query("update centro_salud set ? where codcentro=?", [Datos, Datos.codcentro]);
    res.json();
});

router.get('/buscamepaises', async(req, res, next) => {
    const Query3 = await pool.query("select DISTINCT p.codpais,p.nombrepais from pais as p,estado_provincia as e where p.codpais=e.codpais");
    if (Query3)
        res.json(Query3);
});


router.post('/anadirCentro/', async(req, res, next) => {
    const varr = req.body;
    console.log(varr);
    const Datos = {
        nombrecentro: varr.nombrecentro,
        direccion: varr.direccion,
        codestado: parseInt(varr.codestado),
        codpais: parseInt(varr.codpais),
        docidentidad: varr.docidentidad,
        fechaEncargado: varr.fechaEncargado,
    }
    await pool.query("insert into centro_salud set ? ", [Datos]);
    if ((varr.tipo) == 'Vacunacion') {
        const Query = await pool.query("select codcentro from centro_salud where nombrecentro=? and direccion=?", [Datos.nombrecentro, Datos.direccion]);
        await pool.query("insert into centro_vacunacion set ? ", {
            codcentro: Query[0].codcentro,
            codestado: Datos.codestado,
            codpais: Datos.codpais
        });
    } else {
        const Query = await pool.query("select codcentro from centro_salud where nombrecentro=? and direccion=?", [Datos.nombrecentro, Datos.direccion]);
        await pool.query("insert into centro_hospitalizacion set ? ", {
            codcentro: Query[0].codcentro,
            codestado: Datos.codestado,
            codpais: Datos.codpais
        });
    }
    res.json();
});

/*----------------------------------------------------------------------------------------------------------------------------*/

/*----------------------------------------------PERSONAL DE SALUD-------------------------------------------------------------*/

router.get('/controlPersonalSalud', async(req, res) => {
    const Query = await pool.query("select p.docidentidad from persona as p,personal_salud as ps where p.docidentidad=ps.docidentidad and p.borrado=0");
    res.render("links/controlPersonalSalud", { Query });
});

router.get('/buscaPersonalSalud/:docidentidad', async(req, res) => {
    const docidentidad = req.params.docidentidad;
    const Query = await pool.query("select * from persona where docidentidad = ?", [docidentidad]);
    Query[0].fechanacimiento = moment(Query[0].fechanacimiento).format('YYYY-MM-DD');
    const Query2 = await pool.query("select r.codmunicipio,m.nombremunicipio,r.codestado,e.nombreestado,r.codpais,p.nombrepais from reside as r,municipio as m,estado_provincia as e,pais as p where r.docidentidad=? and m.codmunicipio=r.codmunicipio and e.codestado=r.codestado and p.codpais=r.codpais;", [docidentidad]);
    const Query3 = await pool.query("select c.codcentro,c.nombrecentro,a.fechaasignado from asignado as a,centro_salud as c where a.docidentidad=? and c.codcentro=a.codcentro", [docidentidad]);
    Query3[0].fechaasignado = moment(Query3[0].fechaasignado).format('YYYY-MM-DD');
    if (Object.keys(Query3).length > 0) {
        Query.push(Query2[0]);
        Query.push(Query3[0]);
        const Query4 = await pool.query("select * from medico where docidentidad=? and borrado=0", [docidentidad]);
        const Query5 = await pool.query("select * from enfermeria where docidentidad=? and borrado=0", [docidentidad]);
        const Query6 = await pool.query("select * from asistente_medico where docidentidad=? and borrado=0", [docidentidad]);
        if (Object.keys(Query4).length > 0) {
            medico = { tipo: "Medico" }
            Query[0] = Object.assign(Query[0], medico);
        }
        if (Object.keys(Query5).length > 0) {
            medico = { tipo: "Enfermero" }
            Query[0] = Object.assign(Query[0], medico);
        }
        if (Object.keys(Query6).length > 0) {
            medico = { tipo: "Asistente Medico" }
            Query[0] = Object.assign(Query[0], medico);
        }
        console.log(Query);
        res.json(Query);
    }
    /*else{
            Query.push(Query2[0]);
            for (let i = 0; i <= Object.keys(Query3).length; i++) {
                Query.push(Query3[i]);
            }
            res.json(Query);
        }*/
});

router.post('/borrarPS/', async(req, res, next) => {
    const varr = req.body;
    const Query = await pool.query("select * from medico where docidentidad=?", [varr.docidentidad]);
    const Query1 = await pool.query("select * from enfermeria where docidentidad=?", [varr.docidentidad]);
    const Query2 = await pool.query("select * from asistente_medico where docidentidad=?", [varr.docidentidad]);
    if (Object.keys(Query).length > 0) await pool.query("update medico set `borrado` =1 where docidentidad=?", [varr.docidentidad]);
    if (Object.keys(Query1).length > 0) await pool.query("update enfermeria set `borrado` =1 where docidentidad=?", [varr.docidentidad]);
    if (Object.keys(Query2).length > 0) await pool.query("update asistente_medico set `borrado` =1 where docidentidad=?", [varr.docidentidad]);
    await pool.query("update persona set `borrado` =1 where docidentidad=?", [varr.docidentidad]);
    res.json();
});

router.post('/GuardarEditarPS', async(req, res, next) => {
    const varr = req.body;
    console.log(varr);
    Datos = {
        docidentidad: varr.docidentidad,
        nombreper: varr.nombreper,
        apellidoper: varr.apellidoper,
        fechanacimiento: varr.fechanacimiento,
        sexo: varr.sexo
    }
    if (varr.tipo == 'Medico') {

    } else
    if (varr.tipo == 'Asistente Medico') {

    } else
    if (varr.tipo == 'Enfermero') {

    }
    await pool.query("update persona set ? where docidentidad=?", [Datos, varr.docidentidad]);
    res.json();
});

router.post('/anadirPS/', async(req, res, next) => {
    const varr = req.body;
    varr.codpais = parseInt(varr.codpais);
    varr.codestado = parseInt(varr.codestado);
    varr.codmunicipio = parseInt(varr.codmunicipio);
    varr.codcentro = parseInt(varr.codcentro);
    console.log(varr);
    var actual = new Date();
    var recibido = new Date(varr.fechanacimiento);
    if ((actual.getFullYear() - recibido.getFullYear()) >= 60) varr.riesgo = true;
    const Query = await pool.query("select docidentidad from persona where docidentidad = ? ", [varr.docidentidad]);
    if (Object.keys(Query).length == 0) {
        await pool.query("INSERT INTO persona set ? ", {
            docidentidad: varr.docidentidad,
            nombreper: varr.nombreper,
            apellidoper: varr.apellidoper,
            fechanacimiento: varr.fechanacimiento,
            sexo: varr.sexo,
            altoriesgo: varr.altoriesgo
        });
        await pool.query("INSERT INTO personal_salud set ? ", {
            docidentidad: varr.docidentidad
        });
        await pool.query("INSERT INTO reside set ? ", {
            docidentidad: varr.docidentidad,
            codmunicipio: varr.codmunicipio,
            codestado: varr.codestado,
            codpais: varr.codpais,
            fecharesidencia: varr.fechaAsignado
        });
        await pool.query("INSERT INTO asignado set ?", {
            codcentro: varr.codcentro,
            codestado: varr.codestado,
            codpais: varr.codpais,
            docidentidad: varr.docidentidad,
            fechaasignado: varr.fechaAsignado
        });
        if (varr.tipo == 'Medico') {
            await pool.query("INSERT INTO medico set ?", {
                docidentidad: varr.docidentidad
            });
        } else
        if (varr.tipo == 'Enfermero') {
            await pool.query("INSERT INTO enfemeria set ?", {
                docidentidad: varr.docidentidad
            });
        } else {
            await pool.query("INSERT INTO asistente_medico set ?", {
                docidentidad: varr.docidentidad
            });
        }
    }
    res.json();
});

router.get('/buscameloscentros/:codestado', async(req, res) => {
    const codestado = req.params.codestado;
    const Query = await pool.query("select codcentro,nombrecentro from centro_salud where codestado=?", [codestado]);
    if (Query)
        res.json(Query);
});

/*---------------------------------------------------------------------------------------------------------------------------*/

/*----------------------------------------------CONTAGIO---------------------------------------------------------------------*/

router.post('/registrarContagio', async(req, res, next) => {
    const varr = req.body;
    varr.tiemporeposo = parseInt(varr.tiemporeposo);
    varr.hospitalizado = parseInt(varr.hospitalizado);
    varr.tratamiento = parseInt(varr.tratamiento);
    var hospitalizado = true;
    var Querito = await pool.query("select codestado,codpais from centro_salud where codcentro=? ", [varr.hospitalizado]);
    if (varr.hospitalizado !== 0) {
        await pool.query("insert into hospitalizado set ? ", {
            codcentro: varr.hospitalizado,
            codestado: Querito[0].codestado,
            codpais: Querito[0].codpais,
            docidentidad: varr.tipoCedula,
            fechahospitalizado: varr.fechaContagio
        });
        hospitalizado = false;
    }
    Querito = await pool.query("select pais_origen from virus_variante where denomoms=? ", [varr.virus]);
    await pool.query("insert into contagio set ? ", {
        docidentidad: varr.tipoCedula,
        denomoms: varr.virus,
        pais_origen: Querito[0].pais_origen,
        fechacontagio: varr.fechaContagio,
        tiemporeposo: varr.tiemporeposo,
        casahospitalizado: hospitalizado
    });
    await pool.query("insert into requiere set ? ", {
        codtrat: varr.tratamiento,
        docidentidad: varr.tipoCedula,
        fecha: varr.fechaContagio
    });
    const Query = await pool.query("select docidentidad from persona where borrado=0");
    const Query2 = await pool.query("select v.denomoms,v.pais_origen from virus_variante as v");
    const Query3 = await pool.query("select t.codtrat,t.descriptratamiento from tratamiento as t");
    const Query4 = await pool.query("select cs.codcentro,cs.nombrecentro from centro_salud as cs,centro_hospitalizacion as ch where cs.codcentro=ch.codcentro");
    res.render("links/registrarContagio", { Query, Query2, Query3, Query4 });
});

router.get('/registrarContagio', async(req, res) => {
    const Query = await pool.query("select docidentidad from persona where borrado=0");
    const Query2 = await pool.query("select v.denomoms,v.pais_origen from virus_variante as v");
    const Query3 = await pool.query("select t.codtrat,t.descriptratamiento from tratamiento as t");
    const Query4 = await pool.query("select cs.codcentro,cs.nombrecentro from centro_salud as cs,centro_hospitalizacion as ch where cs.codcentro=ch.codcentro");
    res.render("links/registrarContagio", { Query, Query2, Query3, Query4 });
});


router.post('/registrarSoloContagio', async(req, res, next) => {
    const varr=req.body;
    varr.tiemporeposo = parseInt(varr.tiemporeposo);
    varr.hospitalizado = parseInt(varr.hospitalizado);
    varr.tratamiento = parseInt(varr.tratamiento);
    console.log(varr);
    var hospitalizado = true;
    var Querito = await pool.query("select codestado,codpais from centro_salud where codcentro=? ", [varr.hospitalizado]);
    if (varr.hospitalizado !== 0) {
        await pool.query("insert into hospitalizado set ? ", {
            codcentro: varr.hospitalizado,
            codestado: Querito[0].codestado,
            codpais: Querito[0].codpais,
            docidentidad: varr.cedula,
            fechahospitalizado: varr.fechaContagio
        });
        hospitalizado = false;
    }
    Querito = await pool.query("select pais_origen from virus_variante where denomoms=? ", [varr.virus]);
    await pool.query("insert into contagio set ? ", {
        docidentidad: varr.cedula,
        denomoms: varr.virus,
        pais_origen: Querito[0].pais_origen,
        fechacontagio: varr.fechaContagio,
        tiemporeposo: varr.tiemporeposo,
        casahospitalizado: hospitalizado
    });
    await pool.query("insert into requiere set ? ", {
        codtrat: varr.tratamiento,
        docidentidad: varr.cedula,
        fecha: varr.fechaContagio
    });
    //res.json();
    res.render("links/verificarContagio");
});


router.get('/registrarSoloContagio', async(req, res) => {
    const varr = req.query;
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
        const Query2 = await pool.query("SELECT r.codmunicipio,r.codestado,r.codpais,m.nombremunicipio,e.nombreestado,p.nombrepais FROM municipio as m,reside as r,estado_provincia as e,pais as p WHERE m.codmunicipio=r.codmunicipio and e.codestado=r.codestado and p.codpais=r.codpais and r.docidentidad= ? ", [docidentidad]);
        const Query3 = await pool.query("select v.denomoms,v.pais_origen from virus_variante as v");
        const Query4 = await pool.query("select t.codtrat,t.descriptratamiento from tratamiento as t");
        const Query5 = await pool.query("select cs.codcentro,cs.nombrecentro from centro_salud as cs,centro_hospitalizacion as ch where cs.codcentro=ch.codcentro and ch.borrado=0");
        const Query7 = await pool.query("select * from contagio where docidentidad = ?", [docidentidad]);
        if ((Object.keys(Query7).length) > 0) {
            var contagio = [];
            for (let i = 0; i <= ((Object.keys(Query7).length) - 1); i++) {
                Query7[i].fechacontagio = moment(Query7[i].fechacontagio).format('YYYY-MM-DD');
                const Query6 = await pool.query("select t.descriptratamiento from tratamiento as t,requiere as r where t.codtrat=r.codtrat and r.fecha= ?", [Query7[i].fechacontagio]);
                let objeto = {
                    tratamiento: Query6[0].descriptratamiento,
                    centrohospitalizado: 'En casa'
                };
                if (Query7[i].casahospitalizado == 0) {
                    var Query8 = await pool.query("select cs.nombrecentro from hospitalizado as h,centro_salud as cs,centro_hospitalizacion as ch where ch.codcentro=h.codcentro and cs.codcentro=ch.codcentro and h.fechahospitalizado=?", [Query7[i].fechacontagio]);
                    objeto.centrohospitalizado = Query8[0].nombrecentro;
                }
                objeto = Object.assign(objeto, Query7[i]);
                contagio.push(objeto);
            };
        }
        Query[0] = Object.assign(Query[0], Query2[0]);
        if ((Query) && (Query3) && (Query4) && (Query5))
            res.render("links/registrarSoloContagio", { Query, Query3, Query4, Query5, contagio });
    }
    //res.render("links/registrarSoloContagio");
});

router.get('/verificarContagio', async(req, res) => {
    res.render("links/verificarContagio");
});

/*---------------------------------------------------------------------------------------------------------------------------*/
/*----------------------------------------------TRATAMIENTO-------------------------------------------------------------------*/

router.get('/registrarTratamiento', async(req, res) => {
    const Query=await pool.query("select * from tratamiento where borrado=0");
    res.render("links/registrarTratamiento",{Query});
});

router.get('/dameMedicamentos', async(req, res) => {
    const Query=await pool.query("select codmedicamento,nombre_medicamento from medicamento");
    if(Query)
        res.json(Query);
});

router.get('/dameMedicamentosV2/:codtrat', async(req, res) => {
    var codtrat=req.params.codtrat;
    const Query=await pool.query("select c.codmedicamento, m.nombre_medicamento,c.frecuencia,c.dosis,c.cantdias from consiste as c,medicamento as m where m.codmedicamento=c.codmedicamento and c.codtrat=? ",[codtrat]);
    if(Query)
        res.json(Query);
});

router.post('/borrarTrat/', async(req, res, next) => {
    const varr = req.body;
    varr.codtrat=parseInt(varr.codtrat);
    console.log("el body",varr);
    await pool.query("update tratamiento set `borrado` =1 where codtrat=?",[varr.codtrat]);
    res.json();
});

router.post('/anadirTrat/', async(req, res, next) => {
    const varr = req.body;
    await pool.query("INSERT INTO tratamiento set ? ",{
        descriptratamiento:varr.descriptratamiento
    });
    const codtrat=await pool.query("select codtrat from tratamiento where descriptratamiento=? ",[varr.descriptratamiento]);
    console.log(codtrat);
    for(var i=0;i<=(Object.keys(varr.consiste).length)-1;i++){
        varr.consiste[i].codmedicamento=parseInt(varr.consiste[i].codmedicamento);
        varr.consiste[i].dosis=parseInt(varr.consiste[i].dosis);
        varr.consiste[i].cantdias=parseInt(varr.consiste[i].cantdias);
        await pool.query("INSERT INTO consiste set ? ",{
            codtrat:codtrat[0].codtrat,
            codmedicamento:varr.consiste[i].codmedicamento,
            frecuencia:varr.consiste[i].frecuencia,
            dosis:varr.consiste[i].dosis,
            cantdias:varr.consiste[i].cantdias
        });
    }
    res.json();
});

/*---------------------------------------------------------------------------------------------------------------------------*/

router.get('/desicionContagioTratamiento', async(req, res) => {
    res.render("links/desicionContagioTratamiento");
});


module.exports = router;