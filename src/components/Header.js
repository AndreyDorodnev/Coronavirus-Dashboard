import React, {useState,useEffect} from 'react';
import ToggleButton from './ui/ToggleButton';
import Container from 'components/Container';
import {ReactComponent as RefreshIcon} from '../assets/icons/refresh.svg';
import Search from './ui/Search';

const Header = (props) => {

  const DARK_THEME_FLAG = 'coronaMapDarkTheme';
  const [darkTheme,setDarkTheme] = useState(false);

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

  const dataSubmit = (value) => {
    props.searchEnter(value);
  }

  return (
    <header>
      <Container type="content">
        <div className="caption">
          <p>Coronavirus dashboard</p>
          <div className="icon" title="Refresh data" onClick={props.refreshData}><RefreshIcon></RefreshIcon></div>
          <p>{props.updated? props.updated:null}</p>
        </div>
        <Search propmptsData={props.countryList} dataSubmit={dataSubmit}></Search>
        <ToggleButton active={darkTheme} text="Dark Theme" buttonClick={changeTheme}></ToggleButton>
      </Container>
    </header>
  );
};

export default Header;
