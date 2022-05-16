const res = require("express/lib/response");

var searchByTitle = function() {
    const search = document.querySelector('input[id="searchBar"]').value;
    const query = search.split(" ").join("+");
    console.log(query)
    module.exports = query
}

document.querySelector('#search-btn').addEventListener('click', searchByTitle);