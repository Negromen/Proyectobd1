//const { options } = require("../../routes/links");

async function elegirDosis() {
    let vacuna = document.getElementById('inputVacuna');
    let idvacuna = vacuna.value;
    let response = await fetch(`http://localhost:4000/links/buscadosis/${idvacuna}`);
    let response2 = await response.json();
    console.log(response2);
    //document.getElementById('inputDosis').value = response2.cantdosis;
    const valor = response2.cantdosis;
    const select = document.getElementById('inputDosis');
    for (var i = 1; i <= valor; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.text = i;
        select.appendChild(option);
    }
    document.getElementById('divDosis').style.display = 'block';
};

async function elegirPS() {
    let cs = document.getElementById('inputCS');
    let valueCS = cs.value;
    let response = await fetch(`http://localhost:4000/links/buscapersonal/${valueCS}`);
    let response2 = await response.json();
    const valor = Object.keys(response2).length;
    const select = document.getElementById('inputPS');
    for (var i = 1; i <= (select.length); i++) {
        select.remove(i);
    }
    for (i = 1; i <= valor; i++) {
        const option = document.createElement('option');
        option.value = response2[i - 1].docidentidad;
        option.text = response2[i - 1].nombreper + " " + response2[i - 1].apellidoper;
        select.appendChild(option);
    }
    document.getElementById('divPS').style.display = 'block';
};


async function elegirEstado() {
    let pais = document.getElementById('inputPais');
    let valuepais = pais.value;
    let response = await fetch(`http://localhost:4000/links/buscaestado/${valuepais}`);
    let response2 = await response.json();
    const valor = Object.keys(response2).length;
    const select = document.getElementById('inputEstado');
    for (var i = 1; i <= (select.length); i++) {
        select.remove(i);
    }
    console.log(response2);
    for (i = 1; i <= valor; i++) {
        const option = document.createElement('option');
        option.value = response2[i - 1].codestado;
        option.text = response2[i - 1].nombreestado;
        select.appendChild(option);
    }
    document.getElementById('divEstado').style.display = 'block';
};

async function elegirMunicipio() {
    let estado = document.getElementById('inputEstado');
    let valueestado = estado.value;
    let response = await fetch(`http://localhost:4000/links/buscamunicipio/${valueestado}`);
    let response2 = await response.json();
    const valor = Object.keys(response2).length;
    const select = document.getElementById('inputMunicipio');
    for (var i = 1; i <= (select.length); i++) {
        select.remove(i);
    }
    console.log(response2);
    for (i = 1; i <= valor; i++) {
        const option = document.createElement('option');
        option.value = response2[i - 1].codmunicipio;
        option.text = response2[i - 1].nombremunicipio;
        select.appendChild(option);
    }
    document.getElementById('divMunicipio').style.display = 'block';
};

async function datosVacuna() {
    document.getElementById('divVacuna').style.display = 'block';
    document.getElementById('divDosis').style.display = 'block';
    document.getElementById('divFechaVac').style.display = 'block';
    document.getElementById('divCS').style.display = 'block';
    document.getElementById('divPS').style.display = 'block';
    document.getElementById('divPS').style.display = 'block';
    document.getElementById('divBtnRegistro').style.display = 'block';
}

async function aparecer() {
    var card = document.getElementById('divCard');
    var boton = document.getElementById('botonBorrar');
    card.addEventListener('mouseover', () => {
        boton.style.display = 'block';
    }, false);
    card.addEventListener('mouseout', () => {
        boton.style.display = 'none';
    }, false);
};

async function habilitarCampos() {
    document.getElementById('inputNombre').disabled = false;
    document.getElementById('inputApellido').disabled = false;
    document.getElementById('inputPais').disabled = false;
    document.getElementById('inputEstado').disabled = false;
    document.getElementById('inputMunicipio').disabled = false;
    document.getElementById('inputCedula').disabled = false;
    document.getElementById('inputDate').disabled = false;
    document.getElementById('inputGenero').disabled = false;
    document.getElementById('divBtnRegistro').style.display = 'block';
};