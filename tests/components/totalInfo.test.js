import React from 'react';
import {configure,shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import TotalInfo from '../../src/components/main/TotalInfo';
import Loading from '../../src/components/ui/loading';

configure({
    adapter: new Adapter()
});

describe('<TotalInfo/> with no props',()=>{

    let wrapper;

    beforeEach(()=>{
        wrapper = shallow(<TotalInfo/>);
    });

    it('Should render loading',()=>{
        expect(wrapper.find(Loading)).toHaveLength(1);
    })

});

describe('<TotalInfo/> with props',()=>{

    const initialProps = {
        data: {
            caption: {
                value: '1000000',
                text: 'Total Recovered'
            },
            data: [
                {text:"item1",value:1},
                {text:"item2",value:2}
            ],
        },
        itemClick: jest.fn()
    }

    let wrapper;

    beforeEach(()=>{
        wrapper = shallow(<TotalInfo {...initialProps}/>);
    });

    it('Should render caption',()=>{
        expect(wrapper.find('.caption')).toHaveLength(1);
        expect(wrapper.find('p')).toHaveLength(2);
        expect(wrapper.find('.caption').children('p').first().props()).toEqual({children: '1 000 000'});
        expect(wrapper.find('.caption').children('p').last().props()).toEqual({children: initialProps.data.caption.text});
    });

    it('Should render list',()=>{
        expect(wrapper.find('.list')).toHaveLength(1);
        expect(wrapper.find('ul')).toHaveLength(1);
        expect(wrapper.find('li')).toHaveLength(2);
        expect(wrapper.find('li').first().childAt(0).props()).toEqual({children:"item1"});
        expect(wrapper.find('li').first().childAt(1).props()).toEqual({children: 1});
    });

    it('Should call itemClick func on click list item',()=>{
        wrapper.find('li').first().simulate('click');
        expect(initialProps.itemClick).toHaveBeenCalledTimes(1);
        expect(initialProps.itemClick).toHaveBeenCalledWith(initialProps.data.data[0].text);
    })

})