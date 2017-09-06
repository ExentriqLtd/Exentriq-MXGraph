mxBasePath  = 'grapheditor';
mxLanguage  = 'en'
mxg = require("mxgraph")({
  mxImageBasePath   : "grapheditor/images",
  mxBasePath        : "/grapheditor"
//  mxLoadStylesheets : false
});

mxGraph  = mxg.mxGraph;
mxClient = mxg.mxClient;
mxUtils  = mxg.mxUtils;
mxEvent  = mxg.mxEvent;
mxEventSource = mxg.mxEventSource;
mxGraphView = mxg.mxGraphView;
mxGraphHandler = mxg.mxGraphHandler;
mxConnectionHandler = mxg.mxConnectionHandler;

mxPopupMenu = mxg.mxPopupMenu;
mxPopupMenuHandler = mxg.mxPopupMenuHandler;

mxShape  = mxg.mxShape;
mxResources = mxg.mxResources;
mxConstants = mxg.mxConstants;

mxRubberband = mxg.mxRubberband;
mxVertexHandler = mxg.mxVertexHandler;
mxPanningHandler = mxg.mxPanningHandler;

mxImage = mxg.mxImage;
mxEdgeHandler = mxg.mxEdgeHandler;
mxOutline = mxg.mxOutline;
mxPoint = mxg.mxPoint;

mxLoadResources = mxg.mxLoadResources;
mxClipboard = mxg.mxClipboard;

mxText = mxg.mxText;
mxGraphModel = mxg.mxGraphModel;

mxValueChange = mxg.mxValueChange;
mxSvgCanvas2D = mxg.mxSvgCanvas2D;

mxRectangle = mxg.mxRectangle;
mxStencil = mxg.mxStencil;
mxCellRenderer = mxg.mxCellRenderer;
mxStencilRegistry = mxg.mxStencilRegistry;
mxGuide = mxg.mxGuide;
mxConstraintHandler = mxg.mxConstraintHandler;
mxCellEditor = mxg.mxCellEditor;
mxCellHighlight = mxg.mxCellHighlight;
mxCylinder = mxg.mxCylinder;
mxActor = mxg.mxActor;
mxRhombus = mxg.mxRhombus;
mxRectangleShape  = mxg.mxRectangleShape ;
mxHexagon = mxg.mxHexagon;
mxEllipse = mxg.mxEllipse;
mxPerimeter = mxg.mxPerimeter;
mxStyleRegistry = mxg.mxStyleRegistry;
mxDoubleEllipse = mxg.mxDoubleEllipse;
mxArrowConnector = mxg.mxArrowConnector;
mxMarker = mxg.mxMarker;
mxEdgeStyle = mxg.mxEdgeStyle ;
mxConnectionConstraint = mxg.mxConnectionConstraint;
mxLabel = mxg.mxLabel;
mxImageShape = mxg.mxImageShape;
mxSwimlane = mxg.mxSwimlane;
mxLine = mxg.mxLine;
mxTriangle = mxg.mxTriangle;
mxCloud = mxg.mxCloud;
mxArrow = mxg.mxArrow ;
mxLanguage = mxg.mxLanguage;
mxCodec = mxg.mxCodec;
mxDragSource = mxg.mxDragSource;
mxUndoManager = mxg.mxUndoManager;
mxEventObject = mxg.mxEventObject;
mxLayoutManager = mxg.mxLayoutManager;
mxDictionary = mxg.mxDictionary;
mxCell = mxg.mxCell;
mxGeometry = mxg.mxGeometry;
mxCellMarker = mxg.mxCellMarker;
mxKeyHandler = mxg.mxKeyHandler;
mxStackLayout = mxg.mxStackLayout;
mxForm = mxg.mxForm;
mxPolyline = mxg.mxPolyline;
mxHandle = mxg.mxHandle;
mxGraphAbstractHierarchyCell = mxg.mxGraphAbstractHierarchyCell;
mxGraphHierarchyModel = mxg.mxGraphHierarchyModel;
mxHierarchicalLayoutStage = mxg.mxHierarchicalLayoutStage;
mxGraphLayout = mxg.mxGraphLayout ;
mxHierarchicalLayout = mxg.mxHierarchicalLayout;
mxHierarchicalEdgeStyle = mxg.mxHierarchicalEdgeStyle;
mxCellState = mxg.mxCellState;
mxWindow = mxg.mxWindow;

mxXmlCanvas2D = mxg.mxXmlCanvas2D;
mxImageExport = mxg.mxImageExport;
mxXmlRequest = mxg.mxXmlRequest;
mxMouseEvent = mxg.mxMouseEvent;
mxPrintPreview = mxg.mxPrintPreview;
mxElbowEdgeHandler = mxg.mxElbowEdgeHandler;
mxCellTracker = mxg.mxCellTracker;

mxCircleLayout =mxg.mxCircleLayout ;
mxMorphing = mxg.mxMorphing ;
mxFastOrganicLayout = mxg.mxFastOrganicLayout;
mxCompactTreeLayout = mxg.mxCompactTreeLayout;

mxg.mxResources.add('public/mxgraph/resourcers/editor');

urlParams = (function(url) {
  var result = new Object();
  var idx = url.lastIndexOf('?');

  if (idx > 0)  {
    var params = url.substring(idx + 1).split('&');

    for (var i = 0; i < params.length; i++) {
      idx = params[i].indexOf('=');

      if (idx > 0) {
        result[params[i].substring(0, idx)] = params[i].substring(idx + 1);
        console.log("urlparams="+params[i].substring(idx + 1));
      }
    }
  }

  return result;
})(window.location.href);
