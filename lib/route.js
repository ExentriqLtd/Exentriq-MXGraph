Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFoundTemplate',
  waitOn: function() {
     //return Meteor.subscribe('mxgraph');
     return Meteor.subscribe('mxgimages');
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
    console.log('DELETE GRAPH ');
    var response = '{"origin" : "OK"}';

    var idgraph = this.params.id;
    if (!idgraph) {
      this.response.writeHead(404);
      this.response.end("Graph not found");
      return;
    }

    MXGImages.remove({_id:idgraph})
    return;

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
      var fileObj = new FS.File(MXGImages.findOne({_id:id}));
      var buffer = new Buffer(0);
      var dataMan = new DataMan( process.env.ROOT_URL + fileObj.url(), fileObj.type());
      dataMan.getBuffer(function (err, buffer) {
        console.log(buffer.toString('base64'));
      });

      if(fileObj){
        var headers = {
          'Content-Type': 'image/png',
          'Content-Disposition':'attachment; filename='+fileObj.original.name
        };
        this.response.writeHead(200, headers);
        this.response.end("data:image/png;base64,"+buffer.toString('base64') );
      }

    },
    {'where': 'server'});

});
