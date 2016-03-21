var OAWidgetApp = {

  text_input_id: "",
  callback: "",
  addText: function(text){
    var html = "";

    if ( text )
    {
      $("#" + this.text_input_id).val(text);
    }

    if ( this.callback )
    {
      return window.parent[this.callback].apply(this);
    }
  },

  openWindow: function(type){
    var win = window.open("/widgets/add_text?type=" + type,'addTextWidget','width=400,height=350');
    win.focus();
  },
};


