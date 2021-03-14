$(init);

function init() {
	$('#embedBuilder').css({ 'borderLeftColor': '#7289DA', 'borderLeftWidth': '4px' });
}

$('#embedColorInput').on('input', function() {
	$(init);

	function init() {
		$('#embedBuilder').css({ 'borderLeftColor': $('#embedColorInput').val() });
	}
});