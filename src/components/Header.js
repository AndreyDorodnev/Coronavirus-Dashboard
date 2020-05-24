import React, {useState,useEffect} from 'react';
import ToggleButton from './ui/ToggleButton';
import Container from 'components/Container';
import {ReactComponent as RefreshIcon} from '../assets/icons/refresh.svg';

const Header = (props) => {

  const DARK_THEME_FLAG = 'coronaMapDarkTheme';
  const [darkTheme,setDarkTheme] = useState(false);
  const [inputValue,setInputValue] = useState('');

  useEffect(()=>{
    setTheme(readDarkThemeFlag());
  },[]);

  const setTheme = isDark => {
    applyTheme(isDark);
    setDarkTheme(isDark);
  }

  const readDarkThemeFlag = () => {
    try{
      const darkThemeState = JSON.parse(localStorage.getItem(DARK_THEME_FLAG));
      return darkThemeState;
    }catch(error){
      console.log(error);
      return false;
    }
  }
  const saveDarkThemeState = (state) => {
    try{
      localStorage.setItem(DARK_THEME_FLAG,state);
    } catch(error){
      console.log(error);
    }
  }
  
  const changeTheme = ()=>{
    const themeFlag = !darkTheme;
    saveDarkThemeState(themeFlag);
    applyTheme(themeFlag);
    setDarkTheme(themeFlag);
  }

  const applyTheme = isDark => {
    isDark? document.documentElement.setAttribute('data-theme','dark') : document.documentElement.removeAttribute('data-theme');
  }

  const dataSubmit = event => {
    event.preventDefault();
    props.searchEnter(inputValue);
  }

  const inputValueChange = event => {
    const dataStr = inputDataValidate(event.target.value);
    setInputValue(dataStr);
  }

  const inputDataValidate = (dataStr) => {
    if(dataStr.length>inputValue.length){
      return dataStr.replace(/[0-9]/g, "");
    } else {
      return dataStr;
    }
  }

  return (
    <header>
      <Container type="content">
        <div className="caption">
          <p>Coronavirus dashboard</p>
          <div className="icon" title="Refresh data" onClick={props.refreshData}><RefreshIcon></RefreshIcon></div>
          <p>{props.updated? props.updated:null}</p>
        </div>
        <form onSubmit={dataSubmit}>
          <input type="text" placeholder="enter country" value={inputValue} onChange={inputValueChange}></input>
        </form>
        <ToggleButton active={darkTheme} text="Dark Theme" buttonClick={changeTheme}></ToggleButton>
      </Container>
    </header>
  );
};

export default Header;
