(function () {
  'use strict';

  var currentWidth = document.getElementById('interactive').offsetWidth,
    mapWidth = 900,
    mapHeight = 390,
    aspectRatio = mapHeight / mapWidth;

  var svgMap = d3.select('#map')
    .attr('preserveAspectRatio', 'xMidYMin')
    .attr('viewBox', '70 35 ' + mapWidth + ' ' + mapHeight)
    .attr('width', currentWidth)
    .attr('height', Math.ceil(currentWidth * aspectRatio));
  
  var zoom,
    t = [0, 0],
    s = 1,
    ox = mapWidth / 2,
    oy = mapWidth / 2,
    countryBorderWidth = 0.5;

  var nameById = {},
    hiddenById = {},
    statusById = {};



  function csvInit(filename) {
    queue()
      .defer(d3.csv, filename)
      .defer(d3.json, 'json/earth.json')
      .await(ready);
  }



  function ready(error, mapData, mapJSON) {
    mapData.forEach(function(d) { nameById[d.id] = d.displayName; });
    mapData.forEach(function(d) { statusById[d.id] = d.status; });
    mapData.forEach(function(d) { if ( d.hidden === 'Y' ) { hiddenById[d.id] = true; } else { hiddenById[d.id] = false; } });

    drawEarth(mapJSON);
  } // end ready



  function isInDataset(obj) {
    if ( obj.id in nameById && !hiddenById[obj.id]) {
      return obj;
    }
  }

  function drawEarth(earth) {
    var path = d3.geo.path().projection(null);
    var tooltip;

    zoom = d3.behavior.zoom()
      .on('zoom', zoomed);

    zoom.scaleExtent([1, 8]);

    svgMap.call(zoom)
      .on('dblclick.zoom', null)
      .on('mousewheel.zoom', null)
      .on('DOMMouseScroll.zoom', null)
      .on('wheel.zoom', null);

    var features = svgMap.append('g').classed('features', true);

    features.selectAll('path.land')
      .data(topojson.feature(earth, earth.objects.land).features)
      .enter()
      .append('path')
      .classed('land', 'true')
      .attr('d', path);

    features.selectAll('path.country')
      .data(topojson.feature(earth, earth.objects.countries).features.filter(isInDataset))
      .enter()
      .append('path')
      .attr('class', function(d) { 
        switch(statusById[d.id]) {
          case 'passing' : return 'country passing ' + d.id;
          case 'close' : return 'country close ' + d.id;
          default : return 'country ' + d.id;
        }
      })
      .attr('d', path)
      .style('stroke-width', function() {
          return countryBorderWidth + 'px';
      })
      .on('mouseover', function(d) {
        var thisPath = d3.select(this);
        tooltip = d3.select('#interactive').append('div').attr('id', 'tooltip');
        thisPath.classed('hover', true);
        tooltip
        .html('<h5>' + nameById[d.id] + '</h5>')
        .style('display', 'block');
      })
      .on('mousemove', function() {
        if (d3.mouse(document.getElementById('interactive'))[0] < currentWidth / 1.5) {
          tooltip
          .classed('left', true)
          .classed('right', false)
          .style('left', (d3.mouse(document.getElementById('interactive'))[0] + 20) + 'px')
          .style('top', (d3.mouse(document.getElementById('interactive'))[1] - 15) + 'px');
        } else {
          tooltip
          .classed('right', true)
          .classed('left', false)
          .style('left', (d3.mouse(document.getElementById('interactive'))[0] - 135) + 'px')
          .style('top', (d3.mouse(document.getElementById('interactive'))[1] - 15) + 'px');
        }
      })
      .on('mouseout', function() {
        var thisPath = d3.select(this);
        thisPath.classed('hover', false);
        tooltip.remove();
      });
  } // end drawEarth



  function updateFeatures() {
    var features = d3.selectAll('.features');

    features.transition().duration(500)
      .attr('transform', 'translate(' + t + ')scale(' + s + ')');
    features.selectAll('.country').transition().duration(500)
      .style('stroke-width', countryBorderWidth / s + 'px');
  }



  function setActiveCountry(id) {    
    d3.selectAll('path.country').classed('active', false);
    d3.selectAll('path.country').classed('active-color', false);
    d3.select('path.' + id).classed('active', true).classed('active-color', true);

    if ( groupById[id] !== '' ) {
      var groupCountries = groupById[id].match(/\S+/g);

      for ( var i = 0; i < groupCountries.length; i++ ) {
        d3.select('path.' + groupCountries[i]).classed('active-color', true);
      }
    } 

  }



  function zoomed() {
    var features = d3.selectAll('.features');
    d3.select('#mapTooltip').remove();
    
    t = d3.event.translate;
    s = d3.event.scale;
    
    t[0] = Math.min((mapWidth / 2 - ox) * (s - 1), Math.max((mapWidth / 2 + ox + 150) * (1 - s), t[0]));
    t[1] = Math.min((mapHeight / 2 - oy + 200) * (s - 1), Math.max((mapHeight / 2 + oy - 180)  * (1 - s), t[1]));

    zoom.translate(t);

    features.attr('transform', 'translate(' + t + ')scale(' + s + ')');
    features.selectAll('.country').style('stroke-width', countryBorderWidth / s + 'px');
  }



  function resetZoom() {
    d3.select('#mapTooltip').remove();
    s = 1;
    t = [0, 0];

    if (zoom.scale() > zoom.scaleExtent()[0]) {
      zoom.scale(s);
      zoom.translate(t);
      updateFeatures();
    }
  }


  function zoomTo(location) {
    t = zoom.translate();

    var theSelection = d3.select("path." + location);
    
    var element = theSelection.node(),
      bbox = element.getBBox(),
      bboxArea = bbox.width * bbox.height;
    
    var zoomX = bbox.x + bbox.width/2,
      zoomY = bbox.y + bbox.height/2;

    var scale = d3.scale.linear()
      .domain([144, 1100])
      .range([3.2, 1])
      .clamp(true);

    s = scale(bboxArea);
    
    t[0] = -((zoomX * s) - (mapWidth / 1.35));
   

    if (zoomY < 130 ) {
      t[1] = -((zoomY * s) - (mapHeight / 4));
    } else {
      t[1] = -((zoomY * s) - (mapHeight / 2));
    }

    
    t[0] = Math.min((mapWidth / 2 - ox) * (s - 1), Math.max((mapWidth / 2 + ox + 150) * (1 - s), t[0]));
    t[1] = Math.min((mapHeight / 2 - oy + 200) * (s - 1), Math.max((mapHeight / 2 + oy - 180)  * (1 - s), t[1]));
    
    zoom.scale(s).translate(t);
    updateFeatures();  
  } // end zoomTo




  // ****************************************************************
  // Actions and function calls
  // ****************************************************************

  window.onresize = function() {
    currentWidth = document.getElementById('interactive').offsetWidth;
    svgMap.attr('width', currentWidth);
    svgMap.attr('height', currentWidth * aspectRatio);
  };





  
  // Search, Reset/Home, Zoom in and out map control buttons


  d3.select('.zoomInBtn').on('click', function() {
    if (zoom.scale() * 2 <= zoom.scaleExtent()[1]) {
      s = zoom.scale() * 2;
      t = zoom.translate();

      t[0] = t[0] * 2 - (mapWidth / 2);
      t[1] = t[1] * 2 - (mapHeight / 2);

      zoom.scale(s);
      zoom.translate(t);
      updateFeatures();
    }
  });

  d3.select('.zoomOutBtn').on('click', function() {
    d3.select('#mapTooltip').remove();

    if (zoom.scale() > zoom.scaleExtent()[0]) {
      if (s < zoom.scaleExtent()[0]) { s = zoom.scaleExtent()[0]; }

      s = Math.max( zoom.scale() / 2, zoom.scaleExtent()[0] );
      t = zoom.translate();

      t[0] = t[0] / 2 + (mapWidth / 4);
      t[1] = t[1] / 2 + (mapHeight / 4);

      t[0] = Math.min((mapWidth / 2 - ox) * (s - 1), Math.max((mapWidth / 2 + ox + 150) * (1 - s), t[0]));
      t[1] = Math.min((mapHeight / 2 - oy + 175) * (s - 1), Math.max((mapHeight / 2 + oy - 200)  * (1 - s), t[1]));

      zoom.scale(s);
      zoom.translate(t);
      updateFeatures();
    }
  });



  


  // Load the CSV file and get the party started. The function parameter is the path and file name of the csv to load
  csvInit('data/data.csv');
}());