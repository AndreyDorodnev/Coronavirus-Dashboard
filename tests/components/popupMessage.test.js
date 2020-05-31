import React from 'react';
import {configure,shallow,mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import PopupMessage from '../../src/components/ui/PopupMessage';

configure({
    adapter: new Adapter()
});

describe('<PopupMessage/> with no props',()=>{

    let wrapper;

    beforeEach(()=>{
        wrapper = shallow(<PopupMessage/>)
    });

    it('Sohould render popup-message div and p tag', ()=>{
        expect(wrapper.find('.popup-message')).toHaveLength(1);
        expect(wrapper.find('p')).toHaveLength(1);
    });

    it('Sohould render popup-message without active class', ()=>{
        expect(wrapper.find('.popup-message')).toHaveLength(1);
        expect(wrapper.find('.popup-active')).toHaveLength(0);
        
    });

});

describe('<PopupMessage/> with props',()=>{

    const initalProps = {
        message: {
            text: 'message'
        }
    }

    let wrapper;

    beforeEach(()=>{
        wrapper = shallow(<PopupMessage {...initalProps}/>)
    });

    it('Should set active class and text of the message',()=>{
        expect(wrapper.find('p').props()).toEqual({children: "message"});
        //todo add active class check
    });

});

// describe('<PopupMessage/> timeot test',()=>{

//     const initalProps = {
//         message: {
//             text: 'message'
//         }
//     }

//     let wrapper;

//     const setState = jest.fn();
//     const useStateSpy = jest.spyOn(React,'useState');
//     useStateSpy.mockImplementation((init)=>[init,setState]);

//     beforeEach(()=>{
//         wrapper = shallow(<PopupMessage {...initalProps}/>)
//     });

//     afterEach(()=>{
//         jest.clearAllMocks();
//     });

//     it('Should change state after props change',()=>{
//         wrapper = mount(<PopupMessage {...initalProps}/>);
//         wrapper.setProps({message:{text:"message2"}});
//         wrapper.update();
//         expect(setState).toHaveBeenCalledTimes(1);
//     });


// });