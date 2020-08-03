(function (viz) {
    'use strict';

    const chartContainer = d3.select('.chart');
    const boundingRect = chartContainer.node().getBoundingClientRect();

    const margin = {
        'top': 70,
        'left': 60,
        'right': 20,
        'bottom': 80
    }

    const width = boundingRect.width - margin.left - margin.right;
    const height = boundingRect.height - margin.top - margin.bottom;

    const svg = chartContainer.append('svg')
        .attr('width', width + margin.left + margin.right).attr('height', height + margin.top + margin.bottom);

    d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json', function (error, data) {
        if (error) {
            return console.warn(error);
        }

        const minMaxYear = d3.extent(data, function (d) {
            return d.Year;
        })
        const scaleX = d3.scaleTime().domain([new Date(minMaxYear[0] - 1, 1, 1), new Date(minMaxYear[1] + 1, 1, 1)]).range([margin.left, width]);

        const minMaxTime = d3.extent(data, function (d) {
            return new Date(1970, 0, 1, 0, d.Time.split(':')[0], d.Time.split(':')[1]);
        });
        const scaleY = d3.scaleTime().domain([minMaxTime[1], minMaxTime[0]]).range([height, margin.top]);

        const xAxis = d3.axisBottom(scaleX).tickFormat(d3.timeFormat('%Y'));
        svg.append('g').attr('id', 'x-axis').attr('transform', 'translate(3.5, ' + (height + 25) + ')').call(xAxis)
            .call(function (g) {
                g.select('.domain').remove();
            })
            .call(function (g) {
                g.selectAll('line').attr('y1', 0).attr('y2', -height + 50).attr('stroke', '#666').attr('stroke-opacity', .5);
            })
            .call(function (g) {
                g.selectAll('text').attr('font-size', '1.2rem');
            });

        const yAxis = d3.axisLeft(scaleY).tickFormat(d3.timeFormat('%M:%S'));
        svg.append('g').attr('id', 'y-axis').attr('transform', 'translate(' + margin.left + ', 0)').call(yAxis)
            .call(function (g) {
                g.select('.domain').remove()
            })
            .call(function (g) {
                g.selectAll('line').attr('x1', 0).attr('x2', width).attr('stroke', '#666').attr('stroke-opacity', .5);
            })
            .call(function (g) {
                g.selectAll('text').attr('font-size', '1.2rem');
            });

        const circle_r = 10;

        const legend = svg.append('g').attr('class', 'legend').attr('id', 'legend').attr('transform', 'translate(' + width * 0.74 + ', 35)')
            .call(function (g) {
                g.append('g')
                    .call(function (g) {
                        g.append('circle').attr('r', circle_r).attr('fill', 'rgb(255, 127, 14)');
                        g.append('text').text('No doping allegations').style('font-size', '1.2rem').attr('alignment-baseline', 'middle').attr('dx', '1.2em').attr('dy', '.05em');
                    })
            })
            .call(function (g) {
                g.append('g').attr('transform', 'translate(150, 0)')
                    .call(function (g) {
                        g.append('circle').attr('r', circle_r).attr('fill', 'rgb(31, 119, 180)');
                        g.append('text').text('Riders with doping allegations').style('font-size', '1.2rem').attr('alignment-baseline', 'middle').attr('dx', '1.2em').attr('dy', '.05em');
                    })
            });

        const circleGroup = svg.append('g').attr('class', 'circleGroup');
        const tooltip = d3.select('#tooltip');

        const update = function () {
            const bubbles = circleGroup.selectAll('.dot').data(data);

            bubbles.enter().append('circle').attr('class', 'dot')
                .attr('data-xvalue', function (d) {
                    return d.Year;
                })
                .attr('data-yvalue', function (d) {
                    return new Date(1970, 0, 1, 0, d.Time.split(':')[0], d.Time.split(':')[1]);
                })
                .merge(bubbles)
                .attr('r', circle_r)
                .attr('cx', function (d) {
                    return scaleX(new Date(d.Year, 1, 1));
                })
                .attr('cy', function (d) {
                    return scaleY(new Date(1970, 0, 1, 0, d.Time.split(':')[0], d.Time.split(':')[1]));
                })
                .attr('fill', function (d) {
                    if (d.Doping == '') return 'rgb(255, 127, 14)';
                    else return 'rgb(31, 119, 180)';
                })
                .attr('stroke', '#000')
                .attr('opacity', .75)
                .on('mouseenter', function (d) {
                    d3.selectAll('.dot').transition().duration(500).attr('opacity', .25);
                    d3.select(this).transition().duration(500).attr('opacity', 1);

                    let html = `<p>${d.Name}: ${d.Nationality}</p><p>Year: ${d.Year}, Time: ${d.Time}</p>`;

                    if (d.Doping != '') {
                        html += `<br><p>${d.Doping}</p>`;
                    }

                    tooltip.html(html);
                    tooltip.attr('data-year', function () {
                        return d.Year;
                    });
                    tooltip.style('display', null);

                    if (scaleX(new Date(d.Year, 1, 1)) > 900) {
                        tooltip.classed('bottom', true);
                        tooltip.style('left', (scaleX(new Date(d.Year, 1, 1)) - parseInt(tooltip.style('width')) / 2 - 1) + 'px');
                        tooltip.style('top', (scaleY(new Date(1970, 0, 1, 0, d.Time.split(':')[0], d.Time.split(':')[1])) + parseInt(tooltip.style('height')) / 2 - 20) + 'px');
                    } else {
                        tooltip.classed('left', true);
                        tooltip.style('left', (scaleX(new Date(d.Year, 1, 1)) + 20) + 'px');
                        tooltip.style('top', (scaleY(new Date(1970, 0, 1, 0, d.Time.split(':')[0], d.Time.split(':')[1])) + ((d.Doping == '') ? 53 : 38)) + 'px');
                    }

                    circleGroup.append('g').attr('id', 'valueGroup')
                        .call(function (g) {
                            g.append('line').attr('id', 'lineX').attr('stroke', '#666').attr('stroke-width', '2px')
                                .attr('stroke-opacity', 0).attr('stroke-dasharray', '.5rem')
                                .attr('y1', function () {
                                    return scaleY(new Date(1970, 0, 1, 0, d.Time.split(':')[0], d.Time.split(':')[1])) + 10;
                                })
                                .attr('y2', function () {
                                    return height + margin.top / 2 - 10;
                                })
                                .attr('x1', function () {
                                    return scaleX(new Date(d.Year, 1, 1));
                                })
                                .attr('x2', function () {
                                    return scaleX(new Date(d.Year, 1, 1));
                                })
                                .transition().duration(250)
                                .attr('stroke-opacity', .75);
                        })
                        .call(function (g) {
                            g.append('line').attr('id', 'lineX').attr('stroke', '#666').attr('stroke-width', '2px')
                                .attr('stroke-opacity', 0).attr('stroke-dasharray', '.5rem')
                                .attr('y1', function () {
                                    return scaleY(new Date(1970, 0, 1, 0, d.Time.split(':')[0], d.Time.split(':')[1]));
                                })
                                .attr('y2', function () {
                                    return scaleY(new Date(1970, 0, 1, 0, d.Time.split(':')[0], d.Time.split(':')[1]));
                                })
                                .attr('x1', function () {
                                    return margin.left;
                                })
                                .attr('x2', function () {
                                    return scaleX(new Date(d.Year, 1, 1)) - 10;
                                })
                                .transition().duration(250)
                                .attr('stroke-opacity', .75);
                        })
                        .call(function (g) {
                            g.append('text').text(d.Time).attr('opacity', 0).attr('transform', function () {
                                return 'translate(' + margin.left + ', ' + (scaleY(new Date(1970, 0, 1, 0, d.Time.split(':')[0], d.Time.split(':')[1])) - 5) + ')';
                            }).style('font-weight', 'bold').attr('fill', '#666').transition().duration(250).attr('opacity', 1);
                        })
                        .call(function (g) {
                            g.append('text').text(d.Year).attr('opacity', 0).attr('transform', function () {
                                return 'translate(' + (scaleX(new Date(d.Year, 1, 1)) + 5) + ', ' + (height + 25) + ')';
                            }).style('font-weight', 'bold').attr('fill', '#666').transition().duration(250).attr('opacity', 1);
                        })
                })
                .on('mouseout', function (d) {
                    tooltip.classed('left', false);
                    tooltip.classed('bottom', false);
                    tooltip.style('left', '-9999px');
                    tooltip.style('display', 'none');
                    d3.selectAll('.dot').transition().duration(500).attr('opacity', .75);
                    d3.select(this).transition().duration(500).attr('opacity', 0.75);
                    d3.select('g#valueGroup').remove();
                });
        }

        update();
    })

} (window.viz = window.viz || {}));