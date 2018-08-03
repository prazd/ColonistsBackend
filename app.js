var express = require('express')
  , passport = require('passport')
  , util = require('util')
  , VkStrategy = require('./passport-vkontakte').Strategy
  , parser = require('cookie-parser')
  , esession = require('express-session')
  , bpar = require('body-parser')
  , path = require('path')
  , mongo = require('./db/mong')

var VK_APP_ID = process.env.VK_APP_ID;
var VK_APP_SECRET = process.env.VK_APP_SECRET;

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new VkStrategy(
  {
    clientID: VK_APP_ID,
    clientSecret: VK_APP_SECRET,
    callbackURL: "http://localhost/auth/vk/callback",
    scope: ['email'],
    profileFields: ['email'],
  },
  function verify(accessToken, refreshToken, params, profile, done) {
    process.nextTick(function () {
      return done(null, profile); 
    });
  }
));

var app = express();
app.set('views', __dirname + '/passport-vkontakte/examples/login/views');
app.set('view engine', 'ejs');
app.use(parser());
app.use(esession({
  secret: '123',
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: false
  }
}));

app.use(express.static(__dirname+'/front/dist')) // for vue
app.use(passport.initialize());
app.use(passport.session());
app.use(bpar.json())


app.get('/',(req,res)=>{
  res.sendFile(__dirname+'/check.html')
})


app.get('/auth/vk/',
  passport.authenticate('vkontakte'),
  function(req, res){
  });

app.get('/auth/vk/callback', 
  passport.authenticate('vkontakte', { failureRedirect: 'http://localhost:3000/' }),
  function(req, res) {
    res.redirect('http://localhost/#/main');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('http://localhost/');
  });

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}

app.get('/info',(req,res)=>{
  res.header("Access-Control-Allow-Origin", '*')
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  if(req.user === undefined){
    var obj2 = {
      id:undefined
    }
      res.send(JSON.stringify(obj2))
  }
  else{
      var obj = {
        id:req.user.id,
        gender:req.user.gender
      }   
      res.send(JSON.stringify(obj));
  }
});

app.get('/try',(req,res)=>{
  res.header("Access-Control-Allow-Origin", '*')
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  if(req.user === undefined){
    var obj2 = {
      id:undefined
    }
      res.send(JSON.stringify(obj2))
  }
  else{
      var obj = {
        id:req.user.id,
      }   
      res.send(JSON.stringify(obj));
  }
});


app.post('/api/subjects',(req,res)=>{
  console.log('SUBBBBBBJJJJ')
  if(req.body.user_info===undefined){
    console.log('None')
  }
  else{
    console.log(req.body.user_info)
    let subjadd = mongo.SubjectAdd(req.body.time, req.body.user_agent, req.body.user_info, req.body.time_total)
    subjadd
          .then((data)=>{
            if(data===1){
              console.log('nice')
            }
    })
  }
});

var count = null

app.post('/session',(req,res)=>{
  res.header("Access-Control-Allow-Origin", '*')
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  count++;
  console.log(count)
  res.send(JSON.stringify({id:count}));
});

app.post('/session/:id',(req,res)=>{
  console.log('ISSS',req.params.id)
  res.send(JSON.stringify({data:"OK"}))

  let sess = mongo.SessionAdd(req.body.game,req.body.user_info,req.body.data,req.body.start, req.body.stop)
      sess 
         .then((data)=>{
           if(data===1){
             console.log('NICE')
           }
})
});

app.listen(80);
