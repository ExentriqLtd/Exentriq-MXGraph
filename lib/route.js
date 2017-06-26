Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  waitOn: function() {
     return Meteor.subscribe('mxgraph');
  }
});

Router.onBeforeAction(function(){
  this.render('loading');
  this.next();
});

Router.map(function() {

  this.route('mxGraphEditor', {
    path: '/',
    data: function(){

    }
  });
  this.route('mxPreview',{
    path: '/preview',
    data: function(){

    }
  });

  this.route('exportGraph',{
    path: '/export',
    data: function(){

    }
  });

// delete image stored.
  this.route('/d/:id', function() {
    console.log('SERVER DELETE');
    var response = '{"origin" : "OK"}';

    var id = this.params.id;
    if (!id) {
      this.response.writeHead(404);
      this.response.end("Graph not found");
      return;
    }
    var fs = Npm.require('fs');
    var path = Npm.require("path");
    var pathFile = path.resolve('.').split(path.sep + '.meteor')[0]+'/public/export/DRAW_';

    try{
    //  fs.unlinkSync(pathFile + id +'.png');
    //  var graph = Grapho.remove({id:id});
      console.log("DELETE FILE="+  pathFile + id +'.png' );
    } catch(err){
      response = '{"origin" : '+ err.message +'}';
    }

    var headers = {
      'Access-Control-Allow-Origin':'*',
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Expose-Headers': 'FooBar',
      'Content-Type': 'application/json; charset=utf-8'
    }

    this.response.writeHead(200, headers);
    this.response.end(response);

  }, { where: "server" });


  this.route('/i/:id', function() {
      var id = this.params.id;
//    var graph = Grapho.findOne({id:id});

      var fs = Npm.require('fs');
      var path = Npm.require("path");
      var pathFile = path.resolve('.').split(path.sep + '.meteor')[0]+'/public/export/';

      var file = fs.readFileSync(pathFile + id);
      var headers = {
        'Content-Type':'image/png',
        'Content-Disposition':'attachment; filename='+id,
        'Content-Transfer-Encoding': 'base64'
      };

      this.response.writeHead(200, headers);
      this.response.end(file);

    },
    {'where': 'server'});

});
