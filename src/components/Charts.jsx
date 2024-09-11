import Plot from 'react-plotly.js';


function CreateChart(props) {
    if (props.name === 'CAR'){
		return (
            <Plot
                data={props.contentData} 
                
                layout={{
                    width: 120, 
                    height: 150, 
                    showlegend: false,
                    margin: {"t": 20, "b": 0, "l": 0, "r": 0},
                    annotations: [
                        {
                            font: {
                            size: 20,
                            color: "#68D78D"
                            
                            },
                            showarrow: false,
                            text: props.displayCarRateText,
                            x: 0.5,
                            y: 0.5
                        }
                        ]
                }} 
                
                config={{
                    displayModeBar: false,
                    responsive: true
                }}

            />
        );
    } else if(props.name === "CRR") {
        return (
            <Plot
                data={props.contentData} 
                
                layout={{
                    width: 120, 
                    height: 150, 
                    showlegend: false,
                    margin: {"t": 20, "b": 0, "l": 0, "r": 0},
                    annotations: [
                        {
                            font: {
                            size: 20,
                            color: "#FFC000"
                            
                            },
                            showarrow: false,
                            text: props.displayCrrRateText,
                            x: 0.5,
                            y: 0.5
                        }
                        ]
                }} 
                
                config={{
                    displayModeBar: false,
                    responsive: true
                }}

            />
        );

    } else if(props.name === "revTrend") {
        return (
            <Plot
                data={props.contentData} 
                
                layout={{
                    // width: 500, 
                    height: 300, 
                    showlegend: false,
                    margin: {"t": 30, "b": 50, "l": 50, "r": 50},//these margins are extremely important and sensitive to any changes
                    yaxis: {showgrid: true},
                    xaxis: {showgrid: true},
                    responsive: true
                }} 
                
                config={{
                    displayModeBar: false,
                    responsive: true
                }}

            />
        );

    } else if(props.name === "volTrend" || props.name === "valTrend"){
        return (
            <Plot

                data={props.contentData} 
                
                layout={{
                    width: 600, 
                    height: 150, 
                    margin: {"t": 10, "b": 30, "l": 30, "r": 0},
                    yaxis: {showgrid: false, zeroline: false, showline: false, visible:false}
                }} 
                
                config={{
                    displayModeBar: false,
                    responsive: true
                }}

            />
		);
    } else if(props.name === "txnSuccRate" || props.name === "txnFailRate") {
        return (
            <Plot
                data={props.contentData} 
                
                layout={{
                    width: 100, 
                    height: 120, 
                    showlegend: false,
                    margin: {"t": 20, "b": 0, "l": 0, "r": 0},
                    annotations: [
                        {
                            font: {
                            size: 15,
                            color: props.name === "txnSuccRate"? "#00B050": "#DE0005" 
                            
                            },
                            showarrow: false,
                            text: props.displayRateText,
                            x: 0.5,
                            y: 0.5
                        }
                        ]
                }} 
                
                config={{
                    displayModeBar: false,
                    responsive: true
                }}

            />
        );
    } else if(props.name === "txnPendRate") {
        return (
            <Plot
                data={props.contentData} 
                
                layout={{
                    width: 100, 
                    height: 120, 
                    showlegend: false,
                    margin: {"t": 20, "b": 0, "l": 0, "r": 0},
                    annotations: [
                        {
                            font: {
                            size: 15,
                            color: "#BF9000"
                            
                            },
                            showarrow: false,
                            text: props.displayRateText,
                            x: 0.5,
                            y: 0.5
                        }
                        ]
                }} 
                
                config={{
                    displayModeBar: false,
                    responsive: true
                }}

            />
        );
    }
}

export default CreateChart;