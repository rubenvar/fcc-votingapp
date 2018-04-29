function addNewOptionInPoll() {
    let newFieldHTML = `<form method="POST" action="${window.location.href}/new" class="store-option-form"><label for="newOption">New Option:</label><input type="text" name="newOption" id="newOption" required /><input class="sec" type="submit" value="➕ Add Option" /></form>`;
    this.insertAdjacentHTML("beforeBegin", newFieldHTML);
    this.classList.add('hidden');
}

export default addNewOptionInPoll;