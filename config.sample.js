module.exports = {
  '{subdomain name}': {
    auth: {
      username: '',
      password: ''
    },
    widgets: {
      traffic: {
        title: 'Page Views Today',
        type: 'facet',
        facet: 'date',
        query: 'status=200',
        ui: {
          type: 'bar',
          dateFormat: 'HH:mm',
          autoRefresh: true
        },
        context: {
          from: 'NOW-5HOURS',
          gap: '+10MINUTES'
        }
      },
      redirects: {
        title: 'Redirects',
        type: 'facet',
        facet: 'date',
        query: 'status=301',
        ui: {
          type: 'bar',
          dateFormat: 'HH:mm',
          autoRefresh: true
        },
        context: {
          from: 'NOW-5HOURS',
          gap: '+10MINUTES'
        }
      },
      notFound: {
        title: 'Not Found',
        type: 'facet',
        facet: 'date',
        query: 'status=404',
        ui: {
          type: 'bar',
          dateFormat: 'HH:mm',
          autoRefresh: true
        },
        context: {
          from: 'NOW-5HOURS',
          gap: '+10MINUTES'
        }
      },
      recentPages: {
        title: 'Recent Pages',
        type: 'search',
        query: 'request',
        regex: 'url=(.*?),',
        ui: {
          type: 'list',
          dateFormat: 'MM/dd h:mm tt',
          autoRefresh: true
        },
        context: {
          from: 'NOW-1DAY'
        }
      },
      topReferrals: {
        title: 'Referrals',
        type: 'search',
        query: 'ref=http',
        regex: 'ref=(.*?)(,|$)',
        ui: {
          type: 'list',
          dateFormat: 'MM/dd h:mm tt',
          autoRefresh: true
        },
        context: {
          from: 'NOW-1DAY'
        }
      }
    }
  }
};
