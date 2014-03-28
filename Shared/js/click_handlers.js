(function(){

    // executes when this script loads
    function main(){

        // This binds to all object with the right id, even if they are constructed later.
        // see http://stackoverflow.com/questions/16375975/jquery-click-event-not-firing-in-jquerymobile
        $(document).on('click', '#home-carat-a', function(){
            $('body').animate({
                scrollTop: $('#text-anchor').offset().top
            });
        });

        $(document).on('click', '#btn-search', function(){
            var headstamp = $('#headstamp-search').val();
            var url = server + '/bullet/' + headstamp;
            $.mobile.loading('show');
            $.getJSON(url).done(renderBulletInfo)
                          .fail(onError);
        });

        $(document).on('click', '#btn-post', function(event){
            // prevent the usual form blanking behaviour
            event.preventDefault();
            postFindingAndGotoMap();
        });

        $(document).on('click', '#btn-filter', function(){
            $('#filter-popup').popup('open');
        });
    }

    // We have to reload the page after the filled in Moustache template is added.
    // This is because jQM processes the raw html and adds its own enhanced version to the actual DOM.
    // See http://demos.jquerymobile.com/1.1.1/docs/pages/page-dynamic.html
    function renderBulletInfo(json) {
        $('#headstamp-search').removeClass('error');
        var template = $('#search-result-template').html();
        var bulletSourceContent = $.mustache(template, json);
        var resultDiv = $('#search-result');
        resultDiv.html(bulletSourceContent);
        resultDiv.trigger('create');
        $.mobile.loading('hide');

        //$.mobile.navigate('#page-search');
    }

    function onError(jqXHR, status, error){
        var message;
        // jqXHR.status differs from status
        if (jqXHR.status === 404){
            message = "Couldn't find headstamp in database. Please check if it is correct.";
            $('#headstamp-search').addClass('error');
        } else {
            message = getErrorMessage(jqXHR, error)
        }
        showError($('#page-search'), message);

        $.mobile.loading('hide');
    }

    function getErrorMessage(jqXHR, error){
        if (error === 'timeout') return "Couldn't get response in time. Maybe the server is unavailable.";
        if (jqXHR.responseText) return jqXHR.responseText;
        return error;
    }

    function showError(page, message){
        var errorDivs = page.find('.error-message');
        errorDivs.empty();
        errorDivs.append('<p>' + message + '</p>');
        errorDivs.popup('open');
    }

    function postFindingAndGotoMap(){

        var input = $('#page-post').find('form :input');
        var inputObject = inputToObject(input);

        if (!validateInput(inputObject)) return;

        $.mobile.loading('show');
        var jqxhr = $.post(server + '/found_shell', inputObject);
        jqxhr.done(function() {
            $.mobile.loading('hide');
            $.mobile.navigate('#page-map');
            // clear the page
            location.reload();
        });
        jqxhr.fail(function(jqXHR, status, error) {
            $.mobile.loading('hide');
            var message = getErrorMessage(jqXHR, error);
            showError($('#page-post'), message);
        });
    }

    function inputToObject(input)
    {
        var result = {};
        var inputArray = input.serializeArray();

        $.each(inputArray, function(index, item) {
            result[item.name] = item.value || '';
        });

        return result;
    }

    function validateInput(input){
        if (input.headstamp || input.photo){
            $('#headstamp-post').removeClass('error');
            $('#photo-file').removeClass('error');
            return true;
        }
        else{
            showError($('#page-post'), 'Please give either a headstamp or a photo.');
            $('#headstamp-post').addClass('error');
            $('#photo-file').addClass('error');
            return false;
        }
    }

    main();
}());


