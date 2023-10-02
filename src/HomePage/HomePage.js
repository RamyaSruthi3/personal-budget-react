import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import Chart from 'chart.js/auto';
import axios from 'axios';

function HomePage() {
  const chartRef = React.useRef(null);
  const [chartInstance, setChartInstance] = useState(null);
  const [hasExecuted, setHasExecuted] = useState(false);
  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    width: 300,
    height: 300
  };

  const [data, setData] = useState({
    datasets: [
      {
        data: [],
        backgroundColor: [
          'Yellow',
          'LightBlue',
          '#EE82EE',
          'LightSalmon',
          'PaleTurquoise',
          'HotPink',
          'LightGreen',
        ],
      },
    ],
    labels: [],
  });

  // First useEffect to handle fetching data
  useEffect(() => {
    if (!hasExecuted) {
      axios.get('http://localhost:4200/budget')
      .then((response) => {
        console.log("Server response:", response.data);
    
        if (response.data && response.data.myBudget && Array.isArray(response.data.myBudget)) {
          const newLabels = [];
          const newData = [];

          for (var i = 0; i < response.data.myBudget.length; i++) {
            newLabels.push(response.data.myBudget[i].title);
            newData.push(response.data.myBudget[i].budget);
          }

          setData({
            datasets: [
              {
                data: newData,
                backgroundColor: data.datasets[0].backgroundColor,
              },
            ],
            labels: newLabels,
          });

          createD3Chart(newLabels, newData, data.datasets[0].backgroundColor);
        } else {
          // To handle the case when the data is not in the expected format
        }
      })
      .catch((error) => {
        console.error(error);
      });
      setHasExecuted(true);
    }
  }, [hasExecuted]);

  // Second useEffect to handle chart creation
  useEffect(() => {
    if (data.labels.length && data.datasets[0].data.length) {
      if (chartInstance) {
        chartInstance.destroy();
      }

      const newChartInstance = new Chart(chartRef.current, {
        type: 'pie',
        data: data,
        options: pieChartOptions,
      });

      setChartInstance(newChartInstance);
    }
  }, [data]);
  
  function createD3Chart(labels, data, colors) {
    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2;
    
    d3.select('.d3js-chart').selectAll("svg").remove();
  
    const svg = d3.select('.d3js-chart')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);
  
  
    const color = d3.scaleOrdinal()
    .domain(labels)
    .range(colors);
  
    const pie = d3.pie()
      .value(d => d);
  
    const path = d3.arc()
      .outerRadius(radius - 10)
      .innerRadius(radius - 70);
  
    const arc = svg.selectAll('.arc')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'arc');
  
    arc.append('path')
      .attr('d', path)
      .attr('fill', (d, i) => color(labels[i]));
  
      arc.append('text')
      .attr('transform', d => {
          const [x, y] = path.centroid(d);
          return `translate(${x},${y})`;
      })
      .attr('dy', '.35em')
      .text((d, i) => labels[i]);
  
  }

  return (
    <main className="container center">
    <section className="page-area">
      
      <div className="text-box">
        <h2>Stay on track</h2>       
        <p>
          Do you know where you are spending your money? If you really stop to
          track it down, you would get surprised! Proper budget management
          depends on real data... and this app will help you with that!
        </p>
      </div>
      <div className="text-box">
        <h2>Alerts</h2>      
        <p>
          What if your clothing budget ended? You will get an alert. The goal
          is to never go over the budget.
        </p>
      </div>
      <div className="text-box">
        <h2>Results</h2>
        <p>
          People who stick to a financial plan, budgeting every expense, get
          out of debt faster! Also, they to live happier lives... since they
          expend without guilt or fear... because they know it is all good and
          accounted for.
        </p>
      </div>
      <div className="text-box">
        <h2>Free</h2>
          <p>
            This app is free!!! And you are the only one holding your data!
          </p>
        </div>
        <div className="text-box">
            <h1>Chart</h1>
            <p>
              <canvas ref={chartRef}></canvas>
            </p>
        </div>
          <div className="charts">
            <h1>D3JSChart</h1>
            <div className="d3js-chart"></div>
          </div>
    </section>
  </main>
  );
}

export default HomePage;