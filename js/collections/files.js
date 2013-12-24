
/**
 * A collection of Artists.
 */
app.FileCollection = Backbone.Collection.extend({

  model: app.File,

  sync: function(method, model, options) {
    if (method === "read") {

      if(options.name == 'sources'){
        // Get Sources
        this.getSources(options.success);
      } else {
        // Get Dir
        this.getDirectory(options.name, options.success);
      }

    }
  },

  getSources: function(callback){
    var self = this;

    app.xbmcController.command('Files.GetSources', ['music'], function(res){
      // add a title before return
      var sources = self.parseData(res.result.sources);
      callback(sources);
    })

  },

  getDirectory: function(dir, callback){
    var self = this;

    app.xbmcController.command('Files.GetDirectory', [dir, 'music', app.fileFields,  {"method": "title", "order": "ascending"}], function(res){

      var files = self.parseData(res.result.files);

      callback(files);

    })

  },

  /**
   * adds a title if missing, sorts and thumb defaults
   * @param models
   * @returns {*}
   */
  parseData: function(models){
    for(i in models){

      if(typeof models[i].filetype == 'undefined' || models[i].filetype == ''){
        models[i].filetype = 'directory';
      }

      if(models[i].filetype == 'directory'){
        var f = models[i].file.split('/'),
          foo = f.pop(),
          name = f.pop();
        models[i].title = name;
      }

      if(typeof models[i].title == 'undefined' || models[i].title == ''){
        models[i].title = models[i].label;
      }

      if(typeof models[i].thumbnail == 'undefined'){
        models[i].thumbnail = '';
      }

    }

    return models;
  }




});

