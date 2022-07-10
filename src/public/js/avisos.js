const { Result } = require("express-validator");

function alerta() {
    Swal.fire(
        'Felicidades!',
        'Se ha registrado correctamente!',
        'success'
    ).then(Result => {
        window.location = "http://localhost:4000/"
    });
};