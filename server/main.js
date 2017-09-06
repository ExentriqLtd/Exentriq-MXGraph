import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup

});

Meteor.methods({
  'mxgSearchID' : function(idgraph){
    return Grapho.find({id: idgraph}).fetch();
  },
  'mxgDelete': function(idgraph){
    //  MXGImages.remove({_id:idgraph},(err)=>{
        console.log('Graph deleted...');
    //  });
  },
  'mxgSaveXML': function (idgraph,xmldata,svg,png){
    console.log('mxgSaveXML');
    var dataUrlRegExp = /^data:image\/\w+;base64,/;
    var imageBuffer = new Buffer(png.replace(dataUrlRegExp, ""), "base64");
    var fileObj = new FS.File();
    fileObj._id = idgraph;
    fileObj.xml = xmldata;
    fileObj.backgroundImage = svg;
    //console.log("XML="+xmldata);
    fileObj.attachData(imageBuffer, {type: 'image/png'}, function(error){
        if(error) throw error;
        fileObj.name(idgraph + '.png');
        if( MXGImages.find({_id:idgraph}).count() > 0){
          MXGImages.remove({_id:idgraph},(err)=>{
            if(!err){
              MXGImages.insert(fileObj,(err)=>{
                if(err)
                  console.log("Error in saving file = "+  err);
              });
            }
          });
        } else {
          MXGImages.insert(fileObj,(err)=>{
            if(err)
              console.log("Error in saving file = "+  err);
          });
        }
    });
  } // end of mxgSaveXML


});
