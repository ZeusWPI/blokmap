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
            layer.bindPopup(popuptemplate(feature.properties), {
              showOnMouseOver: true
            });
        }
    }

    function pointToLayer(feature, latlng) {
      var marker = new HoverMarker(latlng, { icon: redIcon, riseOnHover: true});
      if (feature.properties) {
        if (feature.properties.holidays && christmasHoliday) {
          var marker = new HoverMarker(latlng, { icon: christmasIcon, riseOnHover: true});
        }
        if (!feature.properties.hours.saturday && !feature.properties.hours.sunday) {
          var marker = new HoverMarker(latlng, { icon: blueIcon, riseOnHover: true});
        }
      }
      return marker
    }

    var map = L.map('map').setView([50.702, 4.335], 9);
    var osm = L.tileLayer('https://{s}.tiles.mapbox.com/v3/feliciaan.keoaj8d5/{z}/{x}/{y}{r}.png', {
      attribution: '© <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> | © <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>-contributors | Made with ❤ by <a href="https://zeus.ugent.be">Zeus WPI</a>',
      detectRetina: true
    }).addTo(map);

    $.getJSON('https://blokdata.zeus.gent/data.json')
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
    // code copied from http://jsfiddle.net/sowelie/3JbNY/
    var HoverMarker = L.Marker.extend({
      bindPopup: function(htmlContent, options) {
	  			
        if (options && options.showOnMouseOver) {
          
          // call the super method
          L.Marker.prototype.bindPopup.apply(this, [htmlContent, options]);
          
          // unbind the click event
          this.off("click", this.openPopup, this);
          
          // bind to mouse over
          this.on("mouseover", function(e) {
            
            // get the element that the mouse hovered onto
            var target = e.originalEvent.fromElement || e.originalEvent.relatedTarget;
            var parent = this._getParent(target, "leaflet-popup");
     
            // check to see if the element is a popup, and if it is this marker's popup
            if (parent == this._popup._container)
              return true;
            
            // show the popup
            this.openPopup();
            
          }, this);
          
          // and mouse out
          this.on("mouseout", function(e) {
            
            // get the element that the mouse hovered onto
            var target = e.originalEvent.toElement || e.originalEvent.relatedTarget;
            
            // check to see if the element is a popup
            if (this._getParent(target, "leaflet-popup")) {
     
              L.DomEvent.on(this._popup._container, "mouseout", this._popupMouseOut, this);
              return true;
     
            }
            
            // hide the popup
            this.closePopup();
            
          }, this);
          
        }
        
      },
     
      _popupMouseOut: function(e) {
          
        // detach the event
        L.DomEvent.off(this._popup, "mouseout", this._popupMouseOut, this);
     
        // get the element that the mouse hovered onto
        var target = e.toElement || e.relatedTarget;
        
        // check to see if the element is a popup
        if (this._getParent(target, "leaflet-popup"))
          return true;
        
        // check to see if the marker was hovered back onto
        if (target == this._icon)
          return true;
        
        // hide the popup
        this.closePopup();
        
      },
      
      _getParent: function(element, className) {
        
        var parent = element.parentNode;
        
        while (parent != null) {
          
          if (parent.className && L.DomUtil.hasClass(parent, className))
            return parent;
          
          parent = parent.parentNode;
          
        }
        
        return false;
        
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
