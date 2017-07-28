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
	//console.log(ui.editor.modified);
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
		// if parent window remove dialog with iframe with a postmessage
		//if(!(window.location != window.parent.location))

		window.parent.postMessage("Close.Iframe","*");
		ui.hideDialog();
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

waitDialog = function(ui,msg) {
	var container = document.createElement('div');
	container.id = 'wait-message';
	container.innerHTML = msg;

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

////////////////////////////////////

BackgroundImageDialog = function(editorUi, applyFn) {
	var div = document.createElement('div');
	div.style.whiteSpace = 'nowrap';

	var h3 = document.createElement('h2');
	mxUtils.write(h3, mxResources.get('backgroundImage'));
	h3.style.marginTop = '0px';
	div.appendChild(h3);

	mxUtils.write(div, mxResources.get('image') + ' ' + mxResources.get('url') + ':');
	mxUtils.br(div);

	var img = editorUi.editor.graph.backgroundImage;

	var urlInput = document.createElement('input');
	urlInput.setAttribute('type', 'text');
	urlInput.style.marginTop = '4px';
	urlInput.style.marginBottom = '4px';
	urlInput.style.width = '350px';
	urlInput.value = (img != null && typeof(img) !='undefined') ? img.src : '';

	var resetting = false;
	var urlChanged = function()
	{
		if (!resetting && urlInput.value != '' )
		{
			/*
			editorUi.loadImage(mxUtils.trim(urlInput.value), function(img)
			{
				widthInput.value = img.width;
				heightInput.value = img.height;
			}, function()
			{
				editorUi.showError(mxResources.get('error'), mxResources.get('fileNotFound'), mxResources.get('ok'));
				urlInput.value = '';
				widthInput.value = '';
				heightInput.value = '';
			});
			*/
		}
		else
		{
			widthInput.value = '';
			heightInput.value = '';
		}
	};

	this.init = function()
	{
		urlInput.focus();

		// Installs drag and drop handler for local images and links
		if (Graph.fileSupport)
		{
			urlInput.setAttribute('placeholder', mxResources.get('dragImagesHere'));

			// Setup the dnd listeners
			var dlg = div.parentNode;
			var graph = editorUi.editor.graph;
			var dropElt = null;

			mxEvent.addListener(dlg, 'dragleave', function(evt)
			{
				if (dropElt != null)
			    {
			    	dropElt.parentNode.removeChild(dropElt);
			    	dropElt = null;
			    }

				evt.stopPropagation();
				evt.preventDefault();
			});

			mxEvent.addListener(dlg, 'dragover', mxUtils.bind(this, function(evt)
			{
				evt.stopPropagation();
				evt.preventDefault();
			}));



			mxEvent.addListener(dlg, 'drop', mxUtils.bind(this, function(evt)
			{
					var maxSize 	= (maxSize != null) ? maxSize : editorUi.maxImageSize;
					var maxBytes 	= (maxBytes != null) ? maxBytes : editorUi.maxImageBytes;
					var w = editorUi.editor.graph.pageFormat.width;
					var h = editorUi.editor.graph.pageFormat.height;
			    if (dropElt != null)
			    {
			    	dropElt.parentNode.removeChild(dropElt);
			    	dropElt = null;
			    }

			    if (evt.dataTransfer.files.length > 0) {
						// read image file and setBackgroundImage
						var file = evt.dataTransfer.files[0];
						if(file.size > maxBytes){
							editorUi.showError(mxResources.get('error'), mxResources.get('imageTooBig'), mxResources.get('ok'));
						} else {
							var reader = new FileReader();
							//var loader = new waitDialog(editorUi,mxResources.get('loading'));
				  		reader.onload = function (evt) {

								var data = evt.target.result;
								urlInput.value = data;
								var image = new Image();
								image.src = data;
								//urlChanged();

								if(image.width>0 && image.height>0){
									widthInput.value = image.width;
									heightInput.value = image.height;
								}else{
									widthInput.value = w;
									heightInput.value = h;
								}

								editorUi.setBackgroundImage(data);
								//editorUi.hideDialog();
				  		};
				  		if(file){
								//editorUi.showDialog(loader.container, 250, 50, true, false);
								reader.readAsDataURL(file);
							}
						}
					}
			    evt.stopPropagation();
			    evt.preventDefault();
			}), false);
		}
	};

	div.appendChild(urlInput);
	mxUtils.br(div);
	mxUtils.br(div);

	mxUtils.write(div, mxResources.get('width') + ':');

	var widthInput = document.createElement('input');
	widthInput.setAttribute('type', 'text');
	widthInput.style.width = '60px';
	widthInput.style.marginLeft = '4px';
	widthInput.style.marginRight = '16px';
	widthInput.value = (img != null && typeof(img) !='undefined') ? img.width : '';

	div.appendChild(widthInput);

	mxUtils.write(div, mxResources.get('height') + ':');

	var heightInput = document.createElement('input');
	heightInput.setAttribute('type', 'text');
	heightInput.style.width = '60px';
	heightInput.style.marginLeft = '4px';
	heightInput.style.marginRight = '16px';
	heightInput.value = (img != null && typeof(img) !='undefined') ? img.height : '';

	div.appendChild(heightInput);

	var resetBtn = mxUtils.button(mxResources.get('reset'), function()
	{
		urlInput.value = '';
		widthInput.value = '';
		heightInput.value = '';
		resetting = false;
	});
	mxEvent.addListener(resetBtn, 'mousedown', function()
	{
		// Blocks processing a image URL while clicking reset
		resetting = true;
	});
	mxEvent.addListener(resetBtn, 'touchstart', function()
	{
		// Blocks processing a image URL while clicking reset
		resetting = true;
	});
	resetBtn.className = 'geBtn';
	resetBtn.width = '100';
	div.appendChild(resetBtn);
	mxUtils.br(div);

	mxEvent.addListener(urlInput, 'change', urlChanged);

	var btns = document.createElement('div');
	btns.style.marginTop = '40px';
	btns.style.textAlign = 'right';

	var cancelBtn = mxUtils.button(mxResources.get('cancel'), function()
	{
		editorUi.hideDialog();
	});

	cancelBtn.className = 'geBtn';

	if (editorUi.editor.cancelFirst)
	{
		btns.appendChild(cancelBtn);
	}

	var applyBtn = mxUtils.button(mxResources.get('apply'), function()
	{
		editorUi.hideDialog();
		applyFn((urlInput.value != '') ? new mxImage(mxUtils.trim(urlInput.value), widthInput.value, heightInput.value) : null);
	});
	applyBtn.className = 'geBtn gePrimaryBtn';
	btns.appendChild(applyBtn);

	if (!editorUi.editor.cancelFirst)
	{
		btns.appendChild(cancelBtn);
	}

	div.appendChild(btns);

	this.container = div;
};


/**
 *
 */
ErrorDialog = function(editorUi, title, message, buttonText, fn, hide)
{
	hide = (hide != null) ? hide : true;

	var div = document.createElement('div');
	div.style.textAlign = 'center';

	if (title != null)
	{
		var hd = document.createElement('div');
		hd.style.padding = '0px';
		hd.style.margin = '0px';
		hd.style.fontSize = '18px';
		hd.style.paddingBottom = '16px';
		hd.style.marginBottom = '16px';
		hd.style.borderBottom = '1px solid #c0c0c0';
		hd.style.color = 'gray';
		mxUtils.write(hd, title);
		div.appendChild(hd);
	}

	var p2 = document.createElement('div');
	p2.style.padding = '6px';
	p2.innerHTML = message;
	div.appendChild(p2);

	var btns = document.createElement('div');
	btns.style.marginTop = '16px';
	btns.style.textAlign = 'right';

	var btn = mxUtils.button(buttonText, function()
	{
		if (hide)	{
			editorUi.hideDialog();
		}

		if (fn != null)	{
			fn();
		}
	});
	btn.className = 'geBtn';

	btns.appendChild(btn);

	this.init = function(){
		btn.focus();
	};

	div.appendChild(btns);

	this.container = div;
};
