import axios from 'axios';

function addNewOptionInPoll() {
    let newFieldHTML = `<form method="POST" action="${window.location.href}/new" class="store-option-form"><label for="option">New Option:</label><input type="text" name="option" required /><input type="submit" value="Add Option" /></form>`;
    this.insertAdjacentHTML("beforeBegin", newFieldHTML);
    this.classList.add('hidden');
    // const casa = document.querySelector('.store-option-form');
    // casa.addEventListener('submit', storeNewOption);
}

// function storeNewOption(e) {
//     e.preventDefault();
//     const option = this.newOption.value;
//     axios
//         .post(this.action, { option })
//         .then(() => {
//             // TODO more resilient + work when adding more than one
//             this.classList.add('hidden');
//             console.log(this);
//             console.log(e)
//         })
//         .catch(console.error);
// }

export default addNewOptionInPoll;
