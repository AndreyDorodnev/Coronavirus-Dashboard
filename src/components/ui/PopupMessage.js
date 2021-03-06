import React, {useEffect,useState} from 'react';


export default props => {
    
    const [visible,setVisible] = useState(false);

    useEffect(()=>{
        if(props.message.text&&props.message.text.length>0){
            setVisible(true);
            setTimeout(()=>{
                setVisible(false);
            },2000);
        }
    },[props.message]);

    return (
        <div className={['popup-message',visible? "popup-active":null].join(' ')}>
            <p>{props.message? props.message.text : ''}</p>
        </div>
    )
}