(function (viz) {
    'use strict';

    const chartContainer = d3.select('.chart');
    const boundingRect = chartContainer.node().getBoundingClientRect();

    const margin = {
        'top': 20,
        'left': 50,
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

        const bar_w = 5;

        const makeLegend = function () {
            const xAxis = d3.axisBottom(scaleX).tickFormat(d3.timeFormat('%Y'));
            svg.append('g').attr('id', 'x-axis').attr('transform', 'translate(' + margin.left + ', ' + (height) + ')').call(xAxis)
                .call(function (g) {
                    g.select('.domain').attr('display', 'none');
                })
                .call(function (g) {
                    g.selectAll('text').style('font-size', '1.2rem')
                });

            const yAxis = d3.axisLeft(scaleY).tickFormat(d3.format('.2s')).ticks(5);
            svg.append('g').attr('id', 'y-axis').attr('transform', 'translate(' + margin.left + ', 0)').call(yAxis)
                .call(function (g) {
                    g.append('text').text('GDP billion $').attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')').style('font-size', '1.2rem')
                        .attr('fill', '#000');
                })
                .call(function (g) {
                    g.select('.domain').attr('display', 'none');
                })
                .call(function (g) {
                    g.selectAll('line').attr('x1', 0).attr('x2', width + bar_w).attr('stroke', '#666').attr('stroke-opacity', .75).attr('stroke-width', '1px');
                })
                .call(function (g) {
                    g.selectAll('text').style('font-size', '1.2rem')
                });
        }

        makeLegend();

        const barGroup = svg.append('g').attr('class', 'barGroup');

        const mouseG = svg.append('g').attr('class', 'mouse-over-effects');

        mouseG.append('path').attr('class', 'mouse-line').style('stroke', '#A9A9A9')
            .style('stroke-width', '1px').style('opacity', 0);

        const update = function () {
            const bars = barGroup.selectAll('.bar').data(data.data);

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
                .attr('width', bar_w)
                .attr('fill', '#1abc9c')
                .attr('y', height)
                .attr('height', 0)
                .merge(bars)
                .on('mouseenter', function (d) {
                    d3.select(this).classed('active', true);

                    tooltip.attr('data-date', function () {
                        return d[0];
                    });

                    const time = tooltip.select('p#time');
                    const value = tooltip.select('p#value');

                    const date = new Date(d[0]);

                    const label = svg.append('g').attr('id', 'label');
                    const line = label.append('line').attr('id', 'line')
                        .attr('x1', margin.left).attr('x2', function () {
                            return scaleX(date) + margin.left;
                        })
                        .attr('y1', function () {
                            return scaleY(d[1]);
                        })
                        .attr('y2', function () {
                            return scaleY(d[1]);
                        })
                        .attr('stroke', '#666').attr('stroke-dasharray', '.25rem');
                    const text = label.append('text').attr('id', 'text')
                        .text(function () {
                            return d3.format('.2s')(d[1]);
                        })
                        .attr('transform', function () {
                            if (d[1] < 4000) {
                                return 'translate(' + margin.left + ', ' + (scaleY(d[1]) - 5) + ')'
                            }

                            return 'translate(' + margin.left + ', ' + (scaleY(d[1]) + 15) + ')'
                        })
                        .attr('fill', '#666')
                        .style('pointer-events', 'none')
                        .style('font-size', '1.2rem');

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
                    d3.select('#label').remove();
                    tooltip.style('opacity', 0);
                    tooltip.style('left', '-9999px');
                })
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