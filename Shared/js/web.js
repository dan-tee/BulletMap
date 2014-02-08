var db_url = "/bullet/";
//var db_url = "test/test.json";

$(document).on('pagebeforeshow', '#bullet-source', function( ){
    var params = $.url.parse(location);

    var url = db_url + params.params.headstamp;

    var template = $("#bullet-source").html();
    $.getJSON(url, function(json){
        var html = $.mustache(template,json);
       $("#bullet-source").html(html);
    });
});

$("#submit-search").on("click", function(event,data){
    // Prevent the usual navigation behavior
    event.preventDefault();

    // get form data
    var data = $("#bullet-search form :input").serialize();
    var url = "?"+data+"#bullet-source";
    $.mobile.navigate(url);
});
