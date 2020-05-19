import React from 'react';

export default props => {
    return (
        <div>
            {
                props.data?
                (
                    <div>
                        <div className="caption">
                            <p>{props.data.caption.text}</p>
                            <p>{props.data.caption.value}</p>
                        </div>
                        <ul>
                            {
                                props.data.data.map(element=>{
                                    return (
                                        <li key={element.text}>
                                            <div>{element.text}</div>
                                            <div>{element.value}</div>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                ):
                (
                    null
                )
            }
        </div>
    )
}