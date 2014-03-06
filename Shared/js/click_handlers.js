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

    // We have to build the page from the Moustache template before jQuery mobile's page change event.
    // This is because jQM processes the raw html and adds its own enhanced version to the actual DOM.
    // See http://demos.jquerymobile.com/1.1.1/docs/pages/page-dynamic.html
    function renderBulletInfo(bullet_data) {
        var template = $("#page-search-template").html();
        var bulletSourceContent = $.mustache(template, bullet_data);
        var bulletSourcePage = $("#page-search");
        bulletSourcePage.html(bulletSourceContent);
        bulletSourcePage.trigger('create');
        $.mobile.loading('hide');
        $.mobile.navigate('#page-search');
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

        var input = $('#page-post').find('form :input');
        var inputObject = inputToObject(input);

        if (!validateInput(inputObject)) return;

        $.post(server + '/found_shell', inputObject);

        $.mobile.navigate('#page-map');
        // clear the page
        location.reload();
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

    // This binds to all object with the right id, even if they are constructed later.
    // see http://stackoverflow.com/questions/16375975/jquery-click-event-not-firing-in-jquerymobile
    $(document).on('click', '#btn-post', function(event){
        // prevent the usual form blanking behaviour
        event.preventDefault();
        getAndRenderBulletInfo();
    });

    $(document).on('click', '#btn-search', function(){
        var url = server + "/bullet/" + inputObject.headstamp;
        $.mobile.loading('show');
        $.getJSON(url).done(onBulletInfo)
                      .fail(onError);

        var found_data = $.data(document.body, "found_data");
        if (found_data){

        }
    });

    $(document).on('click', '#home-carat-a', function(){
        $('html, body').animate({
            scrollTop: $('#text-anchor').offset().top
        });
    })
}());


