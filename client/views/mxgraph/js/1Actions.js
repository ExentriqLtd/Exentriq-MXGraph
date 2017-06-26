/**
 * Copyright (c) 2006-2012, JGraph Ltd
 */
/**
 * Constructs the actions object for the given UI.
 */
Actions = function(editorUi)
{
	this.editorUi = editorUi;
	this.actions = new Object();
	this.init();
};

/**
 * Adds the default actions.
 */
Actions.prototype.init = function()
{
	var ui = this.editorUi;
	var editor = ui.editor;
	var graph = editor.graph;
	var isGraphEnabled = function()	{
		return Action.prototype.isEnabled.apply(this, arguments) && graph.isEnabled();
	};

//	File actions
//	this.addAction('new...', function() { window.open(ui.getUrl()); });
/*
	this.addAction('open...', function(){
		window.openNew = true;
		window.openKey = 'open';
		ui.openFile();
	});

	this.addAction('import...', function(){
		window.openNew = false;
		window.openKey = 'import';

		// Closes dialog after open
		window.openFile = new OpenFile(mxUtils.bind(this, function(){
			ui.hideDialog();
		}));

		window.openFile.setConsumer(mxUtils.bind(this, function(xml, filename){
			try
			{
				var doc = mxUtils.parseXml(xml);
				var model = new mxg.mxGraphModel();
				var codec = new mxg.mxCodec(doc);
				codec.decode(doc.documentElement, model);

				var children = model.getChildren(model.getChildAt(model.getRoot(), 0));
				editor.graph.setSelectionCells(editor.graph.importCells(children));
			}	catch (e)	{
				mxUtils.alert(mxResources.get('invalidOrMissingFile') + ': ' + e.message);
			}
		}));

		// Removes openFile if dialog is closed
		ui.showDialog(new OpenDialog(this).container, 320, 220, true, true, function(){
			window.openFile = null;
		});
	}).isEnabled = isGraphEnabled;
*/

//this.addAction('save', function() { ui.saveFile(false); }, null, null, 'Ctrl+S').isEnabled = isGraphEnabled;
	this.addAction('save', function() {
/*
			var divOverlay = document.createElement('div')
			divOverlay.className = "overlay";
			divOverlay.style.width = "100%";
			divOverlay.style.opacity = 0.8;
			var divContent = document.createElement('div')
			divContent.className = "overlay-content"
			divContent.innerHTML = "<p>Saving...</p>"
			divOverlay.appendChild(divContent);
			document.body.appendChild(divOverlay);
*/
			var dlg = new waitDialog(ui);
			ui.showDialog(dlg.container, 250, 50, true, true);
			Meteor.setTimeout(
				function(){
						savemxGraph();
			},1000);

//		ui.editor.filename = 'DRAW_'+Router.current().params.query.id;
//		ui.saveFile(true);
	}, null, null, 'Ctrl+S').isEnabled = isGraphEnabled;

	this.addAction('exit', function() {
			if(ui.editor.modified){
				confirmExitEditor(ui);
				return;
			}
			// parent window remove dialog with iframe
			window.parent.postMessage("Close Iframe","*");
	}, null, null, null).isEnabled = isGraphEnabled;

//this.addAction('saveAs...', function() { ui.saveFile(true); }, null, null, 'Ctrl+Shift+S').isEnabled = isGraphEnabled;
//this.addAction('export...', function() { ui.showDialog(new ExportDialog(ui).container, 300, 230, true, true); });

// Saved graph
 	var savemxGraph = function(){
		var idgraph = Router.current().params.query.id;
		if (ui.editor.graph.isEditing()){
			ui.editor.graph.stopEditing();
		}

/*
		ui.editor.setModified(true);
		ui.editor.graph.stopEditing();
		ui.editor.graph.model.endUpdate();
		ui.editor.updateGraphComponents();
		ui.editor.graph.stopEditing(true);
*/
		var xmlData = mxUtils.getXml(ui.editor.getGraphXml());
		var graph = ui.editor.graph;
		var bg = graph.background;
		//console.log("BG="+xmlData);
	  if (bg == null || bg == mxConstants.NONE){
			bg = '#ffffff';
		}
		var s = 1; //Math.max(0, parseFloat(zoomInput.value) || 100) / 100;
		var b = 0; //Math.max(0, parseInt(borderInput.value) || 0);

		var bounds = graph.getGraphBounds();
    var w = Math.round(bounds.x + bounds.width + 4);
		var h = Math.round(bounds.y + bounds.height + 4);
		var xml = mxUtils.getXml(mxUtils.getViewXml(graph, 1), '\n');
//	new mxXmlRequest(EXPORT_URL, 'filename=graph.jpg&format=jpeg&w=' + w +'&h=' + h + '&xml=' + encodeURIComponent(xml)).simulate(document, '_blank');
/*
		console.log(graph.pageFormat.width);// = this.graph.defaultPageVisible;
		console.log(graph.pageFormat.height);// = this.graph.defaultPageVisible;
		console.log(graph.pageScale);// = this.graph.defaultPageVisible;
		console.log(graph.background);// = this.graph.defaultPageVisible;
		console.log("HH="+ $("#heightInput").val() );
*/
		var xmlSvg = mxUtils.getXml(graph.getSvg(bg, s, b));

		var container = document.createElement('div');
    container.id = "exentiqGraph"
    container.style.overflow = "hidden";
    container.style.border = "0px solid red";
    container.innerHTML = xmlSvg;
    document.body.appendChild(container);

		var svg = container.querySelector('svg');
		var saveCanvas = function(canvas) {
			$(container).hide();
			document.body.appendChild(canvas);
			// export XML,and save image
			var buffer = canvas.toDataURL();
			if(idgraph !== null){
				return Meteor.call('mxgSaveXML',idgraph,xmlData,xmlSvg,buffer,function (err, id) {
					if (!err) {
						ui.editor.setStatus(mxResources.get('saved') + ' ' + new Date());
//					ui.editor.graph.startEditing();
						console.log("CANVAS SAVED!!");
						ui.hideDialog();
					}
					return xmlData;
				});
			}
		};

		function parseImages() {
			var xlinkNS = "http://www.w3.org/1999/xlink";
			var total, encoded;
			// convert an external bitmap image to a dataURL
			function toDataURL(image) {
				var img = new Image();
				// CORS workaround, this won't work in IE<11
				// If you are sure you don't need it, remove the next line and the double onerror handler
				// First try with crossorigin set, it should fire an error if not needed
				try{
					img.crossOrigin = 'anonymous';
				}catch(e){
					console.log("Error="+e);
				}
				img.onload = function() {
					// we should now be able to draw it without tainting the canvas
					var canvas = document.createElement('canvas');
					canvas.width = this.width;
					canvas.height = this.height;
					// draw the loaded image
					canvas.getContext('2d').drawImage(this, 0, 0);
					// set our <image>'s href attribute to the dataURL of our canvas
					image.setAttributeNS(xlinkNS, 'href', canvas.toDataURL());
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
						toDataURL(element);
					}
				};
				xhr.onerror = function() {
					toDataURL(element);
				};
				xhr.open('GET', url);
				xhr.send();
			};

			var images = svg.querySelectorAll('image');
			var total = images.length;
			var encoded = 0;

			// loop through all our <images> elements
			for (var i = 0; i < images.length; i++) {
				var href = images[i].getAttributeNS(xlinkNS, 'href');
				// check if the image is external
				if (href.indexOf('data:image') < 0) {
					// if it points to another svg element
					if (href.indexOf('.svg') > 0) {
						parseFromUrl(href, images[i]);
					} else // a pixel image
						toDataURL(images[i]);
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
				saveCanvas(canvas);
			};
			svgImg.src = svgURL;
		};
		// lauch parse
		parseImages();
	}; // end of saveMxGraph

	this.addAction('editDiagram...', function(){
		var dlg = new EditDiagramDialog(ui);
		ui.showDialog(dlg.container, 620, 420, true, true);
		dlg.init();
	});
	this.addAction('pageSetup...', function() { ui.showDialog(new PageSetupDialog(ui).container, 320, 220, true, true); }).isEnabled = isGraphEnabled;
	this.addAction('print...', function() { ui.showDialog(new PrintDialog(ui).container, 300, 180, true, true); }, null, 'sprite-print', 'Ctrl+P');
	this.addAction('preview', function() { mxUtils.show(graph, null, 10, 10); });

	// Edit actions
	this.addAction('undo', function() { ui.undo(); }, null, 'sprite-undo', 'Ctrl+Z');
	this.addAction('redo', function() { ui.redo(); }, null, 'sprite-redo', (!mxClient.IS_WIN) ? 'Ctrl+Shift+Z' : 'Ctrl+Y');
	this.addAction('cut', function() { mxClipboard.cut(graph); }, null, 'sprite-cut', 'Ctrl+X');
	this.addAction('copy', function() { mxClipboard.copy(graph); }, null, 'sprite-copy', 'Ctrl+C');
	this.addAction('paste', function()
	{
		if (graph.isEnabled() && !graph.isCellLocked(graph.getDefaultParent()))
		{
			mxClipboard.paste(graph);
		}
	}, false, 'sprite-paste', 'Ctrl+V');
	this.addAction('pasteHere', function(evt)
	{
		if (graph.isEnabled() && !graph.isCellLocked(graph.getDefaultParent()))
		{
			graph.getModel().beginUpdate();
			try
			{
				var cells = mxClipboard.paste(graph);

				if (cells != null)
				{
					var bb = graph.getBoundingBoxFromGeometry(cells);

					if (bb != null)
					{
						var t = graph.view.translate;
						var s = graph.view.scale;
						var dx = t.x;
						var dy = t.y;

						var x = Math.round(graph.snap(graph.popupMenuHandler.triggerX / s - dx));
						var y = Math.round(graph.snap(graph.popupMenuHandler.triggerY / s - dy));

						graph.cellsMoved(cells, x - bb.x, y - bb.y);
					}
				}
			}
			finally
			{
				graph.getModel().endUpdate();
			}
		}
	});

	function deleteCells(includeEdges)
	{
		// Cancels interactive operations
		graph.escape();
		var cells = graph.getDeletableCells(graph.getSelectionCells());

		if (cells != null && cells.length > 0)
		{
			var parents = graph.model.getParents(cells);
			graph.removeCells(cells, includeEdges);

			// Selects parents for easier editing of groups
			if (parents != null)
			{
				var select = [];

				for (var i = 0; i < parents.length; i++)
				{
					if (graph.model.isVertex(parents[i]) || graph.model.isEdge(parents[i]))
					{
						select.push(parents[i]);
					}
				}

				graph.setSelectionCells(select);
			}
		}
	};

	this.addAction('delete', function(evt)
	{
		deleteCells(evt != null && mxEvent.isShiftDown(evt));
	}, null, null, 'Delete');
	this.addAction('deleteAll', function()
	{
		deleteCells(true);
	}, null, null, 'Ctrl+Delete');
	this.addAction('duplicate', function()
	{
		graph.setSelectionCells(graph.duplicateCells());
	}, null, null, 'Ctrl+D');
	this.put('turn', new Action(mxResources.get('turn') + ' / ' + mxResources.get('reverse'), function()
	{
		graph.turnShapes(graph.getSelectionCells());
	}, null, null, 'Ctrl+R'));
	this.addAction('selectVertices', function() { graph.selectVertices(); }, null, null, 'Ctrl+Shift+I');
	this.addAction('selectEdges', function() { graph.selectEdges(); }, null, null, 'Ctrl+Shift+E');
	this.addAction('selectAll', function() { graph.selectAll(null, true); }, null, null, 'Ctrl+A');
	this.addAction('selectNone', function() { graph.clearSelection(); }, null, null, 'Ctrl+Shift+A');
	this.addAction('lockUnlock', function()
	{
		if (!graph.isSelectionEmpty())
		{
			graph.getModel().beginUpdate();
			try
			{
				var defaultValue = graph.isCellMovable(graph.getSelectionCell()) ? 1 : 0;
				graph.toggleCellStyles(mxConstants.STYLE_MOVABLE, defaultValue);
				graph.toggleCellStyles(mxConstants.STYLE_RESIZABLE, defaultValue);
				graph.toggleCellStyles(mxConstants.STYLE_ROTATABLE, defaultValue);
				graph.toggleCellStyles(mxConstants.STYLE_DELETABLE, defaultValue);
				graph.toggleCellStyles(mxConstants.STYLE_EDITABLE, defaultValue);
				graph.toggleCellStyles('connectable', defaultValue);
			}
			finally
			{
				graph.getModel().endUpdate();
			}
		}
	}, null, null, 'Ctrl+L');

	// Navigation actions
	this.addAction('home', function() { graph.home(); }, null, null, 'Home');
	this.addAction('exitGroup', function() { graph.exitGroup(); }, null, null, 'Ctrl+Shift+Page Up');
	this.addAction('enterGroup', function() { graph.enterGroup(); }, null, null, 'Ctrl+Shift+Page Down');
	this.addAction('expand', function() { graph.foldCells(false); }, null, null, 'Ctrl+Page Down');
	this.addAction('collapse', function() { graph.foldCells(true); }, null, null, 'Ctrl+Page Up');

	// Arrange actions
	this.addAction('toFront', function() { graph.orderCells(false); }, null, null, 'Ctrl+Shift+F');
	this.addAction('toBack', function() { graph.orderCells(true); }, null, null, 'Ctrl+Shift+B');
	this.addAction('group', function()
	{
		if (graph.getSelectionCount() == 1)
		{
			graph.setCellStyles('container', '1');
		}
		else
		{
			graph.setSelectionCell(graph.groupCells(null, 0));
		}
	}, null, null, 'Ctrl+G');
	this.addAction('ungroup', function()
	{
		if (graph.getSelectionCount() == 1 && graph.getModel().getChildCount(graph.getSelectionCell()) == 0)
		{
			graph.setCellStyles('container', '0');
		}
		else
		{
			graph.setSelectionCells(graph.ungroupCells());
		}
	}, null, null, 'Ctrl+Shift+U');
	this.addAction('removeFromGroup', function() { graph.removeCellsFromParent(); });
	// Adds action
	this.addAction('edit', function()
	{
		if (graph.isEnabled())
		{
			graph.startEditingAtCell();
		}
	}, null, null, 'F2/Enter');
	this.addAction('editData...', function()
	{
		var cell = graph.getSelectionCell() || graph.getModel().getRoot();

		if (cell != null)
		{
			var dlg = new EditDataDialog(ui, cell);
			ui.showDialog(dlg.container, 320, 320, true, false);
			dlg.init();
		}
	}, null, null, 'Ctrl+M');
	this.addAction('editTooltip...', function()
	{
		var graph = ui.editor.graph;

		if (graph.isEnabled() && !graph.isSelectionEmpty())
		{
			var cell = graph.getSelectionCell();
			var tooltip = '';

			if (mxUtils.isNode(cell.value))
			{
				var tmp = cell.value.getAttribute('tooltip');

				if (tmp != null)
				{
					tooltip = tmp;
				}
			}

	    	var dlg = new TextareaDialog(ui, mxResources.get('editTooltip') + ':', tooltip, function(newValue)
			{
				graph.setTooltipForCell(cell, newValue);
			});
			ui.showDialog(dlg.container, 320, 200, true, true);
			dlg.init();
		}
	});
	this.addAction('openLink', function()
	{
		var link = graph.getLinkForCell(graph.getSelectionCell());

		if (link != null)
		{
			window.open(link);
		}
	});
	this.addAction('editLink...', function()
	{
		var graph = ui.editor.graph;

		if (graph.isEnabled() && !graph.isSelectionEmpty())
		{
			var cell = graph.getSelectionCell();
			var value = graph.getLinkForCell(cell) || '';

			ui.showLinkDialog(value, mxResources.get('apply'), function(link)
			{
				link = mxUtils.trim(link);
    			graph.setLinkForCell(cell, (link.length > 0) ? link : null);
			});
		}
	});

	this.addAction('insertLink...', function()
	{
		if (graph.isEnabled() && !graph.isCellLocked(graph.getDefaultParent()))
		{
			var dlg = new LinkDialog(ui, '', mxResources.get('insert'), function(link, docs)
			{
				link = mxUtils.trim(link);

				if (link.length > 0)
				{
					var title = link.substring(link.lastIndexOf('/') + 1);
					var icon = null;

					if (docs != null && docs.length > 0)
					{
						icon = docs[0].iconUrl;
						title = docs[0].name || docs[0].type;
						title = title.charAt(0).toUpperCase() + title.substring(1);

						if (title.length > 30)
						{
							title = title.substring(0, 30) + '...';
						}
					}

					var pt = graph.getFreeInsertPoint();
            		var linkCell = new mxg.mxCell(title, new mxg.mxGeometry(pt.x, pt.y, 100, 40),
            	    	'fontColor=#0000EE;fontStyle=4;rounded=1;overflow=hidden;' + ((icon != null) ?
            	    	'shape=label;imageWidth=16;imageHeight=16;spacingLeft=26;align=left;image=' + icon :
            	    	'spacing=10;'));
            	    linkCell.vertex = true;

            	    graph.setLinkForCell(linkCell, link);
            	    graph.cellSizeUpdated(linkCell, true);
            	    graph.setSelectionCell(graph.addCell(linkCell));
            	    graph.scrollCellToVisible(graph.getSelectionCell());
				}
			});

			ui.showDialog(dlg.container, 420, 90, true, true);
			dlg.init();
		}
	}).isEnabled = isGraphEnabled;
	this.addAction('link...', mxUtils.bind(this, function()
	{
		var graph = ui.editor.graph;

		if (graph.isEnabled())
		{
			if (graph.cellEditor.isContentEditing())
			{
				var link = graph.getParentByName(graph.getSelectedElement(), 'A', graph.cellEditor.textarea);
				var oldValue = '';

				if (link != null)
				{
					oldValue = link.getAttribute('href') || '';
				}

				var selState = graph.cellEditor.saveSelection();

				ui.showLinkDialog(oldValue, mxResources.get('apply'), mxUtils.bind(this, function(value)
				{
		    		graph.cellEditor.restoreSelection(selState);

		    		if (value != null)
		    		{
		    			graph.insertLink(value);
					}
				}));
			}
			else if (graph.isSelectionEmpty())
			{
				this.get('insertLink').funct();
			}
			else
			{
				this.get('editLink').funct();
			}
		}
	})).isEnabled = isGraphEnabled;
	this.addAction('autosize', function()
	{
		var cells = graph.getSelectionCells();

		if (cells != null)
		{
			graph.getModel().beginUpdate();
			try
			{
				for (var i = 0; i < cells.length; i++)
				{
					var cell = cells[i];

					if (graph.getModel().getChildCount(cell))
					{
						graph.updateGroupBounds([cell], 20);
					}
					else
					{
						var state = graph.view.getState(cell);
						var geo = graph.getCellGeometry(cell);

						if (graph.getModel().isVertex(cell) && state != null && state.text != null &&
							geo != null && graph.isWrapping(cell))
						{
							geo = geo.clone();
							geo.height = state.text.boundingBox.height / graph.view.scale;
							graph.getModel().setGeometry(cell, geo);
						}
						else
						{
							graph.updateCellSize(cell);
						}
					}
				}
			}
			finally
			{
				graph.getModel().endUpdate();
			}
		}
	}, null, null, 'Ctrl+Shift+Y');
	this.addAction('formattedText', function()
	{
    	var state = graph.getView().getState(graph.getSelectionCell());

    	if (state != null)
    	{
	    	var value = '1';
	    	graph.stopEditing();

			graph.getModel().beginUpdate();
			try
			{
		    	if (state.style['html'] == '1')
		    	{
		    		value = null;
		    		var label = graph.convertValueToString(state.cell);

		    		if (mxUtils.getValue(state.style, 'nl2Br', '1') != '0')
					{
						// Removes newlines from HTML and converts breaks to newlines
						// to match the HTML output in plain text
						label = label.replace(/\n/g, '').replace(/<br\s*.?>/g, '\n');
					}

		    		// Removes HTML tags
	    			var temp = document.createElement('div');
	    			temp.innerHTML = label;
	    			label = mxUtils.extractTextWithWhitespace(temp.childNodes);

					graph.cellLabelChanged(state.cell, label);
		    	}
		    	else
		    	{
		    		// Converts HTML tags to text
		    		var label = mxUtils.htmlEntities(graph.convertValueToString(state.cell), false);

		    		if (mxUtils.getValue(state.style, 'nl2Br', '1') != '0')
					{
						// Converts newlines in plain text to breaks in HTML
						// to match the plain text output
		    			label = label.replace(/\n/g, '<br/>');
					}

		    		graph.cellLabelChanged(state.cell, graph.sanitizeHtml(label));
		    	}

		       	graph.setCellStyles('html', value);
				ui.fireEvent(new mxg.mxEventObject('styleChanged', 'keys', ['html'],
						'values', [(value != null) ? value : '0'], 'cells',
						graph.getSelectionCells()));
			}
			finally
			{
				graph.getModel().endUpdate();
			}
    	}
	});
	this.addAction('wordWrap', function()
	{
    	var state = graph.getView().getState(graph.getSelectionCell());
    	var value = 'wrap';

		graph.stopEditing();

    	if (state != null && state.style[mxConstants.STYLE_WHITE_SPACE] == 'wrap')
    	{
    		value = null;
    	}

       	graph.setCellStyles(mxConstants.STYLE_WHITE_SPACE, value);
	});
	this.addAction('rotation', function()
	{
		var value = '0';
    	var state = graph.getView().getState(graph.getSelectionCell());

    	if (state != null)
    	{
    		value = state.style[mxConstants.STYLE_ROTATION] || value;
    	}

		var dlg = new FilenameDialog(ui, value, mxResources.get('apply'), function(newValue)
		{
			if (newValue != null && newValue.length > 0)
			{
				graph.setCellStyles(mxConstants.STYLE_ROTATION, newValue);
			}
		}, mxResources.get('enterValue') + ' (' + mxResources.get('rotation') + ' 0-360)');

		ui.showDialog(dlg.container, 300, 80, true, true);
		dlg.init();
	});
	// View actions
	this.addAction('resetView', function()
	{
		graph.zoomTo(1);
		ui.resetScrollbars();
	}, null, null, 'Ctrl+H');
	this.addAction('zoomIn', function(evt) { graph.zoomIn(); }, null, null, 'Ctrl + / Alt+Mousewheel');
	this.addAction('zoomOut', function(evt) { graph.zoomOut(); }, null, null, 'Ctrl - / Alt+Mousewheel');
	this.addAction('fitWindow', function() { graph.fit(); }, null, null, 'Ctrl+Shift+H');
	this.addAction('fitPage', mxUtils.bind(this, function()
	{
		if (!graph.pageVisible)
		{
			this.get('pageView').funct();
		}

		var fmt = graph.pageFormat;
		var ps = graph.pageScale;
		var cw = graph.container.clientWidth - 10;
		var ch = graph.container.clientHeight - 10;
		var scale = Math.floor(20 * Math.min(cw / fmt.width / ps, ch / fmt.height / ps)) / 20;
		graph.zoomTo(scale);

		if (mxUtils.hasScrollbars(graph.container))
		{
			var pad = graph.getPagePadding();
			graph.container.scrollTop = pad.y * graph.view.scale;
			graph.container.scrollLeft = Math.min(pad.x * graph.view.scale, (graph.container.scrollWidth - graph.container.clientWidth) / 2);
		}
	}), null, null, 'Ctrl+J');
	this.addAction('fitTwoPages', mxUtils.bind(this, function()
	{
		if (!graph.pageVisible)
		{
			this.get('pageView').funct();
		}

		var fmt = graph.pageFormat;
		var ps = graph.pageScale;
		var cw = graph.container.clientWidth - 10;
		var ch = graph.container.clientHeight - 10;

		var scale = Math.floor(20 * Math.min(cw / (2 * fmt.width) / ps, ch / fmt.height / ps)) / 20;
		graph.zoomTo(scale);

		if (mxUtils.hasScrollbars(graph.container))
		{
			var pad = graph.getPagePadding();
			graph.container.scrollTop = Math.min(pad.y, (graph.container.scrollHeight - graph.container.clientHeight) / 2);
			graph.container.scrollLeft = Math.min(pad.x, (graph.container.scrollWidth - graph.container.clientWidth) / 2);
		}
	}), null, null, 'Ctrl+Shift+J');
	this.addAction('fitPageWidth', mxUtils.bind(this, function()
	{
		if (!graph.pageVisible)
		{
			this.get('pageView').funct();
		}

		var fmt = graph.pageFormat;
		var ps = graph.pageScale;
		var cw = graph.container.clientWidth - 10;

		var scale = Math.floor(20 * cw / fmt.width / ps) / 20;
		graph.zoomTo(scale);

		if (mxUtils.hasScrollbars(graph.container))
		{
			var pad = graph.getPagePadding();
			graph.container.scrollLeft = Math.min(pad.x * graph.view.scale,
				(graph.container.scrollWidth - graph.container.clientWidth) / 2);
		}
	}));
	this.put('customZoom', new Action(mxResources.get('custom') + '...', mxUtils.bind(this, function()
	{
		var dlg = new FilenameDialog(this.editorUi, parseInt(graph.getView().getScale() * 100), mxResources.get('apply'), mxUtils.bind(this, function(newValue)
		{
			var val = parseInt(newValue);

			if (!isNaN(val) && val > 0)
			{
				graph.zoomTo(val / 100);
			}
		}), mxResources.get('zoom') + ' (%)');
		this.editorUi.showDialog(dlg.container, 300, 80, true, true);
		dlg.init();
	}), null, null, 'Ctrl+0'));
	this.addAction('pageScale...', mxUtils.bind(this, function()
	{
		var dlg = new FilenameDialog(this.editorUi, parseInt(graph.pageScale * 100), mxResources.get('apply'), mxUtils.bind(this, function(newValue)
		{
			var val = parseInt(newValue);

			if (!isNaN(val) && val > 0)
			{
				ui.setPageScale(val / 100);
			}
		}), mxResources.get('pageScale') + ' (%)');
		this.editorUi.showDialog(dlg.container, 300, 80, true, true);
		dlg.init();
	}));

	// Option actions
	var action = null;
	action = this.addAction('grid', function()
	{
		graph.setGridEnabled(!graph.isGridEnabled());
		ui.fireEvent(new mxg.mxEventObject('gridEnabledChanged'));
	}, null, null, 'Ctrl+Shift+G');
	action.setToggleAction(true);
	action.setSelectedCallback(function() { return graph.isGridEnabled(); });
	action.setEnabled(false);

	action = this.addAction('guides', function()
	{
		graph.graphHandler.guidesEnabled = !graph.graphHandler.guidesEnabled;
		ui.fireEvent(new mxg.mxEventObject('guidesEnabledChanged'));
	});
	action.setToggleAction(true);
	action.setSelectedCallback(function() { return graph.graphHandler.guidesEnabled; });
	action.setEnabled(false);

	action = this.addAction('tooltips', function()
	{
		graph.tooltipHandler.setEnabled(!graph.tooltipHandler.isEnabled());
	});
	action.setToggleAction(true);
	action.setSelectedCallback(function() { return graph.tooltipHandler.isEnabled(); });

	action = this.addAction('collapseExpand', function()
	{
		ui.setFoldingEnabled(!graph.foldingEnabled);
	});
	action.setToggleAction(true);
	action.setSelectedCallback(function() { return graph.foldingEnabled; });
	action.isEnabled = isGraphEnabled;
	action = this.addAction('scrollbars', function()
	{
		ui.setScrollbars(!ui.hasScrollbars());
	});
	action.setToggleAction(true);
	action.setSelectedCallback(function() { return graph.scrollbars; });
	action = this.addAction('pageView', mxUtils.bind(this, function()
	{
		ui.setPageVisible(!graph.pageVisible);
	}));
	action.setToggleAction(true);
	action.setSelectedCallback(function() { return graph.pageVisible; });
	this.put('pageBackgroundColor', new Action(mxResources.get('backgroundColor') + '...', function()
	{
		ui.pickColor(graph.background || 'none', function(color)
		{
			ui.setBackgroundColor(color);
		});
	}));
	action = this.addAction('connectionArrows', function()
	{
		graph.connectionArrowsEnabled = !graph.connectionArrowsEnabled;
		ui.fireEvent(new mxg.mxEventObject('connectionArrowsChanged'));
	}, null, null, 'Ctrl+Q');
	action.setToggleAction(true);
	action.setSelectedCallback(function() { return graph.connectionArrowsEnabled; });
	action = this.addAction('connectionPoints', function()
	{
		graph.setConnectable(!graph.connectionHandler.isEnabled());
		ui.fireEvent(new mxg.mxEventObject('connectionPointsChanged'));
	}, null, null, 'Ctrl+Shift+Q');
	action.setToggleAction(true);
	action.setSelectedCallback(function() { return graph.connectionHandler.isEnabled(); });
	action = this.addAction('copyConnect', function()
	{
		graph.connectionHandler.setCreateTarget(!graph.connectionHandler.isCreateTarget());
		ui.fireEvent(new mxg.mxEventObject('copyConnectChanged'));
	});
	action.setToggleAction(true);
	action.setSelectedCallback(function() { return graph.connectionHandler.isCreateTarget(); });
	action.isEnabled = isGraphEnabled;
	action = this.addAction('autosave', function()
	{
		ui.editor.setAutosave(!ui.editor.autosave);
	});
	action.setToggleAction(true);
	action.setSelectedCallback(function() { return ui.editor.autosave; });
	action.isEnabled = isGraphEnabled;
	action.visible = false;

	// Help actions
	this.addAction('help', function()
	{
		var ext = '';

		if (mxResources.isLanguageSupported(mxClient.language))
		{
			ext = '_' + mxClient.language;
		}

		window.open(RESOURCES_PATH + '/help' + ext + '.html');
	});
	this.put('about', new Action(mxResources.get('about') + ' Graph Editor...', function()
	{
		ui.showDialog(new AboutDialog(ui).container, 320, 280, true, true);
	}, null, null, 'F1'));

	// Font style actions
	var toggleFontStyle = mxUtils.bind(this, function(key, style, fn, shortcut)
	{
		return this.addAction(key, function()
		{
			if (fn != null && graph.cellEditor.isContentEditing())
			{
				fn();
			}
			else
			{
				graph.stopEditing(false);
				graph.toggleCellStyleFlags(mxConstants.STYLE_FONTSTYLE, style);
			}
		}, null, null, shortcut);
	});

	toggleFontStyle('bold', mxConstants.FONT_BOLD, function() { document.execCommand('bold', false, null); }, 'Ctrl+B');
	toggleFontStyle('italic', mxConstants.FONT_ITALIC, function() { document.execCommand('italic', false, null); }, 'Ctrl+I');
	toggleFontStyle('underline', mxConstants.FONT_UNDERLINE, function() { document.execCommand('underline', false, null); }, 'Ctrl+U');

	// Color actions
	this.addAction('fontColor...', function() { ui.menus.pickColor(mxConstants.STYLE_FONTCOLOR, 'forecolor', '000000'); });
	this.addAction('strokeColor...', function() { ui.menus.pickColor(mxConstants.STYLE_STROKECOLOR); });
	this.addAction('fillColor...', function() { ui.menus.pickColor(mxConstants.STYLE_FILLCOLOR); });
	this.addAction('gradientColor...', function() { ui.menus.pickColor(mxConstants.STYLE_GRADIENTCOLOR); });
	this.addAction('backgroundColor...', function() { ui.menus.pickColor(mxConstants.STYLE_LABEL_BACKGROUNDCOLOR, 'backcolor'); });
	this.addAction('borderColor...', function() { ui.menus.pickColor(mxConstants.STYLE_LABEL_BORDERCOLOR); });

	// Format actions
	this.addAction('vertical', function() { ui.menus.toggleStyle(mxConstants.STYLE_HORIZONTAL, true); });
	this.addAction('shadow', function() { ui.menus.toggleStyle(mxConstants.STYLE_SHADOW); });
	this.addAction('solid', function()
	{
		graph.getModel().beginUpdate();
		try
		{
			graph.setCellStyles(mxConstants.STYLE_DASHED, null);
			graph.setCellStyles(mxConstants.STYLE_DASH_PATTERN, null);
			ui.fireEvent(new mxg.mxEventObject('styleChanged', 'keys', [mxConstants.STYLE_DASHED, mxConstants.STYLE_DASH_PATTERN],
				'values', [null, null], 'cells', graph.getSelectionCells()));
		}
		finally
		{
			graph.getModel().endUpdate();
		}
	});
	this.addAction('dashed', function()
	{
		graph.getModel().beginUpdate();
		try
		{
			graph.setCellStyles(mxConstants.STYLE_DASHED, '1');
			graph.setCellStyles(mxConstants.STYLE_DASH_PATTERN, null);
			ui.fireEvent(new mxg.mxEventObject('styleChanged', 'keys', [mxConstants.STYLE_DASHED, mxConstants.STYLE_DASH_PATTERN],
				'values', ['1', null], 'cells', graph.getSelectionCells()));
		}
		finally
		{
			graph.getModel().endUpdate();
		}
	});
	this.addAction('dotted', function()
	{
		graph.getModel().beginUpdate();
		try
		{
			graph.setCellStyles(mxConstants.STYLE_DASHED, '1');
			graph.setCellStyles(mxConstants.STYLE_DASH_PATTERN, '1 4');
			ui.fireEvent(new mxg.mxEventObject('styleChanged', 'keys', [mxConstants.STYLE_DASHED, mxConstants.STYLE_DASH_PATTERN],
				'values', ['1', '1 4'], 'cells', graph.getSelectionCells()));
		}
		finally
		{
			graph.getModel().endUpdate();
		}
	});
	this.addAction('sharp', function()
	{
		graph.getModel().beginUpdate();
		try
		{
			graph.setCellStyles(mxConstants.STYLE_ROUNDED, '0');
			graph.setCellStyles(mxConstants.STYLE_CURVED, '0');
			ui.fireEvent(new mxg.mxEventObject('styleChanged', 'keys', [mxConstants.STYLE_ROUNDED, mxConstants.STYLE_CURVED],
					'values', ['0', '0'], 'cells', graph.getSelectionCells()));
		}
		finally
		{
			graph.getModel().endUpdate();
		}
	});
	this.addAction('rounded', function()
	{
		graph.getModel().beginUpdate();
		try
		{
			graph.setCellStyles(mxConstants.STYLE_ROUNDED, '1');
			graph.setCellStyles(mxConstants.STYLE_CURVED, '0');
			ui.fireEvent(new mxg.mxEventObject('styleChanged', 'keys', [mxConstants.STYLE_ROUNDED, mxConstants.STYLE_CURVED],
					'values', ['1', '0'], 'cells', graph.getSelectionCells()));
		}
		finally
		{
			graph.getModel().endUpdate();
		}
	});
	this.addAction('toggleRounded', function()
	{
		if (!graph.isSelectionEmpty() && graph.isEnabled())
		{
			graph.getModel().beginUpdate();
			try
			{
				var cells = graph.getSelectionCells();
	    		var state = graph.view.getState(cells[0]);
	    		var style = (state != null) ? state.style : graph.getCellStyle(cells[0]);
	    		var value = (mxUtils.getValue(style, mxConstants.STYLE_ROUNDED, '0') == '1') ? '0' : '1';

				graph.setCellStyles(mxConstants.STYLE_ROUNDED, value);
				graph.setCellStyles(mxConstants.STYLE_CURVED, null);
				ui.fireEvent(new mxg.mxEventObject('styleChanged', 'keys', [mxConstants.STYLE_ROUNDED, mxConstants.STYLE_CURVED],
						'values', [value, '0'], 'cells', graph.getSelectionCells()));
			}
			finally
			{
				graph.getModel().endUpdate();
			}
		}
	});
	this.addAction('curved', function()
	{
		graph.getModel().beginUpdate();
		try
		{
			graph.setCellStyles(mxConstants.STYLE_ROUNDED, '0');
			graph.setCellStyles(mxConstants.STYLE_CURVED, '1');
			ui.fireEvent(new mxg.mxEventObject('styleChanged', 'keys', [mxConstants.STYLE_ROUNDED, mxConstants.STYLE_CURVED],
					'values', ['0', '1'], 'cells', graph.getSelectionCells()));
		}
		finally
		{
			graph.getModel().endUpdate();
		}
	});
	this.addAction('collapsible', function()
	{
		var state = graph.view.getState(graph.getSelectionCell());
		var value = '1';

		if (state != null && graph.getFoldingImage(state) != null)
		{
			value = '0';
		}

		graph.setCellStyles('collapsible', value);
		ui.fireEvent(new mxg.mxEventObject('styleChanged', 'keys', ['collapsible'],
				'values', [value], 'cells', graph.getSelectionCells()));
	});
	this.addAction('editStyle...', mxUtils.bind(this, function()
	{
		var cells = graph.getSelectionCells();

		if (cells != null && cells.length > 0)
		{
			var model = graph.getModel();

	    	var dlg = new TextareaDialog(this.editorUi, mxResources.get('editStyle') + ':',
	    			model.getStyle(cells[0]) || '', function(newValue)
			{
	    		if (newValue != null)
				{
					graph.setCellStyle(mxUtils.trim(newValue), cells);
				}
			}, null, null, 400, 220);
			this.editorUi.showDialog(dlg.container, 420, 300, true, true);
			dlg.init();
		}
	}), null, null, 'Ctrl+E');
	this.addAction('setAsDefaultStyle', function()
	{
		if (graph.isEnabled() && !graph.isSelectionEmpty())
		{
			ui.setDefaultStyle(graph.getSelectionCell());
		}
	}, null, null, 'Ctrl+Shift+D');
	this.addAction('clearDefaultStyle', function()
	{
		if (graph.isEnabled())
		{
			ui.clearDefaultStyle();
		}
	}, null, null, 'Ctrl+Shift+R');
	this.addAction('addWaypoint', function()
	{
		var cell = graph.getSelectionCell();

		if (cell != null && graph.getModel().isEdge(cell))
		{
			var handler = editor.graph.selectionCellsHandler.getHandler(cell);

			if (handler instanceof mxEdgeHandler)
			{
				var t = graph.view.translate;
				var s = graph.view.scale;
				var dx = t.x;
				var dy = t.y;

				var parent = graph.getModel().getParent(cell);
				var pgeo = graph.getCellGeometry(parent);

				while (graph.getModel().isVertex(parent) && pgeo != null)
				{
					dx += pgeo.x;
					dy += pgeo.y;

					parent = graph.getModel().getParent(parent);
					pgeo = graph.getCellGeometry(parent);
				}

				var x = Math.round(graph.snap(graph.popupMenuHandler.triggerX / s - dx));
				var y = Math.round(graph.snap(graph.popupMenuHandler.triggerY / s - dy));

				handler.addPointAt(handler.state, x, y);
			}
		}
	});
	this.addAction('removeWaypoint', function()
	{
		// TODO: Action should run with "this" set to action
		var rmWaypointAction = ui.actions.get('removeWaypoint');

		if (rmWaypointAction.handler != null)
		{
			// NOTE: Popupevent handled and action updated in Menus.createPopupMenu
			rmWaypointAction.handler.removePoint(rmWaypointAction.handler.state, rmWaypointAction.index);
		}
	});
	this.addAction('clearWaypoints', function()
	{
		var cells = graph.getSelectionCells();

		if (cells != null)
		{
			graph.getModel().beginUpdate();
			try
			{
				for (var i = 0; i < cells.length; i++)
				{
					var cell = cells[i];

					if (graph.getModel().isEdge(cell))
					{
						var geo = graph.getCellGeometry(cell);

						if (geo != null)
						{
							geo = geo.clone();
							geo.points = null;
							graph.getModel().setGeometry(cell, geo);
						}
					}
				}
			}
			finally
			{
				graph.getModel().endUpdate();
			}
		}
	});
	action = this.addAction('subscript', mxUtils.bind(this, function()
	{
	    if (graph.cellEditor.isContentEditing())
	    {
			document.execCommand('subscript', false, null);
		}
	}), null, null, 'Ctrl+,');
	action = this.addAction('superscript', mxUtils.bind(this, function()
	{
	    if (graph.cellEditor.isContentEditing())
	    {
			document.execCommand('superscript', false, null);
		}
	}), null, null, 'Ctrl+.');
	this.addAction('image...', function()
	{
/*
		var dlg = new ImageImportDialog(ui);
		ui.showDialog(dlg.container, 280, 350, true, true);
		var newValue = dlg.image ;
		var w = dlg.w;
		var h = dlg.h;
		return;
*/

		if (graph.isEnabled() && !graph.isCellLocked(graph.getDefaultParent()))
		{
				var title = mxResources.get('image') + ' (' + mxResources.get('url') + '):';
	    	var state = graph.getView().getState(graph.getSelectionCell());
	    	var value = '';

	    	if (state != null)
	    	{
	    		value = state.style[mxConstants.STYLE_IMAGE] || value;
	    	}

	    	var selectionState = graph.cellEditor.saveSelection();

//   		ui.showImageDialog(title, value, function(newValue, w, h)
//			{
	   			// Inserts image into HTML text
	    		if (graph.cellEditor.isContentEditing())
	    		{
	    			graph.cellEditor.restoreSelection(selectionState);
	    			graph.insertImage(newValue, w, h);
	    		}
	    		else
	    		{
					var cells = graph.getSelectionCells();

					if (newValue != null)
					{
						var select = null;

						graph.getModel().beginUpdate();
			        	try
			        	{
			        		// Inserts new cell if no cell is selected
			    			if (cells.length == 0)
			    			{
			    				var pt = graph.getFreeInsertPoint();
			    				cells = [graph.insertVertex(graph.getDefaultParent(), null, '', pt.x, pt.y, w, h,
			    						'shape=image;imageAspect=0;aspect=fixed;verticalLabelPosition=bottom;verticalAlign=top;')];
			    				select = cells;
			    			}

			        		graph.setCellStyles(mxConstants.STYLE_IMAGE, newValue, cells);

			        		// Sets shape only if not already shape with image (label or image)
			        		var state = graph.view.getState(cells[0]);
			        		var style = (state != null) ? state.style : graph.getCellStyle(cells[0]);

			        		if (style[mxConstants.STYLE_SHAPE] != 'image' && style[mxConstants.STYLE_SHAPE] != 'label')
			        		{
			        			graph.setCellStyles(mxConstants.STYLE_SHAPE, 'image', cells);
			        		}

				        	if (graph.getSelectionCount() == 1)
				        	{
					        	if (w != null && h != null)
					        	{
					        		var cell = cells[0];
					        		var geo = graph.getModel().getGeometry(cell);

					        		if (geo != null)
					        		{
					        			geo = geo.clone();
						        		geo.width = w;
						        		geo.height = h;
						        		graph.getModel().setGeometry(cell, geo);
					        		}
					        	}
				        	}
			        	}
			        	finally
			        	{
			        		graph.getModel().endUpdate();
			        	}

			        	if (select != null)
			        	{
			        		graph.setSelectionCells(select);
			        		graph.scrollCellToVisible(select[0]);
			        	}
					}
    		}
//			}, graph.cellEditor.isContentEditing(), !graph.cellEditor.isContentEditing());
		}
	}).isEnabled = isGraphEnabled;

	this.addAction('insertImage...', function(image)
	{
		if (graph.isEnabled() && !graph.isCellLocked(graph.getDefaultParent()))
		{
			var dlg = new ImageImportDialog(ui);
			ui.showDialog(dlg.container, 250, 350, true, true);
		}

/*
		if (graph.isEnabled() && !graph.isCellLocked(graph.getDefaultParent()))
		{
			graph.clearSelection();
			ui.actions.get('image').funct();
		}
*/
	}).isEnabled = isGraphEnabled;
	action = this.addAction('layers', mxUtils.bind(this, function()
	{
		if (this.layersWindow == null)
		{
			// LATER: Check outline window for initial placement
			this.layersWindow = new LayersWindow(ui, document.body.offsetWidth - 280, 120, 220, 180);
			this.layersWindow.window.addListener('show', function()
			{
				ui.fireEvent(new mxg.mxEventObject('layers'));
			});
			this.layersWindow.window.addListener('hide', function()
			{
				ui.fireEvent(new mxg.mxEventObject('layers'));
			});
			this.layersWindow.window.setVisible(true);
			ui.fireEvent(new mxg.mxEventObject('layers'));
		}
		else
		{
			this.layersWindow.window.setVisible(!this.layersWindow.window.isVisible());
		}

		//ui.fireEvent(new mxg.mxEventObject('layers'));
	}), null, null, 'Ctrl+Shift+L');
	action.setToggleAction(true);
	action.setSelectedCallback(mxUtils.bind(this, function() { return this.layersWindow != null && this.layersWindow.window.isVisible(); }));
	action = this.addAction('formatPanel', mxUtils.bind(this, function()
	{
		ui.toggleFormatPanel();
	}), null, null, 'Ctrl+Shift+P');
	action.setToggleAction(true);
	action.setSelectedCallback(mxUtils.bind(this, function() { return ui.formatWidth > 0; }));
	action = this.addAction('outline', mxUtils.bind(this, function()
	{
		if (this.outlineWindow == null)
		{
			// LATER: Check layers window for initial placement
			this.outlineWindow = new OutlineWindow(ui, document.body.offsetWidth - 260, 100, 180, 180);
			this.outlineWindow.window.addListener('show', function()
			{
				ui.fireEvent(new mxg.mxEventObject('outline'));
			});
			this.outlineWindow.window.addListener('hide', function()
			{
				ui.fireEvent(new mxg.mxEventObject('outline'));
			});
			this.outlineWindow.window.setVisible(true);
			ui.fireEvent(new mxg.mxEventObject('outline'));
		}
		else
		{
			this.outlineWindow.window.setVisible(!this.outlineWindow.window.isVisible());
		}

		ui.fireEvent(new mxg.mxEventObject('outline'));
	}), null, null, 'Ctrl+Shift+O');

	action.setToggleAction(true);
	action.setSelectedCallback(mxUtils.bind(this, function() { return this.outlineWindow != null && this.outlineWindow.window.isVisible(); }));
};

