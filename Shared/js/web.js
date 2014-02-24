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

    // We have to build the page from the Moustache template before jQuery mobile's page change event.
    // This is because jQM processes the raw html and shows its own enhanced version. So we pause
    // the page change until we have the JSON.
    // See http://demos.jquerymobile.com/1.1.1/docs/pages/page-dynamic.html
    function renderBulletInfo(bullet_data) {
        var template = $("#bullet-source-template").html();
        var bulletSourceContent = $.mustache(template, bullet_data);
        var bulletSourcePage = $("#bullet-source");
        bulletSourcePage.html(bulletSourceContent);
        bulletSourcePage.trigger('create');
        $.mobile.loading('hide');
        $.mobile.navigate('#bullet-source');
    }

    function processBulletInfo(json, found_data) {
        var bullet_data = bulletDataOrUnknowns(json);
        renderBulletInfo(bullet_data);
        found_data.Origin = bullet_data.countryOfOrigin;
        $.post(server + "/found_shell", found_data);
    }

    function showError(jqXHR, status, error){
        $.mobile.loading('hide');
        if (error) errorMessage = status + ", " + error;
        else errorMessage = "Couldn't get bullet information from server. Maybe the server is unavailable.";

        var errorDiv = $("#error-message");
        errorDiv.empty();
        errorDiv.append("<p>" + errorMessage + "</p>");
        errorDiv.popup("open");
    }

    function getAndRenderBulletInfo(){
        function onBulletInfo(json){
            processBulletInfo(json, inputObject);
        }

        var input = $("#bullet-search").find("form :input");
        var inputObject = inputToObject(input);

        var url = server + "/bullet/" + inputObject.headstamp;
        $.getJSON(url).done(onBulletInfo)
                      .fail(showError);
    }

    function inputToObject(input)
    {
        var result = {};
        var inputArray = input.serializeArray();

        $.each(inputArray, function() {
            result[this.name] = this.value || '';
        });

        return result;
    }

    $("#submit-search").on("click", function(event){
        // prevent the usual form blanking behaviour
        event.preventDefault();
        $.mobile.loading('show');
        getAndRenderBulletInfo();
    });
}());


