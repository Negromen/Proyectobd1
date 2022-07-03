const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');

//initializations
const app = express(); // ESTA EJECUCION REGRESA UN OBJETO QUE BASICAMENTE ES LA APLICACION 


//settings 
app.set('port',process.env.PORT || 4000); //ESTA LINEA ASIGNA UN PUERTO PARA CORRER LA APLICACION, EL "process.env.PORT || 4000" LO QUE DICE ES QUE SI HAY UN PUERTO DISPONIBLE, QUE LO TOME, SI NO, QUE USE EL PUERTO 4000
app.set('views',path.join(__dirname, 'views')); //Para decirle a node donde esta la carpeta views, se concatenan directorios 
app.engine('.hbs',exphbs({
    defaultLayout:'main',
    layoutsDir:path.join(app.get('views', 'layout')),
    partialsDir:path.join(app.get('views','partials')),
    extname:'.hbs',
    helpers:require('./lib/handlebars')
}));

app.set('view engine', '.hbs');

//middlewares 
app.use(morgan('dev')); // ESTO ES PARA VER QUE ESTA LLEGANDO A NUESTRO SERVIDOR 
app.use(express.urlencoded({extended:false}));
app.use(express.json());


//global variables 
app.use((req,res,next) => {


    next();
});

//routes 
app.use(require('./routes/index'));
app.use('./links', require('./routes/links'));


//public 
app.use(express.static(path.join(__dirname,'public')));


//starting the server 
app.listen(app.get('port'), () => {
    console.log('Server on port' , app.get('port')); 
});
