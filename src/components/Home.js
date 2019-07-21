import React from 'react';
import { Link } from 'react-router-dom';
import { If, Then, Else } from 'react-if'
import { getCredentials } from '../auth/getCredentials'
export default class Home extends React.Component {
	constructor(props) {
		super(props);
		this.state = {		
			isAutenticated: false
		};
		this.setToken = this.setToken.bind(this)
		this.receiveMessage = this.receiveMessage.bind(this)
		this.checkAutenticate = this.checkAutenticate.bind(this)
	}
	receiveMessage = async function(Message) {
		console.log('setItem', Message.data)
		let setValue = await localStorage.setItem('credentials', Message.data); 
		let newState = { ...this.state }
		newState.isAutenticated = true
		this.setState( newState )
	}
	checkAutenticate = async function() {
		let credentials = await getCredentials()
		console.log(credentials)
		if (credentials){
			console.log('checou')
			let newState = { ...this.state }
			newState.isAutenticated = true
			this.setState( newState )
		}
	}	
	setToken(e){
		window.addEventListener("message", this.receiveMessage, false);
		let Scopes = [
			'user-read-private',
			'playlist-read-private',
			'playlist-modify-public',
			'playlist-modify-private',
			'user-library-read',
			'user-library-modify',
			'user-follow-read',
			'user-follow-modify'
		]
		let Params = {
			client_id: "ff86be0df0f94dbbb4ba03082f63342a",
			response_type: "token",
			redirect_uri: "http://localhost:8080/",
			scope: encodeURI(Scopes.join(' '))
		}
		let url = "https://accounts.spotify.com/authorize?" +  Object.keys(Params).map(key => key + '=' + Params[key]).join('&');
		let width = 450, height = 730, left = (screen.width / 2) - (width / 2), top = (screen.height / 2) - (height / 2);	
		let w = window.open(url, 'Spotify', 'menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=' + width + ', height=' + height + ', top=' + top + ', left=' + left );

			
	}
	componentWillMount() {
		let hash = {};
		if (location.hash !== "" ){
			location.hash.replace(/^#\/?/, '').split('&').forEach(function(kv) {
				let spl = kv.indexOf('=');
				if (spl != -1) {
					hash[kv.substring(0, spl)] = decodeURIComponent(kv.substring(spl+1));
				}
			});

			if (hash.access_token) {
				window.opener.postMessage(JSON.stringify({
					type:'access_token',
					access_token: hash.access_token,
					expires_in: new Date().getTime() + ((hash.expires_in || 0) * 1000)
				}), '*');
				window.close();
			}			
		} else {
			this.checkAutenticate()			
		}
	}

	render() {
		console.log(this.state.isAutenticated)
		return (
			<If condition={ this.state.isAutenticated }>
				<Then>
					<Link to="albums" className="input-login">Pesquisar</Link>			
				</Then>
				<Else>
					<span onClick={ this.setToken } className="input-login">Login</span>
				</Else>
			</If>
		);
	}
}
