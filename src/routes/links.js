const express = require('express');
const router = express.Router();
const pool = require('../database');

////--------------------------------------------------------REDIRECCCIONAMIENTO--------------------------------------------------

router.get('/registrarVacuna', (req , res) => {
    res.render("links/registrarVacuna");
});

router.post('/registrarVacuna', async (req , res, next) => {
    
    res.render("links/registrarVacuna");
});


module.exports = router;
