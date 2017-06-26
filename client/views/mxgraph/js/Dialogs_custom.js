import { Random } from 'meteor/random'

/**
 * Constructs a new about dialog.
 */
noDrawDialog = function(editorUi,message)
{
	var div = document.createElement('div');
	div.setAttribute('align', 'center');
	var h2 = document.createElement('h2');
	mxg.mxUtils.write(h2, message);
	div.appendChild(h2);

	var img = document.createElement('img');
	img.style.border = '0px';
	img.setAttribute('width', '176');
	img.setAttribute('width', '151');
	img.setAttribute('src', IMAGE_PATH + '/logo.png');
	div.appendChild(img);
	mxg.mxUtils.br(div);
	mxg.mxUtils.write(div, 'Powered by mxGraph ' + mxClient.VERSION);
	mxg.mxUtils.br(div);
	var link = document.createElement('a');
	link.setAttribute('href', 'http://www.mxgraph.com/');
	link.setAttribute('target', '_blank');
	mxg.mxUtils.write(link, 'www.jgraph.com');
	div.appendChild(link);
	mxg.mxUtils.br(div);
	mxg.mxUtils.br(div);

	this.container = div;
};

confirmExitEditor = function(ui){
	var container = document.createElement('div');

	var div = document.createElement('div');
	div.setAttribute('align', 'center');
	var h2 = document.createElement('h2');
	mxg.mxUtils.write(h2, 'Exit without save ?');
	div.appendChild(h2);
	div.style.marginTop = "-10px";

	var divFooter = document.createElement('div');
	divFooter.setAttribute('align', 'right');

	var cancelBtn = mxUtils.button(mxResources.get('cancel'), function() {
		ui.hideDialog();
	});
	cancelBtn.className = 'geBtn';

	var okBtn = mxUtils.button(mxResources.get('ok'), function() {
		ui.hideDialog();

		// if parent window remove dialog with iframe with a postmessage
		if(!(window.location != window.parent.location))
			window.parent.postMessage("Close.Iframe","*");
	});
	okBtn.className = 'geBtn gePrimaryBtn';

	divFooter.appendChild(cancelBtn);
	divFooter.appendChild(okBtn);
	divFooter.style.position = 'absolute';
	divFooter.style.bottom = '15px';
	divFooter.style.right = '20px';

	container.appendChild(div);
	container.appendChild(divFooter);
	var onClose = function(){
		ui.hideDialog();
	}
	ui.showDialog(container, 280, 110, true, false, onClose);

	this.container = container;
}

waitDialog = function(ui) {
	var container = document.createElement('div');
	container.id = 'wait-message';
	container.innerHTML = 'Save in progress..';

	this.init = function()	{

	};
	this.container = container;
};


/**
 * Constructs a new import image dialog.
 */
ImageImportDialog = function(editorUi) {
	var div = document.createElement('div');
	div.style.textAlign = 'right';

	var divUpload = document.createElement('div');
	divUpload.id = 'uploader';
	var p = document.createElement('p');
	p.text = 'Drag here your images for preview';
	divUpload.appendChild(p);

	var imgPreview = document.createElement('img');
	divUpload.appendChild(imgPreview);
	divUpload.addEventListener('click',handleImage);

	var imageLoader = document.createElement('input');
	imageLoader.type = 'file';
	imageLoader.name = 'userprofile_picture'
	imageLoader.id = 'filePhoto';
//	imageLoader.setAttribute('multiple','multiple');
	imageLoader.addEventListener('change', handleImage, false);

	div.appendChild(divUpload);
	div.appendChild(imageLoader);

	this.init = function()	{

	};

	function handleImage(e) {
		var file = e.target.files[0];
		var reader = new FileReader();
  	reader.onload = function (event) {
			var data = event.target.result;
			imgPreview.src = data ;
			p.style.display = 'none';
  	};
  	if(file)
			reader.readAsDataURL(file);
	};

  imageLoader.addEventListener('change', handleImage, false);

	divUpload.addEventListener("dragenter", dragenter, false);
	divUpload.addEventListener("dragover", dragover, false);
	divUpload.addEventListener("drop", drop, false);
	function dragenter(e) {
  	e.stopPropagation();
  	e.preventDefault();
	}

	function dragover(e) {
  	e.stopPropagation();
  	e.preventDefault();
	}

	function drop(e) {
  	e.stopPropagation();
  	e.preventDefault();
  	//you can check e's properties
  	//console.log(e);
  	var dt = e.dataTransfer;
  	var files = dt.files;
  	//this code line fires your 'handleImage' function (imageLoader change event)
  	imageLoader.files = files;
	}

	var cancelBtn = mxUtils.button(mxResources.get('cancel'), function(){
		editorUi.hideDialog();
	});
	cancelBtn.className = 'geBtn';
	div.appendChild(cancelBtn);

	var okBtn = mxUtils.button(mxResources.get('ok'), function(e){
			var graph = editorUi.editor.graph;

			var pt = mxUtils.convertPoint(graph.container, mxEvent.getClientX(e), mxEvent.getClientY(e));
			var tr = graph.view.translate;
			var scale = graph.view.scale;
			var x = pt.x / scale - tr.x;
			var y = pt.y / scale - tr.y;

			var data = imgPreview.src;

			//	img.onload = function() {
				var w = Math.max(1, imgPreview.width);
				var h = Math.max(1, imgPreview.height);
				//			console.log('w='+w+' h='+h);
				// Converts format of data url to cell style value for use in vertex
				var semi = data.indexOf(';');
				if (semi > 0)	{
					data = data.substring(0, semi) + data.substring(data.indexOf(',', semi + 1));
				}
				//graph.insertVertex(null, null, '', x, y, w, h, 'shape=image;image=' + data + ';');
				var bundle = new mxg.mxImageBundle();
				var parent = graph.getDefaultParent();
				var name = Random.id;
				bundle.putImage(name, data);

				//graph.insertVertex(parent, null, '', 100, 20, 130, 80, 'shape=image;image=' + name);
				//graph.insertVertex(parent, null, '', 100, 20, w, h, 'shape=image;image='+bundle.getImage(name)+';');

				graph.clearSelection();
				graph.insertVertex(parent, null, '', 100, 20, w, h, 'shape=image;html=1;imageAspect=0;image='+data+';');

				//		};
				//		img.src = data;
				editorUi.hideDialog();
		});

	okBtn.className = 'geBtn gePrimaryBtn';
	div.appendChild(okBtn);

	this.container = div;
};
