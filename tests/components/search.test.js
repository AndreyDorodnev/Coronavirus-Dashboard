import React from 'react';
import {configure,shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Search from '../../src/components/ui/Search';

configure({
    adapter: new Adapter()
});

describe('<Search/> with no props',()=>{

let wrapper;

beforeEach(()=>{
    wrapper = shallow(<Search/>)
});

it('Sohould render form', ()=>{
    expect(wrapper.find('form')).toHaveLength(1);
});

it('Should render input',()=>{
    expect(wrapper.find('input[type="text"]')).toHaveLength(1);
});

it('Should not contain prompt list',()=>{
    expect(wrapper.find('.prompt')).toHaveLength(0);
});

it('Should have proper props for input field',()=>{
    expect(wrapper.find('input[type="text"]').props()).toEqual({
        type: 'text',
        placeholder: "enter country",
        value: "text",
        value: '',
        onChange: expect.any(Function),
        onKeyDown: expect.any(Function),
        onBlur: expect.any(Function)
    })
});

it('Should change input value on change event',()=>{
    wrapper.find('input[type="text"]').simulate('change',{
        target:{
            value: 'something'
        }
    });
    expect(wrapper.find('input[type="text"]').prop('value')).toEqual('something');
});



});

describe('<Search/> with props',()=>{

    let wrapper;

    const dataSubmit = (country) => {
        country = country;
    }

    const event = {
        preventDefault: jest.fn()
    }

    const initialProps= {
        propmptsData: ['Russia','Spain','USA','Italy','India'],
        dataSubmit: jest.fn()
    }

    beforeEach(()=>{
        wrapper = shallow(<Search {...initialProps}/>)
    });

    it('Should have the prompt list with one line after input value change to "r"',()=>{
        wrapper.find('input[type="text"]').simulate('change',{target:{value: 'r'}});
        expect(wrapper.find('.prompt')).toHaveLength(1);
        expect(wrapper.find('ul')).toHaveLength(1);
        expect(wrapper.find('li')).toHaveLength(1);
        expect(wrapper.find('li').props()).toEqual({
            onClick: expect.any(Function),
            className: null,
            children: 'Russia',
        })
    });

    it('Should render two prompt lines',()=>{
        wrapper.find('input[type="text"]').simulate('change',{target:{value: 'in'}});
        expect(wrapper.find('.prompt')).toHaveLength(1);
        expect(wrapper.find('ul')).toHaveLength(1);
        expect(wrapper.find('li')).toHaveLength(2);
    });

    it('Should set prompt list line to active after keyDown event',()=>{
        wrapper.find('input[type="text"]').simulate('change',{target:{value: 'r'}});
        wrapper.find('input[type="text"]').simulate('keyDown',{keyCode : 40});
        expect(wrapper.find('li').props()).toEqual({
            onClick: expect.any(Function),
            className: 'active',
            children: 'Russia',
        })
    });

    it('Should call the dataSubmit method on enter press on input',()=>{
        wrapper.find('input[type="text"]').simulate('change',{target:{value: 'r'}});
        wrapper.find('form').simulate('submit',event);
        expect(wrapper.find('ul')).toHaveLength(1);
        expect(initialProps.dataSubmit).toHaveBeenCalledTimes(1);
        expect(initialProps.dataSubmit).toHaveBeenCalledWith("r");
    });

    it('Should call dataSubmit on press enter on Imput with active prompt',()=>{
        wrapper.find('input[type="text"]').simulate('change',{target:{value: 'r'}});
        wrapper.find('input[type="text"]').simulate('keyDown',{keyCode : 40});
        wrapper.find('input[type="text"]').simulate('keyDown',{keyCode : 13});
        expect(initialProps.dataSubmit).toHaveBeenCalledTimes(1);
    });

    it('Should change input value by click on prompt',()=>{
        wrapper.find('input[type="text"]').simulate('change',{target:{value: 'in'}});
        wrapper.find('li').first().simulate('click');
        expect(wrapper.find('input[type="text"]').prop('value')).toEqual('Spain');
    })

});