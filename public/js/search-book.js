var searchByTitle = function(event) {
    event.preventDefault();
    const search = document.querySelector('input[id="searchBar"]').value;
    const query = search.split(" ").join("+");
    if (query) {
      document.location.replace(`/search-page?q=${query}`);
    };
}

document.querySelector('#search-btn').addEventListener('click', searchByTitle);