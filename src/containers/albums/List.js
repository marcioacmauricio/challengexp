import React from 'react';
import { Link } from 'react-router-dom'
import { fetchAlbums } from '../../reducers/albums/Actions'
import { connect } from 'react-redux'
import { If, Then, Else } from 'react-if'
import debounce from 'lodash.debounce'
import inflection from 'inflection'

class albumsList extends React.Component {
	constructor() {
		super();
		this.state = {
			history: {},
			query: "",
			item: {},
			tracks: {
				href: "",
				items: [],
				limit: 10,
				next: "",
				previous: "",
				offset: 0,
				total: 0
			}
		};
		this.items = true
		this.debouncedHandleChange = debounce(this.debouncedHandleChange, 500)

	}
	handleChange = (event) => {
		this.debouncedHandleChange(event.target)
		let newState = { ...this.state }
		newState.query = event.target.value
		this.setState(newState)
	} 
	debouncedHandleChange = (target) => {
		let term = "" 
		if (target.value !== ""){
			term = target.value
		}
		if (term.length > 2){
			let Post = {
				q: target.value,
				type: 'track',
				limit: 10,
				offset: 0
			}
			this.props.fetchAlbums( Post )
		}
	}   

	componentWillReceiveProps(nextProps) {
		if ( (typeof nextProps.items === 'object') && (typeof nextProps.items !== null) ){
			let newState = { ...this.state }
			let searchHistory = {}
			let strHistory = localStorage.getItem('searchHistory')
			if (typeof strHistory === 'string'){
				searchHistory = JSON.parse(strHistory)
			}
			if (typeof nextProps.items.tracks.items === 'object'){
				for (let i in nextProps.items.tracks.items){
					let item = nextProps.items.tracks.items[i]
					let ArtistName = inflection.dasherize( item.album.artists[0].name )
					if (searchHistory[ArtistName] === undefined){
						searchHistory[ArtistName] = {
							Id: item.album.artists[0].id,
							Name: item.album.artists[0].name ,
							Image: item.album.images[0].url,
							Albums: {}
						}
					}
					let AlbumName = inflection.dasherize( item.album.name )
					if (searchHistory[ArtistName]['Albums'][AlbumName] === undefined){
						searchHistory[ArtistName]['Albums'][AlbumName] = {
							Id: item.album.id,
							Name: item.album.total_tracks,
							TotalTracks: item.album.total_tracks,
							Image: item.album.images[0].url
						}
					}		
				}
				newState.history = searchHistory
				console.log(searchHistory)
				localStorage.setItem('history', JSON.stringify(searchHistory) )
			}
			newState.tracks = { ...newState.tracks, ...nextProps.items.tracks }
			this.setState(newState)     
		}
	}
	renderAlbums(){
		let renderList = []
		let items = {}
		for (let i in this.state.tracks.items){
			let Track = this.state.tracks.items[i]
			let Artists = Track.album.artists
			let Artist = Artists[0]
			items[ Track.album.id ] = {
				img: Track.album.images[0],
				artistName: Artist.name,
				albumName: Track.album.name,
				totalTracks: Track.album.total_tracks
			}
		}

		for (let j in items){
			let item = items[j]
			renderList.push(
				<div key={ j }>
					<div id="album-info" className="album-info">
						<Link to={`/albums/${j}`}>
							<img className="album-image" src={ item.img.url } alt={ item.artistName }/>
						</Link>                     
						<p className="album-title">{ item.albumName }</p>
						<p className="album-artist">{ item.artistName }</p>
						<p className="album-counter">{ item.totalTracks }</p>
					</div>
				</div>
			)           
		}

		return renderList
	}

	render() {
		const albumsItems = this.renderAlbums()
		return (
			<div>

				<div>
					<form id="search-form" className="form-wrapper">
						<input value={ this.state.value } className="form-input" type="text" placeholder="Compece a escrever..."  onChange={ this.handleChange } />
					</form>
				</div>
				<If condition={ this.state.tracks.items.length > 0 }>
					<Then>
						<h1>Lista de Albuns</h1>
						{albumsItems}                   
					</Then>
					<Else>
						<h1>Pesquise sua banda favorita</h1>
					</Else>
				</If>
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