import React, {Component} from 'react';

import CyberTyper from 'cybertyper';
import './CyberTyper.css';

import Say from 'jaxcore-say';

Say.setWorkers({
	'espeak': 'webworkers/espeak-en-worker.js'
});

const voice = new Say({
	language: 'en-us',
});

class PaleFireApp extends Component {
	constructor(props) {
		super(props);
		
		const Interrogator = {
			name: 'Interrogator',
			voice: 'Cylon',
			className: 'Interrogator',
			displayName: true
		};
		const K = {
			name: 'K',
			voice: 'Jack',
			className: 'K',
			displayName: true
		};
		
		this.state = {
			started: false,
			cyberscript: [
				{
					text: [
						'And blood-black nothingness began to spin...',
						'A system of cells interlinked within cells interlinked',
						'within cells interlinked within one stem...',
						'And dreadfully distinct against the dark,',
						'a tall white fountain played.',
					],
					speaker: K,
					linebreak: true
				},
				{
					text: 'Cells.',
					speaker: Interrogator,
					linebreak: true
				},
				{
					text: 'Cells.',
					speaker: K,
					linebreak: true
				},
				{
					text: ['Have you ever been in an institution?', 'Cells.'],
					speaker: Interrogator,
					linebreak: true
				},
				{
					text: 'Cells.',
					speaker: K,
					linebreak: true
				},
				{
					text: ['Do they keep you in a cell?','Cells.'],
					speaker: Interrogator,
					linebreak: true
				},
				{
					text: 'Cells.',
					speaker: K,
					linebreak: true
				},
				{
					text: ['When you\'re not performing your duties do they keep you in a little box?','Cells.'],
					speaker: Interrogator,
					linebreak: true
				},
				{
					text: 'Cells.',
					speaker: K,
					linebreak: true
				},
				{
					text: 'Interlinked.',
					speaker: Interrogator,
					linebreak: true
				},
				{
					text: 'Interlinked.',
					speaker: K,
					linebreak: true
				},
				{
					text: ['What\'s it like to hold the hand of someone you love?', 'Interlinked.'],
					speaker: Interrogator,
					linebreak: true
				},
				{
					text: 'Interlinked.',
					speaker: K,
					linebreak: true
				},
				{
					text: ['Did they teach you how to feel finger to finger?', 'Interlinked.'],
					speaker: Interrogator,
					linebreak: true
				},
				{
					text: 'Interlinked.',
					speaker: K,
					linebreak: true
				},
				{
					text: ['Do you long for having your heart interlinked?', 'Interlinked.'],
					speaker: Interrogator,
					linebreak: true
				},
				{
					text: 'Interlinked.',
					speaker: K,
					linebreak: true
				},
				{
					text: 'Do you dream about being interlinked... ?',
					speaker: Interrogator,
					linebreak: true
				},
				{
					text: 'Interlinked.',
					speaker: K,
					linebreak: true
				},
				{
					text: ['What\'s it like to hold your child in your arms?','Interlinked.'],
					speaker: Interrogator,
					linebreak: true
				},
				{
					text: 'Interlinked.',
					speaker: K,
					linebreak: true
				},
				{
					text: ['Do you feel that there\'s a part of you that\'s missing?','Interlinked.'],
					speaker: Interrogator,
					linebreak: true
				},
				{
					text: 'Interlinked.',
					speaker: K,
					linebreak: true
				},
				{
					text: 'Within cells interlinked.',
					speaker: Interrogator,
					linebreak: true
				},
				{
					text: 'Within cells interlinked.',
					speaker: K,
					linebreak: true
				},
				{
					text: ['Why don\'t you say that three times:','Within cells interlinked.'],
					speaker: Interrogator,
					linebreak: true
				},
				{
					text: ['Within cells interlinked.','Within cells interlinked.','Within cells interlinked.'],
					speaker: K,
					linebreak: true
				},
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
				<h2>Pale Fire</h2>
				<button onClick={e => { this.start() }}>Start</button>
				<br/>
				<br/>
				<CyberTyper say={voice} cursor="&#9612;" sayProfile={'Jack'} script={this.state.cyberscript} maxLines={15} start={this.state.started} onComplete={() => {
					console.log('CyberTyper complete');
				}}/>
			</div>
		);
	}
}

export default PaleFireApp;
