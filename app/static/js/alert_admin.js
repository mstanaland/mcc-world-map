function oaProcessAlertMetaFields()
{
    $("#id__order").val("0");

    $("._meta_title").hide();
    $(".description").hide();
    $(".gen_description").hide();
    $(".keywords").hide();
    $(".short_url").hide();
    $(".in_sitemap").hide();
    $("._order").hide();
    $(".parent").hide();
    $(".in_menus").hide();
    $(".login_required").hide();

    $(".expiry_date").hide();
    $(".message_subject_editable").hide();
    $(".message_body_editable").hide();
    $(".message_closing").hide();
    //$(".message_greeting").hide();
    $(".message_opening").hide();
    //$(".message_signature").hide();
    $(".alert_status").hide();
    $(".required_fields").hide();
    $(".category").hide();
    $(".internal_name").hide();
    $(".alert_type").hide();

    $( '.content > div > label' ).hide();
    $( 'textarea#id_content' ).ckeditor();
}

$(function() {

  //Perform tasks only if this is alert page
  if ( $("#id_required_fields").length )
  {
    //Initialize
    oaProcessAlertMetaFields();
  }

});
