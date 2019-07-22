import React from 'react';
import { Link } from 'react-router-dom'
import { fetchAlbums } from '../reducers/albums/Actions'
import { connect } from 'react-redux'
import { If, Then, Else } from 'react-if'
import debounce from 'lodash.debounce'
import clearStr from '../util/clearStr';

class Home extends React.Component {
	constructor() {
		super();
		this.state = {
			searchHistory: {},
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


	componentWillMount() {
		let searchHistory = {}
		let stringSearch = localStorage.getItem('searchHistory')
		if (typeof stringSearch === 'string'){
			searchHistory = JSON.parse(stringSearch)
			let newState = { ...this.state }
			newState.searchHistory = searchHistory
			this.setState(newState)
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
					let ArtistName = clearStr( item.album.artists[0].name )
					if (searchHistory[ArtistName] === undefined){
						searchHistory[ArtistName] = {
							Id: item.album.artists[0].id,
							Name: item.album.artists[0].name ,
							Image: item.album.images[0].url,
							Albums: {}
						}
					}
					let AlbumName = clearStr( item.album.name )
					if (searchHistory[ArtistName]['Albums'][AlbumName] === undefined){
						searchHistory[ArtistName]['Albums'][AlbumName] = {
							Id: item.album.id,
							Name: item.album.name,
							TotalTracks: item.album.total_tracks,
							Image: item.album.images[0].url,
							ArtistName: item.album.artists[0].name
						}
					}		
				}
				newState.history = searchHistory
				console.log(searchHistory)
				localStorage.setItem('searchHistory', JSON.stringify(searchHistory) )
			}
			newState.tracks = { ...newState.tracks, ...nextProps.items.tracks }
			this.setState(newState)     
		}
	}
	renderAlbums(){
		// debugger
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
			// debugger
			renderList.push(
				<div key={ j }>
					<div className="album-info">
						<Link to={`/albums/${ clearStr(item.artistName) }/${ clearStr(item.albumName) }`}>
							<img className="album-image" src={ item.img.url } alt={ item.artistName }/>
						</Link>                     
						<p className="album-title"><Link className="link" to={`/albums/${ clearStr(item.artistName) }/${ clearStr(item.albumName) }`}>{ item.albumName }</Link></p>
						<p className="album-artist"><Link className="link" to={`/albums/${ clearStr(item.artistName) }`}>{ item.artistName }</Link></p>
						<p className="album-counter">{ item.totalTracks }</p>
					</div>
				</div>
			)           
		}

		return (
			<div className="wrapper">
				{ renderList }
			</div>
		)
	}
	renderSearchHistory(){
		let Rets = []
		if (( typeof this.state.searchHistory === 'object') && (this.state.searchHistory !== null)){
			for (let Art in this.state.searchHistory){

				let Artist = this.state.searchHistory[Art]
				let Albums = []
				for (let Alb in Artist.Albums){
					let Album = Artist.Albums[Alb]
					Albums.push(
						<div key={ Alb } className="album-info">
							<Link to={`/albums/${Art}/${Alb}`}>
								<img className="album-image" src={ Album.Image } alt={ Artist.Name }/>
							</Link>                     
							<p className="album-title"><Link className="link" to={`/albums/${Art}/${Alb}`}>{ Album.Name }</Link></p>
							<p className="album-artist"><Link className="link" to={`/albums/${Art}`}>{ Artist.Name }</Link></p>
							<p className="album-counter">{ Artist.TotalTracks }</p>
						</div>
					)
				}
				Rets.push(
					<div key={ Art } >
						<h1>Buscas recentes</h1>
						<div className="wrapper" >
							
							{ Albums }
						</div>
					</div>
				)
			}
		}
		return (
			<div className="container">
				{ Rets }
			</div>
		)		
	}
	onSubmit(e){
		e.preventDefault()
	}
	render() {
		const albumsItems = this.renderAlbums()
		return (
			<div>
				<div>
					<form id="search-form" onSubmit={ this.onSubmit } className="form-wrapper">
						<input value={ this.state.value } className="form-input" type="text" placeholder="Comece a escrever..."  onChange={ this.handleChange } />
					</form>
				</div>
				<If condition={ this.state.tracks.items.length > 0 }>
					<Then>
						<div className="container">
							<h1>Lista de Albuns</h1>
							{albumsItems}       
						</div>            
					</Then>
				</If>
				<div className="search-history"> 
					{this.renderSearchHistory()}
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
export default connect(mapStateToProps, { fetchAlbums })(Home);