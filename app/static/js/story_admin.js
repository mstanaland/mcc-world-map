var oaStory = {}; 
oaStory.publication_files_count = 0;

function oaShowStatus()
{
    if (!oaGetStoryId())
    {
        //Set new story content to draft status
        $("#id_status_0").attr("checked","checked");
    }

    $(".status").show();
}

function oaGetStoryId()
{
  //Get saved widget id
  var url = location.href; 
  url = url.replace(/\/+$/g, '');

  var id = 0;

  var url_array = url.split("/");
  if (url_array[url_array.length-2] == "story")
  {
    id = url_array[url_array.length-1];
  }

  return parseInt(id);

}

function oaShowLeadImage()
{
  var url = $("#id_lead_image_url").val().trim();
  if ( url )
  {
    html = "<img style='max-width:150px' src='";
    html += url;
    html += "' >";
    $("#currentImageDiv").html(html);
  }
}

function oaProcessFileUploadFields()
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

function oaProcessContentTypes()
{
  var content_type = $("#id_content_type").val();

  $(".publication_type").hide();
  $(".publication_author").hide();
  $(".publication_publisher").hide();
  $(".publication_date").hide();
  $(".publication_files").hide();
  $(".lead_video_embed").hide();
  $(".lead_video_url").hide();
  $(".featured").hide();
  $(".lead_image_url").hide();
  $(".lead_image_caption").hide();
  $(".lead_image_credit").hide();

  //Show publication fields if content_type='publication'
  if ($("#id_content_type").val()=="publication")
  {
    $(".lead_image_url").show();
    $(".lead_image_caption").show();
    $(".lead_image_credit").show();

    $(".publication_type").show();
    $(".publication_author").show();
    $(".publication_publisher").show();
    //$(".publication_date").show();
    $(".publication_files").show();
  }
  else if ($("#id_content_type").val()=="news_clip")
  {
    $(".content").hide();
    $(".publication_publisher").show();
    //$(".publication_date").show();
    $(".publication_url").show();
  }
  else if ($("#id_content_type").val()=="press_release")
  {
  }
  else
  {
    $(".lead_image_url").show();
    $(".lead_image_caption").show();
    $(".lead_image_credit").show();
    $(".lead_video_url").show();
    $(".lead_video_embed").show();
    $(".featured").show();
  }

  //Show press fields if content_type='press_release'
  if (content_type=="press_release")
  {
    $(".press_officer").show();
  }
  else
  {
    $(".press_officer").hide();
  }

}


