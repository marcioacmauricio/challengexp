import React from 'react';
import { Link } from 'react-router-dom'
import { fetchAlbums } from '../../reducers/albums/Actions'
import { connect } from 'react-redux'
class albumsList extends React.Component {
	constructor() {
		super();

		this.state = {items:[]};
		this.items = true
	}

	componentWillMount() {
		// this.props.fetchAlbums();		
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.items){
			this.setState({items:Object.values(nextProps.items)})		
		}
	}
	render() {
		const albumsItems = this.state.items.map(item => {
				return <Link className="link" to={`albums/${item.id}`}>{item.id}</Link>
			});
		return (
			<div>
				<h1>Lista de Albuns</h1>
				{albumsItems}
				<Link className="link" to="/">Home</Link>
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
export default connect(mapStateToProps, { fetchAlbums })(albumsList);