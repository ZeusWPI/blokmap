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
    var googleLayer = new L.Google('TERRAIN');
    map.addLayer(googleLayer);

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
