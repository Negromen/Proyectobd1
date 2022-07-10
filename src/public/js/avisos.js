// const { Result } = require("express-validator");

function alertaRegistroVacuna() {
    let nombre = document.getElementById('inputNombre').value;
    let apellido = document.getElementById('inputApellido').value;
    let pais = document.getElementById('inputPais').value;
    let estado = document.getElementById('inputEstado').value;
    let municipio = document.getElementById('inputMunicipio').value;
    let cedula = document.getElementById('inputCedula').value;
    let fechanac = document.getElementById('inputDate').value;
    let genero = document.getElementById('inputGenero').value;
    let vacuna = document.getElementById('inputVacuna').value;
    let numDosis = document.getElementById('inputDosis').value;
    let fechaVac = document.getElementById('inputDateV').value;
    let centroSalud = document.getElementById('inputCS').value;
    let personalSalud = document.getElementById('inputPS').value;

    if ((nombre !== '') && (apellido !== '') && (pais !== '') && (estado !== '') && (municipio !== '') && (cedula !== '') && (cedula > 0) && (fechanac !== '') && (genero !== '') && (vacuna !== '') && (numDosis !== '') && (fechaVac !== '') && (centroSalud !== '') && (personalSalud !== '')) {
        Swal.fire(
            'Felicidades!',
            'Se ha registrado correctamente!',
            'success'
        ).then(Result => {
            window.location = "http://localhost:4000/"
        });
    } else {
        Swal.fire(
            'Error!',
            'Datos invalidos',
            'error'
        );
    };
};