function oaRemoveDups(arr)
{
  var arr2 = [];
  $.each(arr, function(i, el){
    el = el.replace(/"/g, '');
    el = el.replace(/^\s+/g, '');
    el = el.replace(/\s+$/g, '');
    if($.inArray(el, arr2) === -1) arr2.push(el);
  });
  return arr2;
}

function oaShowPublishFile()
{
  //"OAFileApp.url_input_id='id_publication_file_app_url';";
  //"OAFileApp.file_input_id='id_publication_file_app_id';";
  //alert($("#id_publication_file_app_id").val());
  var html = oaAddPublicationRow($("#id_publication_file_app_id").val(),$("#id_publication_file_app_url").val());

  $('#id_publication_files_details tr:last').after(html);
}

function oaBuildPublicationButtons()
{
  //Hide these fields
  $("#id_publication_files").hide();

  //Append 'Add publication' button
  var addPubBtn = "";
  addPubBtn += "<div style='margin-top:5px'>";
  addPubBtn += "<label></label>";


  var onclick = "OAFileApp.url_input_id='id_publication_file_app_url';";
  onclick += "OAFileApp.div_id='';";
  onclick += "OAFileApp.file_input_id='id_publication_file_app_id';";
  onclick += "OAFileApp.caption_input_id = '';";
  onclick += "OAFileApp.credit_input_id = '';";
  onclick += "OAFileApp.callback = 'oaShowPublishFile';";
  onclick += "OAFileApp.openWindow('document');";

  addPubBtn += "<input class='addPub' type='button' value='Add publication' ";
  addPubBtn += " onclick=\"";
  addPubBtn += onclick;
  addPubBtn += "\" ";
  addPubBtn += ">";
  //addPubBtn += "&nbsp;";
  //addPubBtn += "<input class='removePub' type='button' value='Remove tags'>";
  addPubBtn += "</div>";
  addPubBtn += "<div style='margin-top:5px' class='addedPubs'></div>";
  $(".publication_files > div").append(addPubBtn);

  html = "<input type='hidden' ";
  html += " id='id_publication_file_app_id' ";
  html += "> ";
  html += "<input type='hidden' ";
  html += " id='id_publication_file_app_url' ";
  html += "> ";
  html += "<label></label>";
  html += "<table id='id_publication_files_details'>";

  html += "<tr id='id_publication_files_details_header' style='display:none'>";
  html += "<th>";
  html += "Read";
  html += "</th>";
  html += "<th>";
  html += "File name";
  html += "</th>";
  html += "<th>";
  html += "</th>";
  html += "</tr>";

  var filesJson = $("#id_publication_files").val().trim();
  if ( filesJson )
  {

    var files = $.parseJSON(filesJson);
    if ( typeof(files) != "undefined" && files != null )
    {
      for ( f in files["files"] )
      {
        html += oaAddPublicationRow(files["files"][f]["id"],files["files"][f]["url"],files["files"][f]["name"]);
      }
    }
  }

  html += "</table>";

  $(".publication_files > div").append(html);


}

function oaRemovePublicationFile(row)
{
  $('#id_publication_file_id_'+row).val("");
  $('#id_publication_file_url_'+row).val("");
  $('#id_publication_file_name_'+row).val("");
  //$('#publicationRow'+row).html("");
  $('#publicationRow'+row).hide();
}

function oaAddPublicationRow(id,url,name)
{
  if ( typeof(name) == "undefined" )
  {
    name  = url;
    //alert(url);
    name = new String(name).substring(name.lastIndexOf('/') + 1); 
    if(name.lastIndexOf(".") != -1)       
       name = name.substring(0, name.lastIndexOf("."));

    name = name.replace(/-/g," ");
  }

  if ( !$.trim(url) && !$.trim(name) ){ return ""; }

  html = "";

  html += "<tr id='publicationRow" + oaStory.publication_files_count + "'>";
  html += "<td>";
  html += "<a target='_blank' href='";
  html += url;
  html += "'>";
  html += name;
  html += "</a>";
  html += "</td>";
  html += "<td>";
  html += "<input type='hidden' ";
  html += " id='id_publication_file_id_" + oaStory.publication_files_count + "' ";
  html += " value='";
  html += id;
  html += "'>";
  html += "<input type='hidden' ";
  html += " id='id_publication_file_url_" + oaStory.publication_files_count + "' ";
  html += " value='";
  html += url;
  html += "'>";
  html += "<input type='text' ";
  html += " id='id_publication_file_name_" + oaStory.publication_files_count + "' ";
  html += " value='";
  html += name;
  html += "'>";
  html += "</td>";
  html += "<td>";
  html += "<input class='removePub' type='button' value='Remove' ";
  html += " onclick='oaRemovePublicationFile(\"" + oaStory.publication_files_count + "\");' >";
  html += "</td>";
  html += "</tr>";

  oaStory.publication_files_count++;

  $('#id_publication_files_details_header').show();

  return html;
}

$(function() {

  //Perform tasks only if this is story page
  if ( $("#id_content_type").length )
  {
    //$( '.content > div > label' ).hide();
    //$( 'textarea#id_content' ).ckeditor();
    //$( 'textarea#id_content' ).addClass("mceEditor");

    //Initialize
    oaShowStatus();
    oaProcessContentTypes();
    oaProcessFileUploadFields();
    oaBuildPublicationButtons();
    oaShowLeadImage();

    //Bind functions to elements
    //Run after initialization
    $( "#id_content_type" ).bind( "change", function() {
      oaProcessContentTypes();
    }); 

    $( ".addTag" ).bind( "click", function() {
      oaAddTag('tag');
    }); 

    $( ".addCountry" ).bind( "click", function() {
      oaAddTag('country');
    }); 

    $( ".removeTag" ).bind( "click", function() {
      oaRemoveTag('tag');
    }); 

    $( ".removeCountry" ).bind( "click", function() {
      oaRemoveTag('country');
    }); 

  	var html = "<input type='hidden' ";
  	html += " id='id_publication_file_app_id' ";
  	html += "> ";
  	html += "<input type='hidden' ";
  	html += " id='id_publication_file_app_url' ";
  	html += "> ";
    $("#content-main").append(html);

    $( "#story_form" ).submit(function( event ) {
      //event.preventDefault();
      var files = {};
      files["files"] = [];
      for ( var i=0;i<oaStory.publication_files_count;i++ )
      {
        var file = {};
        file["id"] = $("#id_publication_file_id_" + i).val();
        file["url"] = $("#id_publication_file_url_" + i).val();
        file["name"] = $("#id_publication_file_name_" + i).val();
        files["files"].push(file);
      }
      $("#id_publication_files").val(JSON.stringify(files));
    });

  }

});

