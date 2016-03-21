var OAWidgetSelectorApp = {
  selector_keys: "",
  selector_values: "",
  callback: "",
  removeSelected: function(){
    this.selector_keys = "";
    this.selector_values = "";
    this.callback = "";
  },
  addSelected: function(keys,values){
    var html = "";

    $("#" + this.selector_keys).val(keys);
    $("#" + this.selector_values).val(values);

    if ( this.callback )
    {
      return window.parent[this.callback].apply(this);
    }
  },

  openWindow: function(type){
    var win = window.open("/widgets/selector?type=" + type,'selectorWidget','width=800,height=600');
    win.focus();
  },
};


