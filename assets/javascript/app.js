let url = "https://api.giphy.com/v1/gifs/search?"
let apikey = "lMViRVIDibY6gDVxFOAzgp6LdbutMPUb"
let num = ''

function buildURL(){
    let tempURL = url + `&api_key=${apikey}`
    if(q.length > 0){
        tempURL = tempURL + `&q=${q}`
    }
    console.log(`build url: ${tempURL}`)
    return tempURL
}

function searchAPI(){
    $('#content').empty()
    var url = ``
    pullAPIParameters()
    url = buildURL()

    $.ajax({
        url:url,
        method: 'GET',
    }).done(function(results){
        console.log(results.data);
        let arr = results.data

        for (i = 0; i < 11; i++) {
                $('#content').append(` 
                <div class="card col-md-4">               
                    <img src = ${arr[i].images.fixed_width.url}>
                    <br>
                    <h5>${arr[i].rating}</h5>
                </div>
                `
        )}
    }).fail(function(err) {
        throw err;
    });
}

function pullAPIParameters(){
    console.log('pulling parameters')

    q = $('#searchTerm').val()
}


$(document).ready(function() {

    $(document).on("click", "#search", function(){
        // get form data
        event.preventDefault();
        console.log('running search API')
        searchAPI()
    })

    $(document).on("click", "#clear", function(){
        // clear form data and results
        $('#searchTerm').val('')
        $('#content').empty()
    })
})