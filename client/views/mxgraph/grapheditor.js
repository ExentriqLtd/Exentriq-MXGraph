Template.mxGraphEditor.onCreated(function(){

});

Template.mxGraphEditor.onRendered(function(){
  document.body.addClass ="geEditor";

	require("/public/grapheditor/jscolor/jscolor.js");
  jscolor.dir = "/grapheditor/jscolor/";
/*
	//require("/public/mxgraph/sanitizer/sanitizer.min.js");
  //require("/public/mxgraph/js/mxClient.js");
  require("/public/mxgraph/js/Actions.js");
  require("/public/mxgraph/js/Editor.js");
	require("/public/mxgraph/js/EditorUi.js");
	require("/public/mxgraph/js/Sidebar.js");
	require("/public/mxgraph/js/Graph.js");
	require("/public/mxgraph/js/Shapes.js");
	require("/public/mxgraph/js/Menus.js");
	require("/public/mxgraph/js/Format.js");
	require("/public/mxgraph/js/Toolbar.js");
	require("/public/mxgraph/js/Dialogs.js");
  require("/public/mxgraph/js/Dialogs_custom.js");
/*
	//require("/public/mxgraph/css/common.css");
  //require("/public/mxgraph/css/explorer.css");
  //require("/public/mxgraph/css/grapheditor.css");
*/
//  console.log("STYLE_PATH="+window.STENCIL_PATH);

  // Extends EditorUi to update I/O action states based on availability of backend
  //(function() {
  function initMxGraph(){
      editorUiInit = EditorUi.prototype.init;

      EditorUi.prototype.init = function()
      {
        editorUiInit.apply(this, arguments);
      //this.actions.get('export').setEnabled(false);

        // Updates action states which require a backend
        if (!Editor.useLocalStorage)
        {
          mxUtils.post(OPEN_URL, '', mxUtils.bind(this, function(req)
         {
            var enabled = req.getStatus() != 404;
            //this.actions.get('open').setEnabled(enabled || Graph.fileSupport);
            //this.actions.get('import').setEnabled(enabled || Graph.fileSupport);
            this.actions.get('save').setEnabled(enabled);
            this.actions.get('exit').setEnabled(enabled);
            //this.actions.get('saveAs').setEnabled(enabled);
            //this.actions.get('export').setEnabled(enabled);
          }));
        }
      };

      // Adds required resources (disables loading of fallback properties, this can only
      // be used if we know that all keys are defined in the language specific file)
//      console.log("mxlan="+mxLanguage);
//      console.log("RESOURCE_BASE="+RESOURCE_BASE);

      mxResources.loadDefaultBundle = true;
      var bundle = mxResources.getDefaultBundle(RESOURCE_BASE, mxLanguage) ||
        mxResources.getSpecialBundle(RESOURCE_BASE, mxLanguage);
      //console.log("bundle="+mxResources.getDefaultBundle(RESOURCE_BASE, mxLanguage));
      //console.log("STYLE_PATH="+STYLE_PATH);

      // Fixes possible asynchronous requests
      mxUtils.getAll([bundle, STYLE_PATH + '/default.xml'], function(xhr)
      {
        // Adds bundle text to resources
        mxResources.parse(xhr[0].getText());

        // Configures the default graph theme
        var themes = new Object();
        themes[Graph.prototype.defaultThemeName] = xhr[1].getDocumentElement();

        // Main
        new EditorUi(new Editor(urlParams['chrome'] == '0', themes));
        //console.log(onePageCheckBox.checked);
      },
      function() {
        document.body.innerHTML = '<center style="margin-top:10%;">Error loading resource files. Please check browser console.</center>';
      });
  //})();
  }
  initMxGraph();
});



Template.mxGraphEditor.events({

});

Template.mxGraphEditor.helpers({
/*
   'xmlGraph' : () =>{
      return Grapho.find({'id':Session.get('id')}).fetch() || {id:0,xml:''};
  }
*/
});

Template.mxGraphEditor.rendered = function(){

}
