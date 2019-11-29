import React, {Component} from 'react';
import './App.css';
import CyberTyper from './CyberTyper';

import Say from 'jaxcore-say';

Say.setWorkers({
	'espeak': 'webworkers/espeak-en-worker.js'
});

var voice = new Say({
	language: 'en',
	profile: 'Jack'
});

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			started: false,
			cyberscript: [
				{
					text: 'the quick brown fox',
					mode: 'say', // beeps, silence
					sayProfile: 'Borg',
					beepType: '',
					delay: 1000, // delay 0.5 before proceeding
					onstarted: function() {
						console.log('START', 'the quick brown fox');
					},
					onended: function() {
						console.log('STOP', 'the quick brown fox');
					}
				},
				{
					linebreak: true,
					delay: 1000,
					onstarted: function() {
						console.log('START', 'linebreak');
					}
				},
				{
					text: 'jumped over',
					sayProfile: 'Cylon',
					delay: 1000,
					onstarted: function() {
						console.log('START', 'jump over',);
					},
					onended: function() {
						console.log('STOP', 'jump over',);
					}
				},
				{
					linebreak: true,
					delay: 1000,
					onstarted: function() {
						console.log('START', 'linebreak');
					}
				},
				{
					text: 'the lazy dog',
					sayProfile: 'Xenu',
					onstarted: function() {
						console.log('START', 'the lazy dog',);
					},
					onended: function() {
						console.log('STOP', 'the lazy dog',);
					}
				}
			]
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
				<button onClick={e => { this.start() }}>Start</button>
				<br/>
				<CyberTyper say={voice} cursor="&#9612;" sayProfile={'Jack'} script={this.state.cyberscript} maxLines={3} start={this.state.started} onComplete={() => {
					console.log('CyberTyper complete');
				}}/>
			</div>
		);
	}
}

export default App;
