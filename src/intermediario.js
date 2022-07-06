const pool = require('../database');

async function damevacuna(){
    let vacuna= document.getElementById('inputVacuna');
    let idvacuna= vacuna.value;
    const Query= await pool.query("select cantdosis from vacuna where idvacuna = ? " , [idvacuna]);
    console.log("este es el query",Query);
    document.getElementById('inputDosis').value = Query[0];
    document.getElementById('inputDosis').style.display = 'block'
};

