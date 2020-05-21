import React from 'react';

export default props => {
    return (
        <div className="toggleButton">
            <div className="border" onClick={props.buttonClick}>
                <div className={['button',props.active?'active':''].join(' ')}></div>
            </div>
            <span>{props.text}</span>
        </div>
    )
}