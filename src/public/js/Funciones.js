//const { options } = require("../../routes/links");

var contador = 1;

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

/*-----------------------------------------PERSONAL DE SALUD-------------------------------------------------------------*/

async function buscarPersonalSalud() {
    var docidentidadcita = document.getElementById('buscarTipoCedula').value;
    let response = await fetch(`http://localhost:4000/links/buscaPersonalSalud/${docidentidadcita}`);
    let response2 = await response.json();
    document.getElementById('botonanadir').disabled = true;
    document.getElementById('botonborrar').disabled = false;
    document.getElementById('botoneditar').disabled = false;
    document.getElementById('divEstado').style.display = 'block';
    document.getElementById('divMunicipio').style.display = 'block';
    document.getElementById('buscarTipoCedulita').value = response2[0].docidentidad;
    document.getElementById('cedula').value = response2[0].docidentidad;
    document.getElementById('nombrePer').value = response2[0].nombreper;
    document.getElementById('apellidoPer').value = response2[0].apellidoper;
    document.getElementById('fechaNac').value = response2[0].fechanacimiento;
    if ((response2[0].sexo) == 'M') {
        document.getElementById('genero').value = response2[0].sexo;
        document.getElementById('genero').text = 'Masculino';
    } else
    if ((response2[0].sexo) == 'F') {
        document.getElementById('genero').value = response2[0].sexo;
        document.getElementById('genero').text = 'Femenino';
    } else {
        document.getElementById('genero').value = response2[0].sexo;
        document.getElementById('genero').text = 'N/A';
    }

    document.getElementById('inputPais').options[0].value = response2[1].codpais;
    document.getElementById('inputPais').options[0].text = response2[1].nombrepais;
    document.getElementById('inputEstado').options[0].value = response2[1].codestado;
    document.getElementById('inputEstado').options[0].text = response2[1].nombreestado;
    document.getElementById('inputMunicipio').options[0].value = response2[1].codmunicipio;
    document.getElementById('inputMunicipio').options[0].text = response2[1].nombremunicipio;
    document.getElementById('tipoCentro').options[0].value = response2[2].codcentro;
    document.getElementById('tipoCentro').options[0].text = response2[2].nombrecentro;
    //document.getElementById('tipoCentro').disabled=false;
    document.getElementById('fechaAsig').value = response2[2].fechaasignado;
    document.getElementById('tipoPersonal').options[0].value = response2[0].tipo;
    document.getElementById('tipoPersonal').options[0].text = response2[0].tipo;
};

async function editarPS() {
    document.getElementById('botonbuscar').disabled = true;
    document.getElementById('botoneditar').disabled = true;
    document.getElementById('botonanadir').disabled = true;
    document.getElementById('botonborrar').disabled = true;
    document.getElementById('botonGuardar').disabled = false;
    document.getElementById('nombrePer').disabled = false;
    document.getElementById('apellidoPer').disabled = false;
    document.getElementById('genero').disabled = false;
    document.getElementById('tipoPersonal').disabled = false;
    var codestado = document.getElementById('inputEstado').value;
    let response = await fetch(`http://localhost:4000/links/buscameloscentros/${codestado}`);
    let response2 = await response.json()
    valor = Object.keys(response2).length;
    const select = document.getElementById('tipoCentro');
    for (var i = 1; i <= (select.length); i++) {
        select.remove(i - 1);
    }
    for (i = 1; i <= valor; i++) {
        const option = document.createElement('option');
        option.value = response2[i - 1].codcentro;
        option.text = response2[i - 1].nombrecentro;
        select.appendChild(option);
    }
};

async function GuardarEditarPS() {
    var elsexo = document.getElementById('genero');
    var PS = {
        docidentidad: document.getElementById('buscarTipoCedula').value,
        nombreper: document.getElementById('nombrePer').value,
        apellidoper: document.getElementById('apellidoPer').value,
        fechanacimiento: document.getElementById('fechaNac').value,
        sexo: elsexo.options[elsexo.selectedIndex].value,
        tipo: document.getElementById('tipoPersonal').value
    };
    await fetch(`http://localhost:4000/links/GuardarEditarPS/`, {
        method: 'POST',
        body: JSON.stringify(PS),
        headers: {
            "Content-type": "application/json"
        }
    });
    window.location = "http://localhost:4000/links/controlPersonalSalud"
}

