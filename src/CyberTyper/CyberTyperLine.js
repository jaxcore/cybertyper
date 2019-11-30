import React, {Component} from 'react';

import syllable from 'syllable';

class CyberTyperLine extends Component {
	constructor(props) {
		super(props);
		
		let text = props.text;
		
		const words = text.split(' ');
		let wordIntervals = [];
		let totalSyllables = 0;
		let totalSpaces = 0;
		
		words.forEach((text, index) => {
			let wordSyllables;
			if (text.length === 1) wordSyllables = 1;
			else wordSyllables = syllable(text);
			totalSyllables += wordSyllables;
			
			wordIntervals.push({
				text,
				syllables: wordSyllables
			});
			
			if (index < words.length - 1) {
				// totalSyllables += 1;
				totalSpaces += 1;
				
				wordIntervals.push({
					space: true,
					text: ' ',
					syllables: 1
				});
			}
		});
		
		let syllableDuration;
		let totalDuration;
		
		if (this.props.duration) {
			// generate the syllableDuration based on the audio duration
			totalDuration = this.props.duration;
			syllableDuration = (totalDuration / totalSyllables) * 0.94;
		}
		else {
			// generate the duration based on a fixed syllable duration
			syllableDuration = this.props.syllableDuration;
			totalDuration = totalSyllables * syllableDuration;
		}
		
		this.state = {
			text: '',
			done: false,
			cursor: true,
			wordProgress: 0,
			letterProgress: 0,
			duration: 0,
			letterDuration: 0,
			totalDuration,
			accumulatedDuration: 0,
			syllableDuration,
			lineBreakDuration: 100,
			// spaceDuration: 100,
			// periodDuration: 100,
			totalSyllables,
			letterCount: props.text.length,
			wordIntervals
		};
	}
	
	componentDidMount() {
		this.props.onStart(() => {
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
			// letterDuration = this.state.spaceDuration;
			// letterDuration = this.state.syllableDuration;
			letterDuration = 0;
		}
		else {
			letterDuration = wordInterval.syllables * this.state.syllableDuration / wordInterval.text.length;
		}
		
		let letter;
		if (wordInterval.space) {
			letter = ' ';
		}
		else {
			letter = wordInterval.text[letterProgress - 1];
		}
		text += letter;
		
		let accumulatedDuration = this.state.accumulatedDuration;
		
		accumulatedDuration += letterDuration;
		
		const s = {
			text,
			letterDuration,
			letterProgress,
			wordProgress,
			accumulatedDuration
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
							this.props.onEnd();
							if (this.props.onended) this.props.onended();
						});
					}, this.state.lineBreakDuration);
					
				});
			}
			else {
				setTimeout(() => {
					this.next();
				}, this.state.letterDuration);
			}
			
		});
	}
	
	render() {
		return (
			<div className="CyberTyperLine">
				{this.state.text}
				{this.renderCursor()}
			</div>
		);
	}
	
	renderCursor() {
		if (!this.state.isDelaying && !this.state.done) {
			if (this.state.text.length) {
				let clss = "CyberTyperLineFloatingCursor";
				return (<span className={clss}/>);
			}
			else {
				return (<div className="CyberTyperLineCursor CyberTyperFlashing"/>);
			}
		}
	}
}

export default CyberTyperLine;
