const express = require('express');
const router = express.Router();
const pool = require('../database');


async function elegirDosis() {
    let vacuna = document.getElementById('inputVacuna');
    let idvacuna = vacuna.value;
    //const Query = await pool.query("select cantdosis from vacuna where idvacuna = ? ", [idvacuna]);
    //console.log(Query);
    document.getElementById('inputDosis').value = 2;
    const valor = 2;
    const select = document.getElementById('inputDosis');

    for (var i = 1; i <= valor; i++) {
        const option = document.createElement('option');
        option.text = i;
        select.appendChild(option);
    }
    document.getElementById('divDosis').style.display = 'block';
};