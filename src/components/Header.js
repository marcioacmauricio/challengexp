import React from 'react';
import { Link } from 'react-router-dom';
import { If, Then, Else } from 'react-if'
import { getCredentials } from '../auth/getCredentials'

export default class Header extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			artist: "",
			isAutenticated: false
		};
		this.setToken = this.setToken.bind(this)
		this.exit = this.exit.bind(this)
		this.receiveMessage = this.receiveMessage.bind(this)
		this.checkAutenticate = this.checkAutenticate.bind(this)		
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

	exit(e){
		localStorage.removeItem('credentials')
		let newState = { ...this.state }
		newState.isAutenticated = false
		this.setState( newState )		
	}
	setToken(e){
		debugger
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
	receiveMessage = async function(Message) {
		if(typeof Message.data === 'string'){
			let setValue = await localStorage.setItem('credentials', Message.data); 
			let newState = { ...this.state }
			newState.isAutenticated = true
			this.setState( newState )			
		}
	}
	checkAutenticate = async function() {
		let credentials = await getCredentials()
		if (credentials){
			let newState = { ...this.state }
			newState.isAutenticated = true
			this.setState( newState )
		}
	}	

	componentWillReceiveProps(nextProps) {
		debugger
	}
	render() {
		return (
			<div>
				<header className="aside-header">
					<a className="aside-link" href="/">
						<svg className="aside-icon" viewBox="0 0 167.5 167.5">
							<title>Spotify</title>
							<path fill="currentColor" d="M83.7 0C37.5 0 0 37.5 0 83.7c0 46.3 37.5 83.7 83.7 83.7 46.3 0 83.7-37.5 83.7-83.7S130 0 83.7 0zM122 120.8c-1.4 2.5-4.6 3.2-7 1.7-19.8-12-44.5-14.7-73.7-8-2.8.5-5.6-1.2-6.2-4-.2-2.8 1.5-5.6 4-6.2 32-7.3 59.6-4.2 81.6 9.3 2.6 1.5 3.4 4.7 1.8 7.2zM132.5 98c-2 3-6 4-9 2.2-22.5-14-56.8-18-83.4-9.8-3.2 1-7-1-8-4.3s1-7 4.6-8c30.4-9 68.2-4.5 94 11 3 2 4 6 2 9zm1-23.8c-27-16-71.6-17.5-97.4-9.7-4 1.3-8.2-1-9.5-5.2-1.3-4 1-8.5 5.2-9.8 29.6-9 78.8-7.2 109.8 11.2 3.7 2.2 5 7 2.7 10.7-2 3.8-7 5-10.6 2.8z"></path>
						</svg>
						<h1 className="aside-title">React Spotify Player</h1>
					</a>
					<If condition={ this.state.isAutenticated }>
						<Then>
							<span onClick={ this.exit } className="input-login">Sair</span>			
						</Then>
						<Else>
							<span onClick={ this.setToken } className="input-login">Login</span>
						</Else>
					</If>					
				</header>
				<div>

					<If condition={ this.state.isAutenticated }>
						<Then>
							<div>
								{this.props.children}
							</div>	
						</Then>
						<Else>
							Autentique-se para pesquisar sua música!
						</Else>
					</If>						
				</div>
			</div>
		);
	}
}
