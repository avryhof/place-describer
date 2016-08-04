var geonames_user = 'avryhof';

function miles_to_km(miles) {
    return miles * 1.60934;
}

function km_to_miles(km) {
    return km * 0.621371;
}

function deg2rad(deg) {
    return deg * (Math.PI/180)
}

function get_distance(lat1, lon1, lat2, lon2, km) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1);
    var a =
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon/2) * Math.sin(dLon/2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c; // Distance in km
    if (km == true) {
        return d;
    } else {
        return km_to_miles(d);
    }
}

function show_stores(ziplist) {
    zipcodes = ''
    for (var i in ziplist.postalCodes) {
        zipcodes += ziplist.postalCodes[i].postalCode + ',';
    }
    $.ajax({
        dataType: "json",
        url: 'http://localhost/test-api/pharmacies.php',
        data: {
            'zip': zipcodes
        },
        success: function (res, textStatus, xhr) {
            console.log(res);
            pharmacies = ''
            for ( var r in res.results) {
                pharmacies += '<p class="padded-full">' + res.results[r].Name + '<br>' + res.results[r].Address + '<br>' + res.results[r].City + ', ' + res.results[r].State + '  ' + res.results[r].Zip + '</p>';
            }
            $("#pharmacy_list").html(pharmacies);
            phonon.panel('#pharmacies').open();
        },
        error: function (xhr, textStatus, errorThrown) {
            console.error(errorThrown);
            console.log(textStatus);
        }
    });
}

function find_nearby_with_zip(zip, radius) {
    $.ajax({
        dataType: "json",
        url: 'http://api.geonames.org/findNearbyPostalCodesJSON',
        data: {
            'username': geonames_user,
            'maxRows': 20,
            'postalcode': zip,
            'country': 'US',
            'radius': miles_to_km(radius)
        },
        success: function (res, textStatus, xhr) {
            console.log(res);
            show_stores(res);
        },
        error: function (xhr, textStatus, errorThrown) {
            console.error(errorThrown);
            console.log(textStatus);
        }
    });
}

function find_nearby_with_coords(lat, lng, radius) {
    $.ajax({
        dataType: "json",
        url: 'http://api.geonames.org/findNearbyPostalCodesJSON',
        data: {
            'username': geonames_user,
            'maxRows': 20,
            'lat': lat,
            'lng': lng,
            'radius': miles_to_km(radius)
        },
        success: function (res, textStatus, xhr) {
            console.log(res);
            show_stores(res);
        },
        error: function (xhr, textStatus, errorThrown) {
            console.error(errorThrown);
            console.log(textStatus);
        }
    });
}

function find_nearby_with_address(address, radius) {
    $.ajax({
        dataType: "json",
        url: 'https://geocoding.geo.census.gov/geocoder/locations/onelineaddress',
        data: {
            'benchmark': 'Public_AR_Current',
            'address': address,
            'format': 'json'
        },
        success: function (res, textStatus, xhr) {
            console.log(res.addressMatches[0].coordinates);
            /*
            $.ajax({
                dataType: "json",
                url: 'http://api.geonames.org/findNearbyPostalCodesJSON',
                data: {
                    'username': geonames_user,
                    'maxRows': 20,
                    'lat': lat,
                    'lng': lng,
                    'radius': miles_to_km(radius)
                },
                success: function (res, textStatus, xhr) {
                    console.log(res);
                    show_stores(res);
                },
                error: function (xhr, textStatus, errorThrown) {
                    console.error(errorThrown);
                    console.log(textStatus);
                }
            });
            */
        },
        error: function (xhr, textStatus, errorThrown) {
            console.error(errorThrown);
            console.log(textStatus);
        }
    });
}