var OAFileApp = {

  url_input_id: "",
  file_input_id: "",
  caption_input_id: "",
  credit_input_id: "",
  style_input_id: "",
  div_id: "",
  callback: "",
  removeFile: function(){
    if ( $("#" + this.url_input_id).length )
		{
    	$("#" + this.url_input_id).val("");
		}
    if ( $("#" + this.div_id).length )
		{
    	$("#" + this.div_id).html("");
		}
    if ( $("#" + this.file_input_id).length )
		{
    	$("#" + this.file_input_id).val("");
		}
    if ( $("#" + this.caption_input_id).length )
		{
    	$("#" + this.caption_input_id).val("");
		}
    if ( $("#" + this.credit_input_id).length )
		{
    	$("#" + this.credit_input_id).val("");
		}
    if ( $("#" + this.style_input_id).length )
		{
    	$("#" + this.style_input_id).val("");
		}
    if ( $("#" + this.callback).length )
		{
    	$("#" + this.callback).val("");
		}

    this.url_input_id = "";
    this.div_id = "";
    this.file_input_id = "";
    this.caption_input_id = "";
    this.credit_input_id = "";
    this.style_input_id = "";
    this.callback = "";

  },
  addFile: function(id,url,caption,credit,style){
    var html = "";

    if ( !url )
    {
      url = $("#" + this.url_input_id).val();
    }

    if ( url )
    {

    	if ( $("#" + this.url_input_id).length )
			{
      	$("#" + this.url_input_id).val(url);
      	html = "<img style='max-width:150px' src='";
      	html += url;
      	html += "' >";
			}
    	if ( $("#" + this.div_id).length )
			{
    		$("#" + this.div_id).html(html);
			}
    	if ( $("#" + this.file_input_id).length )
			{
    		$("#" + this.file_input_id).val(id);
			}
    	if ( $("#" + this.caption_input_id).length )
			{
    		$("#" + this.caption_input_id).val(caption);
			}
    	if ( $("#" + this.credit_input_id).length )
			{
    		$("#" + this.credit_input_id).val(credit);
			}
    	if ( $("#" + this.style_input_id).length )
			{
    		$("#" + this.style_input_id).val(style);
			}
    }

    if ( this.callback )
    {
      return window.parent[this.callback].apply(this);
    }
  },

  openWindow: function(type,size){
    var win = window.open("/files/upload_widget?type=" + type + "&size=" + size,'filesWidget','width=800,height=600');
    win.focus();
  },
};


