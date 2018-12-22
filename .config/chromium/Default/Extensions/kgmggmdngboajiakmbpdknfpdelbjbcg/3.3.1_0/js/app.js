swal.setDefaults({ confirmButtonColor: '#32c2a0' });

function sendGAPageview(cid) {
    $.get('https://www.google-analytics.com/r/collect?v=1&t=pageview&dl=http://www.streamlabs.com&dp=/chrome-app/stream-labels&dt=Stream Labels | Chrome App&cid=' + cid + '&tid=UA-52139786-2');
}

var versionCompare = function(left, right) {
    if (typeof left + typeof right != 'stringstring')
        return false;

    var a = left.split('.')
    ,   b = right.split('.')
    ,   i = 0, len = Math.max(a.length, b.length);

    for (; i < len; i++) {
        if ((a[i] && !b[i] && parseInt(a[i]) > 0) || (parseInt(a[i]) > parseInt(b[i]))) {
            return 1;
        } else if ((b[i] && !a[i] && parseInt(b[i]) > 0) || (parseInt(a[i]) < parseInt(b[i]))) {
            return -1;
        }
    }

    return 0;
}

var train = (function(){
    return function(config) {
        var timerFilePath = config.timerPath || "subtrain_clock.txt";
        var duration = config.duration || 60*1000;

        if (typeof duration !== "function") {
            duration = (function(d) {
                return function() {
                    return d;
                };
            })(duration);
        }

        var delay = 100;
        var running = false;
        var timeout = null;
        var startedAt = null;
        //var currentCounter = 0;
        var currentTimerString = "0:00";
        var clearTrain = function()
        {
            currentTimerString = "0:00";
            writeToFile(timerFilePath, currentTimerString);

            if (config.clear) {
                config.clear.apply(this, arguments);
            }
        }
        var restartTimer = function()
        {
            startedAt = moment();
        }
        function increase()
        {
            if (config.increase) {
                config.increase.apply(this, arguments);
            }
            restartTimer();
            if (!running) {
                run();
            }
        }
        function run()
        {
            running = true;
            var diff = duration() - moment().diff(startedAt);
            var minutes = Math.floor(diff / 60000);
            var seconds = Math.floor((diff-minutes*60000) / 1000);
            if (seconds <= 0 && minutes <= 0) {
                clearTrain();
                running = false;
                return;
            }
            var timerString = minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
            if (timerString != currentTimerString) {
                currentTimerString = timerString;
                writeToFile(timerFilePath, currentTimerString);
            }
            timeout = setTimeout(function(){
                run();
            }, delay);
        }
        var initialData = config.data || {};
        return {
            initialize: function()
            {
                clearTrain();
            },
            increase: function()
            {
                increase.apply(this, arguments);
            },
            data: initialData
        }
    }
})();
var train_latests = {
    subscription: null,
    donation: null,
    follow: null
};
subtrain = (function() {
    var data = {
        latestSubPath: "subtrain_latest_sub.txt",
        counterFilePath: "subtrain_counter.txt",
        timerPath: "subtrain_clock.txt",
        counter: 0,
        latestSub: ""
    };
    return train({
        timerPath: "subtrain_clock.txt",
        duration: function() {
            return Math.max(10, Math.min(1800, parseInt(getAllSettings()['train_twitch_subscriptions[duration]']))) * 1000;
        },
        increase: function(subNames) {
            if (subNames && subNames.length) {
                data.counter += subNames.length;
                data.latestSub = subNames[subNames.length-1];
                writeToFile(data.counterFilePath, data.counter);
                writeToFile(data.latestSubPath, data.latestSub);
            }
        },
        clear: function() {
            data.counter = 0;

            if (getAllSettings()['train_twitch_subscriptions[show_count]'] == 'active') {
                writeToFile(data.counterFilePath, '          ');
            } else {
                writeToFile(data.counterFilePath, data.counter);
            }

            if (getAllSettings()['train_twitch_subscriptions[show_latest]'] == 'always') {

            } else {
                data.latestSub = '          ';
                writeToFile(data.latestSubPath, data.latestSub);
            }

            if (getAllSettings()['train_twitch_subscriptions[show_clock]'] == 'active') {
                writeToFile(data.timerPath, '          ');
            }
        }
    });
})();
followtrain = (function() {
    var data = {
        latestFollowerPath: "followtrain_latest_follower.txt",
        counterFilePath: "followtrain_counter.txt",
        timerPath: "followtrain_clock.txt",
        counter: 0,
        latestFollower: ""
    };
    return train({
        timerPath: "followtrain_clock.txt",
        duration: function() {
            return Math.max(10, Math.min(1800, parseInt(getAllSettings()['train_twitch_follows[duration]']))) * 1000;
        },
        increase: function(names) {
            if (names && names.length) {
                data.counter += names.length;
                data.latestFollower = names[names.length-1];
                writeToFile(data.counterFilePath, data.counter);
                writeToFile(data.latestFollowerPath, data.latestFollower);
            }
        },
        clear: function() {
            data.counter = 0;

            if (getAllSettings()['train_twitch_follows[show_count]'] == 'active') {
                writeToFile(data.counterFilePath, '          ');
            } else {
                writeToFile(data.counterFilePath, data.counter);
            }

            if (getAllSettings()['train_twitch_follows[show_latest]'] == 'always') {

            } else {
                data.latestFollower = '          ';
                writeToFile(data.latestFollowerPath, data.latestFollower);
            }

            if (getAllSettings()['train_twitch_follows[show_clock]'] == 'active') {
                writeToFile(data.timerPath, '          ');
            }
        }
    });
})();
donationtrain = (function() {
    var data = {
        latestDonatorPath: "donationtrain_latest_donator.txt",
        latestAmountPath: "donationtrain_latest_amount.txt",
        totalAmountPath: "donationtrain_total_amount.txt",
        counterFilePath: "donationtrain_counter.txt",
        timerPath: "donationtrain_clock.txt",
        latestDonator: "",
        latestAmount: 0,
        totalAmount: 0,
        counter: 0
    };
    return train({
        timerPath: "donationtrain_clock.txt",
        duration: function() {
            return Math.max(10, Math.min(1800, parseInt(getAllSettings()['train_tips[duration]']))) * 1000;
        },
        increase: function(items) {

            if (items && items.length) {
                var latest = items[items.length-1];
                data.counter += items.length;
                data.latestDonator = latest.name;
                data.latestAmount = latest.amount;
                data.totalAmount += items.reduce(function(current, item) { return parseFloat(current)+parseFloat(item.amount); }, 0);
                writeToFile(data.counterFilePath, data.counter);
                writeToFile(data.latestDonatorPath, data.latestDonator);
                writeToFile(data.latestAmountPath, data.latestAmount);
                writeToFile(data.totalAmountPath, data.totalAmount);
            }
        },
        clear: function() {

            var settings = getAllSettings().train_tips;

            data.counter = 0;
            data.totalAmount = 0;

            if (getAllSettings()['train_tips[show_count]'] == 'active') {
                writeToFile(data.counterFilePath, '          ');
                writeToFile(data.totalAmountPath, '          ');
            } else {
                writeToFile(data.counterFilePath, data.counter);
                writeToFile(data.totalAmountPath, data.totalAmount);
            }

            if (getAllSettings()['train_tips[show_latest]'] == 'always') {

            } else {
                data.latestDonator = '          ';
                data.latestAmount = 0;
                writeToFile(data.latestDonatorPath, data.latestDonator);
                writeToFile(data.latestAmountPath, data.latestAmount);
            }

            if (getAllSettings()['train_tips[show_clock]'] == 'active') {
                writeToFile(data.timerPath, '          ');
            }
        }
    });
})();


    var templates = {};

    function loadTemplate(path, id)
    {
        var dfd = new jQuery.Deferred();
        templates[id] = twig({
            id: id,
            href: path,

            load: function(template) {
                templates[id] = template;
                dfd.resolve();
            }
        });

        return dfd.promise();
    }

    var outputDirectoryEntry = null;
    var userToken = null;

    var files = {};

    var mTimeout = null;
    var doPoll = function(){

        if (mTimeout) {
            clearTimeout(mTimeout);
        }
        $.ajax('http://www.twitchalerts.com/api/v2/stream-labels/files?token=' + userToken, { cache: false })
        .done(function(response){

            if (response.data) {

                files = response.data;
                writeFiles();

            }

        }).always(function(){

            mTimeout = setTimeout(doPoll, 20000);

        });

    };

    $(function(){

        $('#choose-output-directory').click(function(e){
            e.preventDefault();

            changeOutputDirectory().done(function(directoryEntry){

                chrome.runtime.reload();

            }).fail(function(){

            });

        });

        $('a[href="#change-output-directory"]').click(function(e){
            e.preventDefault();
            changeOutputDirectory().done(function(){
                writeFiles();
            });
        });

        $('a[href="#restart-session"]').click(function(e){
            e.preventDefault();

            $.ajax('http://www.twitchalerts.com/api/v2/stream-labels/restart-session?token=' + userToken, { cache: false })
            .done(function(response){

            }).always(function(){

            });

        });

        $('a[href="#settings"]').click(function(e){
            e.preventDefault();

            $('#settings-window').addClass('visible').siblings().removeClass('visible');

        });

        $('a[href="#cancel-settings"]').click(function(e){
            e.preventDefault();

            $('#main-window').addClass('visible').siblings().removeClass('visible');

        });

        $('a[href="#logout"]').click(function(e){
            e.preventDefault();

            logout().then(function(){

                chrome.runtime.reload();

            });

        });

        $('a[href="#save-settings"]').click(function(e){
            e.preventDefault();

            var data = getAllSettings();

            $.ajax('http://www.twitchalerts.com/api/v2/stream-labels/settings?token=' + userToken, {
                type: 'POST',
                data: data
            })
            .done(function(response){

                doPoll();

            }).always(function(){
                $('#main-window').addClass('visible').siblings().removeClass('visible');
            });


        });

    });

    function log(message)
    {
        var $parent = $('#output-log').parent();

        var $tr = $('<tr />');
        $tr.append($('<th />').text(moment().format('MM/DD/YYYY, h:mm:ss A')));
        $tr.append($('<td />').text(message));
        $('#output-log').append($tr);

        var $trs = $('#output-log tr');
        var count = $trs.length;

        if (count > 200) {
            $trs.first().remove();
        }

        $parent[0].scrollTop = $parent[0].scrollHeight;

    }

    var twitchalerts = (function(){

        return {



        };

    })();


    function login()
    {
        var dfd = new jQuery.Deferred();

        chrome.storage.sync.get(['token', 'last_booted_version'], function(r){

            if (r.token) {
                dfd.resolve(r);
            } else {

                var cbUrl = chrome.identity.getRedirectURL() + 'provider_cb';
                var authUrl = 'http://www.twitchalerts.com/login?_=' + Date.now() + '&skip_splash=true&r=' + cbUrl;

                if (typeof r.token !== 'undefined') {
                    authUrl += '&force_verify=true';
                }

                chrome.identity.launchWebAuthFlow({
                    url: authUrl,
                    interactive: true
                },
                function(redirect_url) {

                    if (redirect_url) {

                        var matches = redirect_url.match(/token=(.+)/);

                        if (matches && matches[1]) {

                            var token = matches[1];
                            chrome.storage.sync.set({
                                token: token
                            });
                            dfd.resolve({token: token});

                        }

                        dfd.reject();

                    } else {
                        dfd.reject();
                    }

                });


            }

        });

        return dfd.promise();
    }

    function logout()
    {
        var dfd = new jQuery.Deferred();
        chrome.storage.sync.set({
            token: null
        }, function(){
            dfd.resolve();
        });

        return dfd.promise();
    }

    var changeOutputDirectory = function()
    {
        var dfd = new jQuery.Deferred();

        chrome.fileSystem.chooseEntry({
            type: 'openDirectory'
        },
        function(directoryEntry) {

            if (directoryEntry) {

                outputDirectoryEntry = directoryEntry;

                var id = chrome.fileSystem.retainEntry(directoryEntry);
                chrome.storage.sync.set({
                    outputDirectory: id
                }, function(){
                    dfd.resolve();
                });

            } else {
                dfd.reject();
            }

        });

        return dfd.promise();
    }

    function getDirectoryEntry() {

        var dfd = new jQuery.Deferred();

        chrome.storage.sync.get('outputDirectory', function(r){

            if (r.outputDirectory) {

                chrome.fileSystem.isRestorable(r.outputDirectory, function(isRestorable){

                    if (isRestorable) {

                        chrome.fileSystem.restoreEntry(r.outputDirectory, function(directoryEntry){

                            outputDirectoryEntry = directoryEntry;
                            dfd.resolve();

                        });

                    } else {
                        dfd.reject();
                    }

                });

            } else {
                dfd.reject();
            }

        });

        return dfd.promise();

    }

    var writeToFile = function(filename, contents)
    {
        contents += '';
        var dfd = new jQuery.Deferred();

        outputDirectoryEntry.getFile(filename, {create: true}, function(fileEntry)
        {

            var blob = new Blob([contents.replace(/\\n/g, "\r\n")], {type: 'text/plain'});

            fileEntry.createWriter(function(writer) {

                writer.onwriteend = function() {

                    if (writer.length != blob.size) {
                        writer.truncate(blob.size);
                        return;
                    }
                };

                writer.write(blob);
                dfd.resolve(filename);

            });
        },
        function(error)
        {
            dfd.reject(error);
        });

        return dfd.promise();
    }

    function writeFiles()
    {
        if (files) {
            for (filename in files) {
                writeToFile(filename + '.txt', files[filename]).done(function(filename){
                    log('Wrote to ' + filename);
                });
            }
        }
    }

    function init()
    {
        subtrain.initialize();
        donationtrain.initialize();
        followtrain.initialize();

        $('#main-window').prepend('<webview id="webview" src="http://www.twitchalerts.com/dashboard/recent-events?_=' + Date.now() + '&token='  + userToken + '" style="position: fixed; top: 0px;height: 100%;padding-top: 46px;width: 100%;bottom: 0;box-sizing: border-box;"></webview>');

        webview = document.getElementById('webview');
        webview.addEventListener("contentload", function () {
            try {
                webview.contentWindow.postMessage(JSON.stringify({listen: true}), "*");
            } catch(error) {

            }

            webview.addEventListener('dialog', function(e){

                e.dialog.ok();

            });

            webview.addEventListener('newwindow', function(e){

                window.open(e.targetUrl);

            });

        });

        window.addEventListener('message', function(e) {

            try {
                var data = JSON.parse(e.data);

                if (data.type) {

                    switch (data.type) {

                        case 'follows':
                            var names = data.data.map(function(item){
                                return item.name;
                            });
                            followtrain.increase(names);
                            break;

                        case 'subscriptions':
                            var names = data.data.map(function(item){
                                return item.name;
                            });
                            subtrain.increase(names);
                            break;

                        case 'donations':

                            donationtrain.increase(data.data);
                            break;

                    }

                }
            } catch(error) {

            }

        }, false);

        $('#main-window').addClass('visible').siblings().removeClass('visible');
        doPoll();
    }


    $.when(
        loadTemplate("view/simple-file-form.twig", "simpleFileForm"),
        loadTemplate("view/item-file-form.twig", "itemFileForm"),
        loadTemplate("view/train-file-form.twig", "trainFileForm")
    ).then(function(){

        $('#please-login').addClass('visible').siblings().removeClass('visible');

        login().done(function(r){

            var last_booted_version = r.last_booted_version || '0';
            var current_version = chrome.runtime.getManifest().version;

            if (versionCompare(current_version, last_booted_version) != 0) {
                chrome.storage.sync.set({
                    last_booted_version: current_version
                });
            }

            userToken = r.token;

            sendGAPageview(userToken);
            setInterval(function() {
                sendGAPageview(userToken);
            }, 60*60*1000);

            $.ajax('http://www.twitchalerts.com/api/v2/stream-labels/settings?token=' + userToken, { cache: false })
            .done(function(response){

                if (versionCompare('3.1.1', last_booted_version) == 1) {
                    setTimeout(function(){

                        if (files && files.most_recent_subscriber) {
                            swal({
                                title: "Resub support has been added!",
                                text: "Do you want your subscription files to count resubs?",
                                type: "info",
                                showCancelButton: true,
                                confirmButtonText: "Yes, include resubs!",
                                cancelButtonText: "Not now.",
                                closeOnConfirm: false,
                                closeOnCancel: false
                            }, function(confirmed){
                                if (confirmed) {
                                    response.session_subscribers.include_resubs = true;
                                    response.session_most_recent_subscriber.include_resubs = true;
                                    response.session_subscriber_count.include_resubs = true;
                                    response.most_recent_subscriber.include_resubs = true;
                                    swal("Resubs Enabled!", "Your subscriber files will now include resubs. You can always change this on a per-file basis in the File Settings menu.", "success");
                                } else {
                                    response.session_subscribers.include_resubs = false;
                                    response.session_most_recent_subscriber.include_resubs = false;
                                    response.session_subscriber_count.include_resubs = false;
                                    response.most_recent_subscriber.include_resubs = false;
                                    swal("Resubs Disabled!", "Resubs will not count towards your subcription files. You can always change this on a per-file basis in the File Settings menu.", "warning");
                                }

                                setUpSettings(response);
                                $('a[href="#save-settings"]').trigger('click');

                            });
                        }
                    }, 3000);
                }

                setUpSettings(response);

            });

            getDirectoryEntry().done(function(){

                init();

            }).fail(function(){

                $('#choose-output-directory-window').addClass('visible').siblings().removeClass('visible');

            });

        }).fail(function(){

            //window.close();

        });

    });
