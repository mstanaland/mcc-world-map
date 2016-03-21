function oaPeopleProcessFields()
{
  $(".twitter_id").hide();
}

function oaShowPeopleImages()
{
  var url = $("#id_photo_url").val();
  html = "<img style='max-width:150px' src='";
  html += url;
  html += "' >";
  $("#imageDiv").html(html);

  var url = $("#id_hi_res_photo_url").val();
  html = "<img style='max-width:150px' src='";
  html += url;
  html += "' >";
  $("#hiResImageDiv").html(html);

}

function oaPeopleProcessFileUploadFields()
{
  //Initialize oaFileApp
  //OAFileApp.input_id = "id_hi_res_photo_url";
  //OAFileApp.div_id = "hiResImageDiv";

  $("#id_hi_res_photo_url").hide();
  $("#id_photo_url").hide();

  var onclick1 = "OAFileApp.url_input_id='id_hi_res_photo_url';";
  onclick1 += "OAFileApp.div_id='hiResImageDiv';";
  onclick1 += "OAFileApp.file_input_id='id_hi_res_photo_id';";
  onclick1 += "OAFileApp.caption_input_id = '';";
  onclick1 += "OAFileApp.credit_input_id = '';";
  onclick1 += "OAFileApp.callback = '';";
  onclick1 += "OAFileApp.openWindow('image');";

  var onclick2 = "OAFileApp.input_id='id_hi_res_photo_url';";
  onclick2 += "OAFileApp.file_input_id='id_hi_res_photo_id';";
  onclick2 += "OAFileApp.div_id='hiResImageDiv';";
  onclick2 += "OAFileApp.removeFile();";

  var addImageBtn = "";
  addImageBtn += "<table><tr><td valign='top'>";
  addImageBtn += "<div id='hiResImageDiv' style='margin-bottom:5px'></div>";
  addImageBtn += "<input class='addImage' type='button' value='Add image' ";
  addImageBtn += "onclick=\"";
  addImageBtn += onclick1;
  addImageBtn += "\"";
  addImageBtn += ">";
  addImageBtn += "&nbsp;";
  addImageBtn += "<input class='removeImage' type='button' value='Remove image' ";
  addImageBtn += "onclick=\"";
  addImageBtn += onclick2;
  addImageBtn += "\"";
  addImageBtn += ">";
  addImageBtn += "</td></tr></table>";
  $(".hi_res_photo_url").append(addImageBtn);

  onclick1 = "OAFileApp.url_input_id='id_photo_url';";
  onclick1 += "OAFileApp.div_id='imageDiv';";
  onclick1 += "OAFileApp.file_input_id='id_photo_id';";
  onclick1 += "OAFileApp.caption_input_id = '';";
  onclick1 += "OAFileApp.credit_input_id = '';";
  onclick1 += "OAFileApp.callback = '';";
  onclick1 += "OAFileApp.openWindow('image','278x360');";

  onclick2 = "OAFileApp.input_id='id_photo_url';";
  onclick2 += "OAFileApp.file_input_id='id_photo_id';";
  onclick2 += "OAFileApp.div_id='imageDiv';";
  onclick2 += "OAFileApp.removeFile();";

  var addImageBtn2 = "";
  addImageBtn2 += "<table><tr><td valign='top'>";
  addImageBtn2 += "<div id='imageDiv' style='margin-bottom:5px'></div>";
  addImageBtn2 += "<input class='addImage' type='button' value='Add image' ";
  addImageBtn2 += "onclick=\"";
  addImageBtn2 += onclick1;
  addImageBtn2 += "\"";
  addImageBtn2 += ">";
  addImageBtn2 += "&nbsp;";
  addImageBtn2 += "<input class='removeImage' type='button' value='Remove image' ";
  addImageBtn2 += "onclick=\"";
  addImageBtn2 += onclick2;
  addImageBtn2 += "\"";
  addImageBtn2 += ">";
  addImageBtn2 += "</td></tr></table>";
  $(".photo_url").append(addImageBtn2);

  //OAFileApp.input_id = "id_hi_res_photo_url";
  //OAFileApp.div_id = "hiResImageDiv";
  //OAFileApp.addFile();

  //OAFileApp.input_id = "id_photo_url";
  //OAFileApp.div_id = "imageDiv";
  //OAFileApp.addFile();

}

function oaCleanArray(actual){
  var newArray = new Array();
  for(var i = 0; i<actual.length; i++){
      if (actual[i]){
        newArray.push(actual[i]);
    }
  }
  return newArray;
}

function oaEditPeopleOrderBy()
{

  if ( !confirm("Are you sure?") ){ return; }

  var obj = {};
  django.jQuery(".edit-order-by").each(function(input) {
    obj[$(this).attr('data-id')] = $(this).val();
  });

  $.ajax({
    url: "/people/edit_order_by",
    data: obj,
    dataType: "json",
    success: function(data){
      if ( data["success"] )
      {
        alert('Edit is complete');
      }
      else
      {
        alert(data["msg"]);
      }
    }
  });
}

$(function() {

  //Perform tasks only if this is story page
  if ( $("#id_full_name").length )
  {
    //$( '.bio > div > label' ).hide();


    //Initialize
    oaPeopleProcessFields();
    oaPeopleProcessFileUploadFields();
	oaShowPeopleImages();

    $( "#people_form" ).submit(function( event ) {
      event.preventDefault();
      this.submit();
    });

    //$( 'textarea#id_bio' ).ckeditor();

  }

  if ( $(".object-tools > li > a").text().trim() == "Add person" )
  {
    var btnHtml = "<li><a href='javascript:oaEditPeopleOrderBy();' class='focus'>Edit order by</a></li>";
    $(".object-tools").prepend(btnHtml);
  }


});
