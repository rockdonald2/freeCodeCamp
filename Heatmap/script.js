(function (viz) {
    'use strict';

    const colorbrewer = {
        RdYlBu: {
            3: ["#fc8d59", "#ffffbf", "#91bfdb"],
            4: ["#d7191c", "#fdae61", "#abd9e9", "#2c7bb6"],
            5: ["#d7191c", "#fdae61", "#ffffbf", "#abd9e9", "#2c7bb6"],
            6: ["#d73027", "#fc8d59", "#fee090", "#e0f3f8", "#91bfdb", "#4575b4"],
            7: ["#d73027", "#fc8d59", "#fee090", "#ffffbf", "#e0f3f8", "#91bfdb", "#4575b4"],
            8: ["#d73027", "#f46d43", "#fdae61", "#fee090", "#e0f3f8", "#abd9e9", "#74add1", "#4575b4"],
            9: ["#d73027", "#f46d43", "#fdae61", "#fee090", "#ffffbf", "#e0f3f8", "#abd9e9", "#74add1", "#4575b4"],
            10: ["#a50026", "#d73027", "#f46d43", "#fdae61", "#fee090", "#e0f3f8", "#abd9e9", "#74add1", "#4575b4", "#313695"],
            11: ["#a50026", "#d73027", "#f46d43", "#fdae61", "#fee090", "#ffffbf", "#e0f3f8", "#abd9e9", "#74add1", "#4575b4", "#313695"]
        },
        RdBu: {
            3: ["#ef8a62", "#f7f7f7", "#67a9cf"],
            4: ["#ca0020", "#f4a582", "#92c5de", "#0571b0"],
            5: ["#ca0020", "#f4a582", "#f7f7f7", "#92c5de", "#0571b0"],
            6: ["#b2182b", "#ef8a62", "#fddbc7", "#d1e5f0", "#67a9cf", "#2166ac"],
            7: ["#b2182b", "#ef8a62", "#fddbc7", "#f7f7f7", "#d1e5f0", "#67a9cf", "#2166ac"],
            8: ["#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#d1e5f0", "#92c5de", "#4393c3", "#2166ac"],
            9: ["#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#f7f7f7", "#d1e5f0", "#92c5de", "#4393c3", "#2166ac"],
            10: ["#67001f", "#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#d1e5f0", "#92c5de", "#4393c3", "#2166ac", "#053061"],
            11: ["#67001f", "#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#f7f7f7", "#d1e5f0", "#92c5de", "#4393c3", "#2166ac", "#053061"]
        }
    };

    const chartContainer = d3.select('.chart');
    const margin = {
        'top': 30,
        'left': 80,
        'right': 30,
        'bottom': 80
    };

    d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json', function (error, data) {
        if (error) {
            return console.warn(error);
        }

        data.monthlyVariance.map(function (d) {
            d.month -= 1;
        });

        const width = 5 * Math.ceil(data.monthlyVariance.length / 12); // width * number of years
        const height = 33 * 12; // height * number of month

        const svg = chartContainer.append('svg').attr('height', height + margin.top + margin.bottom).attr('width', width + margin.right + margin.left);

        const tooltip = chartContainer.select('.tooltip');

        const scaleX = d3.scaleBand().range([0, width]).domain(d3.range(d3.min(data.monthlyVariance, function (d) {
            return +d.year;
        }), d3.max(data.monthlyVariance, function (d) {
            return +d.year;
        }) + 1)).padding(0);
        const scaleY = d3.scaleBand().range([0, height]).domain(d3.range(0, 12)).padding(0);

        const makeAxis = function () {
            const xAxis = d3.axisBottom(scaleX).tickValues(scaleX.domain().filter(function (t) {
                return t % 10 == 0;
            }));
            svg.append('g').attr('class', 'x-axis').attr('id', 'x-axis').attr('transform', 'translate(' + margin.left + ', ' + height + ')').call(xAxis)
                .call(function (g) {
                    g.selectAll('text').style('font-size', '1.2rem');
                });

            const yAxis = d3.axisLeft(scaleY).tickFormat(function (t) {
                const date = new Date(0);
                date.setUTCMonth(t);

                return d3.timeFormat('%B')(date);
            });
            svg.append('g').attr('class', 'y-axis').attr('id', 'y-axis').attr('transform', 'translate(' + margin.left + ', 0)').call(yAxis)
                .call(function (g) {
                    g.select('.domain').remove();
                })
                .call(function (g) {
                    g.selectAll('text').style('font-size', '1.2rem');
                });
        }

        makeAxis();

        const colors = colorbrewer.RdYlBu[11].reverse();
        const variance = data.monthlyVariance.map(function (val) {
            return val.variance;
        });
        const minTemp = data.baseTemperature + Math.min.apply(null, variance);
        const maxTemp = data.baseTemperature + Math.max.apply(null, variance);

        const colorThreshold = d3.scaleThreshold()
            .domain((function (min, max, count) {
                let array = [];
                let step = (max - min) / count;
                let base = min;
                for (let i = 1; i < count; i++) {
                    array.push(base + i * step);
                }
                return array;
            })(minTemp, maxTemp, colors.length))
            .range(colors);

        const makeLegend = function () {
            const legendWidth = 400;
            const legendHeight = 300 / colors.length;

            const legendX = d3.scaleLinear().domain([minTemp, maxTemp]).range([0, legendWidth]);

            const legendXAxis = d3.axisBottom(legendX).tickSize(10).tickValues(colorThreshold.domain())
                .tickFormat(d3.format('.1f'));

            const legend = svg.append('g').attr('class', 'legend')
                .attr('id', 'legend')
                .attr('transform', 'translate(' + (margin.left) + ', ' + (margin.top + height + margin.bottom - 2 * legendHeight) + ')');

            legend.append('g').selectAll('rect').data(colorThreshold.range().map(function (c) {
                const d = colorThreshold.invertExtent(c);

                if (d[0] == null) {
                    d[0] = legendX.domain()[0];
                }

                if (d[1] == null) {
                    d[1] = legendX.domain()[1];
                }

                return d;
            }))
            .enter().append('rect').style('fill', function (d) {
                return colorThreshold(d[0]);
            })
            .attr('stroke', '#000')
            .attr('x', function (d) {
                return legendX(d[0]);
            })
            .attr('y', 0)
            .attr('width', function (d) {
                return legendX(d[1]) - legendX(d[0]);
            })
            .attr('height', legendHeight);

            legend.append('g')
                .attr('transform', 'translate(-.5, ' + legendHeight + ')').call(legendXAxis)
                .call(function (g) {
                    g.select('.domain').remove();
                });

            svg.append('text').text('Months').attr('transform', 'translate(10,' + (height / 2 + margin.top) + ') rotate(-90)').style('font-size', '1.4rem');
            svg.append('text').text('Years').attr('transform', 'translate(' + (width / 2 + margin.left) + ', ' + (height + margin.bottom / 1.5) + ')').style('font-size', '1.4rem');
        }

        makeLegend();

        const mapGroup = svg.append('g').attr('class', 'map').attr('transform', 'translate(' + margin.left + ', ' + '0)');

        const update = function () {
            const cells = mapGroup.selectAll('.cell').data(data.monthlyVariance);

            cells.enter().append('rect')
                .attr('class', 'cell')
                .attr('data-month', function (d) {
                    return d.month;
                })
                .attr('data-year', function (d) {
                    return d.year;
                })
                .attr('data-temp', function (d) {
                    return data.baseTemperature + d.variance;
                })
                .attr('x', function (d) {
                    return scaleX(d.year);
                })
                .attr('y', function (d) {
                    return scaleY(d.month);
                })
                .attr('width', scaleX.bandwidth())
                .attr('height', scaleY.bandwidth())
                .style('fill', function (d) {
                    return colorThreshold(data.baseTemperature + d.variance);
                })
                .on('mouseover', function (d) {
                    d3.select(this).attr('stroke', '#000');

                    const html = `<p>${d.year} - ${d3.timeFormat('%B')(new Date(1970, d.month, 1))}</p>
                                  <p>${d3.format('.1f')(data.baseTemperature + d.variance)}℃</p>
                                  <p>${d3.format('+.1f')(d.variance)}℃</p>`;

                    tooltip.html(html);
                    tooltip.style('display', null);
                    tooltip.attr('data-year', d.year);

                    const w = parseInt(tooltip.style('width'));
                    const h = parseInt(tooltip.style('height'));

                    tooltip.style('left', function () {
                        return (scaleX(d.year) + 20) + 'px';
                    });
                    tooltip.style('top', function () {
                        if (d.month == 12) {
                            return (h * 2 + margin.top) + 'px';
                        }

                        return (scaleY(d.month) + h / 2) + 'px';
                    });
                })
                .on('mouseout', function (d) {
                    d3.select(this).attr('stroke', null);
                    tooltip.style('display', 'none');
                    tooltip.style('left', '-9999px');
                });
        }

        update();
    });
}(window.viz = window.viz || {}));