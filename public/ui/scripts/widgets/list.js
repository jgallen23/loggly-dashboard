var ListWidget = $.Fidel.extend({
  templateSelector: '#ListWidgetTemplate',
  init: function() {
    if (!this.autoRefreshInterval)
      this.autoRefreshInterval = 5 * 1000; //5 mins

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
    var self = this;
    $.ajax({
      url: '/api/'+this.key,
      type: 'json',
      method: 'get',
      success: function(data) {
        self.render({ settings: self.settings, data: data.data });
      }
    });
  }
});
