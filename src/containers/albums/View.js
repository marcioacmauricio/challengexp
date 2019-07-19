import React from 'react'
import { Link } from 'react-router-dom'
import { readAlbums } from '../../reducers/albums/Actions'
import { connect } from 'react-redux'
class albumsView extends React.Component {
	constructor() {
		super();

		this.state = {
			id: 0,
			title: '',
			description: ''
		};
	}
	componentWillMount() {
		if (this.props.match.params.id > 0){
			this.props.readAlbums(this.props.match.params.id);
		}		
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.item.id > 0){
			this.setState(nextProps.item)
		}
	}	
	render() {
		return (
			<div>
				<div>
					<div>Album</div>
						<div>
							<div>{this.state.title}</div>
							<div>{this.state.description}</div>
						</div>
					<div><Link className="link" to='/albums'>Lista</Link></div>
				</div>
			</div>
		);
	}
}
const mapStateToProps = (state, props) => {
	return {
		item: state.albumsReducer.item,
		items: state.albumsReducer.items
	}
	
}
export default connect(mapStateToProps, {readAlbums})(albumsView);