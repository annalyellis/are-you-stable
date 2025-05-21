document.addEventListener("DOMContentLoaded", () => {
  const tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  d3.csv("../BDSinfo.csv").then(data => {
    const cleanData = data.filter(d => {
      return d.Vision !== "";
    });
    
    renderBalanceRadar(cleanData, tooltip);
  }).catch(error => {
    console.error("Error loading data:", error);
  });

  function renderBalanceRadar(data, tooltip) {
    const margin = {top: 100, right: 100, bottom: 100, left: 100};
    const width = 700 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;
    const radius = Math.min(width, height) / 2;

    const svg = d3.select("#viz")
      .append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
        .attr("preserveAspectRatio", "xMidYMid meet")
      .append("g")
        .attr("transform", `translate(${width/2 + margin.left},${height/2 + margin.top})`);

    const levels = 5;
    const maxValue = 4;
    const labelFactor = 1.2;
    const wrapWidth = 100;
    const opacityArea = 0.35;
    const dotRadius = 4;

    const features = ["Best_1", "Best_2", "Best_3l", "Best_4", "Best_5", "Best_7", "Best_9", "Best_10"];
    const featureLabels = ["Seated Balance", "Sit to Stand", "Standing Unsupported", "Standing Eyes Closed", 
                          "Feet Together", "Reach Forward", "Stand on One Foot", "Turn 360 Degrees"];

    const visionConditions = [...new Set(data.map(d => d.Vision))].filter(v => v);
    const processedData = visionConditions.map(vision => {
      const visionData = data.filter(d => d.Vision === vision);
      const result = { vision: vision };
      
      features.forEach((feature, i) => {
        result[featureLabels[i]] = d3.mean(visionData, d => +d[feature]) || 0;
      });
      
      return result;
    });
    
    const angleSlice = Math.PI * 2 / featureLabels.length;
    const rScale = d3.scaleLinear()
      .domain([0, maxValue])
      .range([0, radius]);
      
    // Add title to the top of the SVG (outside the radar)
    svg.append("text")
      .attr("x", 0)
      .attr("y", -radius - 60)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .text("Balance Performance Components Across Vision Conditions");
      
    for (let j=0; j<levels; j++) {
      const levelFactor = radius * ((j+1) / levels);
      
      svg.selectAll(`.level${j}`)
        .data([1])
        .join("circle")
        .attr("class", `level${j}`)
        .attr("r", levelFactor)
        .style("fill-opacity", 0)
        .style("stroke", "gray")
        .style("stroke-opacity", 0.3);

      if (j < levels - 1) {
        svg.append("text")
          .attr("x", 5)
          .attr("y", -levelFactor)
          .attr("dy", "0.4em")
          .style("font-size", "10px")
          .style("fill", "gray")
          .text(j + 1);
      }
    }
    
    const axis = svg.selectAll(".axis")
      .data(featureLabels)
      .enter()
      .append("g")
      .attr("class", "axis");
      
    axis.append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", (d, i) => rScale(maxValue * 1.1) * Math.cos(angleSlice * i - Math.PI/2))
      .attr("y2", (d, i) => rScale(maxValue * 1.1) * Math.sin(angleSlice * i - Math.PI/2))
      .attr("class", "line")
      .style("stroke", "gray")
      .style("stroke-width", "1px");
      
    axis.append("text")
      .attr("class", "legend")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("x", (d, i) => rScale(maxValue * labelFactor) * Math.cos(angleSlice * i - Math.PI/2))
      .attr("y", (d, i) => rScale(maxValue * labelFactor) * Math.sin(angleSlice * i - Math.PI/2))
      .text(d => d)
      .call(wrap, wrapWidth);
      
    const colors = ["#EDC951", "#CC333F", "#00A0B0"];
    
    for (let i=0; i<processedData.length; i++) {
      const dataPoints = featureLabels.map((label, j) => {
        const value = processedData[i][label] || 0;
        return {
          angle: angleSlice * j - Math.PI/2,
          radius: rScale(value),
          label: label,
          value: value
        };
      });
      
      const lineGenerator = d3.lineRadial()
        .angle(d => d.angle)
        .radius(d => d.radius)
        .curve(d3.curveLinearClosed);
      
      svg.append("path")
        .datum(dataPoints)
        .attr("class", `radar-area radar-area-${i}`)
        .attr("d", lineGenerator)
        .style("fill", colors[i % colors.length])
        .style("fill-opacity", opacityArea)
        .style("stroke", colors[i % colors.length])
        .style("stroke-width", "2px")
        .on("mouseover", function() {
          d3.selectAll(".radar-area").style("fill-opacity", 0.1);
          d3.select(this).style("fill-opacity", 0.7);
        })
        .on("mouseout", function() {
          d3.selectAll(".radar-area").style("fill-opacity", opacityArea);
        });
      
      dataPoints.forEach(point => {
        svg.append("circle")
          .attr("cx", point.radius * Math.cos(point.angle))
          .attr("cy", point.radius * Math.sin(point.angle))
          .attr("r", dotRadius)
          .style("fill", colors[i % colors.length])
          .style("stroke", "#fff")
          .style("stroke-width", "1px")
          .on("mouseover", function(event) {
            tooltip.transition()
              .duration(200)
              .style("opacity", 0.9);
            
            tooltip.html(`
              <strong>${processedData[i].vision}</strong><br>
              ${point.label}: ${point.value.toFixed(2)}
            `)
              .style("left", (event.pageX + 10) + "px")
              .style("top", (event.pageY - 28) + "px");
          })
          .on("mouseout", function() {
            tooltip.transition()
              .duration(500)
              .style("opacity", 0);
          });
      });
    }
    
    // Move the legend to the bottom right instead of top left
    const legend = svg.append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${radius * 0.5},${radius * 0.7})`);
      
    visionConditions.forEach((vision, i) => {
      legend.append("rect")
        .attr("x", 0)
        .attr("y", i * 20)
        .attr("width", 15)
        .attr("height", 15)
        .style("fill", colors[i % colors.length]);
        
      legend.append("text")
        .attr("x", 20)
        .attr("y", i * 20 + 12)
        .text(vision || "Unknown");
    });

    function wrap(text, width) {
      text.each(function() {
        const text = d3.select(this);
        const words = text.text().split(/\s+/).reverse();
        let word, line = [], lineNumber = 0, lineHeight = 1.1;
        let y = text.attr("y");
        let x = text.attr("x");
        let dy = parseFloat(text.attr("dy"));
        let tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
        
        while (word = words.pop()) {
          line.push(word);
          tspan.text(line.join(" "));
          if (tspan.node().getComputedTextLength() > width) {
            line.pop();
            tspan.text(line.join(" "));
            line = [word];
            tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
          }
        }
      });
    }
  }
});