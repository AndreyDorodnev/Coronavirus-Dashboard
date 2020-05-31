import React from 'react';
import {configure,shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ToggleButton from '../../src/components/ui/ToggleButton';

configure({
    adapter: new Adapter()
});

describe('<ToggleButton/> with no props',()=>{
    let wrapper;
    beforeEach(()=>{
        wrapper = shallow(<ToggleButton/>);
    });

    it('Should render the button',()=>{
        expect(wrapper.find('.toggleButton')).toHaveLength(1);
        expect(wrapper.find('.border')).toHaveLength(1);
        expect(wrapper.find('.button')).toHaveLength(1);
        expect(wrapper.find('.active')).toHaveLength(0);
        expect(wrapper.find('span')).toHaveLength(1);
    });

    it('Should do nothing on click',()=>{
        wrapper.find('.border').simulate('click');
        expect(wrapper.find('.active')).toHaveLength(0);
    });

});

describe('<ToggleButton/> with  props',()=>{
    const initialProps = {
        buttonClick: jest.fn(),
        active: true,
        text: 'text'
    }
    let wrapper;
    beforeEach(()=>{
        wrapper = shallow(<ToggleButton {...initialProps}/>);
    });

    it('Should render the active button',()=>{
        expect(wrapper.find('.toggleButton')).toHaveLength(1);
        expect(wrapper.find('.border')).toHaveLength(1);
        expect(wrapper.find('.button')).toHaveLength(1);
        expect(wrapper.find('.active')).toHaveLength(1);
        expect(wrapper.find('span')).toHaveLength(1);
    });

    it('Should show the text from props',()=>{
        expect(wrapper.find('span').props()).toEqual({children:'text'});
    });

    it('Should call the click event',()=>{
        wrapper.find('.border').simulate('click');
        expect(initialProps.buttonClick).toHaveBeenCalledTimes(1);
    });

});


