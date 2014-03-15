+function($){
	_.templateSettings = {
		interpolate: /\{\{(.+?)\}\}/g
	};

	var map,
		tpl_lp_result = _.template($('#tpl-lp-result').html());

	$('#search').submit(function(e){
		do_search($(this).val());
		e.preventDefault();
	});

	function render_map() {
		map = L.map('map').setView([-43.5359033,172.6400246], 10);

		// add an OpenStreetMap tile layer
		L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(map);

		// add a marker in the given location, attach some popup content to it and open the popup
		// L.marker([51.5, -0.09]).addTo(map)
		// 	.bindPopup('A pretty CSS3 popup. <br> Easily customizable.')
		// 	.openPopup();

		return map;
	}

	function do_search(keyword, near) {
		$.getJSON('/javascripts/mock.js', function(results){
			
			if(results && results.listings && results.listings.length) {
				render_results(results.listings);
			} else {
				//do something
			}
		});
	}

	function render_results(results) {
		$('.lp-results').empty();

		results.forEach(function(r){
			$('.lp-results').append(tpl_lp_result(r));
		})
	}

	$(function(){
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position){
				console.log('Found position', position);
			});
		}

		render_map()
			.locate({setView: true, maxZoom: 13})
			.on('locationfound', function(e){
				 var radius = e.accuracy / 2;
				 L.marker(e.latlng).addTo(map)

				 L.circle(e.latlng, radius).addTo(map);

				 do_search('', e.latlng);
			});
	});

}(jQuery)