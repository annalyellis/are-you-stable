document.addEventListener("DOMContentLoaded", () => {
  const tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  d3.csv("../BDSinfo.csv").then(data => {
    const cleanData = data.filter(d => {
      const age = parseFloat(d.Age);
      const falls = parseInt(d.Falls12m);
      const bestT = parseFloat(d.Best_T);
      return !isNaN(age) && !isNaN(falls) && !isNaN(bestT);
    });
    
    renderCorrelationHeatmap(cleanData, tooltip);
  }).catch(error => {
    console.error("Error loading data:", error);
  });

  function renderCorrelationHeatmap(data, tooltip) {
    const margin = {top: 80, right: 50, bottom: 100, left: 150};
    const width = 900 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    const svg = d3.select("#viz")
      .append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
        .attr("preserveAspectRatio", "xMidYMid meet")
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
    
    const variableLabels = [
      { key: "Age", label: "Age" },
      { key: "Falls12m", label: "Falls in 12 Months" },
      { key: "FES_T", label: "Falls Efficacy Scale" },
      { key: "Best_1", label: "Seated Balance" },
      { key: "Best_2", label: "Sit to Stand" },
      { key: "Best_3l", label: "Standing Unsupported" },
      { key: "Best_4", label: "Standing Eyes Closed" },
      { key: "Best_5", label: "Standing Feet Together" },
      { key: "Best_7", label: "Reach Forward" },
      { key: "Best_9", label: "Stand on One Foot" },
      { key: "Best_10", label: "Turn 360 Degrees" },
      { key: "Best_T", label: "Total Balance Score" }
    ];
    
    const correlationMatrix = [];
    
    variableLabels.forEach(variable1 => {
      const row = [];
      
      variableLabels.forEach(variable2 => {
        const corr = calculateCorrelation(
          data.map(d => +d[variable1.key]), 
          data.map(d => +d[variable2.key])
        );
        
        row.push({
          row: variable1.label,
          column: variable2.label,
          correlation: corr,
          rowKey: variable1.key,
          columnKey: variable2.key
        });
      });
      
      correlationMatrix.push(row);
    });
    
    const correlationData = correlationMatrix.flat();
 
    const colorScale = d3.scaleLinear()
      .domain([-1, 0, 1])
      .range(["#e74c3c", "#f5f5f5", "#3498db"]);
    
    const xScale = d3.scaleBand()
      .domain(variableLabels.map(d => d.label))
      .range([0, width])
      .padding(0.05);
      
    const yScale = d3.scaleBand()
      .domain(variableLabels.map(d => d.label))
      .range([0, height])
      .padding(0.05);
    
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-45)");
     
    svg.append("g")
      .call(d3.axisLeft(yScale));
    
    svg.selectAll("rect")
      .data(correlationData)
      .join("rect")
        .attr("x", d => xScale(d.column))
        .attr("y", d => yScale(d.row))
        .attr("width", xScale.bandwidth())
        .attr("height", yScale.bandwidth())
        .style("fill", d => colorScale(d.correlation))
        .style("stroke", "#fff")
        .style("stroke-width", 1)
        .on("mouseover", function(event, d) {
          d3.select(this)
            .style("stroke", "#000")
            .style("stroke-width", 2);
          
          tooltip.transition()
            .duration(200)
            .style("opacity", 0.9);
            
          tooltip.html(`
            <strong>${d.row}</strong> vs <strong>${d.column}</strong><br>
            Correlation: ${d.correlation.toFixed(2)}
          `)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function() {
          d3.select(this)
            .style("stroke", "#fff")
            .style("stroke-width", 1);
            
          tooltip.transition()
            .duration(500)
            .style("opacity", 0);
        });
    
    svg.selectAll("text.cell")
      .data(correlationData)
      .join("text")
        .attr("class", "cell")
        .attr("x", d => xScale(d.column) + xScale.bandwidth() / 2)
        .attr("y", d => yScale(d.row) + yScale.bandwidth() / 2)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .style("font-size", "10px")
        .style("fill", d => Math.abs(d.correlation) > 0.5 ? "#fff" : "#000")
        .text(d => d.correlation.toFixed(2));
    
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", -40)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .text("Correlation Matrix of Balance and Falls Risk Metrics");

    const legendWidth = 200;
    const legendHeight = 20;
    
    const legendX = d3.scaleLinear()
      .domain([-1, 1])
      .range([0, legendWidth]);
      
    const legendAxis = d3.axisBottom(legendX)
      .tickValues([-1, -0.5, 0, 0.5, 1])
      .tickFormat(d3.format(".1f"));
    
    const legend = svg.append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${width/2 - legendWidth/2},${height + 70})`);
    
    const defs = svg.append("defs");
    
    const legendGradient = defs.append("linearGradient")
      .attr("id", "legend-gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "0%");
      
    legendGradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", colorScale(-1));
      
    legendGradient.append("stop")
      .attr("offset", "50%")
      .attr("stop-color", colorScale(0));
      
    legendGradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", colorScale(1));
    
    legend.append("rect")
      .attr("width", legendWidth)
      .attr("height", legendHeight)
      .style("fill", "url(#legend-gradient)");
      
    legend.append("g")
      .attr("transform", `translate(0,${legendHeight})`)
      .call(legendAxis);
      
    legend.append("text")
      .attr("x", legendWidth / 2)
      .attr("y", legendHeight + 30)
      .attr("text-anchor", "middle")
      .text("Correlation Coefficient");
  }
  
  function calculateCorrelation(x, y) {
    const n = x.length;
    
    if (n === 0 || x.some(isNaN) || y.some(isNaN)) {
      return 0;
    }
    
    const xMean = x.reduce((a, b) => a + b, 0) / n;
    const yMean = y.reduce((a, b) => a + b, 0) / n;
    
    let numerator = 0;
    let xVariance = 0;
    let yVariance = 0;
    
    for (let i = 0; i < n; i++) {
      const xDiff = x[i] - xMean;
      const yDiff = y[i] - yMean;
      
      numerator += xDiff * yDiff;
      xVariance += xDiff * xDiff;
      yVariance += yDiff * yDiff;
    }
    
    if (xVariance === 0 || yVariance === 0) {
      return 0;
    }
    
    return numerator / Math.sqrt(xVariance * yVariance);
  }
});