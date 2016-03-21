$(function() {

  if ( $("#search_form").length )
  {

   	$("#id_update_solr").val("");
   	$("#id_clear_homepage_cache").val("no");

   	var btnHtml = "<input class='default' type='button' value='Process' onclick='$(\".change-view-save-another\").click();'>";
   	//$(".submit-row").prepend(btnHtml);
   	$(".submit-row").append(btnHtml);
  }

});
