import React, {Component} from 'react';

class CyberTyperLineBreak extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			done: false
		};
	}
	
	componentDidMount() {
		this.props.onStart(() => {
			this.setState({
				done: true
			}, () => {
				console.log('done');
				this.props.onEnd();
				// if (this.props.onended) this.props.onended();
			});
		});
	}
	
	render() {
		let c;
		if (!this.props.cursor || this.state.done) {
			c = (<br/>);
		}
		else {
			c = (<span>{'&nbsp'}{this.renderCursor()}</span>);
		}
		return (<div className="CyberTyperLineBreak">
			{ c }
		</div>);
	}
	
	renderCursor() {
		return (<div className="CyberTyperLineCursor" />);
	}
}

export default CyberTyperLineBreak;
