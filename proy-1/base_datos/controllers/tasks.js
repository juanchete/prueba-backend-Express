const Task = require('../models').Task;
const User = require('../models').User;

module.exports = {

  // home: function(req,res){
  //   Task.findAll().then(function (tasks){
  //     res.render('tasks/index',{tasks: tasks});
  //   });

index: function(req,res){
  Task.findAll().then((tasks)=>{
    res.render('tasks/index',{tasks: req.user.tasks});
  })
},

show: function(req,res){
  Task.findByPk(req.params.id,{
    include: [
      {
        model: User,
        as:'user'
      }
    ]
  }).then(function(task){
    res.render('tasks/show',{task: task});
  })
},

  create: function(req,res){

    Task.create({
      description: req.body.description,
      userId: req.user.id
    }).then(result =>{
      res.json(result);
    }).catch(err=>{
      console.log(err);
      res.json(err);
    })
  },

edit: function(req,res){
  Task.findByPk(req.params.id).then(function(task){
    res.render('tasks/edit',{task: task});
  })
}
  ,

  update: function(req,res){

Task.update({description: req.body.description},{
  where: {
    id: req.params.id
  }
}).then(function (response){
  res.redirect('/tasks/'+req.params.id);
})

},

destroy: function(req,res){

  Task.destroy({
    where: {
      id: req.params.id
    }
  }).then(function(contadorElementosEliminados){
    res.redirect('/tasks');
  })
}

,

  new: function(req,res){
    res.render('tasks/new');
  }
  };
