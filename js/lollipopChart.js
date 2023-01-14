d3.csv("data/lollipop-chart/GDP_Growth.csv", d=>{
    d.Country = d.Country;
    d.Population = +d.Population;
    d.Color = d.Color;

    return d;
})
.then(function (data) {
    var margin = { top: 20, right: 20, bottom: 20, left: 60 };
    var width = 1200 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

    var svg = d3.select('#lollipop-chart')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .append('g').attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');
    
    var x = d3.scalePoint()
                .range([0, width])
                .domain(data.map(d => d.Country))
                .padding(0.5);
    var y = d3.scaleLinear()
                .domain([-6, d3.max(data.map(d => d.Population))])  
                .range([height, 0]);
    
    var xAxis = d3.axisBottom()
                .scale(x); 
    
    svg.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('r', 6)
        .attr('cx', d => x(d.Country))
        .attr('cy', function(d) {return d.Population > 0? y(d.Population) -5: y(d.Population)+5})
        .attr('class', 'dot')
        .attr('fill', d => d.Color)
        .attr('stroke', 'black');

    svg.selectAll('line')
        .data(data)
        .enter()
        .append('line')
        .attr("x1", d => x(d.Country))
        .attr("x2", d => x(d.Country))
        .attr("y1", height - 5 * 12.1)
        .attr("y2", d => y(d.Population))
        .attr("fill", "black")
        .style("stroke", "black")
        .style("stroke-width", 2); 
              
    svg.append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis)
        .append('text')
                .attr('fill', '#000')
                .attr('transform', 'rotate(0)')
                .attr('y', 6)
                .attr('dy', '0.71em')
                .attr('text-anchor', 'end')
                .text('Country');
              
    var yAxis = d3.axisLeft()
                .scale(y); 
              
    svg.append('g')
        .attr('class', 'y-axis')
        .call(yAxis)
        .append('text')
                .attr('fill', '#000')
                .attr('transform', 'rotate(-90)')
                .attr('y', 6)
                .attr('dy', '0.71em')
                .attr('text-anchor', 'end')
                .text('GDP per capita growth (%)');

    svg.append('line')
        .attr("x1", 0)
        .attr("x2", width)
        .attr("y1", height - 5 * 12.1)
        .attr("y2", height - 5 * 12.1)
        .attr("fill", "black")
        .style("stroke", "black")
        .style("stroke-width", 1);

    svg.append("text")
        .attr("x", width/4)
        .attr("y", margin.top)
        .style("text-anchor", "middle")
        .text("Annual GDP per capita growth in 2021 for 20 countries");
});