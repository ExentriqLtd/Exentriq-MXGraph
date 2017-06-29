MXGImages = new FS.Collection('mxgimages', {
  stores: [   new FS.Store.GridFS('mxgimages')  ]
});

if (Meteor.isServer) {
  MXGImages.allow({
    'insert': function () {
      // add custom authentication code here
      return true;
    },
    'update': function (userid, file) {
      // add custom authentication code here
      return true;
    },
    'remove': function () {
      // add custom authentication code here
      return true;
    },
    'download':()=>{
      return true;
    }
  });
}
