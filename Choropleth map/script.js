(function (viz) {
    'use strict';

    const chartContainer = d3.select('.chart');
    const boundingRect = chartContainer.node().getBoundingClientRect();
    const margin = {
        'top': 60,
        'left': 80,
        'right': 30,
        'bottom': 30
    };

    const width = boundingRect.width - margin.left - margin.right;
    const height = boundingRect.height - margin.top - margin.bottom;

    const svg = chartContainer.append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);

    d3.queue()
        .defer(d3.json, 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json')
        .defer(d3.json, 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json')
        .await(ready);

    function ready(error, eduData, mapData) {
        if (error) {
            return console.warn(error);
        }

        const temp = {};

        eduData.map(function (d) {
            return temp[d.fips] = {
                'state': d.state,
                'area': d.area_name,
                'rate': d.bachelorsOrHigher
            };
        });

        topojson.feature(mapData, mapData.objects.counties).features.map(function (m) {
            temp[m.id]['geo'] = m;
        });

        const data = [];
        for (const k of Object.keys(temp)) {
            const obj = {
                'fips': k,
                'state': temp[k].state,
                'area': temp[k].area,
                'rate': temp[k].rate,
                'geo': temp[k].geo
            };

            data.push(obj);
        }

        const tooltip = d3.select('.tooltip');

        const path = d3.geoPath();

        const holder = svg.append('g').attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

        const minRate = d3.min(data, function (d) {
            return d.rate;
        });
        const maxRate = d3.max(data, function (d) {
            return d.rate;
        });

        const colorScale = d3.scaleThreshold().domain(function (min, max, count) {
            let array = [];
            let step = (max - min) / count;
            let base = min;

            for (let i = 1; i < count; i++) {
                array.push(base + i * step);
            }

            return array;
        }(minRate, maxRate, d3.schemeGreens[9].length)).range(d3.schemeGreens[9]);

        const makeLegend = function () {
            const legendWidth = 450;
            const legendHeight = 10;

            const legendX = d3.scaleLinear().domain([minRate, maxRate])
                .range([0, legendWidth]);

            const rangeValues = colorScale.range().map(function (c) {
                const d = colorScale.invertExtent(c);

                if (d[0] == null) {
                    d[0] = legendX.domain()[0];
                }

                if (d[1] == null) {
                    d[1] = legendX.domain()[1];
                }

                return d;
            });

            const legendXAxis = d3.axisBottom(legendX)
                .tickFormat(function (d) {
                    return d3.format('.1%')(d / 100);
                })
                .tickValues(rangeValues.map(function (m, i) {
                    return m[0];
                }).slice(1));

            const legend = svg.append('g').attr('class', 'legend')
                .attr('id', 'legend')
                .attr('transform', 'translate(' + width * 0.5 + ', ' +
                    (legendHeight + margin.top / 2) + ')');

            legend.append('g').selectAll('rect')
                .data(rangeValues)
                .enter().append('rect')
                .style('fill', function (d) {
                    return colorScale(d[0]);
                })
                .attr('x', function (d) {
                    return legendX(d[0]);
                })
                .attr('y', 0)
                .attr('width', function (d) {
                    return legendX(d[1]) - legendX(d[0]);
                })
                .attr('height', legendHeight);

            legend.append('g').attr('transform', 'translate(0, ' + (legendHeight) + ')')
                .call(legendXAxis)
                .call(function (g) {
                    g.select('.domain').remove();
                })
                .call(function (g) {
                    g.selectAll('line').attr('y1', 6).attr('y2', -legendHeight);
                })
                .call(function (g) {
                    g.selectAll('text').style('font-size', '1.2rem');
                });
        }

        makeLegend();

        const counties = holder.append('g').selectAll('path').data(data)
            .enter().append('path').attr('class', 'county')
            .attr('data-fips', function (d) {
                return d.fips;
            })
            .attr('data-education', function (d) {
                return d.rate;
            })
            .attr('d', function (d) {
                return path(d.geo);
            }).attr('fill', function (d) {
                return colorScale(d.rate);
            })
            .attr('stroke-linejoin', 'round')
            .on('mousemove', function (d) {
                d3.select(this).attr('stroke', '#666');

                const mouseCoords = d3.mouse(d3.select('.container').node());

                const html = d.area + ', ' + d.state + ': ' + d.rate + '%';
                tooltip.html(html);
                tooltip.attr('data-education', function () {
                    return d.rate;
                })
                tooltip.style('display', null);
                tooltip.style('left', (mouseCoords[0] + 10) + 'px');
                tooltip.style('top', (mouseCoords[1] + 10) + 'px');
            })
            .on('mouseout', function (d) {
                d3.select(this).attr('stroke', null);

                tooltip.style('left', '-9999px');
                tooltip.style('display', 'none');
            });

        const states = holder.append('path').datum(topojson.mesh(mapData, mapData.objects.states, function (a, b) {
            return a !== b;
        })).attr('fill', 'none').attr('stroke', '#fafafa').attr('stroke-linejoin', 'round').attr('d', path);
    }

}(window.viz = window.viz || {}));