Meteor.publish('mxgraph', function() {
  return Grapho.find();
});
Meteor.publish('mxgCount', function(idgraph) {
  var result =  Grapho.findOne({id:idgraph}).count();
});
Meteor.publish('mxgSearch', function() {
  return Grapho.find({});
});
