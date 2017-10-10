Template.mxPreview.helpers({
  images: function () {
    var idgraph = Session.get('idgraph');
    return MXGImages.find({_id:idgraph});
  }
});

Template.mxPreview.onRendered(function(){
    var idgraph = Session.get('idgraph');
    var fileObj = new FS.File();
    fileObj = MXGImages.findOne({_id: idgraph});
    if( !fileObj ){
        console.log('0000');
        var div = document.createElement('div');
        div.setAttribute('align', 'center');
        var h2 = document.createElement('h2');
        mxUtils.write(h2, 'REFERENCE NOT FOUND');
        div.appendChild(h2);

        var img = document.createElement('img');
        img.style.border = '0px';
        img.setAttribute('src', IMAGE_PATH + '/logo.png');
        div.appendChild(img);
        mxUtils.br(div);
        mxUtils.write(div, 'Powered by mxGraph ' + mxClient.VERSION);
        mxUtils.br(div);
        var link = document.createElement('a');
        link.setAttribute('href', 'https://www.jgraph.com/');
        link.setAttribute('target', '_blank');
        mxUtils.write(link, 'www.jgraph.com');
        div.appendChild(link);
        mxUtils.br(div);
        mxUtils.br(div);

        document.body.appendChild(div);
    }
}); // end Template
