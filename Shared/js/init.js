// Without JavaScript only a message is shown, but all content is hidden.
// Here we use JavaScript to show the content.
$('[date-role="page"]').css({display: 'block'});

$.ajaxSetup({
    timeout: 5000 // milliseconds
});

var server = 'http://localhost:3000';
//var server = "http://bulletmap.org";