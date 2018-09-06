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
        console.log(results);
        let arr = results.data.data

        for (i = 0; i < num; i++) {
            if(i % 2 === 0) {
                $('#content').append(`                
                    <img src = ${arr[i].images.original.url}/><h5>${arr[i].rating}</h5>
                `)
            } else {
                $('#content').append(`                
                        <img src = ${arr[i].images.original.url}/><h5>${arr[i].rating}</h5>
                    </div>    
                `)
            }
            console.log(arr[i].data.data)
        }
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