import React from 'react';
import { Link } from 'react-router-dom';

export default class Header extends React.Component {
	constructor(props) {
		super(props);
		this.toggle = this.toggle.bind(this);
		this.state = {
			isOpen: false
		};
	}
	toggle() {
		this.setState({
			isOpen: !this.state.isOpen
		});
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
				</header>

				<div>

					<div>
						<div>
							<form id="search-form" className="form-wrapper">
								<input id="search-input" className="form-input" type="text" name="query" placeholder="Type an artist/album" />
							</form>
						</div>
						<div>
							{this.props.children}
						</div>
						
					</div>
				</div>
			</div>
		);
	}
}