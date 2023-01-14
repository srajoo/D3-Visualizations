var promises = [];
var files = ['data/countries-50m.json', 'data/gdp.json', 'data/gdp2.json'];
files.forEach(url => promises.push(d3.json(url)));  
Promise.all(promises).then(function (values) {  
    var us = values[0];
    var data = values[1];
    var data1 = values[2];

    format = d3.format(',.0f')

    data = new Map(data.slice(1).map(([gdp, country]) => [country, +gdp]))
    data1 = new Map(data1.slice(1).map(([country, continent]) => [country, continent]))


    radius = d3.scaleSqrt([0, d3.quantile([...data.values()].sort(d3.ascending), 0.985)], [0, 20]);

    var color = d3.scaleOrdinal()
      .domain(["Asia", "Europe", "South America", "North America"])
      .range([ "#dd3497", "#cb181d", "#2171b5", "#810f7c"])

    svg = d3.select('#symbol-chart')
        .attr('viewBox', [0, 0, 1200, 610]);

    var projection = d3.geoMercator(200);
    var path = d3.geoPath().projection(projection)

   
    svg.append('path')
        .datum(topojson.feature(us, us.objects.countries))
        .attr('fill', '#ccc')
        .attr('d', path);

    
    svg.append('path')
        .datum(topojson.mesh(us, us.objects.countries, (a, b) => a !== b))
        .attr('fill', 'none')
        .attr('stroke', 'white')
        .attr('stroke-linejoin', 'round')
        .attr('d', path);

    
    const legend = svg.append('g')
        .attr('fill', '#777')
        .attr('transform', 'translate(990,558)')
        .attr('text-anchor', 'middle')
        .style('font', '10px sans-serif')
        .selectAll('g')
        .data([5e5, 1e7, 2e8])
        .join('g');

    legend.append('circle')
        .attr('fill', 'none')
        .attr('stroke', '#ccc')
        .attr('cy', d => -radius(d))
        .attr('r', radius);

    legend.append('text')
        .attr('y', d => -2 * radius(d))
        .attr('dy', '1.3em')
        .text(d3.format('.1s'));

    
    svg.append('g')
        .attr('fill-opacity', 0.8)
        .attr('stroke', '#fff')
        .attr('stroke-width', 0.5)
        .selectAll('circle')
        .data(topojson.feature(us, us.objects.countries).features
            .map(d => (d.value = data.get(d.id), d)) 
            .sort((a, b) => b.value - a.value))
        .join('circle')
        .attr('transform', d => `translate(${path.centroid(d)})`)  
        .attr('r', d => radius(d.value))
        .attr('fill', function(d){ return color(data1.get(d.id))})
        .append('title')
        .text(d => `${d.properties.name}, ${format(d.value)}`);
});