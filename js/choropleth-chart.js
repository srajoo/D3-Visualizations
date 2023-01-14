/////////////////////////////////////////////////////////////
//Color Legend code

function legend({
    color,
    title,
    tickSize = 6,
    width = 320,
    height = 44 + tickSize,
    marginTop = 18,
    marginRight = 0,
    marginBottom = 16 + tickSize,
    marginLeft = 0,
    ticks = width / 64,
    tickFormat,
    tickValues
} = {}) {  

    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .style("overflow", "visible")
        .style("display", "block");

    let x;

    // Continuous
    if (color.interpolator) {
        x = Object.assign(color.copy()
            .interpolator(d3.interpolateRound(marginLeft, width - marginRight)),
            { range() { return [marginLeft, width - marginRight]; } });

        svg.append("image")
            .attr("x", marginLeft)
            .attr("y", marginTop)
            .attr("width", width - marginLeft - marginRight)
            .attr("height", height - marginTop - marginBottom)
            .attr("preserveAspectRatio", "none")
            .attr("xlink:href", ramp(color.interpolator()).toDataURL());

        
        if (!x.ticks) {
            if (tickValues === undefined) {
                const n = Math.round(ticks + 1);
                tickValues = d3.range(n).map(i => d3.quantile(color.domain(), i / (n - 1)));
            }
            if (typeof tickFormat !== "function") {
                tickFormat = d3.format(tickFormat === undefined ? ",f" : tickFormat);
            }
        }
    }

    //discrete
    else if (color.invertExtent) {
        const thresholds
            = color.thresholds ? color.thresholds() 
                : color.quantiles ? color.quantiles() 
                    : color.domain(); 

        const thresholdFormat
            = tickFormat === undefined ? d => d
                : typeof tickFormat === "string" ? d3.format(tickFormat)
                    : tickFormat;

        x = d3.scaleLinear()
            .domain([-1, color.range().length - 1])
            .rangeRound([marginLeft, width - marginRight]);

        svg.append("g")
            .selectAll("rect")
            .data(color.range())
            .join("rect")
            .attr("x", (d, i) => x(i - 1))
            .attr("y", marginTop)
            .attr("width", (d, i) => x(i) - x(i - 1))
            .attr("height", height - marginTop - marginBottom)
            .attr("fill", d => d);

        tickValues = d3.range(thresholds.length);
        tickFormat = i => thresholdFormat(thresholds[i], i);
    }

    svg.append("g")
        .attr("transform", `translate(0, ${height - marginBottom})`)
        .call(d3.axisBottom(x)
            .ticks(ticks, typeof tickFormat === "string" ? tickFormat : undefined)
            .tickFormat(typeof tickFormat === "function" ? tickFormat : undefined)
            .tickSize(tickSize)
            .tickValues(tickValues))
        .call(g => g.selectAll(".tick line").attr("y1", marginTop + marginBottom - height))
        .call(g => g.select(".domain").remove())
        .call(g => g.append("text")
            .attr("y", marginTop + marginBottom - height - 6)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .attr("font-weight", "bold")
            .text(title));

    return svg.node();
}

function ramp(color, n = 256) {
    const canvas = DOM.canvas(n, 1);
    const context = canvas.getContext("2d");
    for (let i = 0; i < n; ++i) {
        context.fillStyle = color(i / (n - 1));
        context.fillRect(i, 0, 1, 1);
    }
    return canvas;
}

/////////////////////////////////////////////////////////////
//Choropleth code

var promises = [];

promises.push(d3.json("data/countries-50m.json"));
promises.push(d3.csv("data/gdp.csv"));

Promise.all(promises).then(function (values) {  
    var us = values[0];
    var data = values[1];

    countries = new Map(us.objects.countries.geometries.map(d => [d.id, d.properties]))  

   
    data = Object.assign(new Map(data.map((d) => [d.id, +d.GDP])));  
    data.title = "GDP per capita (in millions of USD)";
    

    color = d3.scaleThreshold([12000, 24000, 170000, 1300000, 5000000, 10000000, 20000000], d3.schemeRdPu[8])  

    projection = d3.geoMercator()
    path = d3.geoPath().projection(projection)

 
    svg = d3.select("#choropleth-chart")
        .attr("viewBox", [0, 0, 975, 610]);

    svg.append("g")
        .attr("transform", "translate(610,420)")
        .append(() => legend({ color, title: data.title, width: 450 }));

    svg.append("g")
        .selectAll("path")
        .data(topojson.feature(us, us.objects.countries).features)  
        .join("path")
        .attr("fill", d => data.get(d.id) ? color(data.get(d.id)) : "white" )  
        .attr("d", path)
        .append("title")
        .text(d => `${countries.get(d.id).name} ${data.get(d.id)}`);  

    svg.append("path")
        .datum(topojson.mesh(us, us.objects.countries))  
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-linejoin", "round")
        .attr("d", path);
});