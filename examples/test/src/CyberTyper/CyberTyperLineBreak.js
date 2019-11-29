import React, {Component} from 'react';

class CyberTyperLineBreak extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			done: false
		};
	}
	
	componentDidMount() {
		this.props.onStart();
		if (this.props.onstarted) this.props.onstarted();
		
		this.setState({
			done: true
		}, () => {
			console.log('done');
			this.props.onEnd();
			if (this.props.onended) this.props.onended();
		});
	}
	
	render() {
		let c;
		if (!this.props.cursor || this.state.done) {
			c = (<br/>);
		}
		else {
			c = this.renderCursor();
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
