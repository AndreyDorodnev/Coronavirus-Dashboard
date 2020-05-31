import React from 'react';
import {configure,shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Loading from '../../src/components/ui/loading';

configure({
    adapter: new Adapter()
});


describe('<Loading/> render test',()=>{
    let wrapper;
    
    beforeEach(()=>{
        wrapper = shallow(<Loading/>);
    });

    it('Should render loading component',()=>{
        expect(wrapper.find('.loading')).toHaveLength(1);
        expect(wrapper.find('.loading').children()).toHaveLength(4);
    });
});



