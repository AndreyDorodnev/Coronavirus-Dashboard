import React from 'react';
import {configure,shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import CountryInfo from '../../src/components/main/CountryInfo';

configure({
    adapter: new Adapter()
});


describe('<CountryInfo/> with no props',()=>{

    let wrapper;

    beforeEach(()=>{
        wrapper = shallow(<CountryInfo/>);
    });

    it('Should render empty component',()=>{
        expect(wrapper.find('.information')).toHaveLength(1);
        expect(wrapper.find('.info')).toHaveLength(1);
        expect(wrapper.find('p')).toHaveLength(1);
        expect(wrapper.find('p').props()).toEqual({children:'No country selected'});
    });

});

describe('<CountryInfo/> with props',()=>{

    const initialProps = {
        data: {
            country: 'Spain',
            continent: 'Europe',
            population: '123456',
            tests: '5',
            cases: '2',
            Deaths: '0',
            recovered: '1'
        }
    }

    let wrapper;

    beforeEach(()=>{
        wrapper = shallow(<CountryInfo {...initialProps}/>);
    });

    it('Should render empty component',()=>{
        expect(wrapper.find('.information')).toHaveLength(1);
        expect(wrapper.find('.info')).toHaveLength(1);
        expect(wrapper.find('p')).toHaveLength(7);
    });

});