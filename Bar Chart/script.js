(function (viz) {
    'use strict';

    const chartContainer = d3.select('.chart');
    const boundingRect = chartContainer.node().getBoundingClientRect();

    const margin = {
        'top': 20,
        'left': 60,
        'right': 30,
        'bottom': 100
    }
    const width = boundingRect.width - margin.left - margin.right;
    const height = boundingRect.height - margin.top - margin.bottom;

    const svg = chartContainer.append('svg').attr('width', width + margin.left + margin.right).attr('height', height + margin.top + margin.bottom);

    const tooltip = d3.select('.tooltip');

    d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json', function (error, data) {
        if (error) {
            return console.warn(error);
        }

        const minMaxTime = d3.extent(data.data, function (d) {
            return d[0]; // date
        });
        const scaleX = d3.scaleTime().domain([new Date(minMaxTime[0]), new Date(minMaxTime[1])]).range([0, width]);

        const scaleY = d3.scaleLinear().domain([0, d3.max(data.data, function (d) {
            return d[1];
        })]).range([height, 0]);

        const makeLegend = function () {
            const xAxis = d3.axisBottom(scaleX).tickFormat(d3.timeFormat('%Y'));
            svg.append('g').attr('id', 'x-axis').attr('transform', 'translate(' + margin.left + ', ' + (height) + ')').call(xAxis);

            const yAxis = d3.axisLeft(scaleY).tickFormat(d3.format('d')).ticks(5);
            svg.append('g').attr('id', 'y-axis').attr('transform', 'translate(' + margin.left + ', 0)').call(yAxis);
        }

        makeLegend();

        const bar_w = 3;

        const update = function () {
            const bars = svg.selectAll('.bar').data(data.data);

            bars.enter().append('rect').attr('class', 'bar')
                .attr('x', function (d) {
                    return margin.left + scaleX(new Date(d[0]));
                })
                .attr('data-date', function (d) {
                    return d[0]
                })
                .attr('data-gdp', function (d) {
                    return d[1];
                })
                .on('mouseenter', function (d) {
                    d3.select(this).classed('active', true);

                    tooltip.attr('data-date', function () {
                        return d[0];
                    });

                    const time = tooltip.select('p#time');
                    const value = tooltip.select('p#value');

                    const date = new Date(d[0]);

                    const qtr = function (date) {

                        var month = date.getMonth();
                        if (month <= 2) {
                            return date.getFullYear() + " " + "Q1";
                        } else if (month > 2 && month <= 5) {
                            return date.getFullYear() + " " + "Q2";
                        } else if (month > 5 && month <= 8) {
                            return date.getFullYear() + " " + "Q3";
                        } else {
                            return date.getFullYear() + " " + "Q4";
                        }
                    }

                    time.text(qtr(date));
                    value.text('$' + d[1] + ' billion');

                    tooltip.style('opacity', 1);
                    tooltip.style('left', function () {
                        if (scaleX(date) < (width * 0.2)) {
                            return (scaleX(new Date(d[0])) + 100) + 'px';
                        }

                        return (scaleX(new Date(d[0])) - 100) + 'px';
                    });
                    tooltip.style('top', (height * 0.8) + 'px');
                })
                .on('mouseout', function (d) {
                    d3.select(this).classed('active', false);
                    tooltip.style('opacity', 0);
                    tooltip.style('left', '-9999px');
                })
                .attr('width', bar_w)
                .attr('fill', '#2980b9')
                .attr('y', height)
                .attr('height', 0)
                .merge(bars)
                .transition().duration(1000)
                .attr('y', function (d) {
                    return scaleY(d[1]);
                })
                .attr('height', function (d) {
                    return height - scaleY(d[1]);
                });
        }

        update();
    });
}(window.viz = window.viz || {}));