var tooltip = d3.select('#tooltip');

          
          d3.csv("data/donut-chart/gdp-per-capita.csv", function(d) {
            d.Country = d.Country;
            d.GDP = +d.GDP;
            return d;
          }).then(data => {

            var svg = d3.select("#donut-chart"),
              width = +svg.attr("width"),
              height = +svg.attr("height"),
              radius = Math.min(width, height) / 2,
              g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
            
            var pie = d3.pie()
              .sort(null)
              .value(function(d) { return d.GDP; });

          var path = d3.arc()
              .outerRadius(radius * 0.36)
              .innerRadius(radius * 0.9);

          var label = d3.arc()
          .outerRadius(radius * 0.36)
          .innerRadius(radius * 0.9);
            
              var color = d3.scaleOrdinal()
            .domain(data.map(d => d.Country))
            .range(d3.schemeDark2);

            var arc = g.selectAll(".arc")
              .data(pie(data))
              .enter().append("g")
              .attr("class", "arc")
              .on('mouseover', function(d){
                  d3.select(this)
                    .select('path')
                    .attr('stroke', "black")
                    .attr('stroke-width', 3);
                  d3.select(this).selectAll(".data-value").style('opacity', "1");
                
              })
              .on('mouseout', function(d){
                d3.select(this)
                    .select('path')
                    .attr('stroke', "white")
                    .attr('stroke-width', 1);

                d3.select(this).selectAll(".data-value").style('opacity', "0");

              });

            arc.append("path")
                .attr("d", path)
                .attr("fill", function(d) { return color(d.data.Country); })
                .attr("stroke", "white");

            arc.append("text")
                .attr("transform", function(d) { return "translate(" + label.centroid(d) + ")"; })
                .attr("dy", "0.35em")
                .text(function(d) { return d.data.Country; })
                .attr("font-weight", "bold")
                .attr("font-size", "12px")
                .attr("fill", "white");

            arc.append("text")
              .attr('class', 'data-value')
              .attr("transform", function(d) { return "translate(" + label.centroid(d) + ")"; })
              .attr("dy", "2em")
              .text(function(d) {return d.data.GDP})
              .attr("font-weight", "bold")
                .attr("font-size", "12px")
                .attr("fill", "white");
              
          });