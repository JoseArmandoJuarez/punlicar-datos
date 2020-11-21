var express = require('express');
var router = express.Router();

var multer = require('multer');
var storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, './public/images')
  }
});
var upload = multer({storage: storage});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {title:'Main'})
});

router.get('/forma', function(req, res, next){
  res.render('forma', {title:'Menu De Ingreso De Registros'})
});

router.post('/forma', upload.any(), function(req, res, next){

  //Get the form values
  var numerodeorden = req.body.numorden;
  var direccion = req.body.direccion;
  var zona = req.body.zona;
  var numerodeposte = req.body.numposte;
  var codigolampara = req.body.codigolamp;
  var tipolampara = req.body.tipolampara; 
  var codigobrazo = req.body.codigobrazo;
  var tipobrazo = req.body.tipobrazo;
  var fecha = new Date();

  if(req.files){
    console.log('Uploading File...');
    var fotolamp = req.files[0].filename;
    var fotobrazo = req.files[1].filename;
  } else {
      console.log('No File Uploading...')
      var fotolamp = 'noayimagen.jpg';
      var fotobrazo = 'noayimagen.jpg';
  }

  var db = req.db;
  var orden = db.get('ordenes');
  orden.insert({
    orden: numerodeorden,
    direccion: direccion,
    zona: zona,
    numerodeposte: numerodeposte,
    tipodelampara: tipolampara,
    codigodelampara: codigolampara,
    fotodelampara: fotolamp,
    tipodebrazo: tipobrazo,
    codigodebrazo: codigobrazo,
    fotodebrazo: fotobrazo,
    fetcha: fecha
  }, function(err, post){
    if(err){
        res.send(err);
    } else {
        req.flash('success', 'Post Added');
        res.location('/ordenes');
        res.redirect('/ordenes');
    }
  });

});

router.get('/ordenes', function(req, res, next){
  var db = req.db;
  var ordenes = db.get('ordenes');
  ordenes.find({}, {}, function(error, ordenes){
    console.log(ordenes);
    res.render('ordenes', { ordenes });
  });
});

router.get('/ordenes/datos/:id/delete', function(req, res, next) {
  
  console.log(req.params.id);

  var db = req.db;
  var orden = db.get('ordenes');

  orden.remove({ _id: req.params.id }, function(err, user) {

      if (err) {
        throw err;
      }

      console.log("Success");

  });

  res.redirect('/ordenes');

});

router.get('/ordenes/datos/:id', function(req, res, next){
  var db = req.db;
  var orden = db.get('ordenes');
  orden.findById(req.params.id, function(error, orden){
    console.log(orden);
    res.render('datos', { orden });
  });
});





router.get('/about', function(req, res, next){
  res.render('about', {title: 'ABOUT'})
});

router.get('/login', function(req, res, next){
  res.render('login', { title: 'Login' });
});

router.post('/login', function(req, res, next){

  //admin
  var admin = {
    userNombre: 'admin',
    adming: true,
    contraseña: 'admin'
  }

  //admin
  var admin2 = {
    userNombre: 'admin2',
    adming: true,
    contraseña: 'admin2'
  }

  //basica
  var userbasic = {
    userNombre: 'fercho',
    adming: false,
    contraseña: '1234'
  }

  var username = req.body.username;
  var contraseña = req.body.password;

  // Admin
  if(admin.userNombre == username && admin.adming == true && admin.contraseña == contraseña ){
    req.app.locals.noUser = false;
    req.app.locals.admin = true;
    req.app.locals.user = true;
    req.app.locals.normal = false;
    res.location('/');
    res.redirect('/');
  }
  // Admin
  else if(admin2.userNombre == username && admin2.adming == true && admin2.contraseña == contraseña ){
    req.app.locals.noUser = false;
    req.app.locals.admin = true;
    req.app.locals.user = true;
    req.app.locals.normal = false;
    res.location('/');
    res.redirect('/');
  }
  // normal
  else if (userbasic.userNombre == username && userbasic.adming == false && userbasic.contraseña == contraseña ){
    req.app.locals.noUser = false;
    req.app.locals.admin = false;
    req.app.locals.user = true;
    req.app.locals.normal = true;
    res.location('/');
    res.redirect('/');
  }
  else {
    req.app.locals.noUser = true;
    req.app.locals.admin = false;
    req.app.locals.user = false;
    req.app.locals.normal = false;
    res.location('/login');
    res.redirect('/login');
  }
});

router.get('/logout', (req, res) => {
  req.app.locals.noUser = false;
  req.app.locals.admin = false;
  req.app.locals.user = false;
  req.app.locals.normal = false;
  res.location('/login');
  res.redirect('/login');
});


module.exports = router;