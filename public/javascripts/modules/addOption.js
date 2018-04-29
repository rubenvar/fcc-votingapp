function addFormOption(e) {
  // TODO could make i more resilient
  let i = ((this.parentNode.childElementCount - 1 ) / 2) + 1;
  let newFieldHTML = `<label for="options[${i-1}][option]">Option ${i}:</label><input id="options[${i-1}][option]" name="options[${i-1}][option]" required="required" type="text">`;
  this.insertAdjacentHTML("beforeBegin", newFieldHTML);
}

export default addFormOption;