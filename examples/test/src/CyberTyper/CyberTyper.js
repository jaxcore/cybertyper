import React, {Component} from 'react';
import './CyberTyper.css';
import CyberTyperLine from './CyberTyperLine';
import CyberTyperLineBreak from './CyberTyperLineBreak';

class CyberTyper extends Component {
	constructor(props) {
		super(props);
		this.state = {
			script: props.script,
			lines: [],
			progress: 0,
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
		if (this.state.isDelaying) {
			return (<div className="CyberTyperLineCursor" />);
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
													 cursor={this.props.cursor}
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
												cursor={this.props.cursor}
												text={line.text}
												sayProfile={sayProfile}
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
			if (this.props.onComplete) {
				this.props.onComplete();
			}
		}
	}
}

export default CyberTyper;
