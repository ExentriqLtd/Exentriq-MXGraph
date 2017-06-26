import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup

});

Meteor.methods({
  'mxgSearchID' : function(idgraph){
    return Grapho.find({id: idgraph}).fetch();
  },
  'mxgSaveXML': function (idgraph,xmldata,svg,png){

    if (Grapho.find({id: idgraph}).count() ==0 ){
      console.log("INSERT");
      //var result = Grapho.insert({id:idgraph,xml:xmldata,svg:svg} );
      var result = Grapho.insert({id:idgraph,xml:xmldata} );
    }else{
      console.log("UPDATE "+idgraph);
      //var result = Grapho.update({id:idgraph},{$set: {xml:xmldata,svg:svg}});
      var result = Grapho.update({id:idgraph},{$set: {xml:xmldata}});
    }
      var path = require("path");
      var filename = "/DRAW_"+idgraph;
      var pathFile = path.resolve('.').split(path.sep + '.meteor')[0]+'/public/export';
      var base64Img = require('base64-img');
      base64Img.img(png, pathFile , filename , function(err, filepath) {
        console.log(filepath);
        if (err) {
          throw (new Meteor.Error(500, 'Failed to save mxGraph file.', err));
        }
      });
/*
    var buffer =  new Buffer(png).toString('base64');
    var z = png;
    var fs = require("fs");
    var pathFile =  Meteor.absolutePath + '/public/export';
    console.log("PNG = "+buffer);
    fs.writeFileSync(pathFile+filename+'.png',png.toString('base64'));
    fs.writeFile(pathFile + filename +'.png', buffer, 'binary', function(err) {
      if (err) {
        throw (new Meteor.Error(500, 'Failed to save file.', err));
      } else {
        console.log('was saved to ' + pathFile);
      }
    });
*/
  } // end of mxgSaveXML


});
