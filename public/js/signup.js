//(PLACEHOLDER) function to gather form data and call our "POST /api/user" express route
const signupFormHandler = async function (event) {
  event.preventDefault();

  const username = document.querySelector('#username-signup').value.trim();
  const password = document.querySelector('#password-signup').value.trim();

  if (username && password) {
      const response = await fetch('/api/users', {
      method: 'post',
      body: JSON.stringify({
          username,
          password
      }),
      headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
      document.location.replace('/user-feed');
      } else {
      alert(response.statusText);
      }
  }
}

document.querySelector('.signup-form').addEventListener('submit', signupFormHandler);
