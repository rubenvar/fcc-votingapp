import { Chart } from 'chart.js';

function loadChart(canvas, labels, data) {
    const myChart = new Chart(canvas, {
        type: 'pie',
        data: {
            labels,
            datasets: [{
                label: '# of Votes',
                data,
                backgroundColor: ['#c77cd2', '#7cd2d2', '#7cd289', '#d2947c', '#d0d27c', '#7c7dd2'],
                borderColor: ['#fff'],
                borderWidth: 1
            }]
        },
        options: {
            legend: {
                display: true,
                position: 'right'
            }
        }
    });
}

export default loadChart;