import React from 'react'
import { Link } from 'react-router-dom'
import { readAlbums } from '../../reducers/albums/Actions'
import { connect } from 'react-redux'
import convertToHumanTime from '../../util/convertToHumanTime';
import { If, Then, Else } from 'react-if'

class albumsView extends React.Component {
	constructor() {
		super();
		this.state = {
			albumId: "",
			track: {},
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
		this.audio = null
		this.preview = null
		this.onClickTrack = this.onClickTrack.bind(this)
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
		if ( (typeof nextProps.track === 'object') && (typeof nextProps.track !== null)){
			console.log(nextProps.track.preview_url)
			// debugger
		}
	}	
	onClickTrack(e){
		let dataTrackPreview = e.target.getAttribute('data-track-preview')
		if (typeof dataTrackPreview === 'string'){
			if (this.preview !== dataTrackPreview){
				this.preview = dataTrackPreview
				this.audio = new Audio(dataTrackPreview)
				this.audio.play()
				e.target.classList.add('active')
			} else {
				if (e.target.classList.contains('active')){
					e.target.classList.remove('active')
					this.audio.pause()
				} else {
					this.audio.play()
					e.target.classList.add('active');
				}
			}			
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
				<div key={i} className="music" onClick={ this.onClickTrack }>
					<p className="music-number">{ track.track_number }</p>
					<p className="music-title">{ track.name }</p>
					<If condition={typeof typeof track.preview_url === 'string'}>
						<Then>
							<p className="music-preview">
								<img className="preview-image" data-track-preview={ track.preview_url } src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEIAAABDCAYAAAAoCNNNAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3NpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NDkxMSwgMjAxMy8xMC8yOS0xMTo0NzoxNiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo4YjUwNDczYS05NjU3LTRlMTEtYWJhMS1lMmQ3MjEwYzUyN2IiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RUREODJEODBERUMzMTFFM0E0NEZBNjk1NEQwMTVGRDIiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RUREODJEN0ZERUMzMTFFM0E0NEZBNjk1NEQwMTVGRDIiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OGI1MDQ3M2EtOTY1Ny00ZTExLWFiYTEtZTJkNzIxMGM1MjdiIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjhiNTA0NzNhLTk2NTctNGUxMS1hYmExLWUyZDcyMTBjNTI3YiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PtHOPm0AAAQtSURBVHja7FtLTxRBEB4mG70aXDGcXScoR2UNcDasMf6AHePjDCTCXdf4+AEaQc+SuJyNGOFsxPC4mkXFs0ENiSeDGNaqUBOLsWemd+jHDEwlX2aMy0zXN1XdX1d3d7Xbbacwx+kqiCiIsEJEFVCjazdgMOH37wGbgGXAPF1zSwQ67gPqgNI+n/UHMAtoEjGZJ8IF3AbcETj/DbBCX3eZvjgaNqCL/a6bIgcxAOgRkPIA8BCwo6zlSIQCuIAGYLu911qAcUB5H8/26Bmt0LO36Z1KfFDxkJqAgBlywFEMj54dJmTEJhEYBXMCAsoaCAijLCBkzgYRXigKWpoiQKYdrVB0eKaI8EMkNCwQEEYjRIavmwg/9MJqBkgIUA19IF8XEXX2kg1LqSCTKhtpyJDVETimL9H9GqBf6Riu1lDLfAD00b8vyChTGSI8enCJxEwv4EfGpw5lwFdq82/6cOtJ7CXZS0ZCfw5IcKiN/dTmI4BXMmEUZw0WYjcAn3I0ocS2Xqf7PvIllcT2VIkVy+Ciz0vTWS7SdBnD62jKznEMcBwwxSZZNjrPX5QiOL0f6iQiqmnH4xjNYVN48bZUO9ERi0wvqFB7XH/YEmGBvlgU/b8boRmCCtKk4jDtIT0yIzliqbTAl0HyMXHUGGeFlKamRl0DbLF3mbAm+eSI3isiok7XKc0NQ23yhDplzxAZ0yEfI4mosRLbM0ONw1D9CHhkIF2eso9QiyOizuYTphXkLZLFNc2Kc43u/aSIQFuwNOZjZ/qG0qWs6R2BbyNRRLisYtx07Bqmy/dEWZy+0wxId0VEnGf3qxmZL9wDbIiGu33YqshnTkSFrRtkqdYQaI85RZ3pDvmIdiqOiJWMziYvK9QegY+nO6lHZMkC7dFSnC65I8Jh9YUlWhJUTkQlh4RcSvl3m3FErOeQiLQr490HJTVQHUpVpw9qH4HD3l3AGUfx5pGSIDUGMkrCa8BNRXOgwMfPcUSUKFKyIqqwhnBFYQS4zO8votTgLzqXERIwDXoVp4FwKuEK2Ee7apkArDafANzXEJk+83UnigjhFNVwZ4gfYUhjPeSiqNTgRkxR+zTWA6LssbO7fqKzBIA+naX7F3FEzLOZ2ahhTTBhoIMeZZG3kKQjZuk6ZiANxnVoghgbC/kYS8QUqwP4GjUBpsG0wdTznX8VuP8r9BGrQu+Kla5dm1QQFesCTXDSYBpERcOE6AemVsOfOvY2mODH3iI12fFq+KHbH9FJnvs5JMGX3Q8qs5msRQIr2EOVl+1DfBPcGg3TkSZDRIXIyOuuOqk2u5K9/zCbor/NOAkutTGYag9LfbiU+Xbgdt4We7GL3fnFeQ0jJ3ieWz7B4xZnujJwuE3mlF9F4yk/V4UPWTn3+RNwjC3HGT/3WZwENkAEt0N9NjxXVhBRELHX/gowAA4L/93bPl/IAAAAAElFTkSuQmCC" />
							</p>
						</Then>
						<Else>
							<p data-track-id={ track.id } className="music-preview">No preview</p>
						</Else>
					</If>					
					<p data-track-id={ track.id } className="music-duration">{convertToHumanTime(track.duration_ms)}</p>
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
		items: state.albumsReducer.items,
		track: state.tracksReducer.item
	}
	
}
export default connect(mapStateToProps, { readAlbums })(albumsView);