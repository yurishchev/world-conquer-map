var WORLD_APP = (function () {
    var map;

    function init(completionPercentage) {
        // create AmMap object
        map = new AmCharts.AmMap();

        /* create areas settings
         * autoZoom set to true means that the map will zoom-in when clicked on the area
         * selectedColor indicates color of the clicked area.
         */
        map.areasSettings = {
            autoZoom: true,
            color: "#DDDDDD",
            unlistedAreasColor: "#DDDDDD",
            rollOverOutlineColor: "#FFFFFF",
            rollOverColor: "#0000CC",
            unlistedAreasAlpha: 0.1
        };

        /* create data provider object
         mapVar tells the map name of the variable of the map data. You have to
         view source of the map file you included in order to find the name of the
         variable - it's the very first line after commented lines.

         getAreasFromMap indicates that amMap should read all the areas available
         in the map data and treat them as they are included in your data provider.
         in case you don't set it to true, all the areas except listed in data
         provider will be treated as unlisted.
         */
        var dataProvider = {
            mapVar: AmCharts.maps.worldLow,
            areas: []
        };

        var i, j;
        var totalArea = conqueredArea = 0;
        var conqueredColor = "#66CC99", toBeConqueredColor="#FF0000";
        var countriesCollection = [];
        var logMessage = "";

        // calculate size of the area that should be drawn as conquered
        for (i = 0; i < WORLD_APP.allCountries.length; i++) {
            var country = WORLD_APP.allCountries[i];

            if (isPresentInBothCollections(country)) {
                countriesCollection.push(country);
                totalArea += country.area;
            }
        }
        conqueredArea = (totalArea * completionPercentage) / 100;

        countriesCollection.sort(function (country1, country2) {
            return country1.area - country2.area;
        });

        var cumulativeArea = 0, lastConqueredIndex = -1;
        for (i = 0; i < countriesCollection.length; i++) {
            var country = countriesCollection[i];

            var newMapItem = {
                id: country.alpha2Code,
                title: country.name
            };
            ///conqueredColor = gradient(conqueredColor, 256);
            logMessage = "" + (i+1) + "." + country.name;
            if (cumulativeArea < conqueredArea) {
                newMapItem.color = conqueredColor;
                cumulativeArea += country.area;
                lastConqueredIndex = i;
                logMessage += " - conquered!";
            } else if (i - lastConqueredIndex === 1) {
                newMapItem.color = toBeConqueredColor;
            }

            dataProvider.areas.push(newMapItem);
            console.log(logMessage);
        }

        // pass data provider to the map object
        map.dataProvider = dataProvider;
        map.addTitle("Conquer The World. Occupied: " + completionPercentage + "%.", 14);
	map.addTitle("Next target: " + countriesCollection[lastConqueredIndex+1].name, 11);
    }

    function isPresentInBothCollections(country) {
        var originalCountryCollection = AmCharts.maps.worldLow.svg.g.path;
        for (var j = 0; j < originalCountryCollection.length; j++) {
            if (originalCountryCollection[j].id === country.alpha2Code) {
                return true;
            }
        }
        return false;
    }

    function gradient(color, step) {
        var colorToInt = parseInt(color.substr(1), 16),                     // Convert HEX color to integer
            nstep = parseInt(step);                                         // Convert step to integer
        if (!isNaN(colorToInt) && !isNaN(nstep)) {                          // Make sure that color has been converted to integer
            colorToInt += nstep;                                            // Increment integer with step
            var ncolor = colorToInt.toString(16);                           // Convert back integer to HEX
            ncolor = '#' + (new Array(7 - ncolor.length).join(0)) + ncolor; // Left pad "0" to make HEX look like a color
            if (/^#[0-9a-f]{6}$/i.test(ncolor)) {                           // Make sure that HEX is a valid color
                return ncolor;
            }
        }
        return color;
    }

    return {
        prepareMap: function (completionPercentage) {
            init(completionPercentage);
            return map;
        }
    };

})();
