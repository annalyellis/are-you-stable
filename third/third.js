document.addEventListener("DOMContentLoaded", () => {
  const tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  d3.csv("../BDSinfo.csv").then(data => {
    const cleanData = data.filter(d => {
      const bmi = parseFloat(d.BMI);
      const bestT = parseFloat(d.Best_T);
      const falls = parseInt(d.Falls12m);
      return !isNaN(bmi) && !isNaN(bestT) && !isNaN(falls);
    });
    
    renderBMIScatter(cleanData, tooltip);
  }).catch(error => {
    console.error("Error loading data:", error);
  });

  function renderBMIScatter(data, tooltip) {
    const margin = {top: 60, right: 150, bottom: 60, left: 60};
    const width = 900 - margin.left - margin.right;
    const height = 450 - margin.top - margin.bottom;

    const svg = d3.select("#viz")
      .append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
        .attr("preserveAspectRatio", "xMidYMid meet")
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear()
      .domain([d3.min(data, d => +d.BMI) * 0.9, d3.max(data, d => +d.BMI) * 1.1])
      .nice()
      .range([0, width]);
      
    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => +d.Best_T) * 1.1])
      .nice()
      .range([height, 0]);
      
    const size = d3.scaleLinear()
      .domain([0, d3.max(data, d => +d.Falls12m)])
      .range([4, 15]);
      
    const color = d3.scaleOrdinal()
      .domain([...new Set(data.map(d => d.Gender))])
      .range(["#FF69B4", "#1E90FF"]);
    
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));
      
    svg.append("g")
      .call(d3.axisLeft(y));

    const xGrid = d3.axisBottom(x)
      .tickSize(-height)
      .tickFormat("")
      .ticks(10);
      
    const yGrid = d3.axisLeft(y)
      .tickSize(-width)
      .tickFormat("")
      .ticks(10);
      
    svg.append("g")
      .attr("class", "x-grid")
      .attr("transform", `translate(0,${height})`)
      .call(xGrid)
      .selectAll("line")
      .attr("stroke", "#e0e0e0");
      
    svg.append("g")
      .attr("class", "y-grid")
      .call(yGrid)
      .selectAll("line")
      .attr("stroke", "#e0e0e0");
      
    svg.selectAll("circle")
      .data(data)
      .join("circle")
        .attr("cx", d => x(+d.BMI))
        .attr("cy", d => y(+d.Best_T))
        .attr("r", d => size(+d.Falls12m))
        .attr("fill", d => color(d.Gender))
        .attr("stroke", "white")
        .attr("stroke-width", 1)
        .attr("opacity", 0.7)
        .on("mouseover", function(event, d) {
          d3.select(this)
            .attr("stroke", "#000")
            .attr("stroke-width", 2);
          
          tooltip.transition()
            .duration(200)
            .style("opacity", 0.9);
          
          tooltip.html(`
            <strong>Subject: ${d.Subject}</strong><br>
            BMI: ${(+d.BMI).toFixed(1)}<br>
            Balance Score: ${(+d.Best_T).toFixed(1)}<br>
            Falls in 12 months: ${d.Falls12m}<br>
            Gender: ${d.Gender}<br>
            Age: ${d.Age}
          `)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function() {
          d3.select(this)
            .attr("stroke", "white")
            .attr("stroke-width", 1);
          
          tooltip.transition()
            .duration(500)
            .style("opacity", 0);
        });
        
    const genderLegend = svg.append("g")
      .attr("transform", `translate(${width + 20}, 20)`);
      
    const genders = [...new Set(data.map(d => d.Gender))];
    
    genders.forEach((gender, i) => {
      genderLegend.append("circle")
        .attr("cx", 0)
        .attr("cy", i * 25)
        .attr("r", 6)
        .style("fill", color(gender));
        
      genderLegend.append("text")
        .attr("x", 15)
        .attr("y", i * 25 + 5)
        .text(gender);
    });
    
    const sizeLegend = svg.append("g")
      .attr("transform", `translate(${width + 20}, 80)`);
      
    sizeLegend.append("text")
      .attr("x", 0)
      .attr("y", 0)
      .text("Falls in 12 months:");
      
    const fallCounts = [0, 1, 2, 3];
    
    fallCounts.forEach((count, i) => {
      sizeLegend.append("circle")
        .attr("cx", 10)
        .attr("cy", 30 + i * 25)
        .attr("r", size(count))
        .style("fill", "gray")
        .style("opacity", 0.5);
        
      sizeLegend.append("text")
        .attr("x", 25)
        .attr("y", 30 + i * 25 + 5)
        .text(count.toString());
    });
    
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", -30)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .text("Relationship Between BMI, Falls History, and Balance Performance");
      
    svg.append("text")
      .attr("x", width/2)
      .attr("y", height + 40)
      .attr("text-anchor", "middle")
      .text("Body Mass Index (BMI)");
      
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -40)
      .attr("x", -height/2)
      .attr("text-anchor", "middle")
      .text("Balance Assessment Score (Best_T)");
      
    const bestFitLine = calculateBestFitLine(data);
    
    svg.append("line")
      .attr("x1", x(bestFitLine.x1))
      .attr("y1", y(bestFitLine.y1))
      .attr("x2", x(bestFitLine.x2))
      .attr("y2", y(bestFitLine.y2))
      .attr("stroke", "#555")
      .attr("stroke-width", 1.5)
      .attr("stroke-dasharray", "5,5");
      
    svg.append("text")
      .attr("x", width - 120)
      .attr("y", 20)
      .attr("text-anchor", "start")
      .style("font-size", "12px")
      .style("font-style", "italic")
      .text(`Correlation: ${calculateCorrelation(data).toFixed(2)}`);
  }
  
  function calculateBestFitLine(data) {
    const xValues = data.map(d => +d.BMI);
    const yValues = data.map(d => +d.Best_T);
    
    const n = xValues.length;
    const xMean = d3.mean(xValues);
    const yMean = d3.mean(yValues);
    
    let numerator = 0;
    let denominator = 0;
    
    for (let i = 0; i < n; i++) {
      numerator += (xValues[i] - xMean) * (yValues[i] - yMean);
      denominator += (xValues[i] - xMean) * (xValues[i] - xMean);
    }
    
    const slope = numerator / denominator;
    const intercept = yMean - slope * xMean;
    
    const xMin = d3.min(xValues);
    const xMax = d3.max(xValues);
    
    return {
      x1: xMin,
      y1: slope * xMin + intercept,
      x2: xMax,
      y2: slope * xMax + intercept
    };
  }
  
  function calculateCorrelation(data) {
    const xValues = data.map(d => +d.BMI);
    const yValues = data.map(d => +d.Best_T);
    
    const n = xValues.length;
    const xMean = d3.mean(xValues);
    const yMean = d3.mean(yValues);
    
    let numerator = 0;
    let xDenominator = 0;
    let yDenominator = 0;
    
    for (let i = 0; i < n; i++) {
      const xDiff = xValues[i] - xMean;
      const yDiff = yValues[i] - yMean;
      
      numerator += xDiff * yDiff;
      xDenominator += xDiff * xDiff;
      yDenominator += yDiff * yDiff;
    }
    
    return numerator / Math.sqrt(xDenominator * yDenominator);
  }
});