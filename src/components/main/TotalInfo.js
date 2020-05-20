import React from 'react';

export default props => {
    return (
        <React.Fragment>
            {
                props.data?
                (
                    <React.Fragment>
                        <div className="caption">
                            <p>{props.data.caption.text}</p>
                            <p>{props.data.caption.value}</p>
                        </div>
                        <div className="list">
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