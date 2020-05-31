import React, {useState} from 'react';

export default props => {

    const MAX_PROPMTLIST_SIZE = 6;

    const [inputValue,setInputValue] = useState('');
    const [promptList,setPromptList] = useState(null);
    const [activePrompt,setActivePrompt] = useState(-1);
    const [showPrompt,setShowPrompt] = useState(false);

    const inputValueChange = event => {
        const dataStr = inputDataValidate(event.target.value); //validation
        setPromptList(setPrompt(dataStr)); //add items to prompt list
        if(dataStr.length>0)
            setShowPrompt(true);
        else 
            setShowPrompt(false);
        setInputValue(dataStr); //set state
    }
    const inputDataValidate = (dataStr) => {
        if(dataStr.length>inputValue.length){
          return dataStr.replace(/[0-9]/g, "");
        } else {
          return dataStr;
        }
    }
    const setPrompt = (dataStr) => {
        return props.propmptsData? 
        props.propmptsData.filter(element=>{
          return element.toLowerCase().includes(dataStr.toLowerCase());
        }).slice(0,MAX_PROPMTLIST_SIZE) :
        null;
    }

    const onInputKeyDown = (event) => {
        if(event.keyCode === 13){ //enter
          if(activePrompt>-1){
            setInputValue(promptList[activePrompt]);
            setPromptList(null);
            setActivePrompt(-1);
          }
        } else if(event.keyCode === 38) {  //up
          if(activePrompt>-1) 
            setActivePrompt(activePrompt-1); 
        } else if(event.keyCode === 40) { //down
          if(activePrompt<promptList.length-1)
            setActivePrompt(activePrompt+1);
        }
    }

    const promptClick = (event,countryName) => {
        //prompt mouse click
        setInputValue(countryName);
        setPromptList(null);
        setActivePrompt(-1);
        props.dataSubmit(countryName);
    }

    const dataSubmit = (event) => {
        event.preventDefault();
        props.dataSubmit(inputValue);
    }

    const hidePrompt = () => {
        setShowPrompt(false);
    }

    return (
        <React.Fragment>
            <form onSubmit={dataSubmit}>
                <input type="text" placeholder="enter country" value={inputValue} onChange={inputValueChange} onKeyDown={onInputKeyDown} onBlur={hidePrompt}></input>
                {
                    promptList?
                    (
                        <div className={["prompt",showPrompt?"prompt-active":''].join(' ')}>
                            <ul>
                                {
                                    promptList.map((element,index)=>{
                                    let className = null;
                                    if(index === activePrompt)
                                        className = 'active';
                                    return (
                                        <li onClick={evt=>promptClick(evt,element)} className={className} key={element}>{element}</li>
                                    )
                                    })
                                }
                            </ul>
                        </div>
                    ):
                    null
                }
            </form>
        </React.Fragment>
    )
}