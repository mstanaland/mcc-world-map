var oaData = {}; 
oaData.data_count = 0;
oaData.data_name = "";
oaData.data_type = "";
oaData.html = "";
oaData.row_head = "";
oaData.row = "";
oaData.keys = new Array();
oaData.key_types = new Array();

oaData.image_sizes = {};
oaData.has_image = false;

oaData.selector = {};
oaData.has_selector = false;

oaData.data = [];
oaData.columns = [];
oaData.column_headers = [];
oaData.column_width = [];

oaData.current_row = 0;
oaData.current_column = 0;
oaData.current_column_name = "";
oaData.current_column_type = "";
oaData.template = "{{if value}}{{value}}{{/if}}";

var submitData = false;

var $HOT = "";

function strip_tags(input, allowed) {
	allowed = (((allowed || "") + "").toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join('');
	var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
	commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
	return input.replace(commentsAndPhpTags, '').replace(tags, function ($0, $1) {
		return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
	});
}

var selectorRenderer = function (instance, td, row, col, prop, value, cellProperties) {
  var escaped = Handsontable.helper.stringify(value);
  td.innerHTML = escaped;
  return td;
};

var htmlRenderer = function (instance, td, row, col, prop, value, cellProperties) {
  var escaped = Handsontable.helper.stringify(value);
  //escaped = strip_tags(escaped, '<textarea><img><em><b><a>');
  td.innerHTML = escaped;
  return td;
};

var imageOrEmbedRenderer = function (instance, td, row, col, prop, value, cellProperties) {
  //var escaped = Handsontable.helper.stringify(value);
  //escaped = strip_tags(escaped, '<textarea><img><em><b><a>');
  
	if ( typeof(value) === "undefined" ){ return; }

	if(value.indexOf("<") != -1 && value.indexOf(">") != -1)
	{
  	//This is an embed
  	$(td).empty().append(value); 
  	return td;
	}

  var $img = $('<img>');
  $img.attr('src', value);
  $img.attr('width', "100");
  //$img.attr('height', "100");
  $img.on('mousedown', function (event) {
    event.preventDefault(); //prevent selection quirk
  });
  $(td).empty().append($img); 
  return td;
};

function oaShowSelectorValues()
{
	localStorage["show_selector_values"] = true;
	location.reload();
}

function oaHideSelectorValues()
{
	localStorage["show_selector_values"] = "";
	location.reload();
}

function oaShowSize()
{
	localStorage["show_size"] = true;
	location.reload();
}

function oaHideSize()
{
	localStorage["show_size"] = "";
	location.reload();
}

function oaAddRow()
{

	var add = [];
  for ( var i in oaData.keys )
  {
    add[oaData.keys[i]] = "";
  }

	oaData.data.push(add);
	$HOT.handsontable("render");

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
function oaGoToWidget()
{
    var url = "/admin/widgets/widget/" + $("#id_widget").val();
    window.open(url);
}

function oaGetFinalData(type)
{
	var data_array = new Array();

	var hot_data = $HOT.handsontable('getData');

	if (typeof(hot_data) === "undefined"){ return; }

	for (var i=0; i<hot_data.length; i++)
	{
		var hot = {};

		var hot_data2 = hot_data[i];
		for (key in hot_data[i] )
		{
			hot[key] = hot_data[i][key];
		}

		data_array.push(hot);
	}

  if ( typeof(oaData.data_type) == undefined || oaData.data_type != "collection" )
  {
    final_data_array = data_array[0];
  }
  else
  {
    final_data_array = data_array;
  }

  if ( typeof(oaData.data_name) == undefined )
  {
    final_data = final_data_array;
  }
  else
  {
    final_data = {};
    final_data[oaData.data_name] = final_data_array;
  }

	return final_data;

}

function oaSaveData(type)
{

  //$("#id_data").val(JSON.stringify(final_data));
  $("#id_data").val(JSON.stringify(oaGetFinalData(type)));
  if ( type == "another" ) { $("#submitBtnAnother").click(); }
  else if ( type == "continue" ) { $("#submitBtnContinue").click(); }
  else { $("#submitBtn").click(); }

}

function oaCleanTitle(title)
{
  title = title.replace(/_/g," ");
  title = title.charAt(0).toUpperCase() + title.slice(1);
  return title;
}

function oaProcessWidgetType()
{
  $(".data_definition").hide();

  if ( $( "#id_widget_type" ).val() == "data" )
  {
    $(".data_definition").show();
  }
}

function oaProcessWidget()
{
  $(".data").hide();

  var id = oaGetWidgetId(true);

  if ( id )
  {
    $.ajax({
      url: "/widgets/get_widget?id=" + id,
      data: {id: id},
      dataType: "json",
      success: function(data){
        oaBuildDataDefinition(data);
      }
    });
  }

}

function oaBuildDataDefinition(data)
{
  if ( !data["success"] ){
    $("#widget-data").html("");
    alert(data["msg"]);
    return;
  }

  var dd = data["data_definition"];
  if ( !$.trim(dd) )
  {
    $("#widget-data").html("");
    return;
  }

  $(".data_definition").show();

  var dd_array = dd.split("\n")
  
  var data_name = "";
  var data_type = "";

  //oaData.row += "<tr id='widget-data-row{{count}}'>";
  for (i=0;i<dd_array.length;i++)
  {
    var dd_string = dd_array[i];
    var equal_array = dd_string.split("=");
    var colon_array = dd_string.split(":");
    var image_size = "";
    var selector = "";

    if ( colon_array.length == 3 && colon_array[1] == "image" )
	{
		oaData.has_image = true;
		image_size = colon_array[2];
	}

    if ( colon_array[1] == "selector" )
	{
		oaData.has_selector = true;
		selector = colon_array[2];
	}

    if ( equal_array[0] == "data_name" )
    {
      data_name = equal_array[1];
      oaData.data_name = $.trim(data_name);
    }
    else if ( equal_array[0] == "data_type" )
    {
      data_type = equal_array[1];
      oaData.data_type = $.trim(data_type);
    }
    else
    {
      oaData.keys.push(colon_array[0]);
      oaData.column_headers.push(colon_array[0]);
      oaData.key_types.push(colon_array[1]);
      oaData.column_width.push(150);
      oaData.image_sizes[colon_array[0]] = image_size;
      oaData.selector[colon_array[0]] = selector;

      if ( $.trim(colon_array[1]) == "selector" )
      {
			oaData.has_selector = true;
      	    oaData.keys.push("selector_values_for_" + colon_array[0]);
      	    oaData.columns.push({data:colon_array[0],renderer: selectorRenderer,readOnly: true});

			if ( localStorage["show_selector_values"] )
			{
      		    oaData.column_headers.push("selector_values_for_" + colon_array[0]);
      		    oaData.columns.push({data:"selector_values_for_" + colon_array[0],renderer: htmlRenderer,readOnly: true});
			}
      }
      else if ( $.trim(colon_array[1]).slice(0,5) == "image" )
      {
			oaData.has_image = true;
      	    oaData.keys.push("file_id_for_" + colon_array[0]);
      	    oaData.keys.push("size_for_" + colon_array[0]);
      	    oaData.columns.push({data:colon_array[0],renderer: imageOrEmbedRenderer,readOnly: true});

			if ( localStorage["show_size"] )
			{
      		    oaData.column_headers.push("size_for_" + colon_array[0]);
      		    oaData.columns.push({data:"size_for_" + colon_array[0],renderer: htmlRenderer,readOnly: true});
			}
      }
      else if ( $.trim(colon_array[1]) == "text" )
      {
      	oaData.columns.push({data:colon_array[0],renderer: htmlRenderer,readOnly: false});
      }
      else if ( $.trim(colon_array[1]) == "wysiwyg" )
      {
      	oaData.columns.push({data:colon_array[0],renderer: htmlRenderer,readOnly: true});
      }

    }

  }


  oaInitialDataFields();

}

function oaGetWidgetId(checkSelect)
{
  if ( checkSelect && $("#id_widget").length )
  {
    return parseInt($("#id_widget").val());
  }

  //Get saved widget id
  var url = location.href; 
  url = url.replace(/\/+$/g, '');

  var id = 0;

  var url_array = url.split("/");
  if (url_array[url_array.length-2] == "widget")
  {
    id = url_array[url_array.length-1];
  }

  return parseInt(id);

}


function oaGetPlacementId()
{
  //Get placement id
  var url = location.href; 
  url = url.replace(/\/+$/g, '');

  var id = 0;

  var url_array = url.split("/");
  if (url_array[url_array.length-2] == "placement")
  {
    id = url_array[url_array.length-1];
  }

  return parseInt(id);
}

function oaInitialDataFields()
{
  var placement_id = oaGetPlacementId();
  var widget_id = oaGetWidgetId(true);
  if ( placement_id || widget_id )
  {
    $.ajax({
      url: "/widgets/get_data",
      data: {placement_id: placement_id, widget_id: widget_id},
      dataType: "json",
      success: function(data){
        console.log(data);
        oaFillData(data);
      }
    });
  }
}


function oaSelectData()
{
	oaData.data[oaData.current_row][oaData.current_column_name] = $.trim($("#widgetDataSelectorKeys").val());
	oaData.data[oaData.current_row]["selector_values_for_" + oaData.current_column_name] = $.trim($("#widgetDataSelectorValues").val());
	$HOT.handsontable('render'); 

	//Reset local storage
	localStorage["widgetDataSelectorKeys"] = "";
	localStorage["widgetDataSelectorValues"] = "";
}
function oaPostText()
{
	oaData.data[oaData.current_row][oaData.current_column_name] = $.trim($("#widgetDataText").val());
	$HOT.handsontable('render'); 

	//Reset local storage
	localStorage["widgetText"] = "";
}

function oaSelectFile()
{
	oaData.data[oaData.current_row][oaData.current_column_name] = $.trim($("#widgetDataUrl").val());
	oaData.data[oaData.current_row]["file_id_for_" + oaData.current_column_name] = $.trim($("#widgetDataFile").val());
	oaData.data[oaData.current_row]["size_for_" + oaData.current_column_name] = $.trim(oaData.image_sizes[oaData.current_column_name]);

	$HOT.handsontable('render'); 
}

function oaFillData(data)
{

  var d = $.parseJSON(data["data"]);

  if ( typeof(d) != "undefined" && d != null )
  {
    d = d[oaData["data_name"]];
  }

  var button_html = "";
  if ( oaGetWidgetId() || oaGetPlacementId() )
  {
    if ( oaData.data_type == "collection" )
    {
      button_html += "<input type='button' value='Add row' onclick='oaAddRow();' style='margin-bottom:10px'>&nbsp;";
    }
    //Uncomment below to show size column for data fields
    //if ( oaData.has_image )
		//{
    //	button_html += "<input type='button' value='Show size' onclick='oaShowSize();' style='margin-bottom:10px'>&nbsp;";
    //	button_html += "<input type='button' value='Hide size' onclick='oaHideSize();' style='margin-bottom:10px'>&nbsp;";
		//}
    //table_html += "&nbsp;";
    //table_html += "<input type='button' value='Save data' onclick='oaSaveData();'>";

  	$('#button-data').append(button_html);
  }

	//var hidden = "";

  var count = 0;
   var dataTemp = [];
  if ( oaData["data_type"] == "collection" )
  {
    for (var o in d)
    {
      var context = {};
      var template = oaData.row;
    	var dataTemp = Array();
      
      //Setup count
      context["count"] = count;

      for ( var i in oaData.keys )
      {

        if ( d[o][oaData.keys[i]] )
		{
        	context["value"] = d[o][oaData.keys[i]];
		}
		else
		{
        	context["value"] = "";
		}

      	dataTemp[oaData.keys[i]] = Mark.up(oaData.template, context);

      }

      count++;

	  oaData.data.push(dataTemp);

    }

  }
  else if ( d )
  {
    var context = {};
    var template = oaData.row;

    //Setup count
    context["count"] = count;

    for ( var i in oaData.keys )
    {
      context["value"] = d[oaData.keys[i]];
      dataTemp[oaData.keys[i]] = Mark.up(oaData.template, context);

    }

    count++;
	oaData.data.push(dataTemp);

  }
	else { oaAddRow(); }

  oaData.data_count = count;

  $HOT.handsontable({
    data: oaData.data,
    startRows: 6,
    startCols: 10,
		colWidths: oaData.column_width,
   	//minSpareCols: 1,
   	//minSpareRows: 1,
   	rowHeaders: true,
    colHeaders: oaData.column_headers,
    //colHeaders: true,
    columns: oaData.columns,
  	scrollH: 'auto',
  	scrollV: 'auto',
  	outsideClickDeselects: true,
  	removeRowPlugin: true,
    contextMenu: false,

	afterSelectionEnd: function(row, column, row2, column2) {
		if ( row == row2 && column == column2 )
		{
			oaData.current_row = row;
			oaData.current_column = row;

            console.log(oaData);

       	    var key = $.trim(oaData.keys[column]) + "_" + row;
            oaData.current_column_name = oaData.column_headers[column];
            oaData.current_column_type = oaData.key_types[column];

      	    if ( $.trim(oaData.key_types[column]).slice(0,5) == "image" )
      	    {
        	    OAFileApp.url_input_id = "widgetDataUrl";
        	    OAFileApp.file_input_id = "widgetDataFile";
        	    OAFileApp.caption_input_id = "widgetDataCaption";
        	    OAFileApp.credit_input_id = "widgetDataCredit";
        	    OAFileApp.callback = "oaSelectFile";

      		    if ( $.trim(oaData.key_types[column]) == "image_or_embed" )
      		    {
						if ( confirm("Do you want to add an image or embed? Click 'OK' for image") )
						{
        			        OAFileApp.openWindow('image');
						}
						else
						{
							localStorage["widgetText"] = $HOT.handsontable('getData')[oaData.current_row][oaData.current_column_name];
        			        OAWidgetApp.text_input_id = "widgetDataText";
        			        OAWidgetApp.callback = "oaPostText";
        			        OAWidgetApp.openWindow(oaData.key_types[column]);
						}
      		    }
				else
				{
        		    OAFileApp.openWindow('image');
				}
      	    }
      	    else if ( $.trim(oaData.key_types[column]) == "selector" )
      	    {
        	    OAWidgetSelectorApp.selector_keys = "widgetDataSelectorKeys";
        	    OAWidgetSelectorApp.selector_values = "widgetDataSelectorValues";
        	    OAWidgetSelectorApp.callback = "oaSelectData";
				localStorage["widgetSelectorKeys"] = $HOT.handsontable('getData')[oaData.current_row][oaData.current_column_name];
        		OAWidgetSelectorApp.openWindow(oaData.selector[oaData.current_column_name]);
      	    }
      	    else if ( $.trim(oaData.key_types[column]) == "text" )
      	    {
      	    }
      	    else if ( $.trim(oaData.key_types[column]) == "wysiwyg" )
      	    {
			    localStorage["widgetText"] = $HOT.handsontable('getData')[oaData.current_row][oaData.current_column_name];
        	    OAWidgetApp.text_input_id = "widgetDataText";
        	    OAWidgetApp.callback = "oaPostText";
        	    OAWidgetApp.openWindow(oaData.key_types[column]);
            }
	    }
    }

  });

}

function oaEditOrderBy()
{

  if ( !confirm("Are you sure?") ){ return; }

  var obj = {};
  django.jQuery(".edit-order-by").each(function(input) {
    obj[$(this).attr('data-id')] = $(this).val();
  });

  $.ajax({
    url: "/widgets/edit_order_by",
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
  if ( $("#id_widget").length || $("#id_code").length )
  {

    if ( $("a.add-another").attr('href') == "/admin/widgets/widget/add/" )
    {
        var plus = "<a href='javascript:oaGoToWidget();' class='goto-selected'>Edit the widget</a>";
        $("#content-main").append("<div>" + plus + "</div>");
    }



	//Show_size should always be hidden
	localStorage["show_size"] = "";

	//Show_selector values should always be true
	localStorage["show_selector_values"] = true;

	hidden_fields = "<input type='hidden' id='widgetDataUrl' >";
	hidden_fields += "<input type='hidden' id='widgetDataFile' >";
	hidden_fields += "<input type='hidden' id='widgetDataCaption' >";
	hidden_fields += "<input type='hidden' id='widgetDataCredit' >";
	hidden_fields += "<input type='hidden' id='widgetDataText' >";

	hidden_fields += "<input type='hidden' id='widgetDataSelectorKeys' >";
	hidden_fields += "<input type='hidden' id='widgetDataSelectorValues' >";

    //Initialize
    $("#content-main").append("<br><br>");
    $("#content-main").append("<div id='button-data' style=''></div>");
    $("#content-main").append("<div id='widget-data'></div>");
    $("#content-main").append("<div id='hidden-data'>" + hidden_fields + "</div>");

		$HOT = $("#widget-data");

    $( "#id_widget" ).bind( "change", function() {
      oaProcessWidget();
    }); 

    $( "#id_widget_type" ).bind( "change", function() {
      oaProcessWidgetType();
    }); 

    oaProcessWidget();

  }

  if ( $(".object-tools > li > a").text().trim() == "Add placement" )
  {
    var btnHtml = "<li><a href='javascript:oaEditOrderBy();' class='focus'>Edit order by</a></li>";
    $(".object-tools").prepend(btnHtml);

  }

  if ( $("#widget_form").length || $("#placement_form").length )
  {

		var submitHtml = "<p class=\"deletelink-box\"><a href=\"delete/\" class=\"deletelink\">Delete</a></p>";
  	submitHtml += "<input type=\"submit\" value=\"Save\" class=\"default\" name=\"_save\" id=\"submitBtn\" >";
  	submitHtml += "<input class=\"change-view-save-another\" type=\"submit\" value=\"Save and add another\" id=\"submitBtnAnother\"  name=\"_addanother\">";
  	submitHtml += "<input  class=\"change-view-save-continue\" type=\"submit\" value=\"Save and continue editing\" id=\"submitBtnContinue\"  name=\"_continue\">";

  	submitHtml += "<input type=\"button\" value=\"Save\" class=\"default2\"  onclick=\"oaSaveData('done');return false;\">";
  	submitHtml += "<input type=\"button\" value=\"Save and add another\"  onclick=\"oaSaveData('another');return false;\">";
  	submitHtml += "<input type=\"button\" value=\"Save and continue editing\"  onclick=\"oaSaveData('continue');return false;\">";

		//Replace submit buttons
  	$('.submit-row').html(submitHtml);

	}


});

