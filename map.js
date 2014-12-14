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

    var SimpleControl = L.Control.extend({
      initialize: function(templateId, divClass, options) {
        this.template = Handlebars.compile($(templateId).html());
        this.divClass = divClass;
        L.Util.setOptions(this, options);
      },

      onAdd: function (map) {
        this._div = L.DomUtil.create('div', this.divClass);
        this._div.innerHTML = this.template();

        return this._div;
      }
    });

    var info = new SimpleControl('#info-template', 'info', {
      position: 'topright'
    }).addTo(map);

    var sharePane = new SimpleControl('#share-template', 'info', {
      position: 'bottomleft'
    }).addTo(map);

    var legend = new SimpleControl('#legend-template', 'legend', {
      position: 'bottomright'
    }).addTo(map);
});
