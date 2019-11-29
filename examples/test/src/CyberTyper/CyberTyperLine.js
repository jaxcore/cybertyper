import React, {Component} from 'react';

import syllable from 'syllable';

global.syllable = syllable;
console.log('syllable', syllable);

class CyberTyperLine extends Component {
	constructor(props) {
		super(props);
		
		let text = props.text;
		
		const words = text.split(' ');
		let wordIntervals = [];
		let totalSyllables = 0;
		
		let syllableDuration = this.props.syllableDuration;
		// todo: for text-to-speech need use audio length to calculate the required syllableDuration
		
		words.forEach((text, index) => {
			let wordSyllables;
			if (text.length===1) wordSyllables = 1;
			else wordSyllables = syllable(text);
			totalSyllables += wordSyllables;
			
			wordIntervals.push({
				text,
				syllables: wordSyllables
			});
			
			if (index < words.length - 1) {
				totalSyllables += 1;
				
				wordIntervals.push({
					space: true,
					text: ' ',
					syllables: 1
				});
			}
		});
		
		// generate the duration
		const totalDuration = totalSyllables * syllableDuration;
		
		
		this.state = {
			text: '',
			done: false,
			cursor: true,
			wordProgress: 0,
			letterProgress: 0,
			duration: 0,
			letterDuration: 0,
			totalDuration,
			lineBreakDuration: 300,
			spaceDuration: 100,
			periodDuration: 1000,
			totalSyllables,
			letterCount: props.text.length,
			wordIntervals
		};
	}
	
	componentDidMount() {
		this.props.onStart();
		if (this.props.onstarted) this.props.onstarted();
		
		// todo: use getAudioData
		this.props.voice.say(this.props.text).then(() => {
			this.next();
		});
		
	}
	
	next() {
		let wordProgress = this.state.wordProgress;
		
		if (wordProgress > this.state.wordIntervals.length) {
			console.log('stopped');
			return;
		}
		
		let letterProgress = this.state.letterProgress;
		
		let text = this.state.text;
		
		let wordInterval;
		
		if (wordProgress === 0) {
			wordProgress = 1;
			letterProgress = 1;
			wordInterval = this.state.wordIntervals[wordProgress - 1];
		}
		else {
			letterProgress += 1;
			wordInterval = this.state.wordIntervals[wordProgress - 1];
			
			if (letterProgress > wordInterval.text.length) {
				letterProgress = 1;
				wordProgress += 1;
				wordInterval = this.state.wordIntervals[wordProgress - 1];
			}
		}
		
		let letterDuration;
		if (wordInterval.space) {
			letterDuration = this.state.spaceDuration;
		}
		else {
			letterDuration = wordInterval.syllables * this.props.syllableDuration / wordInterval.text.length;
		}
		
		if (wordInterval.space) {
			text += ' ';
		}
		else {
			text += wordInterval.text[letterProgress - 1];
		}
		
		const s = {
			text,
			letterDuration,
			letterProgress,
			wordProgress
		};
		
		this.setState(s, () => {
			
			if (wordProgress === this.state.wordIntervals.length
				&& letterProgress === wordInterval.text.length) {
					
				let {wordProgress} = this.state;
				wordProgress++;
				this.setState({
					wordProgress,
				}, () => {
					
					setTimeout(() => {
						this.setState({
							done: true
						}, () => {
							console.log('done');
							this.props.onEnd();
							if (this.props.onended) this.props.onended();
						});
					}, this.state.lineBreakDuration);
					
				});
			}
			else {
				if (this.state.letterDuration) {
					setTimeout(() => {
						this.next();
					}, this.state.letterDuration);
				}
			}
			
		});
	}
	
	render() {
		return (
			<div className="CyberTyperLine">
				{this.state.text}
				{this.renderFloatingCursor()}
			</div>
		);
	}
	
	renderFloatingCursor() {
		if (!this.state.isDelaying && !this.state.done && this.props.cursor) {
			let clss = "CyberTyperLineFloatingCursor";
			return (<span className={clss} />);
		}
	}
}

export default CyberTyperLine;
