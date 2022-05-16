
var searchByTitle = function() {
    const search = document.querySelector('input[id="searchBar"]').value;
    const query = search.split(" ").join("+");
    console.log(query)
    document.location.replace("/search-page")
}

document.querySelector('#search-btn').addEventListener('click', searchByTitle);