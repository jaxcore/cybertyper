import React, {Component} from 'react';
import EventEmitter from 'events';
// import './CyberTyper.css';
import CyberTyperLine from './CyberTyperLine';
import CyberTyperLineBreak from './CyberTyperLineBreak';

class CyberTyper extends Component {
	constructor(props) {
		super(props);
		
		this.events = new EventEmitter();
		
		let script = props.script;
		let processedScript = [];
		script.forEach((line) => {
			if (line.text) {
				if (line.text.forEach) {
					line.text.forEach((t, index) => {
						const s = {
							text: t,
							lineNum: processedScript.length,
							lineClass: line.className,
							displayName: line.displayName
						};
						if (index === 0) {
							if (line.speaker) {
								s.speaker = line.speaker;
							}
						}
						else {
							if (line.speaker) {
								s.speaker = {
									voice: line.speaker.voice,
									className: line.speaker.className,
								};
							}
						}
						
						processedScript.push(s);
					});
				}
				else if (line.text.toString) {
					processedScript.push({
						speaker: line.speaker? line.speaker : null,
						text: line.text.toString(),
						lineClass: line.className,
						name: line.speaker? line.speaker.name : null,
						lineNum: processedScript.length
					});
				}
			}
			if (line.linebreak) {
				if (typeof line.linebreak === 'number') {
					for (let i = 0; i < line.linebreak; i++) {
						processedScript.push({
							linebreak: true,
							lineNum: processedScript.length
						});
					}
				}
				else {
					processedScript.push({
						linebreak: true,
						lineNum: processedScript.length
					});
				}
			}
		});
		
		let hideCursorWhenDone = true;
		if ('hideCursorWhenDone' in props) hideCursorWhenDone = props.hideCursorWhenDone;
		
		this.state = {
			hideCursorWhenDone,
			script: processedScript,
			lines: [],
			progress: 0,
			done: false,
			// started: props.start || false,
			syllableDuration: 300
		};
		
		this.audioCache = {
			playing: null,
			next: null
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
	
	componentDidMount() {
		if (this.props.autostart) {
			this.start();
		}
	}
	
	componentDidUpdate(prevProps, prevState, snapshot) {
		if (snapshot && 'started' in snapshot) {
			if (snapshot.started) {
				this.start();
			}
			else {
				this.stop();
			}
		}
	}
	
	start() {
		this.setState({
			started: true,
		}, () => {
			this.cacheNextAudio(0, (duration) => {
				this.next();
			});
		});
	}
	
	next() {
		// console.log('next');
		
		let progress = this.state.progress + 1;
		let script = this.state.script;
		if (progress <= script.length) {
			const scriptline = script[progress - 1];
			
			const done = () => {
				scriptline.started = true;
				scriptline.lineNum = progress - 1;
				
				let lines = this.state.lines;
				if (progress === 1) lines.push(scriptline);
				
				this.setState({
					lines,
					progress
				});
			};
			
			if (scriptline.linebreak) {
				done();
			}
			else if (scriptline.text) {
				if (scriptline.speaker && scriptline.voice) {
					if (scriptline.cached) {
						done();
					}
					else {
						console.log('waiting for audio cache', scriptline);
						this.events.once('audio-cached-' + scriptline.lineNum, (duration) => {
							done();
						});
					}
				}
				else {
					done();
				}
			}
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
			return (<div className="CyberTyperLineCursor CyberTyperFlashing"/>);
		}
	}
	
	renderLines() {
		if (this.state.started) {
			const lines = this.state.lines;
			
			return lines.map((line, index) => {
				const lineNum = line.lineNum;
				if (line.started) {
					if (line.linebreak) {
						return (<CyberTyperLineBreak key={lineNum}
													 delay={line.delay}
													 onStart={(callback) => {
														 this.onStart(lineNum, line, callback);
													 }}
													 onEnd={() => {
														 this.onEnd(lineNum, line);
													 }}
						/>);
					}
					else {
						return (<CyberTyperLine key={lineNum}
												text={line.text}
												speaker={line.speaker}
												lineClass={line.lineClass}
												displayName={line.displayName}
												name={line.name}
												duration={line.duration}
												delay={line.delay}
												syllableDuration={this.state.syllableDuration}
												// lineBreakDuration={this.props.lineBreakDuration||100}
												onStart={(callback) => {
													this.onStart(lineNum, line, callback);
												}}
												onEnd={() => {
													this.onEnd(lineNum, line);
												}}
						/>);
					}
				}
			});
		}
	}
	
	onStart(index, line, callback) {
		if (line.onstarted) line.onstarted();
		
		if (line.linebreak) {
			this.audioCache.next = null;
			this.cacheNextAudio(index + 1);
			callback();
		}
		else if (line.text) {
			if (!line.speaker || !line.speaker.voice) {
				this.cacheNextAudio(index + 1);
				callback();
			}
			else {
				if (line.cached) {
					if (this.audioCache.next.lineNum === index) {
						this.audioCache.current = this.audioCache.next;
						this.audioCache.next = null;
						this.cacheNextAudio(index + 1);
						this.playCurrentAudio();
						callback();
					}
					else console.log('wrong num', this.audioCache.next);
				}
				else {
					// console.log('audio onStart NOT CACHED wait for', line);
					this.events.once('audio-cached-' + line.lineNum, (duration) => {
						// console.log('audio onStart GOT CACHED', line);
						this.audioCache.current = this.audioCache.next;
						this.audioCache.next = null;
						this.cacheNextAudio(index + 1);
						this.playCurrentAudio();
						callback();
					});
				}
			}
		}
	}
	
	playCurrentAudio() {
		const current = this.audioCache.current;
		const audioContext = this.audioCache.current.audioContext;
		const source = this.audioCache.current.source;
		source.connect(audioContext.destination);
		source.onended = () => {
			audioContext.close();
			if (current.lineEnded) {
				this.next();
			}
			else {
				current.audioEnded = true;
			}
		};
		source.start(0);
	}
	
	cacheNextAudio(nextIndex, callback) {
		
		if (!this.state.script[nextIndex]) {
			console.log('no nextIndex', nextIndex);
			return;
		}
		
		const line = this.state.script[nextIndex];
		const script = this.state.script;
		
		if (line.linebreak) {
			if (callback) callback(null);
			return;
		}
		
		if (line.speaker && !line.speaker.voice) {
			// console.log('NO SPEAKER VOICE');
			if (callback) callback(null);
			return;
		}
		
		const sayOptions = {};
		if (line.speaker && line.speaker.voice) {
			sayOptions.profile = line.speaker.voice;
		}
		else {
			sayOptions.profile = this.props.sayProfile;
		}
		
		this.props.say.getWorkerAudioData(line.text, sayOptions, (audioContext, source) => {
			let duration = source.buffer.duration * 1000;
			
			line.duration = duration;
			line.cached = true;
			
			this.audioCache.next = {
				lineNum: nextIndex,
				audioContext,
				source,
				audioEnded: false
			};
			
			this.setState({
				script
			}, () => {
				this.events.emit('audio-cached-' + line.lineNum, duration);
				if (callback) callback(duration);
			});
		});
	}
	
	onEnd(index, line) {
		let lineBreakDuration = this.props.lineBreakDuration; // || 100;
		
		let progress = this.state.progress + 1;
		const script = this.state.script;
		
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
						
						if (line.onended) line.onended();
						
						if (line.linebreak) {
							this.next();
						}
						else if (line.text) {
							if (line.speaker && line.speaker.voice) {
								if (this.audioCache.current.audioEnded) {
									this.next();
								}
								else {
									// console.log('waiting for audio-ended');
									this.audioCache.current.lineEnded = true;
								}
							}
							else this.next();
						}
					});
				}, delay);
			});
		}
		else {
			this.setState({
				done: true
			}, () => {
				if (line.onended) line.onended();
				
				if (this.props.onComplete) {
					this.props.onComplete();
				}
			});
		}
	}
}

export default CyberTyper;
