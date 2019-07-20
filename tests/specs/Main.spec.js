import React from 'react';
import { expect } from 'chai';
import { shallow, configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import Header from '../../src/components/Header'
configure({ adapter: new Adapter() })

describe('Component Hello', () => {
	it('should have h1 to display the Hello', () => {
		const wrapper = shallow(<Header/>)
		console.log(typeof wrapper, wrapper)
		expect(wrapper.find('head')).to.have.length(1);
	});
});