async function GuardarAnadirPS() {
    var docidentidadcita = document.getElementById('buscarTipoCedulita').value + '-' + document.getElementById('cedula').value;
    console.log(docidentidadcita);
    personal = {
        docidentidad: docidentidadcita,
        nombreper: document.getElementById('nombrePer').value,
        apellidoper: document.getElementById('apellidoPer').value,
        fechanacimiento: document.getElementById('fechaNac').value,
        sexo: document.getElementById('genero').value,
        altoriesgo: false,
        codpais: document.getElementById('inputPais').value,
        codestado: document.getElementById('inputEstado').value,
        codmunicipio: document.getElementById('inputMunicipio').value,
        tipo: document.getElementById('tipoPersonal').value,
        codcentro: document.getElementById('tipoCentro').value,
        fechaAsignado: document.getElementById('fechaAsig').value
    }
    await fetch(`http://localhost:4000/links/anadirPS/`, {
        method: 'POST',
        body: JSON.stringify(personal),
        headers: {
            "Content-type": "application/json"
        }
    });
    window.location = "http://localhost:4000/links/controlPersonalSalud"
};

async function habilitaranadirPersonal() {
    document.getElementById('buscarTipoCedulita').disabled = false;
    document.getElementById('cedula').disabled = false;
    document.getElementById('nombrePer').disabled = false;
    document.getElementById('apellidoPer').disabled = false;
    document.getElementById('fechaNac').disabled = false;
    document.getElementById('genero').disabled = false;
    document.getElementById('inputPais').disabled = false;
    document.getElementById('inputEstado').disabled = false;
    document.getElementById('inputMunicipio').disabled = false;
    document.getElementById('tipoPersonal').disabled = false;
    document.getElementById('tipoCentro').disabled = false;
    document.getElementById('buscarTipoCedula').disabled = true;
    //document.getElementById('lacedula').disabled=true;
    document.getElementById('botonGuardar').style.display = 'none';
    document.getElementById('botonGuardar2').style.display = 'block';
    document.getElementById('botonGuardar2').disabled = false;
    document.getElementById('botonanadir').disabled = true;
    document.getElementById('botonbuscar').disabled = true;
    let response = await fetch(`http://localhost:4000/links/buscamepaises/`);
    let response2 = await response.json();
    var valor = Object.keys(response2).length;
    const select = document.getElementById('inputPais');
    for (i = 1; i <= valor; i++) {
        const option = document.createElement('option');
        option.value = response2[i - 1].codpais;
        option.text = response2[i - 1].nombrepais;
        select.appendChild(option);
    }
};

async function elegirMunicipio_Centro() {
    let estado = document.getElementById('inputEstado');
    let valueestado = estado.value;
    let response = await fetch(`http://localhost:4000/links/buscamunicipio/${valueestado}`);
    let response2 = await response.json();
    var valor = Object.keys(response2).length;
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
    var codestado = document.getElementById('inputEstado').value;
    response = await fetch(`http://localhost:4000/links/buscameloscentros/${codestado}`);
    response2 = await response.json()
    valor = Object.keys(response2).length;
    const selectdos = document.getElementById('tipoCentro');
    for (i = 1; i <= valor; i++) {
        const option = document.createElement('option');
        option.value = response2[i - 1].codcentro;
        option.text = response2[i - 1].nombrecentro;
        selectdos.appendChild(option);
    }
};

function fechaAsignado() {
    let date = new Date();
    let output = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
    document.getElementById('fechaAsig').value = output;
}

