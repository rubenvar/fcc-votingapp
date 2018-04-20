function addFormOption() {
    // TODO could make i more resilient
    let i = ((this.parentNode.childElementCount - 1 ) / 2) + 1;
    let newFieldHTML = `<label for="option${i}">Option ${i}</label><input name="options[${i-1}][option]" required="required" type="text">`;
    this.insertAdjacentHTML("beforeBegin", newFieldHTML);
}

export default addFormOption;