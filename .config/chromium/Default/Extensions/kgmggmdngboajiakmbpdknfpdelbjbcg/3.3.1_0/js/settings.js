var parseBoolean = function(v) {
    return v != null && !/^(false|0)$/i.test(v);
};

var getAllSettings = function() {
    var data = {};
    $('input, select[name]').each(function(){
        if ($(this).is(':checkbox')) {
            data[$(this).attr('name')] = $(this).is(':checked');
        } else {
            data[$(this).attr('name')] = $(this).val();
        }
    });
    return data;
};

var setUpSettings = function(currentSettings) {

    var groups = [
        {
            label: 'Trains/Combos',
            files: [
                {
                    name: 'train_tips',
                    label: 'Donation Train',
                    template: 'trainFileForm'
                },
                {
                    name: 'train_twitch_follows',
                    label: 'Follows Train',
                    template: 'trainFileForm'
                },
                {
                    name: 'train_twitch_subscriptions',
                    label: 'Subscription Train',
                    template: 'trainFileForm'
                }
            ]
        },
        {
            label: 'Top Donator',
            files: [{
                name: 'all_time_top_donator',
                label: 'All-Time Top Donator',
                settings: {
                    format: { tokens: ['{name}', '{amount}'] }
                },
                template: 'simpleFileForm'
            },{
                name: 'session_top_donator',
                label: 'Session Top Donator',
                settings: {
                    format: { tokens: ['{name}', '{amount}'] }
                },
                template: 'simpleFileForm'
            },{
                name: 'monthly_top_donator',
                label: 'Monthly Top Donator',
                settings: {
                    format: { tokens: ['{name}', '{amount}'] }
                },
                template: 'simpleFileForm'
            },{
                name: '30day_top_donator',
                label: '30-Day Top Donator',
                settings: {
                    format: { tokens: ['{name}', '{amount}'] }
                },
                template: 'simpleFileForm'
            },{
                name: 'weekly_top_donator',
                label: 'Weekly Top Donator',
                settings: {
                    format: { tokens: ['{name}', '{amount}'] }
                },
                template: 'simpleFileForm'
            }]
        },
        {
            label: 'Top Donators (Top 10)',
            files: [{
                name: 'all_time_top_donators',
                label: 'All-Time Top Donators',
                settings: {
                    format: { tokens: ['{list}'] },
                    item_format: { tokens: ['{name}', '{amount}'] },
                    item_separator: { tokens: ['\\n'] }
                },
                template: 'itemFileForm'
            },{
                name: 'session_top_donators',
                label: 'Session Top Donators',
                settings: {
                    format: { tokens: ['{list}'] },
                    item_format: { tokens: ['{name}', '{amount}'] },
                    item_separator: { tokens: ['\\n'] }
                },
                template: 'itemFileForm'
            },{
                name: 'monthly_top_donators',
                label: 'Monthly Top Donators',
                settings: {
                    format: { tokens: ['{list}'] },
                    item_format: { tokens: ['{name}', '{amount}'] },
                    item_separator: { tokens: ['\\n'] }
                },
                template: 'itemFileForm'
            },{
                name: '30day_top_donators',
                label: '30-Day Top Donators',
                settings: {
                    format: { tokens: ['{list}'] },
                    item_format: { tokens: ['{name}', '{amount}'] },
                    item_separator: { tokens: ['\\n'] }
                },
                template: 'itemFileForm'
            },{
                name: 'weekly_top_donators',
                label: 'Weekly Top Donators',
                settings: {
                    format: { tokens: ['{list}'] },
                    item_format: { tokens: ['{name}', '{amount}'] },
                    item_separator: { tokens: ['\\n'] }
                },
                template: 'itemFileForm'
            }]
        },
        {
            label: 'Top Donations',
            files: [{
                name: 'all_time_top_donations',
                label: 'All-Time Top Donations',
                settings: {
                    format: { tokens: ['{list}'] },
                    item_format: { tokens: ['{name}', '{amount}'] },
                    item_separator: { tokens: ['\\n'] }
                },
                template: 'itemFileForm'
            },{
                name: 'session_top_donations',
                label: 'Session Top Donations',
                settings: {
                    format: { tokens: ['{list}'] },
                    item_format: { tokens: ['{name}', '{amount}'] },
                    item_separator: { tokens: ['\\n'] }
                },
                template: 'itemFileForm'
            },{
                name: 'monthly_top_donations',
                label: 'Monthly Top Donations',
                settings: {
                    format: { tokens: ['{list}'] },
                    item_format: { tokens: ['{name}', '{amount}'] },
                    item_separator: { tokens: ['\\n'] }
                },
                template: 'itemFileForm'
            },{
                name: '30day_top_donations',
                label: '30-Day Top Donations',
                settings: {
                    format: { tokens: ['{list}'] },
                    item_format: { tokens: ['{name}', '{amount}'] },
                    item_separator: { tokens: ['\\n'] }
                },
                template: 'itemFileForm'
            },{
                name: 'weekly_top_donations',
                label: 'Weekly Top Donations',
                settings: {
                    format: { tokens: ['{list}'] },
                    item_format: { tokens: ['{name}', '{amount}'] },
                    item_separator: { tokens: ['\\n'] }
                },
                template: 'itemFileForm'
            }]
        },
        {
            label: 'Donation Amount',
            files: [{
                name: 'total_donation_amount',
                label: 'Total Donation Amount',
                settings: {
                    format: { tokens: ['{amount}'] }
                },
                template: 'simpleFileForm'
            },{
                name: 'session_donation_amount',
                label: 'Session Donation Amount',
                settings: {
                    format: { tokens: ['{amount}'] }
                },
                template: 'simpleFileForm'
            },{
                name: 'monthly_donation_amount',
                label: 'Monthly Donation Amount',
                settings: {
                    format: { tokens: ['{amount}'] }
                },
                template: 'simpleFileForm'
            },{
                name: '30day_donation_amount',
                label: '30-Day Donation Amount',
                settings: {
                    format: { tokens: ['{amount}'] }
                },
                template: 'simpleFileForm'
            },{
                name: 'weekly_donation_amount',
                label: 'Weekly Donation Amount',
                settings: {
                    format: { tokens: ['{amount}'] }
                },
                template: 'simpleFileForm'
            }]
        },
        {
            label: 'Donators',
            files: [
                {
                    name: 'most_recent_donator',
                    label: 'Most Recent Donator',
                    settings: {
                        format: { tokens: ['{name}', '{amount}', '{message}'] }
                    },
                    template: 'simpleFileForm'
                },{
                    name: 'session_donators',
                    label: 'Session Donators (Max 25)',
                    settings: {
                        format: { tokens: ['{list}'] },
                        item_format: { tokens: ['{name}', '{amount}', '{message}'] },
                        item_separator: { tokens: ['\\n'] }
                    },
                    template: 'itemFileForm'
                },{
                    name: 'session_most_recent_donator',
                    label: 'Session Recent Donator',
                    settings: {
                        format: { tokens: ['{name}', '{amount}', '{message}'] }
                    },
                    template: 'simpleFileForm'
                }
            ]
        },
        {
            label: 'Followers',
            files: [
                {
                    name: 'total_follower_count',
                    label: 'Total Follower Count',
                    settings: {
                        format: { tokens: ['{count}'] }
                    },
                    template: 'simpleFileForm'
                },
                {
                    name: 'most_recent_follower',
                    label: 'Most Recent Follower',
                    settings: {
                        format: { tokens: ['{name}'] }
                    },
                    template: 'simpleFileForm'
                },
                {
                    name: 'session_followers',
                    label: 'Session Followers (Max 100)',
                    settings: {
                        format: { tokens: ['{list}'] },
                        item_format: { tokens: ['{name}'] },
                        item_separator: { tokens: ['\\n'] }
                    },
                    template: 'itemFileForm'
                },
                {
                    name: 'session_follower_count',
                    label: 'Session Follower Count',
                    settings: {
                        format: { tokens: ['{count}'] }
                    },
                    template: 'simpleFileForm'
                },
                {
                    name: 'session_most_recent_follower',
                    label: 'Session Most Recent Follower',
                    settings: {
                        format: { tokens: ['{name}'] }
                    },
                    template: 'simpleFileForm'
                }
            ]
        },
        {
            label: 'Subscribers',
            files: [
                {
                    name: 'total_subscriber_count',
                    label: 'Total Subscriber Count',
                    settings: {
                        format: { tokens: ['{count}'] }
                    },
                    template: 'simpleFileForm'
                },
                {
                    name: 'most_recent_subscriber',
                    label: 'Most Recent Subscriber',
                    settings: {
                        format: { tokens: ['{name}'] },
                        includeResubsOption: true
                    },
                    template: 'simpleFileForm'
                },
                {
                    name: 'session_subscribers',
                    label: 'Session Subscribers (Max 100)',
                    settings: {
                        format: { tokens: ['{list}'] },
                        item_format: { tokens: ['{name}'] },
                        item_separator: { tokens: ['\\n'] },
                        includeResubsOption: true
                    },
                    template: 'itemFileForm'
                },
                {
                    name: 'session_subscriber_count',
                    label: 'Session Subscriber Count',
                    settings: {
                        format: { tokens: ['{count}'] },
                        includeResubsOption: true
                    },
                    template: 'simpleFileForm'
                },
                {
                    name: 'session_most_recent_subscriber',
                    label: 'Session Most Recent Subscriber',
                    settings: {
                        format: { tokens: ['{name}'] },
                        includeResubsOption: true
                    },
                    template: 'simpleFileForm'
                }
            ]
        },
        {
            label: 'Donation Goal',
            files: [
                {
                    name: 'donation_goal',
                    label: 'Donation Goal',
                    settings: {
                        format: { tokens: ['{title}', '{currentAmount}', '{goalAmount}'] }
                    },
                    template: 'simpleFileForm'
                }
            ]
        }
    ];






    var $filepicker = $('#file-picker');

    for (var i = 0; i < groups.length; i++) {
        var group = groups[i];

        var $optgroup = $('<optgroup />').attr('label', group.label);

        for (var j = 0; j < group.files.length; j++) {
            var settings = group.files[j];

            $('.form').append(templates[settings.template].render(settings));

            if (settings.template == 'itemFileForm') {

                $('#' + settings.name + '-settings input').on('input', function(e){
                    var $fieldset = $(this).closest('.fieldset');

                    var $format = $fieldset.find('[name$="[format]"]');
                    var $itemFormat = $fieldset.find('[name$="[item_format]"]');
                    var $itemSeparator = $fieldset.find('[name$="[item_separator]"]');

                    var $preview = $fieldset.find('.preview');

                    var sampleData = [
                        { name: 'Fishstickslol', amount: '$4.98', message: 'I love you!' },
                        { name: 'ChocoPie', amount: '$5', message: 'I love you!' },
                        { name: 'Beecreative', amount: '$1.43', message: 'I love you!' }
                    ];

                    var itemStrings = [];
                    for (var i = 0; i < sampleData.length; i++) {

                        var data = sampleData[i];

                        var r = new RegExp('{name}', "gi");
                        var string = $itemFormat.val()
                            .replace(/{name}/gi, data.name)
                            .replace(/{amount}/gi, data.amount)
                            .replace(/{message}/gi, data.message);
                        itemStrings.push(string);

                    }

                    var list = itemStrings.join($itemSeparator.val()
                        .replace(/ /g, " ")
                        .replace(/\\n/g, "<br />")
                    );

                    var preview = $format.val()
                        .replace(/{list}/gi, list);

                    $preview.html(preview);

                }).trigger('input');

            } else {

                $('#' + settings.name + '-settings input').on('input', function(e){
                    var $fieldset = $(this).closest('.fieldset');
                    var $preview = $fieldset.find('.preview');
                    var preview = $(this).val()
                        .replace(/{name}/gi, 'Fishstickslol')
                        .replace(/{title}/gi, 'New Computer')
                        .replace(/{currentAmount}/gi, '$12')
                        .replace(/{goalAmount}/gi, '$47')
                        .replace(/{amount}/gi, '$4.99');

                    $preview.text(preview);

                }).trigger('input');
            }

            $optgroup.append($('<option />').text(settings.label).val(settings.name));
        }

        $filepicker.append($optgroup);


    }



    $('#file-picker').change(function(e){

        $('#' + $(this).val() + '-settings').show().siblings().hide();

    }).change();


    $('.tokens a').click(function(e){
        e.preventDefault();
        var currentVal = $(this).parent().prev().val();
        currentVal += $(this).text();
        $(this).parent().prev().val(currentVal).trigger('input').focus();
    });


    $.each(currentSettings, function(k, v){
        for (var k2 in v) {
            var $input = $('[name="' + k + "[" + k2 + ']"]');
            if ($input.is(':checkbox')) {
                $input.prop('checked', parseBoolean(v[k2])).change();
            } else {
                $input.val(v[k2]).trigger('input');
            }
        }

    });

};
