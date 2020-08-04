(function (viz) {
    'use strict';

    const chartContainer = d3.select('.chart');
    const boundingRect = chartContainer.node().getBoundingClientRect();

    const margin = {
        'top': 10,
        'left': 50,
        'right': 50,
        'bottom': 100
    };

    const width = boundingRect.width - margin.left - margin.right;
    const height = boundingRect.height - margin.top - margin.bottom;

    const svg = chartContainer.append('svg').attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);

    const group = svg.append('g').attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

    const tooltip = d3.select('.tooltip');

    d3.json('https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json', function (error, data) {
        if (error) {
            return console.warn(error);
        }

        const root = d3.hierarchy(data)
            .sum(function (d) {
            return d.value;
        });

        const treemap = d3.treemap().size([width, height]).paddingInner(1);

        treemap(root);

        const colorScale = d3.scaleOrdinal().domain(['Action', 'Drama', 'Adventure', 'Family', 'Animation', 'Comedy', 'Biography'])
            .range(d3.schemeCategory10);

        const makeLegend = function () {
            const legend = svg.append('g').attr('class', 'legend').attr('id', 'legend')
                .attr('transform', 'translate(' + (width * 0.25) + ', ' + (height + margin.top + 25) + ')');

            const legendGroups = legend.selectAll('g').data(colorScale.domain())
                .enter().append('g').attr('class', 'legendGroup')
                .attr('transform', function (d, i) {
                    return 'translate(' + (i * 100) + ', 0)';
                });

            legendGroups.append('rect')
                .attr('class', 'legend-item')
                .attr('width', 20).attr('height', 20)
                .style('fill', function (d) {
                    return colorScale(d);
                });

            legendGroups.append('text').text(function (d) {
                return d;
            }).attr('x', 25).attr('y', 13)
                .attr('dy', '.15em')
                .style('font-size', '1.2rem');
        }   

        makeLegend();

        const leaf = group.selectAll('g').data(root.leaves())
            .enter().append('g').attr('transform', function (d) {
                return 'translate(' + d.x0 + ', ' + d.y0 + ')';
            }).style('overflow', 'hidden');

        leaf.append('rect')
            .attr('class', 'tile')
            .attr('data-name', function (d) {
                return d.data.name;
            })
            .attr('data-category', function (d) {
                return d.data.category;
            })
            .attr('data-value', function (d) {
                return d.data.value;
            })
            .attr('width', function (d) {
                return d.x1 - d.x0;
            })
            .attr('height', function (d) {
                return d.y1 - d.y0;
            })
            .style('stroke', '#fafafa')
            .style('fill', function (d) {
                return colorScale(d.data.category);
            })
            .on('mousemove', function (d) {
                d3.select(this).style('stroke', '#333').style('stroke-width', '2px');

                const html = `<p>Name: ${d.data.name}</p><p>Genre: ${d.data.category}</p><p>Value: ${d3.format(',d')(d.data.value)}</p>`;

                const mouseCoords = d3.mouse(d3.select('.container').node());

                tooltip.html(html);
                tooltip.attr('data-value', d.value);
                tooltip.style('display', null);
                tooltip.style('left', (mouseCoords[0] + 10) + 'px');
                tooltip.style('top', (mouseCoords[1] + 10) + 'px');
            })
            .on('mouseout', function (d) {
                d3.select(this).style('stroke', null);

                tooltip.style('display', 'none');
                tooltip.style('left', '-9999px');
            });

        leaf.append('text')
            .selectAll('tspan')
            .data(function (d) {
                return d.data.name.trim().split(/(?=[A-Z][a-z])|\s+/g);
            })
            .enter().append('tspan')
            .attr('x', 4)
            .attr('y', function (d, i) {
                return 13 + i * 10;
            })
            .text(function (d) {
                return d;
            })
            .style('fill', '#fafafa')
            .style('pointer-events', 'none');
    });

} (window.viz = window.viz || {}));