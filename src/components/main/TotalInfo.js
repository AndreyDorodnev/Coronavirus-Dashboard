import React from 'react';
import {Scrollbars} from 'react-custom-scrollbars';

export default props => {

    const getValueStr = value => {
        const result = [];
        let count =0;
        String(value).split('').reverse().forEach((element,index)=>{
            result.push(element);
            if(++count===3){
                result.push(' ');
                count=0;
            }

        });
        return result.reverse().join('');
    }

    return (
        <React.Fragment>
            {
                props.data?
                (
                    <React.Fragment>
                        <div className="caption">
                            <p>{getValueStr(props.data.caption.value)}</p>
                            <p>{props.data.caption.text}</p>
                        </div>
                        <div className="list">
                        <Scrollbars>
                            <ul>
                                {
                                    props.data.data.map(element=>{
                                        return (
                                            <li key={element.text} onClick={evt=>props.itemClick(element.text)}>
                                                <div>{element.text}</div>
                                                <div>{element.value}</div>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </Scrollbars>
                        </div>

                    </React.Fragment>
                ):
                (
                    null
                )
            }
        </React.Fragment>
    )
}