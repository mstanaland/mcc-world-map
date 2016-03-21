countries.geojson: 
	ogr2ogr -f GeoJSON countries.geojson ne_110m_admin_0_countries.shp

land.geojson:
	ogr2ogr -f GeoJSON land.geojson ne_110m_land.shp

earth.json: countries.geojson land.geojson
	topojson -o earth.json --projection 'd3.geo.robinson()' --id-property adm0_a3 -- countries.geojson land.geojson
	rm -f countries.geojson
	rm -f land.geojson