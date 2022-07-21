//const { options } = require("../../routes/links");

/*-----------------------------------------------EVENTOS VARIOS-------------------------------------------------*/
//PARA ELEGIR LA CANTIDAD DE DOSIS DE UNA VACUNA
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

//PARA ELEGIR EL PERSONAL DE SALUD DE UN CENTRO 
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

//PARA ELEGIR LOS ESTADOS DE UN PAIS
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

//PARA ELEGIR LOS MUNICIPIOS DE UN ESTADO
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
    for (i = 1; i <= valor; i++) {
        const option = document.createElement('option');
        option.value = response2[i - 1].codmunicipio;
        option.text = response2[i - 1].nombremunicipio;
        select.appendChild(option);
    }
    document.getElementById('divMunicipio').style.display = 'block';
};


/*-----------------------------------------CENTROS DE SALUD-------------------------------------------------------------*/
//PARA BUSCAR CENTROS EN LA INTERFAZ DE CONTROL DE CENTROS
async function buscarCentro() {
    let centro = document.getElementById('buscarCodigo');
    let codcentro = centro.value;
    let response = await fetch(`http://localhost:4000/links/buscamecentro/${codcentro}`);
    let response2 = await response.json();
    document.getElementById('inputNombreC').value = response2[0].nombrecentro;
    document.getElementById('inputDireccionC').value = response2[0].direccion;
    document.getElementById('fechaEncargado').value = response2[0].fechaEncargado;
    document.getElementById('inputPais').options[0].text = response2[0].nombrepais;
    document.getElementById('inputPais').options[0].value = response2[0].codpais;
    document.getElementById('inputEstado').options[0].text = response2[0].nombreestado;
    document.getElementById('inputEstado').options[0].value = response2[0].codestado;
    document.getElementById('medico').options[0].text = response2[0].nombreper + ' ' + response2[0].apellidoper;
    document.getElementById('medico').options[0].value = response2[0].docidentidad;
    document.getElementById('tipoCentro').options[0].text = response2[0].tipo;
    document.getElementById('tipoCentro').options[0].value = response2[0].tipo;
    document.getElementById('botonborrar').disabled = false;
    document.getElementById('botoneditar').disabled = false;
};

async function editarCentro() {
    document.getElementById('botonBuscar').disabled = true;
    document.getElementById('botoneditar').disabled = true;
    document.getElementById('botonanadir').disabled = true;
    document.getElementById('botonborrar').disabled = true;
    document.getElementById('inputNombreC').disabled = false;
    document.getElementById('inputDireccionC').disabled = false;
    document.getElementById('tipoCentro').disabled = false;
    document.getElementById('medico').disabled = false;
    document.getElementById('botonguardar').disabled = false;
    codcentro = document.getElementById('buscarCodigo').value;
    var cedula = document.getElementById('medico').value;
    let response = await fetch(`http://localhost:4000/links/buscadoctores/${codcentro}`);
    let response2 = await response.json();
    const valor = Object.keys(response2).length;
    const select = document.getElementById('medico');
    for (i = 1; i <= valor; i++) {
        if ((response2[i - 1].docidentidad) !== cedula) {
            const option = document.createElement('option');
            option.value = response2[i - 1].docidentidad;
            option.text = response2[i - 1].nombreper + " " + response2[i - 1].apellidoper;
            select.appendChild(option);
        }
    }
};

async function GuardarEditarCentro() {
    var centro = {
        codcentro: document.getElementById('buscarCodigo').value,
        nombrecentro: document.getElementById('inputNombreC').value,
        direccion: document.getElementById('inputDireccionC').value,
        codestado: document.getElementById('inputEstado').options[0].value,
        codpais: document.getElementById('inputPais').options[0].value,
        docidentidad: document.getElementById('medico').options[0].value,
        fechaEncargado: document.getElementById('fechaEncargado').value,
        tipo: document.getElementById('tipoCentro').value
    };
    await fetch(`http://localhost:4000/links/GuardarEditarCentro/`, {
        method: 'POST',
        body: JSON.stringify(centro),
        headers: {
            "Content-type": "application/json"
        }
    });
    window.location = "http://localhost:4000/links/controlCentroSalud"
        /*
        document.getElementById('inputNombreC').disabled = true;
        document.getElementById('inputDireccionC').disabled = true;
        document.getElementById('tipoCentro').disabled = true;
        document.getElementById('medico').disabled = true;
        document.getElementById('botonguardar').disabled = true;
        document.getElementById('botonBuscar').disabled = false;*/
};

async function borraCentro() {
    centro = {
        codcentro: document.getElementById('buscarCodigo').value
    }
    await fetch(`http://localhost:4000/links/borrarCentro/`, {
        method: 'POST',
        body: JSON.stringify(centro),
        headers: {
            "Content-type": "application/json"
        }
    });
    //await fetch(`http://localhost:4000/links/buscadoctores/${codcentro}`);
    console.log("salio del fetch que borra");
    window.location = "http://localhost:4000/links/controlCentroSalud"
};


async function habilitaranadirCentro() {
    console.log("ENTRANDO");
    document.getElementById('botonBuscar').disabled = true;
    document.getElementById('botonguardar').disabled = true;
    document.getElementById('botonborrar').disabled = true;
    document.getElementById('botonanadir').disabled = true;
    document.getElementById('inputNombreC').disabled = false;
    document.getElementById('inputDireccionC').disabled = false;
    document.getElementById('inputPais').disabled = false;
    document.getElementById('divEstado').style.display = 'none';
    document.getElementById('tipoCentro').disabled = false;
    document.getElementById('medico').disabled = false;
    let response = await fetch(`http://localhost:4000/links/buscamepaises/`);
    let response2 = await response.json();
    const valor = Object.keys(response2).length;
    const select = document.getElementById('inputPais');
    for (i = 1; i <= valor; i++) {
        const option = document.createElement('option');
        option.value = response2[i - 1].codpais;
        option.text = response2[i - 1].nombrepais;
        select.appendChild(option);
    }
    /*
    response = await fetch(`http://localhost:4000/links/buscadoctoresv2/${}`);
    response2 = await response.json();
    const valor = Object.keys(response2).length;
    const select = document.getElementById('medico');
    for (i = 1; i <= valor; i++) {
        const option = document.createElement('option');
        option.value = response2[i - 1].docidentidad;
        option.text = response2[i - 1].nombreper + " " + response2[i - 1].apellidoper;
        select.appendChild(option);
    }*/
};

async function anadirCentro() {

};

function editarfechaEncargado() {
    let date = new Date();
    let output = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
    document.getElementById('fechaEncargado').disabled = false;
    document.getElementById('fechaEncargado').value = output;
};

//--------------------------------------------------------------------------------------------------------------------------

//HABILITA CAMPOS PARA REGISTRAR UNA VACUNA
function datosVacuna() {
    document.getElementById('divVacuna').style.display = 'block';
    document.getElementById('divFechaVac').style.display = 'block';
    document.getElementById('divCS').style.display = 'block';
    document.getElementById('divBtnRegistro').style.display = 'block';
};

function aparecer() {
    var card = document.getElementById('divCard');
    var boton = document.getElementById('botonBorrar');
    card.addEventListener('mouseover', () => {
        boton.style.display = 'block';
    }, false);
    card.addEventListener('mouseout', () => {
        boton.style.display = 'none';
    }, false);
};