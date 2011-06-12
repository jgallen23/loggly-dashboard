!function(public) {

  var renderWidgets = function() {
    var widgetContainer = $("#widgets");
    for (var key in widgets) {
      var widget = widgets[key];
      if (widget.disabled)
        continue;
      var node = $("<div/>").attr("id", key).addClass("Widget").addClass(widget.ui.type);
      if (widget.ui.type == "list") {
        new ListWidget({ el: node, key: key, settings: widget });
      }
      else if (widget.ui.type == "bar") {
        new BarWidget({ el: node, key: key, settings: widget });
      }
      widgetContainer.append(node);
    }
  };


  var initGoogleCharts = function(cb) {
    google.load("visualization", "1", {packages:["corechart"]});
    google.setOnLoadCallback(cb);
  };

  initGoogleCharts(function() {
    renderWidgets();
  });

}(this);