async function GuardarAnadirPS() {
    var docidentidadcita = document.getElementById('buscarTipoCedulita').value + '-' + document.getElementById('cedula').value;
    console.log(docidentidadcita);
    personal = {
        docidentidad: docidentidadcita,
        nombreper: document.getElementById('nombrePer').value,
        apellidoper: document.getElementById('apellidoPer').value,
        fechanacimiento: document.getElementById('fechaNac').value,
        sexo: document.getElementById('genero').value,
        altoriesgo: false,
        codpais: document.getElementById('inputPais').value,
        codestado: document.getElementById('inputEstado').value,
        codmunicipio: document.getElementById('inputMunicipio').value,
        tipo: document.getElementById('tipoPersonal').value,
        codcentro: document.getElementById('tipoCentro').value,
        fechaAsignado: document.getElementById('fechaAsig').value
    }
    await fetch(`http://localhost:4000/links/anadirPS/`, {
        method: 'POST',
        body: JSON.stringify(personal),
        headers: {
            "Content-type": "application/json"
        }
    });

    // Swal.fire(
    //     'Felicidades!',
    //     'Se ha registrado correctamente!',
    //     'success'
    // ).then(Result => {
    //     window.location = "http://localhost:4000/links/controlPersonalSalud"
    // });

    window.location = "http://localhost:4000/links/controlPersonalSalud"
};

async function buscarPersonalSalud() {
    var docidentidadcita = document.getElementById('buscarTipoCedula').value;
    let response = await fetch(`http://localhost:4000/links/buscaPersonalSalud/${docidentidadcita}`);
    let response2 = await response.json();
    console.log(response2);
    document.getElementById('botonanadir').disabled = true;
    document.getElementById('botonborrar').disabled = false;
    document.getElementById('botoneditar').disabled = false;
    document.getElementById('divEstado').style.display = 'block';
    document.getElementById('divMunicipio').style.display = 'block';
    document.getElementById('buscarTipoCedulita').value = response2[0].docidentidad;
    document.getElementById('cedula').value = response2[0].docidentidad;
    document.getElementById('nombrePer').value = response2[0].nombreper;
    document.getElementById('apellidoPer').value = response2[0].apellidoper;
    document.getElementById('fechaNac').value = response2[0].fechanacimiento;
    if ((response2[0].sexo) == 'M') {
        document.getElementById('genero').value = response2[0].sexo;
        document.getElementById('genero').text = 'Masculino';
    } else
    if ((response2[0].sexo) == 'F') {
        document.getElementById('genero').value = response2[0].sexo;
        document.getElementById('genero').text = 'Femenino';
    } else {
        document.getElementById('genero').value = response2[0].sexo;
        document.getElementById('genero').text = 'N/A';
    }

    document.getElementById('inputPais').options[0].value = response2[1].codpais;
    document.getElementById('inputPais').options[0].text = response2[1].nombrepais;
    document.getElementById('inputEstado').options[0].value = response2[1].codestado;
    document.getElementById('inputEstado').options[0].text = response2[1].nombreestado;
    document.getElementById('inputMunicipio').options[0].value = response2[1].codmunicipio;
    document.getElementById('inputMunicipio').options[0].text = response2[1].nombremunicipio;
    document.getElementById('tipoCentro').options[0].value = response2[2].codcentro;
    document.getElementById('tipoCentro').options[0].text = response2[2].nombrecentro;
    //document.getElementById('tipoCentro').disabled=false;
    document.getElementById('fechaAsig').value = response2[2].fechaasignado;
    document.getElementById('tipoPersonal').options[0].text = response2[0].tipo;
}

async function borraPS() {
    persona = {
        docidentidad: document.getElementById('buscarTipoCedula').value
    }
    await fetch(`http://localhost:4000/links/borrarPS/`, {
        method: 'POST',
        body: JSON.stringify(persona),
        headers: {
            "Content-type": "application/json"
        }
    });
    window.location = "http://localhost:4000/links/controlCentroSalud"
};

//-------------------------------------------------------------------------------------------------------------------------
/*-----------------------------------------TRATAMIENTOS------------------------------------------------------------------*/
/*
async function buscarTratamiento(){
    var codtrat=document.getElementById('codigoTrat').value;

}
*/

