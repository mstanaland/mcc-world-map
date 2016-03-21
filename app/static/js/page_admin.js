function oaPageShowLeadImage()
{
  var url = $("#id_lead_image_url").val();
  if ( url )
  {
    html = "<img style='max-width:150px' src='";
    html += url;
    html += "' >";
    $("#currentImageDiv").html(html);
  }
}

function oaPageProcessFileUploadFields()
{
  //Initialize oaFileApp
  //OAFileApp.url_input_id = "id_lead_image_url";
  //OAFileApp.div_id = "currentImageDiv";
  //OAFileApp.file_input_id = "id_lead_image_id";
  //OAFileApp.caption_input_id = "id_lead_image_caption";
  //OAFileApp.credit_input_id = "id_lead_image_credit";
  //OAFileApp.callback = "";

  $("#id_lead_image_url").hide();
  //$("#id_lead_video_url").hide();
  //$("#id_publication_files").hide();

  var onclick = "OAFileApp.url_input_id='id_lead_image_url';";
  onclick += "OAFileApp.div_id='currentImageDiv';";
  onclick += "OAFileApp.file_input_id='id_lead_image_id';";
  onclick += "OAFileApp.caption_input_id = 'id_lead_image_caption';";
  onclick += "OAFileApp.credit_input_id = 'id_lead_image_credit';";
  onclick += "OAFileApp.callback = '';";

  //Append 'Add tag' button
  var addImageBtn = "";
  //addImageBtn += "<div>";
  //addImageBtn += "<label></label>";
  addImageBtn += "<table><tr><td valign='top'>";
  addImageBtn += "<div id='currentImageDiv' style='margin-bottom:5px'></div>";
  addImageBtn += "<input class='addImage' type='button' value='Select' ";
  //addImageBtn += "onclick=\"OAFileApp.openWindow('image');\"";
  addImageBtn += " onclick=\"";
  addImageBtn += onclick;
  addImageBtn += "OAFileApp.openWindow('image','1220x763');";
  addImageBtn += "\" ";
  addImageBtn += ">";
  addImageBtn += "&nbsp;";
  addImageBtn += "<input class='removeImage' type='button' value='Remove' ";
  //addImageBtn += "onclick='OAFileApp.removeFile();'";
  addImageBtn += " onclick=\"";
  addImageBtn += onclick;
  addImageBtn += "OAFileApp.removeFile();";
  addImageBtn += "\" ";
  addImageBtn += ">";
  addImageBtn += "</td></tr></table>";
  //addImageBtn += "</div>";
  $(".lead_image_url").append(addImageBtn);

  OAFileApp.addFile();
}


$(function() {

  //Perform tasks only if this is story page
  if ( $("#richtextpage_form").length )
  {
    //$( '.content > div > label' ).hide();
    //$( 'textarea#id_content' ).ckeditor();
    //$( 'textarea#id_content' ).addClass("mceEditor");

    //Initialize
    oaPageProcessFileUploadFields();
    oaPageShowLeadImage();

  	var html = "<input type='hidden' ";
  	html += " id='id_publication_file_app_id' ";
  	html += "> ";
  	html += "<input type='hidden' ";
  	html += " id='id_publication_file_app_url' ";
  	html += "> ";
    $("#content-main").append(html);

  }

});

