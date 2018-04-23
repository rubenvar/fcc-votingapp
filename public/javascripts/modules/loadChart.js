import Chart from 'chart.js';

function loadChart(canvas, labels, data) {
    const myChart = new Chart(canvas, {
        type: 'pie',
        data: {
            labels,
            datasets: [{
                label: '# of Votes',
                data,
                backgroundColor: ['#f00', '#f0f', '#0f0', '#00f'],
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