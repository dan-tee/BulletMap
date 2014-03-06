(function(){

    // executes on script load
    function main(){

        // This binds to all object with the right id, even if they are constructed later.
        // see http://stackoverflow.com/questions/16375975/jquery-click-event-not-firing-in-jquerymobile
        $(document).on('click', '#home-carat-a', function(){
            $('body').animate({
                scrollTop: $('#text-anchor').offset().top
            });
        });

        $(document).on('click', '#btn-search', function(){
            var headstamp = $("#headstamp-search").val();
            var url = server + "/bullet/" + headstamp;
            $.mobile.loading('show');
            $.getJSON(url).done(renderBulletInfo)
                          .fail(onError);
        });

        $(document).on('click', '#btn-post', function(event){
            // prevent the usual form blanking behaviour
            event.preventDefault();
            postFindingAndGotoMap();
        });
    }

    // We have to reload the page after the filled in Moustache template is added.
    // This is because jQM processes the raw html and adds its own enhanced version to the actual DOM.
    // See http://demos.jquerymobile.com/1.1.1/docs/pages/page-dynamic.html
    function renderBulletInfo(json) {
        var bullet_data = bulletDataOrUnknowns(json);
        var template = $("#search-result-template").html();
        var bulletSourceContent = $.mustache(template, bullet_data);
        var resultDiv = $("#search-result");
        resultDiv.html(bulletSourceContent);
        resultDiv.trigger('create');
        $.mobile.loading('hide');

        //$.mobile.navigate('#page-search');
    }

    function onError(jqXHR, status, error){
        if (jqXHR.status === 404){
            message = "Couldn't find headstamp in database. Please check if it is correct.";
            $("#headstamp").addClass("error");
        }
        else if (error) message = status + ", " + error;
        else message = "Couldn't get bullet information from server. Maybe the server is unavailable.";

        showError(message);

        $.mobile.loading('hide');
    }

    function showError(message){
        var errorDiv = $(".error-message");
        errorDiv.empty();
        errorDiv.append("<p>" + message + "</p>");
        errorDiv.popup("open");
    }

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

    function validateInput(input){
        if (input.headstamp || input.photo){
            $("#headstamp-post").removeClass("error");
            $("#photo-file").removeClass("error");
            return true;
        }
        else{
            showError("Please give either a headstamp or a photo.");
            $("#headstamp-post").addClass("error");
            $("#photo-file").addClass("error");
            return false;
        }
    }

    function postFindingAndGotoMap(){
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

    main();
}());


