function oaProcessTagFields()
{
    $("#id_slug").attr('disabled','disabled');
}

$(function() {

  //Perform tasks only if this is tag page
  if ( $("#id_tag_type").length )
  {
    //Initialize
    oaProcessTagFields();

  }

  if ( $(".object-tools > li > a").text().trim() == "Add items" )
  {
    //Hiding this because if you add items from here it will not show in Story admin
    $(".object-tools > li > a").hide();
  }

});
