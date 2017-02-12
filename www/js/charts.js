/**
 * Gets data from ThingSpeak.com to feed google charts
 * @author Tomasz Ceszke
 */



google.charts.load('current', {
    'packages': ['corechart'],
    'language': 'pl' //, 'gauge']
});



function drawDownChart() {
    $('#' + config.divIdDown).html("Loading...");
    google.charts.setOnLoadCallback(loadAndDrawDownChart);
}

function drawUpChart() {
    $('#' + config.divIdUp).html("Loading...");
    google.charts.setOnLoadCallback(loadAndDrawUpChart);
}



function loadAndDrawDownChart() {
    var dataTable = new google.visualization.DataTable();
    dataTable.addColumn('datetime', 'Time');
    dataTable.addColumn('number', 'Download');

    $.ajax({
        url: 'https://api.thingspeak.com/channels/' + config.channelId + '/feeds.json',
        data: {
            'days': 7,
        }
    }).done(function (data) {
        if (data) {
            $.each(data.feeds, function (i, row) {
                dataTable.addRow([new Date(row.created_at),
                                          parseFloat(row.field1),
                                         ]);
            });
            var options = {
                title: 'Download - last week',
                curveType: 'function',
                explorer: {
                    actions: ['dragToZoom', 'rightClickToReset'],
                    axis: 'horizontal'
                },
                legend: {
                    position: 'none'
                }
            };
            var chart = new google.visualization.LineChart(document.getElementById(config.divIdDown));
            chart.draw(dataTable, options);
        }
    });
}

function loadAndDrawUpChart() {
    var dataTable = new google.visualization.DataTable();
    dataTable.addColumn('datetime', 'Time');
    dataTable.addColumn('number', 'Upload');

    $.ajax({
        url: 'https://api.thingspeak.com/channels/' + config.channelId + '/feeds.json',
        data: {
            'days': 7,
        }
    }).done(function (data) {
        if (data) {
            $.each(data.feeds, function (i, row) {
                dataTable.addRow([new Date(row.created_at),
                                          parseFloat(row.field2),
                                         ]);
            });
            var options = {
                title: 'Upload - last week',
                curveType: 'function',
                explorer: {
                    actions: ['dragToZoom', 'rightClickToReset'],
                    axis: 'horizontal'
                },
                legend: {
                    position: 'none'
                },
                colors: ['red'],
            };
            var chart = new google.visualization.LineChart(document.getElementById(config.divIdUp));
            chart.draw(dataTable, options);
        }
    });
}



$(window).resize(function () {
    drawDownChart();
    drawUpChart();
});
