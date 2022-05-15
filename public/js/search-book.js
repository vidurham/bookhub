var searchResultsEl = document.querySelector("#search-result")

const url = "http://openlibrary.org/search.json?title=the+lord+of+the+rings"

var searchByTitle = function() {
    fetch(url)
        .then(response => response.json().then(data => {
            document.location.replace('/search-page')
            console.log(data.docs)
            for (var i = 0; i < 20; i++) {
                const bookCover = data.docs[i].cover_i
                const bookTitle = data.docs[i].title
                const bookAuthor = data.docs[i].author
                const book = document.createElement("img");
                book.src = "https://covers.openlibrary.org/b/id/240727-M.jpg"
                books.append(book)
            }
        }))
}

document.querySelector('#search-btn').addEventListener('click', searchByTitle);