//-------------------------------------------------------------------------------------------------------------------------
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

    if ((centro.nombrecentro !== '') && (centro.direccion !== '') && (centro.codestado !== '') && (centro.codpais !== '') && (centro.docidentidad !== '') && (centro.fechaEncargado !== '') && (centro.tipo !== '')) {
        await fetch(`http://localhost:4000/links/GuardarEditarCentro/`, {
            method: 'POST',
            body: JSON.stringify(centro),
            headers: {
                "Content-type": "application/json"
            }
        });
        Swal.fire(
            'Bien hecho!',
            'Centro de Salud se ha editado correctamente!',
            'success'
        ).then(Result => {
            window.location = "http://localhost:4000/links/controlCentroSalud"
        });
    } else {
        console.log(centro);
        Swal.fire(
            'Error!',
            'Campos invalidos!',
            'error'
        ).then(Result => {
            window.location = "http://localhost:4000/links/controlCentroSalud"
        });
    }

    // window.location = "http://localhost:4000/links/controlCentroSalud"
};

async function GuardarAnadirCentro() {
    var centro = {
        nombrecentro: document.getElementById('inputNombreC').value,
        direccion: document.getElementById('inputDireccionC').value,
        codestado: document.getElementById('inputEstado').value,
        codpais: document.getElementById('inputPais').value,
        docidentidad: document.getElementById('medico').value,
        fechaEncargado: document.getElementById('fechaEncargado').value,
        tipo: document.getElementById('tipoCentro').value
    };
    console.log(centro);

    if ((centro.nombrecentro !== '') && (centro.direccion !== '') && (centro.codestado !== '') && (centro.codpais !== '') && (centro.docidentidad !== '') && (centro.fechaEncargado !== '') && (centro.tipo !== '')) {
        await fetch(`http://localhost:4000/links/anadirCentro/`, {
            method: 'POST',
            body: JSON.stringify(centro),
            headers: {
                "Content-type": "application/json"
            }
        });

        Swal.fire(
            'Bien hecho!',
            'Centro de Salud registrado correctamente!',
            'success'
        ).then(Result => {
            window.location = "http://localhost:4000/links/controlCentroSalud"
        });
    } else {
        Swal.fire(
            'Error!',
            'Campos invalidos!',
            'error'
        ).then(Result => {
            window.location = "http://localhost:4000/links/controlCentroSalud"
        });
    }

    // window.location = "http://localhost:4000/links/controlCentroSalud"
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

    Swal.fire(
        'Bien hecho!',
        'El Centro de Salud se ha borrado exitosamente!',
        'success'
    ).then(Result => {
        window.location = "http://localhost:4000/links/controlCentroSalud"
    });
    console.log("qlq");
    // window.location = "http://localhost:4000/links/controlCentroSalud"
};

async function habilitaranadirCentro() {
    document.getElementById('botonBuscar').disabled = true;
    document.getElementById('botonguardar').disabled = false;
    document.getElementById('botonborrar').disabled = true;
    document.getElementById('botonanadir').disabled = true;
    document.getElementById('botonguardar2').disabled = false;
    document.getElementById('inputNombreC').disabled = false;
    document.getElementById('inputDireccionC').disabled = false;
    document.getElementById('inputPais').disabled = false;
    document.getElementById('divEstado').style.display = 'none';
    document.getElementById('inputEstado').disabled = false;
    document.getElementById('tipoCentro').disabled = false;
    document.getElementById('medico').disabled = false;
    document.getElementById('botonguardar').style.display = 'none';
    document.getElementById('botonguardar2').style.display = 'block';
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
};

async function palosMedicos() {
    const codestado = document.getElementById('inputEstado').value;
    let response = await fetch(`http://localhost:4000/links/buscadoctoresv2/${codestado}`);
    let response2 = await response.json();
    const valor = Object.keys(response2).length;
    const select = document.getElementById('medico');
    console.log(response2);
    for (i = 1; i <= valor; i++) {
        const option = document.createElement('option');
        option.value = response2[i - 1].docidentidad;
        option.text = response2[i - 1].nombreper + " " + response2[i - 1].apellidoper;
        select.appendChild(option);
    }
}