/**
 * Registers the given action under the given name.
 */
Actions.prototype.addAction = function(key, funct, enabled, iconCls, shortcut)
{
	var title;

	if (key.substring(key.length - 3) == '...')
	{
		key = key.substring(0, key.length - 3);
		title = mxg.mxResources.get(key) + '...';
	}
	else
	{
		title = mxg.mxResources.get(key) ;
	}

	return this.put(key, new Action(title, funct, enabled, iconCls, shortcut));
};

/**
 * Registers the given action under the given name.
 */
Actions.prototype.put = function(name, action)
{
	this.actions[name] = action;

	return action;
};

/**
 * Returns the action for the given name or null if no such action exists.
 */
Actions.prototype.get = function(name)
{
	return this.actions[name];
};

/**
 * Constructs a new action for the given parameters.
 */
Action = function(label, funct, enabled, iconCls, shortcut)
{
	mxEventSource.call(this);
	this.label = label;
	this.funct = funct;
	this.enabled = (enabled != null) ? enabled : true;
	this.iconCls = iconCls;
	this.shortcut = shortcut;
	this.visible = true;
};

// Action inherits from mxEventSource
mxUtils.extend(Action, mxEventSource);

/**
 * Sets the enabled state of the action and fires a stateChanged event.
 */
Action.prototype.setEnabled = function(value)
{
	if (this.enabled != value)
	{
		this.enabled = value;
		this.fireEvent(new mxg.mxEventObject('stateChanged'));
	}
};

/**
 * Sets the enabled state of the action and fires a stateChanged event.
 */
Action.prototype.isEnabled = function()
{
	return this.enabled;
};

/**
 * Sets the enabled state of the action and fires a stateChanged event.
 */
Action.prototype.setToggleAction = function(value)
{
	this.toggleAction = value;
};

/**
 * Sets the enabled state of the action and fires a stateChanged event.
 */
Action.prototype.setSelectedCallback = function(funct)
{
	this.selectedCallback = funct;
};

/**
 * Sets the enabled state of the action and fires a stateChanged event.
 */
Action.prototype.isSelected = function()
{
	return this.selectedCallback();
};
