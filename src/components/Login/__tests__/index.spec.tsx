import {shallow} from 'enzyme';
import React from 'react';

import {Login} from '../index';

const setup = () => {
    const getWrapperShallow = shallow(<Login />);

    return {
        getWrapperShallow
    }
};


describe('<Login/>', () => {
    it('should render properly', () => {
        const wrapper = setup().getWrapperShallow;
        expect(wrapper.exists()).toBeTruthy();
    });
});