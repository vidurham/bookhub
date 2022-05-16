const { response } = require("express");

const finishSetUpBtn = document.querySelector("#finishSetUp");

function collectChecks(event){
  event.preventDefault();
  const genreArr = document.querySelectorAll('.form-check-input:checked')
  const checkedArr = Array.from(genreArr).map(element => element.name);

  if (checkedArr.length > 0) {
    fetch('/api/users/profile-quest', {
    method: 'PUT',
    body: JSON.stringify({
        checkedArr
    }),
    headers: { 'Content-Type': 'application/json' }
    }).then( response => {
      if (response.ok) {
        document.location.replace('/user-profile');
      } else {
        alert(response.statusText);
      }
    })
  } else {
    //document.location.replace('/user-profile');
  }
}

finishSetUpBtn.addEventListener("click", collectChecks);