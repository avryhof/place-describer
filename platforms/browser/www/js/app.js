/* **
 * These are your app views.
 *
 * a view is defined like so ...
 *
 * app.on({page: '<pagename>', preventClose: <true|false>, content: '<template>', (optional) function(activity) {});
 */

var session = window.localStorage;

phonon.options({
    navigator: {
        defaultPage: 'home',
        animatePages: true,
        enableBrowserBackButton: true,
        templateRootDirectory: './tpl'
    },
    i18n: null // for this example, we do not use internationalization
});


var app = phonon.navigator();

app.on({
    page: 'home',
    preventClose: false,
    content: null
});

app.on({
        page: 'login',
        preventClose: false,
        content: 'login.html',
        readyDelay: 1
    }, function(activity) {

        var action = null;

        var onAction = function(evt) {
            var target = evt.target;
            action = 'ok';

            var req = phonon.ajax({
                method: 'POST',
                url: 'https://staging.proactrx.com/kph/accounts/api_login/',
                crossDomain: true,
                dataType: 'json',
                //contentType: '',
                data: {
                    username: document.getElementById('username').value,
                    password: document.getElementById('password').value
                },
                //timeout: 5000,
                headers: {
                    'KPH-Agent': 'wVb5Rp0MweHsEaRr4j5tXbTuGsIyErWePtRnjOba9CtQuf4T8y',
                 },
                success: function(res, xhr) {
                    console.log(res);
                    // session.setItem('auth_token', )
                    phonon.alert('You are being logged in.', 'Login');
                },
                error: function(res, flagError, xhr) {
                    console.error(flagError);
                    console.log(res);
                    phonon.alert('Error contacting the API.', 'Login');
                }
            });
        };

        activity.onCreate(function() {
            document.querySelector('#signin').on('tap', onAction);
        });

        activity.onClose(function(self) {

        });

        activity.onHidden(function() {
            action = null;
        });

        activity.onHashChanged(function(hashvalue) {

        });
    }); // End Login Page

app.on({
        page: 'quickrefill',
        preventClose: false,
        content: 'quickrefill.html',
        readyDelay: 1
    }, function(activity) {

        var action = null;

        var onAction = function(evt) {
            var target = evt.target;
            action = 'ok';

            phonon.alert('Ordering refill', 'Refill Order');
        };

        activity.onCreate(function() {
            document.querySelector('#order_rx').on('tap', onAction);
        });

        activity.onClose(function(self) {

        });

        activity.onHidden(function() {
            action = null;
        });

        activity.onHashChanged(function(hashvalue) {

        });
    }); // End Quick Rx Refill

app.on({
    page: 'locator',
    preventClose: false,
    content: 'locator.html',
    readyDelay: 1
}, function(activity) {

    var action = null;

    var onAction = function(evt) {
        var target = evt.target;
        action = 'ok';

        if (target.id == "geo_search") {
            if ('geolocation' in navigator) {
                navigator.geolocation.getCurrentPosition(
                    function (pos) {
                        // Success
                        find_nearby_with_coords(pos.coords.latitude, pos.coords.longitude, $("#radius").val());
                    }, function (error) {
                        // Error
                        phonon.alert("Error " + error.code + "<br>" + error.message, "Error");
                    }
                );
            }
        }

        if (target.id == "pharma_search") {
            search_field = $("#address_or_zip").val();

            if (search_field.length == 5) {
                find_nearby_with_zip(search_field, $("#radius").val());
            } else {
                find_nearby_with_address(search_field, $("#radius").val());
            }

        }

    };

    activity.onCreate(function() {
        document.querySelector('#pharma_search').on('tap', onAction);
        document.querySelector('#geo_search').on('tap', onAction);
    });

    activity.onClose(function(self) {

    });

    activity.onHidden(function() {
        action = null;
    });

    activity.onHashChanged(function(hashvalue) {

    });
}); // End Pharmacy Finder

// Let's go!
app.start();
