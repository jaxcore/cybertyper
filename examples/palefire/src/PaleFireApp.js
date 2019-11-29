import React, {Component} from 'react';

import CyberTyper from 'cybertyper';
import './CyberTyper.css';
import paleFireScript from './paleFireScript';

import Say from 'jaxcore-say';

const quickBrownFox = [
	{
		text: 'A quick brown fox',
		linebreak: true
	},
	{
		text: 'jumped over',
		linebreak: true
	},
	{
		text: 'the lazy dog.',
		linebreak: true
	}
];

Say.setWorkers({
	'espeak': 'webworkers/espeak-en-worker.js'
});

const voice = new Say({
	language: 'en-us',
});

class PaleFireApp extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			started: false,
			cyberscript: paleFireScript
			// cyberscript: quickBrownFox
		};
	}
	
	start() {
		this.setState({
			started: true
		});
	}
	
	render() {
		return (
			<div className="App">
				<h2>Pale Fire</h2>
				<button onClick={e => {
					this.start()
				}}>Start</button>
				<br/>
				<br/>
				<CyberTyper
					say={voice}
					sayProfile={'Jack'}
					script={this.state.cyberscript}
					maxLines={15}
					start={this.state.started}
					hideCursorWhenDone={false}
					onComplete={() => {
						console.log('CyberTyper complete');
					}}/>
			</div>
		);
	}
}

export default PaleFireApp;
