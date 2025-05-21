document.addEventListener("DOMContentLoaded", () => {
  const tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  d3.csv("../BDSinfo.csv").then(data => {
    const cleanData = data.filter(d => {
      const fesT = parseFloat(d.FES_T);
      return !isNaN(fesT) && d.Gender && d.AgeGroup;
    });
    
    renderGenderAgeBarChart(cleanData, tooltip);
  }).catch(error => {
    console.error("Error loading data:", error);
  });

  function renderGenderAgeBarChart(data, tooltip) {
    const margin = {top: 60, right: 120, bottom: 80, left: 60};
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

    const ageGroups = [...new Set(data.map(d => d.AgeGroup))].sort();
    const genders = [...new Set(data.map(d => d.Gender))];
    
    const avgData = [];
    
    ageGroups.forEach(age => {
      genders.forEach(gender => {
        const filteredData = data.filter(d => d.AgeGroup === age && d.Gender === gender);
        const avg = d3.mean(filteredData, d => +d.FES_T);
        const count = filteredData.length;
        
        if (count > 0) {
          avgData.push({
            ageGroup: age,
            gender: gender,
            avg: avg,
            count: count
          });
        }
      });
    });
    
    const x0 = d3.scaleBand()
      .domain(ageGroups)
      .range([0, width])
      .padding(0.2);
      
    const x1 = d3.scaleBand()
      .domain(genders)
      .range([0, x0.bandwidth()])
      .padding(0.05);
      
    const y = d3.scaleLinear()
      .domain([0, d3.max(avgData, d => d.avg) * 1.1])
      .range([height, 0]);
      
    const color = d3.scaleOrdinal()
      .domain(genders)
      .range(["#FF69B4", "#1E90FF"]);
    
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x0))
      .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-45)");
        
    svg.append("g")
      .call(d3.axisLeft(y));
      
    const ageGroupBars = svg.selectAll(".age-group")
      .data(avgData)
      .join("g")
        .attr("class", "age-group")
        .attr("transform", d => `translate(${x0(d.ageGroup)},0)`);
        
    ageGroupBars.append("rect")
      .attr("x", d => x1(d.gender))
      .attr("y", d => y(d.avg))
      .attr("width", x1.bandwidth())
      .attr("height", d => height - y(d.avg))
      .attr("fill", d => color(d.gender))
      .attr("opacity", 0.8)
      .on("mouseover", function(event, d) {
        d3.select(this).attr("opacity", 1);
        
        tooltip.transition()
          .duration(200)
          .style("opacity", 0.9);
        
        tooltip.html(`
          <strong>${d.gender}, ${d.ageGroup}</strong><br>
          Average FES Score: ${d.avg.toFixed(2)}<br>
          Number of subjects: ${d.count}
        `)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function() {
        d3.select(this).attr("opacity", 0.8);
        
        tooltip.transition()
          .duration(500)
          .style("opacity", 0);
      });
      
    ageGroupBars.append("text")
      .attr("class", "count-label")
      .attr("x", d => x1(d.gender) + x1.bandwidth() / 2)
      .attr("y", d => y(d.avg) - 5)
      .attr("text-anchor", "middle")
      .style("font-size", "10px")
      .text(d => `n=${d.count}`);
    
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", -30)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .text("Falls Risk by Gender and Age Group");
      
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height + 60)
      .attr("text-anchor", "middle")
      .text("Age Group");
      
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -40)
      .attr("x", -height / 2)
      .attr("text-anchor", "middle")
      .text("Average FES Score");
      
    const legend = svg.append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${width + 10}, 0)`);
      
    genders.forEach((gender, i) => {
      legend.append("rect")
        .attr("x", 0)
        .attr("y", i * 20)
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", color(gender));
        
      legend.append("text")
        .attr("x", 25)
        .attr("y", i * 20 + 12)
        .text(gender);
    });
  }
});
  