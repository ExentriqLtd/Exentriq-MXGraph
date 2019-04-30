import { ExSSO } from 'meteor/exentriq:sso';

itemSubscription=null;
BlazeLayout.setRoot('body');


// FlowRouter.notFound = {
//     // Subscriptions registered here don't have Fast Render support.
//     action: function() { 
//       BlazeLayout.render("layout",{ main: "notFoundTemplate" });
//       Meteor.setTimeout(function(){
//         window.parent.postMessage("Close Iframe","*");
//       },5000);
//     }
// }

FlowRouter.onRouteRegister(function(route) {
  // do anything with the route object
});

var authRoutes = ExSSO.authRouter(function(context, isCordova){
	if (isCordova){
		return '/login';
	}
	return Meteor.absoluteUrl(context.path);
});

var mxgRoutes = authRoutes.group({
  name : 'mxg-routes',
  triggersEnter:[function(context){
    // check if iframe has loaded plugin
    itemSubscription = Meteor.subscribe('mxgimages',context.params.idgraph);
    if(context.queryParams.sessionToken==null)
      BlazeLayout.render("layout",{ main: "notFoundTemplate" });
    else
      BlazeLayout.render("layout",{ main: "loader" });
  }],

});

mxgRoutes.route('/draw/:idgraph', {
  name: 'drawing',
  triggersEnter:[function (context, redirect) {
        Tracker.autorun(function() {
          if(itemSubscription)
            if (itemSubscription.ready()){
              if(window.location == window.parent.location){
                  BlazeLayout.render("layout",{ main: "notFoundTemplate" });
              }else
                BlazeLayout.render("layout",{ main: "mxGraphEditor" });
            }
        });
  }],
  action: function(params, queryParams) {
    var idgraph = params.idgraph;
    Session.set('idgraph',idgraph);
  }
});

mxgRoutes.route('/preview/:idgraph', {
    name: 'preview',
    triggersEnter:[function (context, redirect) {
      //BlazeLayout.render("layout",{ main: "loader" });
      //let itemSubscription = Meteor.subscribe('mxgimages',context.params.idgraph);
        Tracker.autorun(function() {
          if(itemSubscription){
            if (itemSubscription.ready())
              BlazeLayout.render("layout",{ main: "mxPreview" });
          }else{
            console.log('PPPP');
          }
        });
    }],
    action: function(params, queryParams) {
        var idgraph = params.idgraph;
        Session.set('idgraph',idgraph);
    }
});

mxgRoutes.route('/delete/:idgraph', {
    name: 'delete',
    triggersEnter:[function (context, redirect) {
        Tracker.autorun(function() {
            if(itemSubscription) {
              if (itemSubscription.ready()) {
                Meteor.call('mxgDelete',context.params.idgraph,function(err,id){
                  if (!err) {
                    //  console.log('Graph removed');
                    window.parent.postMessage("CloseDeleteIframe","*");
                  }
                });
              }
            }
        });
    }],
    action: function(params, queryParams) {
        var idgraph = params.idgraph;
        Session.set('idgraph',idgraph);
    }
});


/******** IRON:ROUTER
Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFoundTemplate',
  noRoutesTemplate: 'notFoundTemplate',
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

  this.route('/:id/:token', function(){
      var idgraph = this.params.id;
      var token = this.params.token;
      console.log('id='+idgraph);
      console.log('token='+token);
      Session.set('idgraph', idgraph);
      Session.set('token', token);
      this.render('mxGraphEditor');
      this.next();
  });

  this.route('/preview/:id/:token', function(){
      var idgraph = this.params.id;
      var token = this.params.token;
      console.log('id='+idgraph);
      console.log('token='+token);
      Session.set('idgraph', idgraph);
      Session.set('token', token);
      this.render('mxPreview');
      this.next();
  });

// delete image stored.
  this.route('/delete/:id/:token', function() {
    var idgraph = this.params.id;
    var token = this.params.token;
//  console.log('Route DELETE GRAPH ');
    var response = '{"origin" : "OK"}'
    if (!idgraph) {
      this.response.writeHead(404);
      this.response.end("Graph not found");
      return;
    }

    Meteor.call('mxgDelete',idgraph,function(err,id){
      if (!err) {
      //  console.log('Graph removed');
      }
    });
    //MXGImages.remove({_id:idgraph})
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
        //console.log(buffer.toString('base64'));
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
***********/
