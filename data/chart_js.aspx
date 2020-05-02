<%@ Page Language="C#" AutoEventWireup="true" CodeFile="chart_js.aspx.cs" Inherits="app_Default" %>

<canvas id="canvas_<%=Common.My.getParam("rate") %>"></canvas>

<script>
    var COLORS1 = ['#E57373', '#F06292', '#BA68C8', '#9575CD', '#7986CB', '#64B5F6', '#4FC3F7', '#4DD0E1', '#4DB6AC', '#81C784', '#D50000', '#DCE775', '#FFF176', '#FFD54F', '#FFB74D', '#FF8A65', '#A1887F', '#E0E0E0', '#90A4AE'];
    var COLORS2 = ['#FFEBEE', '#FCE4EC', '#F3E5F5', '#EDE7F6', '#E8EAF6', '#E3F2FD', '#E1F5FE', '#E0F7FA', '#E0F2F1', '#E8F5E9', '#FF8A80', '#F9FBE7', '#FFFDE7', '#FFF8E1', '#FFF3E0', '#FBE9E7', '#EFEBE9', '#FAFAFA', '#ECEFF1'];

    COLORS1 = [
        'rgba(54, 162, 235, 0.4)',
        'rgba(255, 99, 132, 1)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)'
    ];
    COLORS2 = [
        'rgba(54, 162, 235, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
    ];

    var jqxhr = $.post("../data/chart_js_srv_get.aspx?rate=<%=Common.My.getParam("rate") %>", { payload: JSON.stringify( <%=Common.My.getParam("payload") %>) }, function (data) {
        var oData = JSON.parse(data);
        fn_chart<%=Common.My.getParam("rate") %>(oData.labels, oData.datasets);
    })
        .done(function () {
            //alert("second success");
            //fn_chart();
        })
        .fail(function () {
            alert("error");
        })
        .always(function () {
            //alert("finished");
        });

    function fn_chart<%=Common.My.getParam("rate") %>(iLabels, iDatasets) {
        var datasets = [];
        var std = {
            showLines: true,
            spanGaps: true,
            pointRadius: 0,
            steppedLine: true,
            fill: false
        }
        $.each(iDatasets, function (i, o) {
            datasets.push($.extend({ label: o.name, backgroundColor: COLORS2[i], borderColor: COLORS1[i], data: o.data }, std));
        });

        // console.log(datasets); console.log(iLabels);

        var config = {
            type: 'line',
            data: {
                labels: iLabels,
                datasets: datasets
            },
            options: {
                maintainAspectRatio: false,
                responsive: true,
                title: { display: false, text: 'Chart.js Line Chart' },
                tooltips: { mode: 'index', intersect: false },
                hover: { mode: 'nearest', intersect: false },
                scales: {
                    xAxes: [{
                        display: true,
                        scaleLabel: {
                            display: false,
                            labelString: 'Month'
                        }
                    }],
                    yAxes: [{
                        display: true,
                        scaleLabel: {
                            display: false,
                            labelString: 'Value'
                        }
                    }]
                }
            }
        };
        using('chartjs', function () {
            var ctx = document.getElementById('canvas_<%=Common.My.getParam("rate") %>'); // .getContext('2d');
            window.myLine = new Chart(ctx, config);
        });
    }
</script>
