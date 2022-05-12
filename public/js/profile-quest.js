const finishSetUpBtn = document.querySelector("#finishSetUp");

function collectChecks(event){
  event.preventDefault();
  const genreArr = document.querySelectorAll('.form-check-input:checked')
  const checkedArr = Array.from(genreArr).map(element => element.name);
  console.log(checkedArr);
}

finishSetUpBtn.addEventListener("click", collectChecks);