function plot3d(svg, x, y, z) {
    const width = 500;
    const height = 500;

    const xScale = d3.scaleLinear([-2, 2], [0, width + 28]);
    const yScale = d3.scaleLinear([-2, 2], [height, 0]);

    const xAxis = g => g
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisTop(xScale).ticks(width / height * 10))
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick").filter(d => xScale.domain().includes(d)).remove());

    const yAxis = g => g
        .attr("transform", "translate(-1,0)")
        .call(d3.axisRight(yScale))
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick").filter(d => yScale.domain().includes(d)).remove());

    // TODO compute thres based on z values.
    const zThres = d3.range(1, 20).map(i => Math.pow(2, i));
    const color = d3.scaleSequentialLog(d3.extent(zThres), d3.interpolateMagma);
    // const grid = _makeGrid(x, y, z);
    const transform = ({type, value, coordinates}) => {
        // console.log(type, value, coordinates);
        return {type, value, coordinates: coordinates.map(rings => {
                return rings.map(points => {
                    return points.map(([x, y]) => ([
                        -4 + 4 * x,
                        -4 + 4 * y
                    ]));
                });
            })};
    };

    const contours = d3.contours()
        .size([x.length, y.length])
        .thresholds(zThres)
        (z)
        .map(transform);

    svg
        .attr("viewBox", [0, 0, width + 28, height])
        .style("display", "block")
        .style("margin", "0 -14px")
        .style("width", "calc(100% + 28px)");


    svg.append("g")
        .attr("fill", "none")
        .attr("stroke", "#fff")
        .attr("stroke-opacity", 0.5)
        .selectAll("path")
        .data(contours)
        .join("path")
        .attr("fill", d => color(d.value))
        .attr("d", d3.geoPath());

    svg.append("g")
        .call(xAxis);

    svg.append("g")
        .call(yAxis);
}

// function _makeGrid(x, y, z) {
//     const grid = new Array(y.length * x.length);
//     for (let j = 0; j < y.length; ++j) {
//         for (let i = 0; i < x.length; ++i) {
//             grid[j * x.length + i] = z[x][y]
//         }
//     }
//     return grid;
// }

const value = (x, y) =>
    (1 + (x + y + 1) ** 2 * (19 - 14 * x + 3 * x ** 2 - 14 * y + 6 * x * y + 3 * y ** 2))
    * (30 + (2 * x - 3 * y) ** 2 * (18 - 32 * x + 12 * x * x + 48 * y - 36 * x * y + 27 * y ** 2));

const x_labels = [];
const y_labels = [];
const z = [];
for (let i = -2 ; i <= 2 ; i += 0.1) {
    x_labels.push(i);
    y_labels.push(i);
    for (let j = -2 ; j <= 2 ; j += 0.1) {
        z.push(value(i, j))
    }
}

plot3d(d3.select('#svg1'), x_labels, y_labels, z);