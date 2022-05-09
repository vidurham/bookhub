async function newFormHandler(event) {
    event.preventDefault();

    const first_name = document.querySelector('input[name="first_name"]').value;
    const last_name = document.querySelector('input[name="last_name"]').value;

    const response = await fetch('/api/users/:id', {
        method: 'GET',
        body: JSON.stringify({
            first_name,
            last_name
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        document.location.replace('/dashboard');
    } else {
        alert(response.statusText);
    }
}

document.querySelector('.new-post-form').addEventListener('submit', newFormHandler);