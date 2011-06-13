var BarWidget = $.Fidel.extend({
  templateSelector: '#BarWidgetTemplate',
  init: function() {
    if (!this.autoRefreshInterval)
      this.autoRefreshInterval = 5 * 60 * 1000; //5 mins

    if (this.settings.ui.autoRefresh) {
      this.startAutoRefresh();
    }

    this.refresh();
  },
  startAutoRefresh: function() {
    var self = this;
    if (!this._timeout) {
      this._timeout = setInterval(function() {
        self.refresh();
      }, this.autoRefreshInterval);
    }
  },
  stopAutoRefresh: function() {
    clearInterval(this._timeout);
    this._timeout = null;
  },
  refresh: function() {
    console.log("refresh", this.key);
    var self = this;
    $.ajax({
      url: '/'+window.subdomain+'/api/'+this.key,
      type: 'json',
      method: 'get',
      success: function(data) {
        self.renderChart(data);
      }
    });
  },
  renderChart: function(data) {
    var self = this;
    this.render({ settings: this.settings, data: data.data });
    var chartData = new google.visualization.DataTable();
    chartData.addColumn('string', 'Date');
    chartData.addColumn('number', 'Value');
    var dateArr = [];
    for (var date in data.data) {
      dateArr.push(date);
    }
    dateArr.sort();
    chartData.addRows(dateArr.length);
    for (var i = 0, c = dateArr.length; i < c; i++) {
      var item = dateArr[i];
      chartData.setValue(i, 0, new Date(item).toString(this.settings.ui.dateFormat));
      chartData.setValue(i, 1, data.data[item]);
    }
    var chart = new google.visualization.ColumnChart(this.find(".chart")[0]);
    chart.draw(chartData, {width: 400, height: 300, legend: 'none', chartArea: {left:30,top:10,width:"100%",height:"80%"} });
  }
});
