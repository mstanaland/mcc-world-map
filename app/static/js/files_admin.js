$(function() {
  if ( $(".object-tools > li > a").text().trim() == "Add images" )
  {
    $(".object-tools > li > a").attr("href","javascript:OAFileApp.openWindow('image');");
  }

  if ( $(".object-tools > li > a").text().trim() == "Add files" )
  {
    $(".object-tools > li > a").attr("href","javascript:OAFileApp.openWindow('all');");
  }

  if ( $(".object-tools > li > a").text().trim() == "Add documents" )
  {
    $(".object-tools > li > a").attr("href","javascript:OAFileApp.openWindow('document');");
  }
});
