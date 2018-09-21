//GiphyAPI Query
function giphy (searchString, page) {
    let queryURL = "https://api.giphy.com/v1/gifs/search?api_key=not61tTmcb9Tq8XHIjAzFEpeQM4sMd9t&q=" + searchString + "&offset=" + page  + "&lang=en";
    $.ajax({
        url:queryURL,
        method: 'GET',
    }).done(function(results){
        console.log(results.data);
        let arr = results.data
        console.log(arr[0].images.original_still.url)

        for (let i = 0; i < 11; i++) {
            title = arr[i].title.split(" GIF")
                $('#content').append(` 
                <div class="card col-md-4">               
                    <img class="giphyimg" data-image="${arr[i].images.fixed_height_still.url}" data-gif="${arr[i].images.fixed_height.url}" src = "${arr[i].images.fixed_height_still.url}" alt="Card Image">
                    <br>
                    <div class="row card-body">
                        <div class="tags col-sm-10">
                        <p class="card-text title">Title: ${title[0].charAt(0).toUpperCase() + title[0].slice(1)}
                        </p>

                    <p class="card-text rating">Rating: ${arr[i].rating.toUpperCase()}</p>
                    </div>
                    <div class="col-sm-1 addFav">
                    <button type="button" data-toggle="tooltip"
                    title="Add to favorite" class="btn btn-secondary btn-sm">+</button>
                    </div>
                </div>
                `

        )}
        $('[data-toggle="tooltip"]').tooltip({
            trigger: 'hover'
        })
        
    }).fail(function(err) {
        throw err;
    });
}


let page = 0;
let searchString;
let favArr = [];

function pullAPIParameters(){
    console.log('pulling parameters')

    q = $('#searchTerm').val()
}


$(function() {
    $('#viewMore').hide()
    $('[data-toggle="tooltip"]').tooltip()

    
    //Search and add

    $('#searchAdd').on('click', function(){

    
        // get form data
        event.preventDefault();
        let searchVal = $.trim($('#search').val())
        if (searchVal !== "") {
            $('#btn').append(`
            <div class="gif col-sm-2 btn btn-outline-light mr-1 mt-1">
            <div class="row align-items-center">
            <div class="searchvalue col-8">${searchVal}</div>
            <div class="col-2 closebtn">&times;
            </div>
            </div>
            `)
            $('#search').val("")
            btnClick();
            closeBtn();
            
        }
        console.log('running search API')
        searchAPI()
    })

    //Button Click Function
    function btnClick() {
        $(document).on('click','.searchvalue', function(){
            $('#viewMore').show()
            $('#content').empty()
            searchString = $(this).text();
            page = 0;
            giphy(searchString, page)
        })
    }
    btnClick();
})
    //Close Button
    function closeBtn(){
        $('.closebtn').on('click', function(){
            $(this).parentsUntil($('#btn')).remove()
        })
    
    closeBtn()
}
    //View More Gifs Function
    $(document).on('click', '#viewMore', function(){
        page += 10;
        giphy(searchString, page)
    })

    //Adding Favorites Function
    $(document).on('click', '.addFav', function(){
        $(this).children().tooltip('dispose');
        $(this).html(`<i class="material-icons">done</i>`)
        let favObj = {
            imageLink: $(this).parent().siblings().attr('data-image'),
            gifLink: $(this).parent().siblings().attr('data-gif'),
            title: $(this).parent().children('.tags').children('.title').text(),
            rating: $(this).parent().children('.tags').children('.rating').text()
        }
        if(favArr.map(function(gif){
            return gif.imageLink
        }).indexOf(favObj.imageLink) == -1) {
            favArr.push(favObj)
        }
        localStorage.setItem("favArr", JSON.stringify(favArr));
    })

    //Toggling GIF and Still Image
    $(document).on('click', '.giphyimg', function(){
        let _gif = $(this).attr("data-gif")
        let _still = $(this).attr("data-image")
        if ($(this).attr("src") == _still ){
            $(this).attr("src", _gif)
        } else if ($(this).attr("src") == _gif){
            $(this).attr("src", _still)
        }
    })

    //Viewing Favorite GIFS
    $(document).on('click', '#fav', viewFav);function viewFav(){
        $('#content').empty();
        favArr = JSON.parse(localStorage.getItem('favArr'));
        favArr.forEach(gif => {
            $('#content').append(`
            <div id="gif" class="card col-sm-6 col-md-4 col-lg-3 mt-2">
                <img class="giphyimg card-img-top" data-image="${gif.imageLink}" data-gif="${gif.gifLink}" src="${gif.imageLink}" alt="Card image">
                <div class="row card-body">
                    <div class="tags col-sm-10">
                    <p class="card-text title">${gif.title}</p>
                    <p class="card-text rating">${gif.rating}</p>
                    </div>
                    <div class="col-sm-1 rmvFav">
                    <button type="button" data-toggle="tooltip"
                    title="Remove from favorites"
                    class="btn btn-secondary btn-sm">&times;</button>
                    </div>
                </div>
            </div>
            `)
        });
        $('#viewMore').hide()
        $('[data-toggle="tooltip"]').tooltip()
    }

    //Removing from favorites
    $(document).on('click', '.rmvFav', function(){
        $(this).children().tooltip('dispose')
        let imageLink = $(this).parent().siblings().attr('data-image')
        let rmvIndex = (favArr.map(function(gif){
            return gif.imageLink
        }).indexOf(imageLink))
        favArr.splice(rmvIndex, 1)
        localStorage.setItem('favArr', JSON.stringify(favArr));
        viewFav()
    })

    $(document).on("click", "#clear", function(){
        // clear form data and results
        $('#searchTerm').val('')
        $('#content').empty()
    })

