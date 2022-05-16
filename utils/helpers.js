module.exports = {
  list: (objArr, objKey) => {
    let genreArr;

    if (objKey=== "fiction"){
      genreArr = objArr.fiction
    }
    if (objKey=== "nonFiction"){
      genreArr = objArr.nonFiction
    }

    let out = "<ul class='list-group bg-gray rounded'>";
    for (let i = 0; i < genreArr.length; i++){
      out = out + 
      `<li class='list-group-item bg-gray'> 
        <div class='form-check'>
          <input class='form-check-input ml-5' type='checkbox' name='${genreArr[i]}' id='genreCheck'>
          <label class='form-check-label' for='genreCheck'>
          ${genreArr[i]} 
          </label>
        </div>
      </li>`
    };

    return out + "</ul>"
  },

  genres: (book_genres) => {
    let out = `<div class="card w-100">
    <h5 class="card-header">Favorite Genres</h5> 
    <div class="card-body">`


    for (let i = 0; i < book_genres.length; i++){
      console.log(book_genres[i]);
      out = out + `<span class="badge badge-pill badge-success bg-success m-1">${book_genres[i]}</span>`
    };

    return out + `</div>
              </div>`
  },

  format_date: date => {
    return `${new Date(date).getMonth() + 1}/${new Date(date).getDate()}/${new Date(date).getFullYear()}`;
  },

  format_plural: (word, amount) => {
    if (amount !== 1) {
        return `${word}s`;
    }

    return word;
 },
};