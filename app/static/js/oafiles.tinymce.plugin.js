function oaTinyMCECallback()
{
	var url = $("#widgetDataUrl").val();
	var style = $("#widgetDataStyle").val();
	var caption = $("#widgetDataCaption").val();
	var credit = $("#widgetDataCredit").val();
	var img = "<img src='";
	img += url
	img += "' ";
	img += ">";

	var html = "<figure ";
	if ( style )
	{
		html += " class='" + style + "' ";
	}
	html += ">";
	html += img;
	if ( caption || credit  )
	{
		html += "<figcaption>";
		html += caption;
		if ( caption ){ html += " " + credit; }
		else { html += credit; }
		html += "</figcaption>";
	}
	html += "</figure>";
	tinyMCE.activeEditor.execCommand('mceInsertContent', false, html);
}

if ( typeof(tinyMCE) != "undefined" )
{
	tinyMCE.PluginManager.add('oafiles', function(editor, url) {
    // Add a button that opens a window
    editor.addButton('oafiles', {
        text: 'Files',
        icon: false,
        onclick: function() {
            // Open window
        		OAFileApp.url_input_id = "widgetDataUrl";
        		OAFileApp.div_id = "";
        		OAFileApp.file_input_id = "widgetDataFile";
        		OAFileApp.caption_input_id = "widgetDataCaption";
        		OAFileApp.credit_input_id = "widgetDataCredit";
        		OAFileApp.style_input_id = "widgetDataStyle";
        		OAFileApp.callback = "oaTinyMCECallback";

            editor.windowManager.open({
                title: 'OA Files plugin',
                url: '/files/upload_widget/?type=image&inline=true',
                width: 750,
                height: 600,
            });
        }
    });
	});
}


$(function() {

	var hidden_fields = "<input type='hidden' id='widgetDataUrl' >";
	hidden_fields += "<input type='hidden' id='widgetDataFile' >";
	hidden_fields += "<input type='hidden' id='widgetDataCaption' >";
	hidden_fields += "<input type='hidden' id='widgetDataCredit' >";
	hidden_fields += "<input type='hidden' id='widgetDataText' >";
	hidden_fields += "<input type='hidden' id='widgetDataStyle' >";

   //Initialize
   $("#content-main").append("<div id='hidden-data'>" + hidden_fields + "</div>");

});
