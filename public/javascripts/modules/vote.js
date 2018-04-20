import axios from 'axios';
import { $, $$ } from './bling';

// FUNCIONA A MEDIAS, FALLA SI LA ID TIENE ESPACIOS O ES NUM O ALGO ASI, MIERDA!
function ajaxVote(e) {
    e.preventDefault();
    // check if the logged-in user already voted
    // :( server side
    // const userVotes = user
    // get poll and option ids to store the vote
    const pollId = this.parentNode.dataset.pollid;
    const chosenId = e.explicitOriginalTarget.value;
    // start the POST action
    axios
        .post(this.action, { chosenId, pollId })
        .then(res => {
            let result = res.data.options.filter(obj => {
                return obj._id === chosenId;
            });
            // console.log(result);
            // const isHearted = this.heart.classList.toggle('heart__button--hearted');
            $('.total-votes').textContent = res.data.total; // change the value in total
            // console.log($(`#${result[0].option}`))
            console.log(result)
            $(`#${result[0].option}`).children[1].innerHTML = result[0].votes; // change the value in the result option
            // and change the width of the result option
            const r = $('.results')
            r.querySelectorAll('.result').forEach(resl => {
                const votes = Number(resl.querySelector('.vote').innerHTML);
                const width = votes * 100 / res.data.total;
                resl.style.width = `${width}%`;
            });
            // res.data.options.forEach(option => {
            //     console.log($(`#${result[0].option}`).style.width)
            // });
            // if (isHearted) {
            //     this.heart.classList.add('heart__button--float');
            //     setTimeout(() => this.heart.classList.remove('heart__button--float'), 2500);
            // }
        })
        .catch(console.error);
}

export default ajaxVote;