

var searchByTitle = function(event) {
    event.preventDefault();
    const search = document.querySelector('input[id="searchBar"]').value;
    const query = search.split(" ").join("+");
    if (query) {
        fetch('/api/search', {
            method: 'POST',
            body: JSON.stringify({
                query
            }),
            headers: { 'Content-Type': 'application/json' }
            })
            .then( response => {
            console.log(response);
            if (response.ok) {
                document.location.replace('/search-page');
            } else {
                alert(response.statusText);
            };
        });
    };
}

document.querySelector('#search-btn').addEventListener('click', searchByTitle);