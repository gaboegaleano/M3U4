var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const { title } = require('process');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//EJEMPLO 1 - LOGIN:

app.use(session({
  secret: 'Octubre0910',
  resave: false,
  saveUninitialized: true,
}));

//app.use('/', indexRouter);
//app.use('/users', usersRouter);



//EJEMPLO 1 - LOGIN:

app.get('/', function (req, res) {
  var conocido = Boolean(req.session.nombre);

  res.render('index', {
    title: 'Sesiones en Express.js',
    conocido: conocido,
    nombre: req.session.nombre
  });

});


app.post('/ingresar', function(req, res) {
  if (req.body.nombre) {
    req.session.nombre = req.body.nombre
  }
  res.redirect('/');
})

app.get('/salir', function(req, res) {
  req.session.destroy();
  res.redirect('/');
})



//EJEMPLO 2 - CONTADOR DE VISTAS:
//Este codigo es el que realiza el conteo de VISTAS
app.use(function(req, res, next){
  //Si no existe la variable vistas, la creamos como objeto vacio:
  if (!req.session.vistas) {
    req.session.vistas = {}; //Aca arranca vacio.
  }
  //Buscamos una clave dentro session.vistas que coincida con la url
  //Este if es el que inicializa y cuenta las vistas
  if(!req.session.vistas [req.originalUrl]) {
    req.session.vistas[req.originalUrl] = 1;//Aca declaro que empiece en 1.
  } else{
    req.session.vistas[req.originalUrl]++;//Aca ordeno que se incremente conteo de vistas con cada nueva entrada.
  }
  console.log(req.session.vistas);
  next();
});

app.get('/pagina1', function(req, res) {
  res.render('pagina', {
    nombre: 'pagina1',
    vistas: req.session.vistas[req.originalUrl]
  });
});

///Ahora para que codigo de conteo funciona, armo 2 paginas:
app.get('/nosotros', function(req, res){
  res.render('pagina', {
    nombre: 'nosotros',
    vistas: req.session.vistas[req.originalUrl]
  });
});

app.get('/contacto', function(req, res){
  res.render('pagina', {
    nombre: 'contacto',
    vistas: req.session.vistas[req.originalUrl]
  });
});






// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
