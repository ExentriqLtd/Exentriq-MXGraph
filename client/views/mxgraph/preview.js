Template.mxPreview.helpers({
  images: function () {
    return MXGImages.find({_id:Router.current().params.query.id}); // Where Images is an FS.Collection instance
//    return MXGImages.find({_id:Router.current().params.id}); // Where Images is an FS.Collection instance
  }
});

Template.mxPreview.onCreated(function(){
  return;
    idgraph = Router.current().params.query.id;
    //var xml = MXGImages.findOne({_id: idgraph});
    var fileObj = new FS.File();
    fileObj = MXGImages.findOne({_id: idgraph});
    //console.log(fileObj);

    //xml = Grapho.findOne({id:idgraph});
return;
    if( !fileObj ){
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
      link.setAttribute('href', 'http://www.mxgraph.com/');
      link.setAttribute('target', '_blank');
      mxUtils.write(link, 'www.jgraph.com');
      div.appendChild(link);
      mxUtils.br(div);
      mxUtils.br(div);

      document.body.appendChild(div);

      return false;
    }

    var container = document.createElement('div');
    container.id = "exentiqGraph"
    //container.style.width = "300px";
    //container.style.height = "250px";
    container.style.overflow = "hidden";
    container.style.border = "0px solid red";
    container.innerHTML = xml.svg;
    document.body.appendChild(container);

/*  var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var img = new Image();
    img.onload = function() {
      ctx.drawImage(img, 0, 0);
    }
    var filename = "DRAW_"+idgraph+'.svg';
    img.src = 'data:image/svg+xml,' + xml.svg;  //"/export/"+filename;
    container.appendChild(canvas);
*/

    var svg = container.querySelector('svg');
    var doSomethingWith = function(canvas) {
      $(container).hide();
      document.body.appendChild(canvas);
      $(canvas).hide();
      img = document.createElement('img');
      img.src = canvas.toDataURL("image/png");
      document.body.appendChild(img);
    };

    function parseImages() {
      var xlinkNS = "http://www.w3.org/1999/xlink";
      var total, encoded;
      // convert an external bitmap image to a dataURL
      var toDataURLx = function(image) {

        var img = new Image();
        // CORS workaround, this won't work in IE<11
        // If you are sure you don't need it, remove the next line and the double onerror handler
        // First try with crossorigin set, it should fire an error if not needed
        img.crossOrigin = 'anonymous';

        img.onload = function() {
          // we should now be able to draw it without tainting the canvas
          var canvas = document.createElement('canvas');
          canvas.width = this.width;
          canvas.height = this.height;
          // draw the loaded image
          canvas.getContext('2d').drawImage(this, 0, 0);
          // set our <image>'s href attribute to the dataURL of our canvas
          image.setAttributeNS(xlinkNS, 'href', canvas.toDataURLx());
          // that was the last one
          if (++encoded === total) exportDoc();
        };

        // No CORS set in the response
        img.onerror = function() {
          // save the src
          var oldSrc = this.src;
          // there is an other problem
          this.onerror = function() {
            console.warn('failed to load an image at : ', this.src);
            if (--total === encoded && encoded > 0) exportDoc();
          };
          // remove the crossorigin attribute
          this.removeAttribute('crossorigin');
          // retry
          this.src = '';
          this.src = oldSrc;
        };
        // load our external image into our img
        var href = image.getAttributeNS(xlinkNS, 'href');
        // really weird bug that appeared since this answer was first posted
        // we need to force a no-cached request for the crossOrigin be applied
        img.src = href + (href.indexOf('?') > -1 ? + '&1': '?1');
      };

      // get an external svg doc to data String
      var parseFromUrl = function(url, element) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function() {
          if (this.status === 200) {
            var response = this.responseText || this.response;
            var dataUrl = 'data:image/svg+xml; charset=utf8, ' + encodeURIComponent(response);
            element.setAttributeNS(xlinkNS, 'href', dataUrl);
            if (++encoded === total) exportDoc();
          }
          // request failed with xhr, try as an <img>
          else {
            toDataURLx(element);
          }
        };
        xhr.onerror = function() {
          toDataURLx(element);
        };
        xhr.open('GET', url);
        xhr.send();
      };

      var images = svg.querySelectorAll('image');
      total = images.length;
      encoded = 0;

      // loop through all our <images> elements
      for (var i = 0; i < images.length; i++) {
        var href = images[i].getAttributeNS(xlinkNS, 'href');
        // check if the image is external
        if (href.indexOf('data:image') < 0) {
          // if it points to another svg element
          if (href.indexOf('.svg') > 0) {
            parseFromUrl(href, images[i]);
          } else // a pixel image
            toDataURLx(images[i]);
        }
        // else increment our counter
        else if (++encoded === total) exportDoc();
      }
      // if there were no <image> element
      if (total === 0) exportDoc();
    }

    var exportDoc = function() {
      // check if our svgNode has width and height properties set to absolute values
      // otherwise, canvas won't be able to draw it
      var bbox = svg.getBoundingClientRect();

      if (svg.width.baseVal.unitType !== 1) svg.setAttribute('width', bbox.width);
      if (svg.height.baseVal.unitType !== 1) svg.setAttribute('height', bbox.height);

      // serialize our node
      var svgData = (new XMLSerializer()).serializeToString(svg);
      // remember to encode special chars
      var svgURL = 'data:image/svg+xml; charset=utf8, ' + encodeURIComponent(svgData);

      var svgImg = new Image();

      svgImg.onload = function() {
        var canvas = document.createElement('canvas');
        // IE11 doesn't set a width on svg images...
        canvas.width = this.width || bbox.width;
        canvas.height = this.height || bbox.height;

        canvas.getContext('2d').drawImage(svgImg, 0, 0, canvas.width, canvas.height);
        doSomethingWith(canvas);
      };

      svgImg.src = svgURL;
    };

    // lauch parse
    parseImages();

}); // end Template
