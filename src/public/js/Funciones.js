//const { options } = require("../../routes/links");


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

//PARA ELEGIR EL PEROSNAL DE SALUD DE UN CENTRO 
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

//PARA BUSCAR CENTROS EN LA INTERFAZ DE CONTROL DE CENTROS
async function buscarCentro() {
    let centro = document.getElementById('buscarCodigo');
    let codcentro = centro.value;
    console.log(codcentro);
    let response = await fetch(`http://localhost:4000/links/buscamecentro/${codcentro}`);
    let response2 = await response.json();
    console.log("sale del fetch");
    console.log(response2);
    document.getElementById('inputNombreC').value = response2[0].nombrecentro;
    document.getElementById('inputDireccionC').value = response2[0].direccion;
    document.getElementById('fechaEncargado').value = response2[0].fechaEncargado;
    document.getElementById('inputPais').options[0].text = response2[0].nombrepais;
    document.getElementById('inputEstado').options[0].text = response2[0].nombreestado;
    document.getElementById('medico').options[0].text = response2[0].nombreper + ' ' + response2[0].apellidoper;
    document.getElementById('tipoCentro').options[0].text = response2[0].tipo;
    document.getElementById('botonborrar').disabled=false;
    document.getElementById('botoneditar').disabled=false;
    // const option = document.createElement('option');
    // const pais = document.getElementById('inputPais');
    // option.value = response2[0].codpais;
    // option.text = response2[0].nombrepais;
    // pais.appendChild(option);
    // const estado = document.getElementById('inputEstado');
    // option.value = response2[0].codestado;
    // option.text = response2[0].nombreestado;
    // estado.appendChild(option);
    // const encargado = document.getElementById('medico');
    // option.value = response2[0].docidentidad;
    // option.text = response2[0].nombreper;
    // encargado.appendChild(option);
    // const tipo = document.getElementById('tipoCentro');
    // option.value = "0";
    // option.text = response2[0].tipo;
    // tipo.appendChild(option);
};

//HABILITA CAMPOS PARA REGISTRAR UNA VACUNA
function datosVacuna() {
    document.getElementById('divVacuna').style.display = 'block';
    document.getElementById('divFechaVac').style.display = 'block';
    document.getElementById('divCS').style.display = 'block';
    document.getElementById('divBtnRegistro').style.display = 'block';
};

//
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

/*  FUNCION SIN USO AUN
function habilitarCampos() {
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
*/

function editarCentro(){
    console.log("sexo");
    document.getElementById('inputNombreC').disabled=false;
    document.getElementById('inputDireccionC').disabled=false;
    document.getElementById('tipoCentro').disabled=false;
    document.getElementById('tipoCentro').disabled=false;
    
}

function cambiarColorAltoRiesgo() {
    //alto riesgo
    document.getElementById('circle').style.background = 'green';

    //bajo riesgo
    document.getElementById('circle').style.background = 'red';
};
