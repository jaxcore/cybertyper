import React, {Component} from 'react';

import Say from 'jaxcore-say';
import CyberTyper from 'cybertyper';
import './CyberTyper.css';

import paleFireScript from './paleFireScript';

Say.setWorkers({
	'espeak': 'webworkers/espeak-en-worker.js'
});

const voice = new Say({
	language: 'en-us'
});

class PaleFireApp extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			started: false,
			cyberscript: paleFireScript
		};
	}
	
	start() {
		this.setState({
			started: true
		});
	}
	stop() {
		this.setState({
			started: false
		});
	}
	
	render() {
		return (
			<div className="App">
				<h2>Pale Fire</h2>
				
				{ this.renderButtons() }
				
				<br/>
				<br/>
				
				{ this.renderCyberTyper() }
				
				
			</div>
		);
	}
	
	renderCyberTyper() {
		if (this.state.started) {
			return (<CyberTyper
				autostart={true}
				say={voice}
				script={this.state.cyberscript}
				maxLines={15}
				lineBreakDuration={200}
				hideCursorWhenDone={true}
				onComplete={() => {
					console.log('CyberTyper complete');
				}}/>);
		}
	}
	
	renderButtons() {
		if (this.state.started) {
			return (<button onClick={e => {
				this.stop()
			}}>Stop</button>);
		}
		else {
			return (<button onClick={e => {
				this.start()
			}}>Start</button>);
		}
	}
}

export default PaleFireApp;
