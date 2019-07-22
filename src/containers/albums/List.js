import React from 'react';
import { Link } from 'react-router-dom'
import { fetchAlbums } from '../../reducers/albums/Actions'
import { connect } from 'react-redux'
import { If, Then, Else } from 'react-if'
import debounce from 'lodash.debounce'
import clearStr from '../../util/clearStr';

class albumsList extends React.Component {
	constructor() {
		super();
		this.state = {
			artistId: "",
			artist: {}
		};
	}
  


	componentWillMount() {
		let ArtistName = ""
		if (typeof this.props.match.params.artist === 'string'){
			ArtistName = this.props.match.params.artist
		}
		if (ArtistName !== ""){
			let searchHistory = {}
			let stringSearch = localStorage.getItem('searchHistory')
			if (typeof stringSearch === 'string'){
				searchHistory = JSON.parse(stringSearch)

				let newState = { ...this.state }
				newState.artistId = ArtistName
				newState.artist = searchHistory[ArtistName]
				this.setState(newState)
			}				

		}
	}
	renderAlbums(){
		let Albums = []
		for (let i in this.state.artist.Albums){
			let Album = this.state.artist.Albums[i]
			let Artist = this.state.artist
			Albums.push(
				<div key={ i } className="album-info">
					<Link to={`/albums/${ this.state.ArtistName }/${i}`}>
						<img className="album-image" src={ Album.Image } alt={ Artist.Name }/>
					</Link>                     
					<p className="album-title"><Link className="link" to={`/albums/${ this.state.ArtistName }/${i}`}>{ Album.Name }</Link></p>
					<p className="album-artist">{ Artist.Name }</p>
					<p className="album-counter">{ Artist.TotalTracks }</p>
				</div>
			)
		}
		return (
			<div className="container" >
				<div className="wrapper" >
					
					{ Albums }
				</div>
			</div>
		)
	}

	render() {
		return (
			<div>
				<h1>{ this.state.artist.Name }</h1>
				{ this.renderAlbums() }
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