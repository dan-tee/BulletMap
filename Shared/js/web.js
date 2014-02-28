(function(){
    // Without JavaScript only a message is shown, but all content is hidden.
    // Here we use JavaScript to show the content.
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
    // This is because jQM processes the raw html and adds its own enhanced version to the actual DOM.
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
        $.data(document.body, "found_data", found_data);
    }

    function onError(jqXHR, status, error){
        if (jqXHR.status === 404){
            message = "Couldn't find headstamp in database. Please check if it is correct.";
            $("#serial-number").addClass("error");
        }
        else if (error) message = status + ", " + error;
        else message = "Couldn't get bullet information from server. Maybe the server is unavailable.";

        showError(message);

        $.mobile.loading('hide');
    }

    function showError(message){
        var errorDiv = $("#error-message");
        errorDiv.empty();
        errorDiv.append("<p>" + message + "</p>");
        errorDiv.popup("open");
    }

    function validateInput(input){
        if (input.headstamp || input.photo){
            $("#serial-number").removeClass("error");
            $("#photo-file").removeClass("error");
            return true;
        }

        showError("Please give either a headstamp or a photo.");
        $("#serial-number").addClass("error");
        $("#photo-file").addClass("error");
        return false;
    }

    function getAndRenderBulletInfo(){
        function onBulletInfo(json){
            processBulletInfo(json, inputObject);
        }

        var input = $("#bullet-search").find("form :input");
        var inputObject = inputToObject(input);

        if (!validateInput(inputObject)) return;

        var url = server + "/bullet/" + inputObject.headstamp;
        $.mobile.loading('show');
        $.getJSON(url).done(onBulletInfo)
                      .fail(onError);
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

    // Wait with event bindings until page is shown, so that the button exists in the DOM.
    // see http://stackoverflow.com/questions/16375975/jquery-click-event-not-firing-in-jquerymobile
    $("#bullet-search").on("pagebeforeshow", function(){
        $("#submit-search").on("click", function(event){
            // prevent the usual form blanking behaviour
            event.preventDefault();
            getAndRenderBulletInfo();
        });
    });

    $("#bullet-source").on("pagebeforeshow", function(){
        $("#upload").on("click", function(){
            var found_data = $.data(document.body, "found_data");
            if (found_data){
                $.post(server + "/found_shell", found_data);
                $.mobile.navigate('#bullet-search');
            }
        });
    });
}());