function editarfechaEncargado() {
    let date = new Date();
    let output = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
    document.getElementById('fechaEncargado').disabled = false;
    document.getElementById('fechaEncargado').value = output;
};

//--------------------------------------------------------------------------------------------------------------------------

function datosContagio() {
    document.getElementById('divBtnregistrar').style.display = 'block';
    document.getElementById('divVirus').style.display = 'block';
    document.getElementById('divFechacontagio').style.display = 'block';
    document.getElementById('divReposo').style.display = 'block';
    document.getElementById('divTratamiento').style.display = 'block';
    document.getElementById('divHospital').style.display = 'block';
}

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

function paraAnadir(){
    document.getElementById('tablaMedicamentos').innerHTML = '';
    document.getElementById('elbotoncito').style.display = 'block';
    document.getElementById('buttonEditar').disabled = true;
    document.getElementById('buttonBorrar').disabled = true;
    document.getElementById('butoncitobuscar').disabled = true;
}

function añadirMedicamento() {
    // var original = document.getElementById("inputsMedicamentos");
    // var nuevo = original.cloneNode(true);
    // nuevo.id = "inputsMedicamentos" + contador;
    // destino = document.getElementById("tablaMedicamentos");
    // destino.appendChild(nuevo);
    // contador = contador + 1;
    /*
    let response = await fetch(`http://localhost:4000/links/dameMedicamentos/`);
    let response2 = await response.json();
    const valor = Object.keys(response2).length;
    */
    var divPadre = document.getElementById('tablaMedicamentos');
    var divRow = document.createElement('div');
    divRow.className = 'row';
    divRow.id = "inputsMedicamentos" + contador;
    divPadre.appendChild(divRow);

    const divCol12 = document.createElement('div');
    divCol12.className = 'col-md-12';
    divCol12.style.paddingRight = '856px';
    divRow.appendChild(divCol12);

    var label = document.createElement('label');
    label.innerHTML = "Medicamentos";
    label.htmlFor = 'medicaments' + contador;
    divCol12.appendChild(label);

    var select = document.createElement('select');
    select.name = 'medicaments' + contador;
    select.id = 'medicaments' + contador;
    select.className = 'form-select';
    divCol12.appendChild(select);

    const select1 = document.getElementById('medicaments' + contador);
    const option1 = document.createElement('option');
    option1.value = '';
    option1.text = 'Seleccionar medicamento...';
    option1.selected = true;
    select1.appendChild(option1);

    divRow = document.getElementById('inputsMedicamentos' + contador);
    var divCol4 = document.createElement('div');
    divCol4.className = 'col-md-4';
    divRow.appendChild(divCol4);

    label = document.createElement('label');
    label.innerHTML = "Frecuencia";
    label.htmlFor = 'frecuencia' + contador;
    divCol4.appendChild(label);
    var input = document.createElement('input');
    input.type = 'text';
    input.id = 'frecuencia' + contador;
    input.className = 'form-control';
    input.placeholder = 'Ej: Cada 10 dias';
    divCol4.appendChild(input);

    divRow = document.getElementById('inputsMedicamentos' + contador);
    var divCol4 = document.createElement('div');
    divCol4.className = 'col-md-4';
    divRow.appendChild(divCol4);

    label = document.createElement('label');
    label.innerHTML = 'Dosis';
    label.htmlFor = 'dosis' + contador;
    divCol4.appendChild(label);
    input = document.createElement('input');
    input.type = 'text';
    input.id = 'dosis' + contador;
    input.className = 'form-control';
    input.placeholder = 'Ej: 10';
    divCol4.appendChild(input);

    divRow = document.getElementById('inputsMedicamentos' + contador);
    var divCol4 = document.createElement('div');
    divCol4.className = 'col-md-4';
    divRow.appendChild(divCol4);

    label = document.createElement('label');
    label.innerHTML = 'Cantidad de dias';
    label.htmlFor = 'cantDias' + contador;
    divCol4.appendChild(label);
    input = document.createElement('input');
    input.type = 'text';
    input.id = 'cantDias' + contador;
    input.className = 'form-control';
    input.placeholder = 'Ej: 3';
    divCol4.appendChild(input);

    var divDivider = document.createElement('div');
    divDivider.className = 'dropdown-divider';
    divRow = document.getElementById('inputsMedicamentos' + contador);
    divRow.appendChild(divDivider);
    contador = contador + 1;
    return false;
};

