mapboxgl.accessToken = 'pk.eyJ1Ijoic291bWV5YWsiLCJhIjoiY2w5eW9uZ3J0MDczODNwbzJ4bGN2ZzJsdyJ9.q47T3SNXyRzUNBTpVNQkDQ';
    const map = new mapboxgl.Map({
    container: 'map', 
    
    style: 'mapbox://styles/mapbox/dark-v10', 
    center: [-118.28466639151476,34.02253861801796], 
    zoom: 15, 
    projection: 'globe' 
    });
     
    map.on('style.load', () => {
    map.setFog({}); 
    });
  map.on('load', function () {
  map.addSource('footprints_source', {
    type: 'geojson',
    data: 'data/map.geojson'
  });

  map.addLayer({
    'id': 'footprints',
    'type': 'fill',
    'source': 'footprints_source',
    'layout': {},
    'paint': {
      'fill-color': ['interpolate', ['linear'], ['get', 'AREA'],
                0, '#fff7f3',
                100, '#fde0dd',
                500, '#fcc5c0',
                1000, '#fa9fb5',
                5000, '#f768a1',
                10000, '#dd3497',
                20000, '#ae017e',
                60000, '#7a0177',
                100000, '#49006a'],
      'fill-opacity': 0.8
    }
  });
  map.on('click', 'footprints', (e) => {
    new mapboxgl.Popup()
    .setLngLat(e.lngLat)
    .setHTML('<b>'+e.features[0].properties.CODE + '</b>' + '<br> ID:' + e.features[0].properties.BLD_ID)
   
    .addTo(map);
    });
     
    
    map.on('mouseenter', 'footprints', () => {
    map.getCanvas().style.cursor = 'pointer';
    });
     
    
    map.on('mouseleave', 'footprints', () => {
    map.getCanvas().style.cursor = '';
    });
});