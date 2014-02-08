$(document).on('pagebeforeshow', '#bullet-source', function( ){
    var url= "test.json";
    var template = $("#bullet-source").html();
    $.getJSON(url, function(json){
        var html = $.mustache(template,json);
       $("#bullet-source").html(html);
    });
});
