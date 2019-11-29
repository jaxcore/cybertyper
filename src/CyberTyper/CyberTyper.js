import React, {Component} from 'react';
// import './CyberTyper.css';
import CyberTyperLine from './CyberTyperLine';
import CyberTyperLineBreak from './CyberTyperLineBreak';

class CyberTyper extends Component {
	constructor(props) {
		super(props);
		
		let script = props.script;
		let processedScript = [];
		script.forEach((line) => {
			if (line.text) {
				if (line.text.forEach) {
					line.text.forEach((t, index) => {
						const s = {
							text: t
						};
						if (index === 0) {
							s.speaker = {
								...line.speaker,
								displayName: true
							};
						}
						else {
							s.speaker = {
								...line.speaker,
								displayName: false
							};
						}
						processedScript.push(s);
					});
				}
				else if (line.text.toString) {
					processedScript.push({
						text: line.text.toString(),
						speaker: line.speaker
					});
				}
			}
			if (line.linebreak) {
				if (typeof line.linebreak === 'number') {
					for (let i=0;i<line.linebreak;i++) {
						processedScript.push({
							linebreak: true
						});
					}
				}
				else {
					processedScript.push({
						linebreak: true
					});
				}
			}
		
		});
		//console.log('processedScript', processedScript);
		
		let hideCursorWhenDone = true;
		if ('hideCursorWhenDone' in props) hideCursorWhenDone = props.hideCursorWhenDone;
		
		this.state = {
			hideCursorWhenDone,
			script: processedScript,
			lines: [],
			progress: 0,
			done: false,
			started: props.start || false,
			syllableDuration: 300
		};
	}
	
	static getDerivedStateFromProps(props, state) {
		if (props.start) {
			state.started = props.start;
		}
		return state;
	}
	
	getSnapshotBeforeUpdate(prevProps, prevState) {
		if (this.props.start && prevProps.start === false) {
			return {
				started: this.props.start
			};
		}
		else return null;
	}
	
	componentDidUpdate(prevProps, prevState, snapshot) {
		if (snapshot && 'started' in snapshot) {
			this.next();
		}
	}
	
	next() {
		let progress = this.state.progress + 1;
		let script = this.state.script;
		if (progress <= script.length) {
			script[progress - 1].started = true;
			script[progress - 1].lineNum = progress - 1;
			
			let lines = this.state.lines;
			if (progress === 1) lines.push(script[progress - 1]);
			
			this.setState({
				lines,
				progress
			});
		}
	}
	
	render() {
		return (
			<div className="CyberTyper">
				{this.renderLines()}
				{this.renderCursor()}
			</div>
		);
	}
	
	renderCursor() {
		if (this.state.isDelaying || (this.state.done && !this.state.hideCursorWhenDone)) {
			return (<div className="CyberTyperLineCursor CyberTyperFlashing" />);
		}
	}
	
	renderLines() {
		if (this.state.started) {
			const lines = this.state.lines;
			
			return lines.map((line, index) => {
				const lineNum = line.lineNum;
				if (line.started) {
					let sayProfile = line.sayProfile || this.props.defaultSayProfile;
					if (line.linebreak) {
						return (<CyberTyperLineBreak key={lineNum}
													 delay={line.delay}
						
													 onstarted={line.onstarted}
													 onStart={() => {
														 this.onStart(lineNum);
													 }}
						
													 onended={line.onended}
													 onEnd={() => {
														 this.onEnd(lineNum);
													 }}
						/>);
					}
					else {
						return (<CyberTyperLine key={lineNum}
												voice={this.props.say}
												text={line.text}
												speaker={line.speaker}
												delay={line.delay}
												syllableDuration={this.state.syllableDuration}
												onstarted={line.onstarted}
												onStart={() => {
													this.onStart(lineNum);
												}}
						
												onended={line.onended}
												onEnd={() => {
													this.onEnd(lineNum);
												}}
						/>);
					}
				}
			});
		}
	}
	
	onStart(index) {
		console.log('line start', index);
	}
	
	onEnd(index) {
		console.log('line end', index);
		
		let lineBreakDuration = 300;
		
		let progress = this.state.progress + 1;
		let script = this.state.script;
		
		if (progress <= script.length) {
			let delay = script[progress - 1].delay || lineBreakDuration;
			
			let lines = this.state.lines;
			lines.push(script[progress - 1]);
			
			if (this.props.maxLines) {
				if (lines.length > this.props.maxLines) {
					lines.splice(0, (lines.length - this.props.maxLines));
				}
			}
			
			this.setState({
				isDelaying: true,
				lines
			}, () => {
				setTimeout(() => {
					this.setState({
						isDelaying: false
					}, () => {
						this.next();
					});
				}, delay);
			});
		}
		else {
			this.setState({
				done: true
			}, () => {
				if (this.props.onComplete) {
					this.props.onComplete();
				}
			});
		}
	}
}

export default CyberTyper;
