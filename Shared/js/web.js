(function(){
    // use JavaScript to unhide content.
    $('[date-role="page"]').css({display: 'block'});

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
        $.post(server + "/found_shell", found_data);
    }

    function showError(jqXHR, status, error){
        // delay popup until page is layed out for proper positioning.
        $(document).on('pageshow', '#bullet-source', function(){
            if (error) errorMessage = status + ", " + error;
            else errorMessage = "Couldn't get bullet information from server";

            var errorDiv = $("#error-message");
            errorDiv.empty();
            errorDiv.append("<p>" + errorMessage + "</p>");
            errorDiv.popup("open");
        });
    }

    $(document).on('pagebeforeshow', '#bullet-source', function( ){
        function onBulletInfo(json){
            processBulletInfo(json, found_data);
        }

        //TODO: refresh data on page for other than the first load
        var found_data = $('#bullet-source').data("form");
        var url = server + "/bullet/" + found_data.headstamp;
        $.getJSON(url).done(onBulletInfo)
                      .fail(showError);
    });

    function inputToObject(input)
    {
        var result = {};
        var inputArray = input.serializeArray();

        $.each(inputArray, function() {
            result[this.name] = this.value || '';
        });

        return result;
    }

    function storeInput(url) {
        var input = $("#bullet-search").find("form :input");
        var dataObject = inputToObject(input);
        $(url).data("form", dataObject);
    }

    $("#submit-search").on("click", function(event){
        // Prevent the usual navigation behavior
        event.preventDefault();
        var url = '#bullet-source';
        storeInput(url);
        $.mobile.navigate(url);
    });
}());


