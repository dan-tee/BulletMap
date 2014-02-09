$(document).on('pagebeforeshow', '#bullet-source', function( ){

    //TODO: refresh data on page for other than the first load

    var found_data = $('#bullet-source').data("form");
    console.log("search_data: ",found_data);

    var url = "/bullet/" + found_data.headstamp;

    var template = $("#bullet-source").html();
    $.getJSON(url)
        .always(function(json, textStatus) {

            var bullet_data;
            if (json.hasOwnProperty("_id")){
                bullet_data = json;
            } else {
                bullet_data = {};
                ["headstamp", "weapon", "manufacturer", "countryOfOrigin"].forEach(function(attr){
                    bullet_data[attr] = "unkown";
                });
            }
            found_data.Origin = bullet_data.countryOfOrigin;

            //console.log("bullet_data: ", bullet_data);
            //console.log("found_data: ", found_data);

            var html = $.mustache(template,bullet_data);
            $("#bullet-source").html(html);
            $("#bullet-source").trigger('create');

            $.post("/found_shell", found_data);
        })

    ;
});

$("#submit-search").on("click", function(event,data){
    // Prevent the usual navigation behavior
    event.preventDefault();

    var url = '#bullet-source';

    // get form data
    var data = $("#bullet-search form :input").serializeObject();
    $(url).data("form",data);

    $.mobile.navigate(url);
});

$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};
