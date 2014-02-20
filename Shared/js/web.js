(function(){
    function bulletDataOrUnknowns(json) {
        var bullet_data;

        if (json.hasOwnProperty("_id")) {
            bullet_data = json;
        } else {
            bullet_data = {};
            ["headstamp", "weapon", "manufacturer", "countryOfOrigin"].forEach(function (attr) {
                bullet_data[attr] = "unkown";
            });
        }
        return bullet_data;
    }

    function renderBulletInfo(bullet_data) {
        //console.log("bullet_data: ", bullet_data);
        //console.log("found_data: ", found_data);

        var bulletSourcePage = $("#bullet-source");
        var template = bulletSourcePage.html();
        var html = $.mustache(template, bullet_data);
        bulletSourcePage.html(html);
        bulletSourcePage.trigger('create');
    }

    function processBulletInfo(json, found_data) {
        var bullet_data = bulletDataOrUnknowns(json);
        renderBulletInfo(bullet_data);
        found_data.Origin = bullet_data.countryOfOrigin;
        $.post("/found_shell", found_data);
    }

    $(document).on('pagebeforeshow', '#bullet-source', function( ){
        function onBulletInfo(json, textStatus){
            processBulletInfo(json, found_data);
        }

        //TODO: refresh data on page for other than the first load
        var found_data = $('#bullet-source').data("form");
        var url = server+ "/bullet/" + found_data.headstamp;
        $.getJSON(url).always(onBulletInfo);
    });

    function inputToObject(input)
    {
        var result = {};
        var inputArray = input.serializeArray();

        $.each(inputArray, function() {
            result[this.name] = this.value || '';
        });

        return result;
    };

    function storeInput(url) {
        var input = $("#bullet-search").find("form :input");
        var dataObject = inputToObject(input);
        $(url).data("form", dataObject);
    }

    $("#submit-search").on("click", function(event,data){
        // Prevent the usual navigation behavior
        event.preventDefault();
        var url = '#bullet-source';
        storeInput(url);
        $.mobile.navigate(url);
    });
}());


