import * as d3 from "d3";
import lasso from "./lasso";


const getMinMax = (data) => {
    const minY = data.reduce((min, p) => p.y < min ? p.y : min, data[0].y);
    const maxY = data.reduce((max, p) => p.y > max ? p.y : max, data[0].y);
    const minX = data.reduce((min, p) => p.x < min ? p.x : min, data[0].x);
    const maxX = data.reduce((max, p) => p.x > max ? p.x : max, data[0].x);
    return {minX,maxX,minY, maxY}
}

class Chart {
    constructor(opts) {
        this.data = opts.data;
        this.element = opts.element;
        this.width = opts.width;
        this.height = opts.height;
        this.handleSelection = opts.handleSelection;
        this.element.innerHTML = '';
        const width = this.width;
        const height = this.height;
        this.padding = {top: 40, right: 10, bottom: 40, left: 40};
        const plotWidth = width - this.padding.right - this.padding.left;
        const plotHeight = height - this.padding.top - this.padding.bottom;
        const {minX,maxX,minY,maxY }= getMinMax(this.data);
        this.xScale = d3.scaleLinear().domain([minX,maxX]).range([0,plotWidth]);
        this.yScale = d3.scaleLinear().domain([minX,maxX]).range([0,plotHeight]);
        window.scale = this.xScale
        console.log("FUCK", this.xScale(0.5))
        const visRoot = d3
            .select(this.element)
            .style('position', 'relative');

// main canvas to draw on
        this.canvas = visRoot
            .append('canvas')
            .attr('width', width )
            .attr('height', height)
            .style('width', `${width}px`)
            .style('height', `${height}px`);



// add in an interaction layer as an SVG
        this.interactionSvg = visRoot
            .append('svg')
            .attr('width', plotWidth)
            .attr('height', plotHeight)
            .style('position', 'absolute')
            .style('top', this.padding.top)
            .style('left', this.padding.left);

// attach lasso to interaction SVG
        const lassoInstance = lasso()
            .on('end', (lassoPolygon)=>this.handleLassoEnd(lassoPolygon))
            .on('start', (lassoPolygon)=>this.handleLassoStart(lassoPolygon));

        this.interactionSvg.call(lassoInstance);

        this.drawPoints();
    }

    setColor() {
        // more stuff
    }

    setData() {
        // even more stuff
    }

    drawPoints() {
        const context = this.canvas.node().getContext('2d');
        context.save();
        context.clearRect(0, 0, this.width, this.height);
        context.translate(this.padding.left, this.padding.top);

        // draw each point as a rectangle
        for (let i = 0; i < this.data.length; ++i) {
            const point = this.data[i];

            // draw circles
            context.fillStyle = point.color;
            context.beginPath();
            context.arc(this.xScale(point.x), this.yScale(point.y), point.r, 0, 2 * Math.PI);
            context.fill();
        }

        context.restore();
    }

    updateSelectedPoints(selectedPoints) {
        // if no selected points, reset to all tomato
        if (!selectedPoints.length) {
            // reset all
            this.data.forEach((d, idx) => {
                d.r = 2;
            });

            // otherwise gray out selected and color selected black
        } else {
            this.data.forEach(d => {
                d.r = 1;
            });
            selectedPoints.forEach(d => {
                d.r = 2;
            });
        }

        // redraw with new colors
        this.drawPoints();
    }

    handleLassoEnd(lassoPolygon) {
        const selectedPoints = this.data.filter(d => {
            const x = this.xScale(d.x)
            const y = this.yScale(d.y)

            return d3.polygonContains(lassoPolygon, [x, y]);
        });
        this.handleSelection(selectedPoints);
        this.updateSelectedPoints(selectedPoints);
    }

// reset selected points when starting a new polygon
    handleLassoStart(lassoPolygon) {
        this.updateSelectedPoints([]);
    }

}

export default Chart;
