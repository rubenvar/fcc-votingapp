import axios from 'axios';
import { $ } from './bling';

function ajaxDelete(e) {
    // stop the action
    e.preventDefault();
    // get the poll id to delete
    const pollIdToDelete = e.explicitOriginalTarget.value;
    // find the whole card so we can make it disappear
    const pollCardToDelete = $('#poll-id-' + pollIdToDelete);
    // vanish the card (transition)
    vanish(pollCardToDelete);
    // and actually delete the poll POSTing the form action
    axios
        .post(this.action, { pollIdToDelete })
        .then(res => {
            console.log('poll deleted forever ' + pollIdToDelete);
        })
        .catch(console.error);
}

function ajaxConfirmDelete(e) {
    e.preventDefault();
    this.parentNode.classList.add('hidden'); // hide the first delete form so we can ask for confirmation
    $('#poll-id-' + this.value).querySelector('.delete-main').classList.remove('hidden'); // show the confirmation ask
};

function ajaxCancelDelete(e) {
    e.preventDefault();
    this.parentNode.classList.add('hidden');
    $('#poll-id-' + this.value).querySelector('.delete-conf').classList.remove('hidden'); // show the confirmation ask
}

function vanish(elem) {
    elem.classList.add('hidden');
    setTimeout(() => {
        elem.classList.add('gone-forever');
    }, 800);
}

export { ajaxDelete, ajaxConfirmDelete, ajaxCancelDelete }