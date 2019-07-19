import React, {Component} from 'react';
import ScatterPlot from './ScatterPlot';
import './App.css';
import * as d3 from "d3";

const BASECOLORS = ['tomato', 'green', 'blue', 'yellow'];
const NRPOINTS = 500;

const COLORS = d3.range(NRPOINTS).map(() =>
    BASECOLORS.randomElement()
)
const DATA = d3.range(NRPOINTS).map((idx) => ({
    x: Math.random(),
    y: Math.random(),
    r: 2,
    color: COLORS[idx]
}));


class App extends Component {
    constructor(props) {
        super(props)
        this.state = {data: DATA, selectedPoints: []}
    }

    handleSelection(selectedPoints) {
        this.setState({selectedPoints: selectedPoints})

    }

    componentDidMount() {

    }

    render() {
        return (
            <div className="App">
                <div className={'container'}>
                    <ScatterPlot data={this.state.data}
                                 handleSelection={(selectedPoints) => this.handleSelection(selectedPoints)} width={1200}
                                 height={800}/>
                </div>
                <div>
                    {}
                </div>
            </div>
        );
    }
}

export default App;