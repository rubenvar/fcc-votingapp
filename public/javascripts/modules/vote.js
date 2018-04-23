import axios from 'axios';
// import Chart from 'chart.js';
import loadChart from './loadChart';
import { $, $$ } from './bling';

function ajaxVote(e) {
    e.preventDefault();
    const canvas = $('#results-chart').getContext('2d');
    const labels = [], data = [];
    // check if the logged-in user already voted
    // :( server side
    // get poll and option ids to store the vote
    const pollId = this.parentNode.dataset.pollid;
    const chosenId = e.explicitOriginalTarget.value;
    // start the POST action
    axios
        .post(this.action, { chosenId, pollId })
        .then(res => {
            console.log(res.data);
            // change the value in total
            $('.total-votes').textContent = res.data.total;
            // get the values for the chart
            res.data.options.forEach(opt => {
                labels.push(opt.option);
                data.push(opt.votes);
            });
            // display the chart
            loadChart(canvas, labels, data);
        })
        .catch(console.error);
}

export default ajaxVote;