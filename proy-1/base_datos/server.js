const express = require('express');

const sqlite3 = require('sqlite3');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const methodOverride = require('method-override');
const session = require('express-session');

const socketio = require('socket.io');

const app = express();


// const tasks = require('./controllers/tasks');

const tasksRoutes = require('./routes/tasks_routes');
const registrationsRoutes = require('./routes/registrations_routes');
const sessionsRoutes = require('./routes/sessions_routes');
const categoriesRoutes = require('./routes/categories_routes');
const findUserMiddleware = require('./middlewares/find_user');
const authUser = require('./middlewares/auth_user');
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
// const sequelize = new Sequelize('proyecto-backend',null,null,{
//   dialect: 'sqlite',
//   storage: './proyecto-backend'
// });

app.set('view engine', 'pug');


// app.get('/tasks',tasks.home);
//
// app.post('/pendientes',function (req,res) {
//   // db.run(`INSERT INTO task(description) VALUES(?)`,req.body.description);
//   res.send('Inserccion finalite');
// });

app.use(session({
  secret:['dadasdasdasdasd','dikijuuinfv'],
  saveUninitialized: false,
  resave: false
}));

app.use(findUserMiddleware);
app.use(authUser);
app.use(tasksRoutes);
app.use(registrationsRoutes);
app.use(sessionsRoutes);
app.use(categoriesRoutes);

app.get('/',function (req,res) {
  res.render('home',{user: req.user});
})

let server = app.listen(3000);

let io = socketio(server);
let sockets = {};

let usersCount = 0;

io.on('connection',function(socket){


let userId = socket.request._query.loggeduser;
if(userId)  socket[userId] = socket;
console.log(sockets);

  usersCount++;

  io.emit('count_updated',{count: usersCount});

  socket.on('new_task', function (data) {
    if(data.userId){
      let userSocket = socket[data.userId];
      if(!userSocket) return;

      userSocket.emit('new_task',data);
    }

  })

  socket.on('disconnect', function(){

   Object.keys(sockets).forEach( userId => {
     let s = sockets[userId];
     if (s.id == socket.id) sockets[userId] = null;
   });

console.log(sockets);
    usersCount--;
    io.emit('count_updated',{count: usersCount});
  })
});

const client = require('./realtime/client');
