const res = require("express/lib/response");

//(PLACEHOLDER) function to gather form data and call our "POST /api/user" express route
const signupFormHandler = async function (event) {
  event.preventDefault();

  const first_name = document.querySelector('#firstname-signup').value.trim();
  const last_name = document.querySelector('#lastname-signup').value.trim();
  const email = document.querySelector('#email-signup').value.trim();
  const password = document.querySelector('#password-signup').value.trim();

  if (first_name && last_name && email && password) {
    const response = await fetch('/api/users', {
    method: 'POST',
    body: JSON.stringify({
        first_name,
        last_name,
        email,
        password
    }),
    headers: { 'Content-Type': 'application/json' }
    })
    .then( response => {
      if (response.ok) {
        document.location.replace('/profile-quest');
      } else {
        alert(response.statusText);
      };
    });
  };
};

document.querySelector('.signup-form').addEventListener('submit', signupFormHandler);
