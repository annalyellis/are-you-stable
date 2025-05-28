// document.addEventListener("DOMContentLoaded", () => {
//   const tooltip = d3.select("body")
//     .append("div")
//     .attr("class", "tooltip")
//     .style("opacity", 0);

//   d3.csv("../BDSinfo.csv").then(data => {
//     const cleanData = data.filter(d => {
//       const age = parseFloat(d.Age);
//       const fesT = parseFloat(d.FES_T);
//       return !isNaN(age) && !isNaN(fesT);
//     });
    
//     renderAgeDistribution(cleanData, tooltip);
//   }).catch(error => {
//     console.error("Error loading data:", error);
//   });

//   function renderAgeDistribution(data, tooltip) {
//     const margin = {top: 50, right: 30, bottom: 50, left: 60};
//     const width = 900 - margin.left - margin.right;
//     const height = 400 - margin.top - margin.bottom;

//     const svg = d3.select("#viz")
//       .append("svg")
//         .attr("width", "100%")
//         .attr("height", "100%")
//         .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
//         .attr("preserveAspectRatio", "xMidYMid meet")
//       .append("g")
//         .attr("transform", `translate(${margin.left},${margin.top})`);

//     const ageGroups = [...new Set(data.map(d => d.AgeGroup))].sort();
    
//     const avgFesPerAge = ageGroups.map(group => {
//       const groupData = data.filter(d => d.AgeGroup === group);
//       return {
//         ageGroup: group,
//         avgFes: d3.mean(groupData, d => +d.FES_T),
//         count: groupData.length
//       };
//     });
    
//     const x = d3.scaleBand()
//       .domain(ageGroups)
//       .range([0, width])
//       .padding(0.2);
    
//     svg.append("g")
//       .attr("transform", `translate(0,${height})`)
//       .call(d3.axisBottom(x))
//       .selectAll("text")
//         .attr("transform", "translate(-10,0)rotate(-45)")
//         .style("text-anchor", "end");
        
//     const maxFes = d3.max(avgFesPerAge, d => d.avgFes);
//     const y = d3.scaleLinear()
//       .domain([0, maxFes * 1.1])
//       .range([height, 0]);
      
//     svg.append("g")
//       .call(d3.axisLeft(y));
      
//     svg.selectAll("rect")
//       .data(avgFesPerAge)
//       .join("rect")
//         .attr("x", d => x(d.ageGroup))
//         .attr("y", d => y(d.avgFes))
//         .attr("width", x.bandwidth())
//         .attr("height", d => height - y(d.avgFes))
//         .attr("fill", "#4e79a7")
//         .attr("opacity", 0.8)
//         .on("mouseover", function(event, d) {
//           d3.select(this).attr("opacity", 1);
          
//           tooltip.transition()
//             .duration(200)
//             .style("opacity", 0.9);
          
//           tooltip.html(`
//             <strong>${d.ageGroup}</strong><br>
//             Average FES Score: ${d.avgFes.toFixed(2)}<br>
//             Number of subjects: ${d.count}
//           `)
//             .style("left", (event.pageX + 10) + "px")
//             .style("top", (event.pageY - 28) + "px");
//         })
//         .on("mouseout", function() {
//           d3.select(this).attr("opacity", 0.8);
          
//           tooltip.transition()
//             .duration(500)
//             .style("opacity", 0);
//         });
        
//     svg.selectAll(".text")
//       .data(avgFesPerAge)
//       .join("text")
//         .attr("class", "label")
//         .attr("x", d => x(d.ageGroup) + x.bandwidth()/2)
//         .attr("y", d => y(d.avgFes) - 10)
//         .attr("text-anchor", "middle")
//         .text(d => `n=${d.count}`);
        
//     svg.append("text")
//       .attr("x", width / 2)
//       .attr("y", -20)
//       .attr("text-anchor", "middle")
//       .style("font-size", "16px")
//       .style("font-weight", "bold")
//       .text("Average Falls Risk (FES Total) by Age Group");
      
//     svg.append("text")
//       .attr("x", width/2)
//       .attr("y", height + margin.bottom - 5)
//       .attr("text-anchor", "middle")
//       .text("Age Group");
      
//     svg.append("text")
//       .attr("transform", "rotate(-90)")
//       .attr("y", -margin.left + 15)
//       .attr("x", -height/2)
//       .attr("text-anchor", "middle")
//       .text("Average FES Total Score");
//   }
// });

