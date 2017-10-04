EditorUi.prototype.imageLoad = function(url, onload, onerror) {
  var img = new Image();
  img.onload = function() {
    onload(img);
  }
  if (onerror != null) {
    img.onerror = onerror;
  }
  img.src = url;
};

EditorUi.prototype.insertImage = function(img,x,y){
    var data = img.src || '';
    if(data =='')
      return;

    var w = Math.max(1, img.width);
    var h = Math.max(1, img.height);

    // Converts format of data url to cell style value for use in vertex
    var semi = data.indexOf(';');
    if (semi > 0)	{
      data = data.substring(0, semi) + data.substring(data.indexOf(',', semi + 1));
    }
    var graph = this.editor.graph;
    graph.setSelectionCell(graph.insertVertex(null, null, '', x, y, w, h,
        'shape=image;aspect=fixed;image=' + data + ';'));
}

EditorUi.prototype.handleFiles = function(files,x,y){
  for (var i = 0; i < files.length; i++) {
    // get the next file that the user selected
    var file = files[i];
    var imageType = /image.*/;

    // don't try to process non-images
    if (!file.type.match(imageType)) {
      continue;
    }

    // a seed img element for the FileReader
    var img = document.createElement("img");
    img.classList.add("obj");
    img.file = file;

    // get an image file from the user
    // this uses drag/drop, but you could substitute file-browsing
    var positionImage = {};
    var offsetPoint = 0;
    var reader = new FileReader();
    var self = this;
    reader.onload = (function(image) {
      return function(e) {
        image.onload = function() {
          var canvas = document.createElement("canvas");
  				if(image.height > MAX_HEIGHT) {
  					image.width *= MAX_HEIGHT / image.height;
  					image.height = MAX_HEIGHT;
  				}
  				var ctx = canvas.getContext("2d");
  				ctx.clearRect(0, 0, canvas.width, canvas.height);
  				canvas.width = image.width;
  				canvas.height = image.height;
  				ctx.drawImage(image, 0, 0, image.width, image.height);
          if(offsetPoint == 0){
            positionImage.x = x-(image.width/2)+offsetPoint;
            positionImage.y = y-(image.height/2)+offsetPoint;

          }else{
            positionImage.x += offsetPoint;
            positionImage.y += offsetPoint;
          }
  				self.insertImage(image,positionImage.x,positionImage.y);
          offsetPoint +=10;
        }
        image.src = e.target.result;
      };
    })(img);
    reader.readAsDataURL(file);
  } // end for
};


/**
 * Highlights the element
 */
EditorUi.prototype.highlightContainer = function(element)
{
  var x = 0;
  var y = 0;
  var w = 0;
  var h = 0;

  if (element == null)
  {
    var b = document.body;
    var d = document.documentElement;

    w = (b.clientWidth || d.clientWidth) - 3;
    h = Math.max(b.clientHeight || 0, d.clientHeight) - 3;
  }
  else
  {
    x = element.offsetTop;
    y = element.offsetLeft;
    w = element.clientWidth;
    h = element.clientHeight;
  }

  var div = document.createElement('div');
  div.style.zIndex = mxg.mxPopupMenu.prototype.zIndex + 2;
  div.style.border = '2px solid #67d2bc';
  div.style.pointerEvents = 'none';
  div.style.position = 'absolute';
  div.style.left = y+'px';
  div.style.top = x+'px';
  div.style.width = Math.max(0, w - 3) + 'px';
  div.style.height = Math.max(0, h - 3) + 'px';

  if (element != null && element.parentNode == this.editor.graph.container)
    this.editor.graph.container.appendChild(div);
  else
    document.body.appendChild(div);

  return div;
};
