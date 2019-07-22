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
			Album: {}
		};
		this.audio = null
		this.preview = null
		this.onClickTrack = this.onClickTrack.bind(this)
		this.ArtistName = ""
		this.AlbumName = ""	
		this.searchHistory = {}	
	}
	componentWillMount() {


		if (typeof this.props.match.params.artist === 'string'){
			this.ArtistName = this.props.match.params.artist
		}
		if (typeof this.props.match.params.id === 'string'){
			this.AlbumName = this.props.match.params.id
		}
		if ((this.ArtistName !== "") && (this.AlbumName !== "")){
			let stringSearch = localStorage.getItem('searchHistory')
			if (typeof stringSearch === 'string'){
				this.searchHistory = JSON.parse(stringSearch)
				let Album = this.searchHistory[this.ArtistName].Albums[this.AlbumName]
				// debugger
				if (Album['Tracks'] === undefined){
					this.props.readAlbums({ id: Album.Id })
				}
				let newState = { ...this.state }
				newState.Album = Album
				this.setState(newState)
			}				
		}		

	}
	componentWillReceiveProps(nextProps) {
		if ( (typeof nextProps.item.tracks === 'object') && (nextProps.item.tracks !== null)){
			let Tracks = []
			for (let i in nextProps.item.tracks.items){
				let Track = nextProps.item.tracks.items[i]
				Tracks.push({
					Id: Track.id,
					Name: Track.name,
					Number: Track.track_number,
					TimeDuration: convertToHumanTime(Track.duration_ms),
					Previw: Track.preview_url
				})
			}
			let newState = { ...this.state }
			newState.Album.Tracks = Tracks
			this.searchHistory[this.ArtistName].Albums[this.AlbumName] = newState.Album
			localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory))
			this.setState(newState)
		}
	}	
	onClickTrack(e){
		// debugger
		let dataTrackPreview = e.target.getAttribute('data-track-preview')
		if (typeof dataTrackPreview === 'string'){
			if (this.preview !== dataTrackPreview){
				this.preview = dataTrackPreview
				if (this.audio !== null){
					this.audio.pause()
				}
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
		// debugger
		let tracks = []
		if ( (typeof this.state.Album.Tracks === 'object') && (this.state.Album.Tracks !== null) ){
			tracks = this.state.Album.Tracks
		}
		let returnList = []
		for (let i in tracks){
			let track = tracks[i]
			// debugger
			returnList.push(
				<div key={i} className="music" onClick={ this.onClickTrack }>
					<p className="music-number">{ track.Number }</p>
					<If condition={ typeof track.Previw === 'string'}>
						<Then>
							<p className="music-preview">
								<img className="preview-image" data-track-id={ track.Id } data-track-preview={ track.Previw } src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEIAAABDCAYAAAAoCNNNAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3NpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NDkxMSwgMjAxMy8xMC8yOS0xMTo0NzoxNiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo4YjUwNDczYS05NjU3LTRlMTEtYWJhMS1lMmQ3MjEwYzUyN2IiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RUREODJEODBERUMzMTFFM0E0NEZBNjk1NEQwMTVGRDIiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RUREODJEN0ZERUMzMTFFM0E0NEZBNjk1NEQwMTVGRDIiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OGI1MDQ3M2EtOTY1Ny00ZTExLWFiYTEtZTJkNzIxMGM1MjdiIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjhiNTA0NzNhLTk2NTctNGUxMS1hYmExLWUyZDcyMTBjNTI3YiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PtHOPm0AAAQtSURBVHja7FtLTxRBEB4mG70aXDGcXScoR2UNcDasMf6AHePjDCTCXdf4+AEaQc+SuJyNGOFsxPC4mkXFs0ENiSeDGNaqUBOLsWemd+jHDEwlX2aMy0zXN1XdX1d3d7Xbbacwx+kqiCiIsEJEFVCjazdgMOH37wGbgGXAPF1zSwQ67gPqgNI+n/UHMAtoEjGZJ8IF3AbcETj/DbBCX3eZvjgaNqCL/a6bIgcxAOgRkPIA8BCwo6zlSIQCuIAGYLu911qAcUB5H8/26Bmt0LO36Z1KfFDxkJqAgBlywFEMj54dJmTEJhEYBXMCAsoaCAijLCBkzgYRXigKWpoiQKYdrVB0eKaI8EMkNCwQEEYjRIavmwg/9MJqBkgIUA19IF8XEXX2kg1LqSCTKhtpyJDVETimL9H9GqBf6Riu1lDLfAD00b8vyChTGSI8enCJxEwv4EfGpw5lwFdq82/6cOtJ7CXZS0ZCfw5IcKiN/dTmI4BXMmEUZw0WYjcAn3I0ocS2Xqf7PvIllcT2VIkVy+Ciz0vTWS7SdBnD62jKznEMcBwwxSZZNjrPX5QiOL0f6iQiqmnH4xjNYVN48bZUO9ERi0wvqFB7XH/YEmGBvlgU/b8boRmCCtKk4jDtIT0yIzliqbTAl0HyMXHUGGeFlKamRl0DbLF3mbAm+eSI3isiok7XKc0NQ23yhDplzxAZ0yEfI4mosRLbM0ONw1D9CHhkIF2eso9QiyOizuYTphXkLZLFNc2Kc43u/aSIQFuwNOZjZ/qG0qWs6R2BbyNRRLisYtx07Bqmy/dEWZy+0wxId0VEnGf3qxmZL9wDbIiGu33YqshnTkSFrRtkqdYQaI85RZ3pDvmIdiqOiJWMziYvK9QegY+nO6lHZMkC7dFSnC65I8Jh9YUlWhJUTkQlh4RcSvl3m3FErOeQiLQr490HJTVQHUpVpw9qH4HD3l3AGUfx5pGSIDUGMkrCa8BNRXOgwMfPcUSUKFKyIqqwhnBFYQS4zO8votTgLzqXERIwDXoVp4FwKuEK2Ee7apkArDafANzXEJk+83UnigjhFNVwZ4gfYUhjPeSiqNTgRkxR+zTWA6LssbO7fqKzBIA+naX7F3FEzLOZ2ahhTTBhoIMeZZG3kKQjZuk6ZiANxnVoghgbC/kYS8QUqwP4GjUBpsG0wdTznX8VuP8r9BGrQu+Kla5dm1QQFesCTXDSYBpERcOE6AemVsOfOvY2mODH3iI12fFq+KHbH9FJnvs5JMGX3Q8qs5msRQIr2EOVl+1DfBPcGg3TkSZDRIXIyOuuOqk2u5K9/zCbor/NOAkutTGYag9LfbiU+Xbgdt4We7GL3fnFeQ0jJ3ieWz7B4xZnujJwuE3mlF9F4yk/V4UPWTn3+RNwjC3HGT/3WZwENkAEt0N9NjxXVhBRELHX/gowAA4L/93bPl/IAAAAAElFTkSuQmCC" />
							</p>
						</Then>
						<Else>
							<p className="music-preview">
								<img className="preview-image-deny" src="data:image/png;base64,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Lm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICAgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIgogICB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkVERDgyRDgwREVDMzExRTNBNDRGQTY5NTREMDE1RkQyIgogICB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjhkMTNhY2RmLWJmZGEtNDYyNS1iMzAzLTA2NDUzZDRiNGU5ZSIKICAgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjhiNTA0NzNhLTk2NTctNGUxMS1hYmExLWUyZDcyMTBjNTI3YiIKICAgR0lNUDpBUEk9IjIuMCIKICAgR0lNUDpQbGF0Zm9ybT0iTGludXgiCiAgIEdJTVA6VGltZVN0YW1wPSIxNTYzNzA0Nzk5NzI3NDYyIgogICBHSU1QOlZlcnNpb249IjIuMTAuMTAiCiAgIGRjOkZvcm1hdD0iaW1hZ2UvcG5nIgogICB4bXA6Q3JlYXRvclRvb2w9IkdJTVAgMi4xMCI+CiAgIDxpcHRjRXh0OkxvY2F0aW9uQ3JlYXRlZD4KICAgIDxyZGY6QmFnLz4KICAgPC9pcHRjRXh0OkxvY2F0aW9uQ3JlYXRlZD4KICAgPGlwdGNFeHQ6TG9jYXRpb25TaG93bj4KICAgIDxyZGY6QmFnLz4KICAgPC9pcHRjRXh0OkxvY2F0aW9uU2hvd24+CiAgIDxpcHRjRXh0OkFydHdvcmtPck9iamVjdD4KICAgIDxyZGY6QmFnLz4KICAgPC9pcHRjRXh0OkFydHdvcmtPck9iamVjdD4KICAgPGlwdGNFeHQ6UmVnaXN0cnlJZD4KICAgIDxyZGY6QmFnLz4KICAgPC9pcHRjRXh0OlJlZ2lzdHJ5SWQ+CiAgIDx4bXBNTTpIaXN0b3J5PgogICAgPHJkZjpTZXE+CiAgICAgPHJkZjpsaQogICAgICBzdEV2dDphY3Rpb249InNhdmVkIgogICAgICBzdEV2dDpjaGFuZ2VkPSIvIgogICAgICBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjYzZjJkZmM5LWVkOGMtNGNhYi05YTEzLTI0YjE1MDg5ZTRiZiIKICAgICAgc3RFdnQ6c29mdHdhcmVBZ2VudD0iR2ltcCAyLjEwIChMaW51eCkiCiAgICAgIHN0RXZ0OndoZW49Ii0wMzowMCIvPgogICAgPC9yZGY6U2VxPgogICA8L3htcE1NOkhpc3Rvcnk+CiAgIDx4bXBNTTpEZXJpdmVkRnJvbQogICAgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo4YjUwNDczYS05NjU3LTRlMTEtYWJhMS1lMmQ3MjEwYzUyN2IiCiAgICBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjhiNTA0NzNhLTk2NTctNGUxMS1hYmExLWUyZDcyMTBjNTI3YiIvPgogICA8cGx1czpJbWFnZVN1cHBsaWVyPgogICAgPHJkZjpTZXEvPgogICA8L3BsdXM6SW1hZ2VTdXBwbGllcj4KICAgPHBsdXM6SW1hZ2VDcmVhdG9yPgogICAgPHJkZjpTZXEvPgogICA8L3BsdXM6SW1hZ2VDcmVhdG9yPgogICA8cGx1czpDb3B5cmlnaHRPd25lcj4KICAgIDxyZGY6U2VxLz4KICAgPC9wbHVzOkNvcHlyaWdodE93bmVyPgogICA8cGx1czpMaWNlbnNvcj4KICAgIDxyZGY6U2VxLz4KICAgPC9wbHVzOkxpY2Vuc29yPgogIDwvcmRmOkRlc2NyaXB0aW9uPgogPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgIAo8P3hwYWNrZXQgZW5kPSJ3Ij8+J9XroQAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+MHFQoaJ5FTclcAAAQ9SURBVHja7ZxPaxRJFMB/6Z2LNw1jQMGT45A9eHLSol7VjIiXvaW97N2AX2AdQf0Aghev5qBfIKLudTFizM3DCOueRZHIrqCEZOd5sBoqTc1Md8+r/qP9oJiB9HTV+/Wr6np/KnMiQiMQNAgaEPukVVA/IdA3n/PAmSnXvwC2gU3gqfn0KnMe14g+EAErCsD3gEfAQwOm8iAC4A/ghkP5D8Ar83Q3zRMHEGDOum7eWE4ILAELDii3gTvASG3kIqLRAhEZiMiu7JehiKyKSHuGe3fNPYaJe++aPlV00LhJ3wFgzSiAcuuaeyeBLJcJIhCRdQeAtgcAydZ2AFkvA0Q3YQVDTxaQZhzDhHV0iwIRJSAMSgCQbIMEjMg3iCjRYVgBCHELHWuVFxArVgfvS5oK09pvIjKyxhlpgwgT60FQQQg9Edk2Y9yzxhtqgbAXxt2C3gqzQNgWkfPWmHdEpKMBYjjrilwwhJ7jAQ5nBTHIM98qAMG1rg3yguhqbVZKghA3e9PXzQNiw5oSeRfHa+ZJzJcEId4B75hrN7KCCBWmROTJQcoCwTWWMAuIDWu/oLHbs/cfYcEQ4vZ+klX4soZxIGznLCgQwlSrcP1gTcEapoGIp8tqQRCSVrGWBkT87r3hGYRYptotAII9pt1pIPrWANsFgYjlrmO6aEKI4xix9O2/JcP5K+bzDfCx4Ij6deCdCfoC9IA/gUPAJ+AisDVjHx+NbpjA8thwfjyIZyWlFxaAJ8Br4BhwUBEClm6LwPK4BE9gRYwflpxvOWkgfFWGYOu2YOtvg+hZ37eohhwAHpvQvpZsuXS2QXSsvMGI6sgC8BJYV0pRjoyOAMcngXhV0fTkZWAHWFW4V6zjibomgVvAPWCoPF1qmw1fNNNlyQeITg2BXMr5u+1JIN7WEETezPj8jzI13gCnNesm6gZiD7gJ/KpdPNJyTI2likJ4DPyu5APFOv49CUTLWEpVNlUfgCuKFhBYev/jmhp2R6cqAuEmcER5GjhdicBBH+BqyQBeAIeBWx4sM7J0HY0DEbvfywodHs25GF4FznqMh1xwhho8Rah6IvJFIULlo9ImluW0McuBQsg9jQwLrLNIHbOcNYptQ/iSIop9reA0YaYodt68RjLQen8ChPUSaiwy5zUQkecZrcIVbfaR6dKwhg3xlPscF3KPEhDKLDrLnftMmw2flneIs+FlVtkE1gsgczY8TX2EdvLFV5u5PmJSxUxdIEQaFTPjaqjqAiFTDVWaYwodEyxtAf8Dnz1loDSlzff0Ycts249M27KnCcy8Bc6Z77/UAEIA/GW52ufS+C1pI1SbCY9UgP8qCKFrLGHR8qLTufA/cC12pmqfpjq/Oa/h9wTPg5JP8OR25JozXYog0pzy68yo/KRTfirufFXOff5r9idxOq7wc5/NSeACQNjyU58Nr5U0/zahAbFfvgE6BBbphFfboQAAAABJRU5ErkJggg==" />
							</p>
						</Else>
					</If>					
					<p className="music-title">{ track.Name }</p>
					<p data-track-id={ track.Id } className="music-duration">{ track.TimeDuration }</p>
				</div>
			)			
		}
		return returnList
		return []
	}

	render() {
		return (
			<div>
				<div className="container-inner">
					<div id="album-info" className="album-info">
						<img className="album-image" src={ this.state.Album.Image } alt={ this.state.Album.Name }/>
						<p className="album-title">{ this.state.Album.Name }</p>
						<p className="album-artist">{ this.state.Album.ArtistName }</p>
						<p className="album-counter">{ this.state.Album.TotalTracks} Músicas</p>
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