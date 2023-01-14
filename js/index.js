var margin = { top: 20, left: 75, bottom: 50, right: 50 },
                width = 850 - margin.left - margin.right,
                height = 500 - margin.top - margin.bottom;

var svg = d3.select('#chart').append('svg')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .append('g')
                .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

var all, current, filterMode, filterModeText, sortMode, sortModeText;
d3.json('data/2019_GDP_per_capita.json', d =>{
    return {
        Country: d.Country,
        GDP: +d.GDP,
    };
}).then(data => {
    all = data;

    filterModeText = "10";
    sortModeText = "alphabetical order";

    filter('#all');
    sortBars("#alphabeticOrder");

    toggleFilter('#all');
    toggleSort("#alphabeticOrder");

    drawChart();
});

// Reset

d3.select("#reset")
    .on('click', () => {
        filterModeText = "10";
        sortModeText = "alphabetical order";
        toggleReset(true);
        filter('#reset');
        sortBars("#alphabeticOrder");
        /*toggleSort("#alphabeticOrder");
        toggleFilter("#all");*/
        redrawChart();
    })

// Sort controls
d3.select("#alphabeticOrder")
    .on('click', () => {
        sortModeText = "alphabetical order";
        sortBars("#alphabeticOrder");
        transition();
        toggleSort("#alphabeticOrder");
        toggleReset(false);
    });

d3.select("#ascending")
    .on('click', () => {
        sortModeText = "increasing order of GDP";
        sortBars("#ascending");
        transition();
        toggleSort("#ascending");
        toggleReset(false);
    });

d3.select("#descending")
    .on('click', () => {
        sortModeText = "decreasing order of GDP";
        sortBars("#descending");
        transition();
        toggleSort("#descending");
        toggleReset(false);
    });

// Filter controls

d3.select("#all")
    .on('click', () => {
        filterModeText = "10";
        filter("#all");
        toggleFilter("#all");
        toggleReset(false);
        redrawChart();
    });

d3.select("#top5")
    .on('click', () => {
        filterModeText = "top 5";
        filter("#top5");
        toggleFilter("#top5");
        toggleReset(false);
        redrawChart();
    });

d3.select("#bottom5")
    .on('click', () => {
        filterModeText = "bottom 5";
        filter("#bottom5");
        toggleFilter("#bottom5");
        toggleReset(false);
        redrawChart();
    });

// Filtering

function filter(mode)
{
    filterMode = mode;
    if (mode == "#all" )
    {
        current = JSON.parse(JSON.stringify(all));
        sortBars(sortMode);
    }
    else if (mode == "#top5")
    {
        current = all.sort((a,b) => d3.descending(a.GDP, b.GDP)).slice(0,5);
        sortBars(sortMode);

    }
    else if (mode == "#bottom5")
    {
        current = all.sort((a,b) => d3.descending(a.GDP, b.GDP)).slice(5,10);
        sortBars(sortMode);
    }
    else if (mode == "#reset")
    {
        current = JSON.parse(JSON.stringify(all));
        sortBars("#alphabeticOrder");
    }
}


// Sorting

function sortBars(mode){  
    if (mode == "#alphabeticOrder")
        {
            current.sort((a,b) => d3.ascending(a.Country, b.Country));
        }
    else if (mode == "#ascending")
        {
            current.sort((a,b) => d3.ascending(a.GDP, b.GDP));
        }
    else if (mode == "#descending")
        {
            current.sort((a,b) => d3.descending(a.GDP, b.GDP));
        }
    x.domain(current.map(d => d.Country));
    sortMode = mode;
}


function toggleReset(status){
    if (status)
    {
        d3.select("#reset")
            .classed('active', true);
        d3.selectAll(".filter, .sort")
            .classed('active', false);
    }
    else
    {
        d3.select("#reset")
            .classed('active', false);
    }
}

function toggleFilter(id){
    d3.selectAll('.filter')
        .classed('active', false);
    d3.select(id)
        .classed('active', true);
}

function toggleSort(id){
    if (id){
        d3.selectAll('.sort')
            .classed('active', false);
        d3.select(id)
            .classed('active', true);
    }
    else {
        d3.selectAll('.sort')
            .classed('active', false);
    }
}

var x = d3.scaleBand();
var y = d3.scaleLinear();
var xAxis, yAxis;

var delay = function (d, i) {
    return i * 50;
  };

function redrawChart() {
    x.domain(current.map(d => d.Country));

    // DATA JOIN FOR BARS.
    var bars = svg.selectAll('.bar')
                    .data(current, d => d.Country);

    // UPDATE.
    bars.transition()
        .duration(750)
        .delay(delay)
        .attr('x', d => x(d.Country))
        .attr('width', x.bandwidth());

    // ENTER.
    bars.enter()
        .append('rect')
        .attr('x', d => x(d.Country))
        .attr('y', d => y(0))
        .attr('width', x.bandwidth())
        .transition()
        .duration(750)
        .attr('class', 'bar')
        .attr('x', d => x(d.Country))
        .attr('y', d => y(d.GDP))
        .attr('width', x.bandwidth())
        .attr('height', d => height - y(d.GDP))
        .attr('fill', 'mistyrose');

    // EXIT.
    bars.exit()
        .transition()
        .duration(750)
        .style('opacity', 0)
        .remove();

    // UPDATE X AXIS                
    xAxis = d3.axisBottom()
                .scale(x);

    svg.select(".xAxis")
        .transition()
        .duration(750)
        .call(xAxis);

    // title.   
    svg.select(".title")              
        .transition()
        .duration(750)
        .text("GDP per capita of " + filterModeText + " countries arranged in " + sortModeText);
}

function transition() {
    var transition = svg.transition()
      .duration(750);

    transition.selectAll('.bar')
      .delay(delay)
      .attr('x', d => x(d.Country));

    transition.select('.xAxis').call(xAxis);

    transition.select('.title').text("GDP per capita of " + filterModeText + " countries arranged in " + sortModeText);
  }

function drawChart() {
    
    x.domain(current.map(d => d.Country))
        .range([0, width])
        .paddingInner(0.2);
    
    y.domain([0, d3.max(current.map(d => d.GDP))])
        .range([height, 0]);

    svg.selectAll('.bar')
        .data(current)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', d => x(d.Country))
        .attr('y', d=> y(d.GDP))
        .attr('width', x.bandwidth())
        .attr('height', d => height - y(d.GDP))
        .attr('fill', 'mistyrose');

    xAxis = d3.axisBottom()
                .scale(x);
    
    yAxis = d3.axisLeft() 
                .scale(y)
                .ticks(10)
                .tickFormat(d3.format('d')); 
    
    svg.append('g')
        .attr('class', 'xAxis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis);
    
    svg.append('text')
        .attr('x', margin.right * 6)
        .attr('y', height + 40  )
        .attr('class', 'xlabel')
        .text('Country');

    svg.append('g')
        .attr('class', 'axis')
        .call(yAxis);
    
    svg.append('text')
        .attr('x', - margin.right * 7)
        .attr('y', - margin.left * 0.7)
        .attr('transform', 'rotate(-90)')
        .attr('class', 'label')
        .append('tspan').text('GDP per capita (in millions of USD)');
    
    svg.append("text")
        .attr("class", "title")
        .text("GDP per capita of 10 countries arranged in alphabetical order")
        .attr("x", (margin.right * 2))
        .attr("y", 0)
        .style("baseline-shift", "nomal");


}