async function buscaTrat() {
    var codtrat = document.getElementById('codigoTrat').value;
    let response = await fetch(`http://localhost:4000/links/dameMedicamentosV2/${codtrat}`);
    let response2 = await response.json();
    const valor = Object.keys(response2).length;
    document.getElementById('tablaMedicamentos').innerHTML = '';
    for (var i = 0; i <= (valor - 1); i++) {
        var divPadre = document.getElementById('tablaMedicamentos');
        var divRow = document.createElement('div');
        divRow.className = 'row';
        divRow.id = "inputsMedicamentos" + contador;
        divPadre.appendChild(divRow);
    
        const divCol12 = document.createElement('div');
        divCol12.className = 'col-md-12';
        divCol12.style.paddingRight = '856px';
        divRow.appendChild(divCol12);
    
        var label = document.createElement('label');
        label.innerHTML = "Medicamentos";
        label.htmlFor = 'medicaments' + contador;
        divCol12.appendChild(label);
    
        var select = document.createElement('select');
        select.name = 'medicaments' + contador;
        select.id = 'medicaments' + contador;
        select.className = 'form-select';
        divCol12.appendChild(select);
        const select1 = document.getElementById('medicaments' + contador);
        const option1 = document.createElement('option');
        option1.value = response2[i].codmedicamento;
        option1.text = response2[i].nombre_medicamento;
        option1.selected = true;
        select1.appendChild(option1);
        divRow = document.getElementById('inputsMedicamentos' + contador);
        var divCol4 = document.createElement('div');
        divCol4.className = 'col-md-4';
        divRow.appendChild(divCol4);

        label = document.createElement('label');
        label.innerHTML = "Frecuencia";
        label.htmlFor = 'frecuencia' + contador;
        divCol4.appendChild(label);
        var input = document.createElement('input');
        input.type = 'text';
        input.id = 'frecuencia' + contador;
        input.className = 'form-control';
        input.placeholder = 'Ej: Cada 10 dias';
        input.value=response2[i].frecuencia;
        divCol4.appendChild(input);
    
        divRow = document.getElementById('inputsMedicamentos' + contador);
        var divCol4 = document.createElement('div');
        divCol4.className = 'col-md-4';
        divRow.appendChild(divCol4);
    
        label = document.createElement('label');
        label.innerHTML = 'Dosis';
        label.htmlFor = 'dosis' + contador;
        divCol4.appendChild(label);
        input = document.createElement('input');
        input.type = 'text';
        input.id = 'dosis' + contador;
        input.className = 'form-control';
        input.placeholder = 'Ej: 10';
        input.value=response2[i].dosis;
        divCol4.appendChild(input);
    
        divRow = document.getElementById('inputsMedicamentos' + contador);
        var divCol4 = document.createElement('div');
        divCol4.className = 'col-md-4';
        divRow.appendChild(divCol4);
    
        label = document.createElement('label');
        label.innerHTML = 'Cantidad de dias';
        label.htmlFor = 'cantDias' + contador;
        divCol4.appendChild(label);
        input = document.createElement('input');
        input.type = 'text';
        input.id = 'cantDias' + contador;
        input.className = 'form-control';
        input.placeholder = 'Ej: 3';
        input.value=response2[i].cantdias;
        divCol4.appendChild(input);
    
        var divDivider = document.createElement('div');
        divDivider.className = 'dropdown-divider';
        divRow = document.getElementById('inputsMedicamentos' + contador);
        divRow.appendChild(divDivider);
        contador = contador + 1;
    }
    return false;
};