$(document).ready(function() {
    var popuptemplate = Handlebars.compile($('#popup-template').html());
    var RedIcon = L.Icon.Default.extend({
        options: {
            iconUrl: 'red-marker.png'
        }
    });
    var redIcon = new RedIcon();
    var BlueIcon = L.Icon.Default.extend({});
    var blueIcon = new BlueIcon();

    function onEachFeature(feature, layer) {
        if (feature.properties) {
            layer.bindPopup(popuptemplate(feature.properties));
        }
    }

    function pointToLayer(feature, latlng) {
        if (feature.properties) {
            if (!feature.properties.hours.saturday && !feature.properties.hours.sunday) {
                return L.marker(latlng, {icon:blueIcon});
            }
        }
        return L.marker(latlng, {icon: redIcon});
    }

    var map = L.map('map').setView([51.0475378, 3.7261835], 13);
    L.tileLayer('http://otile{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpeg', {
        attribution: 'Tiles Courtesy of <a href="http://www.mapquest.com/">MapQuest</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        subdomains: '1234'
    }).addTo(map);

    $.getJSON('data.json')
    .done(function(data) {
        var geojson = L.geoJson(data, {
            onEachFeature: onEachFeature,
            pointToLayer: pointToLayer
        });
        map.addLayer(geojson);
    });

    var info = L.control();

    info.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info');
        div.innerHTML = Handlebars.compile($('#info-template').html())();

        return div;
    };

    info.addTo(map);

    var sharePane = L.control().setPosition("bottomleft");
    sharePane.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info');
        div.innerHTML = Handlebars.compile($('#share-template').html())();

        return div;
    };

    sharePane.addTo(map);
});
