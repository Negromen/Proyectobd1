const pool = require('/src/database');

function elegirDosis() {
    let vacuna = document.getElementById('inputVacuna');
    let idvacuna = vacuna.value;
    const Query = await pool.query("select cantdosis from vacuna where idvacuna = ? ", [idvacuna]);
    console.log("este es el query", Query);
    document.getElementById('inputDosis').value = Query[0];
    const valor = Query[0];
    const select = document.getElementById('inputDosis');

    for (var i = 1; i <= valor; i++) {
        const option = document.createElement('option');
        option.text = i;
        select.appendChild(option);
    }
    document.getElementById('divDosis').style.display = 'block';
};