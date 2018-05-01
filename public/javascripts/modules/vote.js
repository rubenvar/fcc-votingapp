import axios from 'axios';
import loadChart from './loadChart';
import { $, $$ } from './bling';

function ajaxVote(e) {
    e.preventDefault();
    const canvas = $('#results-chart').getContext('2d');
    const labels = [], data = [];
    // get poll and option ids to store the vote
    const pollId = this.parentNode.dataset.pollid;
    // const chosenId = e.explicitOriginalTarget.value; doesn't work in Chrome
    const chosenId = chosenIdFromButton;
    // start the POST action
    axios
        .post(this.action, { chosenId, pollId })
        .then(res => {
            // change the value in total
            $('.total-votes').textContent = res.data.total;
            // hide the voting buttons
            this.parentNode.classList.add('hide-vote');
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