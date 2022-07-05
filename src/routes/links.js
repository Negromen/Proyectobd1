const express = require('express');
const router = express.Router();
const pool = require ('../database');

router.get('/RegistroVacuna', async(req, res, next) => {
    res.render('links/ProductoModificar', { Query: Query[0] })
});

/*
router.post('/RegistroVacuna', async(req, res, next) => {
    res.render('links/ProductoModificar', { Query: Query[0] })
});
*/

module.exports=router;