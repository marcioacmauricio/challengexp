import React from 'react'
import { Link } from 'react-router-dom'
import { readAlbums } from '../../reducers/albums/Actions'
import { connect } from 'react-redux'
import convertToHumanTime from '../../util/convertToHumanTime';
class albumsView extends React.Component {
	constructor() {
		super();
		this.state = {
			albumId: "",
			album: {
				album_type: "",
				artists: [{}],
				available_markets: [{}],
				copyrights: [{}],
				external_ids: {},
				external_urls: {},
				genres: [{}],
				href: "",
				id: "",
				images: [{}],
				label: "",
				name: "",
				popularity: 0,
				release_date: "",
				release_date_precision: "",
				total_tracks: 0,
				tracks: {},
				type: "",
				uri: ""
			}
		};
	}
	componentWillMount() {
		if (this.props.match.params.id){
			this.props.readAlbums(this.props.match.params.id);
		}		
	}
	componentWillReceiveProps(nextProps) {
		if ( (typeof nextProps.item === 'object') && (typeof nextProps.item !== null)){
			let newState = { ...this.state }
			newState.album = nextProps.item
			this.setState(newState)
		}
	}	

	renderTracks(){
		let tracks = []
		if ( (typeof this.state.album.tracks.items === 'object') && (this.state.album.tracks.items !== null) ){
			tracks = this.state.album.tracks.items
		}
		let returnList = []
		for (let i in tracks){
			let track = tracks[i]
			returnList.push(
				<div key={i} className="music">
					<p className="music-number">{ track.track_number }</p>
					<p className="music-title">{ track.name }</p>
					<p className="music-duration">{convertToHumanTime(track.duration_ms)}</p>
				</div>
			)			
		}
		return returnList
	}

	render() {
		return (
			<div>
				<div className="container-inner">
					<div id="album-info" className="album-info">
						<img className="album-image" src={ this.state.album.images[0].url } alt={ this.state.album.name }/>
						<p className="album-title">{ this.state.album.name }</p>
						<p className="album-artist">{ this.state.album.artists[0].name }</p>
						<p className="album-counter">{ this.state.album.total_tracks } Músicas</p>
					</div>
					<div id="album-tracks" className="album-musics">
						{this.renderTracks()}
					</div>
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