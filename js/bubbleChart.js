d3.csv("data/bubble-chart/NutritionData.csv")
.then(function (data) {

    var margin = { top: 10, right: 20, bottom: 20, left: 40 };
    var width = 1200 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    var x = d3.scaleLinear()
                .domain([d3.min(data.map(d => d.Cost)), d3.max(data.map(d => d.Cost))])
                .range([0, width]);
    
    var y = d3.scaleLinear()
                .domain([0, 100])
                .range([height, 0]);

    
    var xAxis = d3.axisBottom()
                .scale(x);
              
    var yAxis = d3.axisLeft() //🚧 axis labels not formatted 
                .scale(y)
                .ticks(10);

    
    var svg = d3.select("#bubble-chart")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    svg.selectAll('circle')
                .data(data)
                .enter()
                .append('circle')
                .attr('r', d => d.Population * 0.35)
                .attr('cx', d => x(d.Cost))
                .attr('cy', d => y(d.Percent))
                .attr('class', 'dot')
                .attr('fill', d => d.Color)
                .attr('stroke', d => d.Color);
    
    svg.selectAll('text')
        .data(data)
        .enter()
        .append('text')
        .attr('x', d => x(d.Cost) - 20)
        .attr('y', d => y(d.Percent)- 10)
        .text(d => d.Country)
        .attr('font-size', '10px')
        .attr('font-weight', 'bold')
        .attr('fill', 'white');


    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis).append('text')
        .attr('fill', '#fff')
        .attr('transform', 'rotate(0)')
        .attr('x', width)
        .attr('y', 6)
        .attr('dy', '0.71em')
        .attr('text-anchor', 'end')
        .text('Cost');
              
    svg.append("g")
        .call(yAxis).append('text')
        .attr('fill', '#fff')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('x', -100)
        .attr('dy', '0.71em')
        .attr('text-anchor', 'end')
        .text('Population %');

    svg.append("text")
        .attr("x", width/4)
        .attr("y", margin.top)
        .style("text-anchor", "middle")
        .text("Cost of a healthy diet and population unable to afford diet, 2021")
        .attr('fill', 'white');

});