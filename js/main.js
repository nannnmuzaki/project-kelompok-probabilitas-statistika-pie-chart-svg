document.addEventListener("DOMContentLoaded", () => {
  let dataCount = 1;

  const form = document.getElementById("data-form");
  const inputWrapper = document.getElementById("input-wrapper");
  const addDataButton = document.getElementById("add-data");
  const resultContainer = document.querySelector(".result");
  const pieChart = document.getElementById("pie-chart");
  const legend = document.getElementById("legend");
  const downloadButton = document.getElementById("download-button");

  addDataButton.addEventListener("click", () => {
    dataCount++;
    const newInputContainer = document.createElement("div");
    newInputContainer.classList.add("input-container");
    newInputContainer.innerHTML = `
      <label for="label-${dataCount}"></label>
      <input type="text" id="label-${dataCount}" name="label-${dataCount}" placeholder="Label-${dataCount}" required>
      <label for="value-${dataCount}"></label>
      <input type="number" id="value-${dataCount}" name="value-${dataCount}" placeholder="Value-${dataCount}" required>
      <label for="color-${dataCount}"></label>
      <input type="color" id="color-${dataCount}" name="color-${dataCount}" required>
    `;
    inputWrapper.appendChild(newInputContainer);
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = [];
    for (let i = 1; i <= dataCount; i++) {
      const label = document.getElementById(`label-${i}`).value;
      const value = parseInt(document.getElementById(`value-${i}`).value);
      const color = document.getElementById(`color-${i}`).value;
      data.push({ label, value, color });
    }

    createPieChart(data);
  });

  function createPieChart(data) {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let startAngle = 0;

    pieChart.innerHTML = '';
    legend.innerHTML = '';

    data.forEach((item, index) => {
      if (data.length == 1) {
        // Special case for a single data point
        pathData = `
          M 16,16
          m -16,0
          a 16,16 0 1,0 32,0
          a 16,16 0 1,0 -32,0
        `;
      } else {
        const sliceAngle = (item.value / total) * 2 * Math.PI;
        const x1 = (16 + 16 * Math.cos(startAngle)).toFixed(2);
        const y1 = (16 + 16 * Math.sin(startAngle)).toFixed(2);
        const x2 = (16 + 16 * Math.cos(startAngle + sliceAngle)).toFixed(2);
        const y2 = (16 + 16 * Math.sin(startAngle + sliceAngle)).toFixed(2);
        const largeArcFlag = sliceAngle > Math.PI ? 1 : 0;

        pathData = `
          M 16,16
          L ${x1},${y1}
          A 16,16 0 ${largeArcFlag} 1 ${x2},${y2}
          Z
        `;
        
        startAngle += sliceAngle;
      }

      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", pathData);
      path.setAttribute("fill", item.color);
      path.setAttribute("stroke", "#fff");
      path.setAttribute("stroke-width", "0.5");

      pieChart.appendChild(path);

      const legendItem = document.createElement("li");
      legendItem.classList.add("legend-item");
      legendItem.innerHTML = `
        <div class="legend-color" style="background-color:${item.color}"></div>
        ${item.label} : ${(item.value/total*100).toFixed(1)}%
      `;
      legend.appendChild(legendItem);
    });

    resultContainer.style.display = 'flex';
  }

  downloadButton.addEventListener("click", () => {
    const svgData = new XMLSerializer().serializeToString(pieChart);
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const svgUrl = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = "pie_chart.svg";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  });
});