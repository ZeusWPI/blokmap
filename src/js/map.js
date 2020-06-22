$(document).ready(function() {
    Handlebars.registerHelper("date", function (ddmyyyy) {
        return ddmyyyy.replace(/-/g, "/");
    });


    L.Icon.Default.imagePath = "img";

    var popuptemplate = Handlebars.compile($("#popup-template").html());

    var BlueIcon = L.Icon.Default.extend({});
    var RedIcon = L.Icon.Default.extend({
        options: {
            iconUrl: "img/red-marker.png"
        }
    });
    var ChristmasIcon = L.Icon.Default.extend({
        options: {
            iconUrl: "img/christmas-marker.png"
        }
    });

    var blueIcon = new BlueIcon();
    var redIcon = new RedIcon();
    var christmasIcon = new ChristmasIcon();

    var now = new Date();
    var christmasSeason =
        now.getTime() > new Date(now.getFullYear() + "-12-20").getTime() ||
        now.getTime() < new Date(now.getFullYear() + "-01-04").getTime();

    function onEachFeature(feature, layer) {
        if (feature.properties) {
            layer.bindPopup(popuptemplate(feature.properties), {
                showOnMouseOver: true
            });
        }
    }

    function pointToLayer(feature, latlng) {
        var icon = redIcon;
        var iconDescription = "red";
        if (feature.properties) {
            if (feature.properties.holidays && christmasSeason) {
                icon = christmasIcon;
                iconDescription = "christmas";
            } else if (!feature.properties.hours.saturday && !feature.properties.hours.sunday) {
                icon = blueIcon;
                iconDescription = "blue";
            }
        }
        return new HoverMarker(latlng, { icon: icon, riseOnHover: true});
    }

    var map = L.map("map").setView([50.702, 4.335], 9);
    var osm = L.tileLayer("//tile.osm.be/osmbe-nl/{z}/{x}/{y}.png", {
        attribution: 'Achtergrondkaart © <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>-bijdragers, tiles courtesy of <a href="https://geo6.be/">GEO-6</a>. | <span lang="en">Made with ❤ by <a href="https://zeus.gent/">Zeus WPI</a></span>',
        maxZoom: 18
    }).addTo(map);

    $.getJSON("https://blokdata.zeus.gent/data.json")
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
            this._div = L.DomUtil.create("div", this.divClass);
            this._div.innerHTML = this.template();

            return this._div;
        }
    });

    // code copied from http://jsfiddle.net/sowelie/3JbNY/
    var HoverMarker = L.Marker.extend({
        bindPopup: function(htmlContent, options) {

            if (options && options.showOnMouseOver) {

                L.Marker.prototype.bindPopup.apply(this, [htmlContent, options]);

                this.off("click", this.openPopup, this);

                this.on("mouseover", function(e) {

                    // get the element that the mouse hovered onto
                    var target = e.originalEvent.fromElement || e.originalEvent.relatedTarget;
                    var ancestor = this._findAncestorWithClass(target, "leaflet-popup");

                    // check to see if the element is a popup, and if it is this marker's popup
                    if (ancestor && ancestor === this._popup._container)
                        return true;

                    this.openPopup();

                }, this);

                this.on("mouseout", function(e) {

                    // get the element that the mouse hovered onto
                    var target = e.originalEvent.toElement || e.originalEvent.relatedTarget;

                    // check to see if the element is a popup
                    if (this._findAncestorWithClass(target, "leaflet-popup")) {
                        L.DomEvent.on(this._popup._container, "mouseout", this._popupMouseOut, this);
                        return true;
                    }

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
            if (this._findAncestorWithClass(target, "leaflet-popup"))
                return true;

            // check to see if the marker was hovered back onto
            if (target === this._icon)
                return true;

            this.closePopup();
        },

        _findAncestorWithClass: function(element, className) {
            while (element) {
                if (element.className && L.DomUtil.hasClass(element, className))
                    return element;
                element = element.parentNode;
            }

            return null;
        }
    });

    var info = new SimpleControl("#info-template", "info", {
        position: "topright"
    }).addTo(map);

    var sharePane = new SimpleControl("#share-template", "info", {
        position: "bottomleft"
    }).addTo(map);

    var legend = new SimpleControl("#legend-template", christmasSeason ? "holiday-legend" : "legend", {
        position: "bottomright"
    }).addTo(map);
});
