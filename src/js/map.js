$(document).ready(function() {
    /* change image path */
    L.Icon.Default.imagePath = 'img';

    var popuptemplate = Handlebars.compile($('#popup-template').html());
    var RedIcon = L.Icon.Default.extend({
        options: {
            iconUrl: 'img/red-marker.png'
        }
    });
    var ChristmasIcon = L.Icon.Default.extend({
        options: {
            iconUrl: 'img/christmas-marker.png'
        }
    });
    var redIcon = new RedIcon();
    var BlueIcon = L.Icon.Default.extend({});
    var blueIcon = new BlueIcon();
    var christmasIcon = new ChristmasIcon();
    var christmasHoliday = Date.now() < new Date("2016-01-04").getTime();

    function onEachFeature(feature, layer) {
        if (feature.properties) {
            layer.bindPopup(popuptemplate(feature.properties));
        }
    }

    function pointToLayer(feature, latlng) {
      var marker = L.marker(latlng, { icon: redIcon, riseOnHover: true });
      if (feature.properties) {
        if (feature.properties.holidays && christmasHoliday) {
          var marker = L.marker(latlng, { icon: christmasIcon, riseOnHover: true });
        }
        if (!feature.properties.hours.saturday && !feature.properties.hours.sunday) {
          var marker = L.marker(latlng, { icon: blueIcon, riseOnHover: true });
        }
      }
      marker.on('mouseover', function (ev) {
        marker.openPopup();
      });
      marker.on('mouseout', function (ev) {
        marker.closePopup();
      });
      return marker
    }

    var map = L.map('map').setView([51.0475378, 3.7261835], 13);
    var osm = L.tileLayer('https://{s}.tiles.mapbox.com/v3/feliciaan.keoaj8d5/{z}/{x}/{y}{r}.png', {
      attribution: '© <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> | © <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>-contributors | Made with ❤ by <a href="https://zeus.ugent.be">Zeus WPI</a>',
      detectRetina: true
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

    var legend = new SimpleControl('#legend-template', christmasHoliday ? "holiday-legend" : "legend", {
      position: 'bottomright'
    }).addTo(map);
});
