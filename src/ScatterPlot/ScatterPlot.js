import React, {Component} from 'react';
import * as d3 from 'd3';
import D3ScatterPlot from './D3ScatterPlot';

Array.prototype.randomElement = function () {
    return this[Math.floor(Math.random() * this.length)]
}

// make up fake data
const width = window.innerWidth;
const height = window.innerHeight;

const padding = {top: 40, right: 40, bottom: 40, left: 40}

const plotAreaWidth = width - padding.left - padding.right;
const plotAreaHeight = height - padding.top - padding.bottom;



class ScatterPlot extends Component {

    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.chart= new D3ScatterPlot({
            element: this.refs.plot,
            data: this.props.data,
            width: this.props.width,
            height: this.props.height,
            handleSelection: this.props.handleSelection
        })
    }

    render() {
        return (
            <div ref={"plot"}>
            </div>
        );
    }
}



export default ScatterPlot;
