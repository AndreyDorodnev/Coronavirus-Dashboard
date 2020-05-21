import React, {useState,useEffect} from 'react';
import { Link } from 'gatsby';
import ToggleButton from './ui/ToggleButton';
import Container from 'components/Container';

const Header = () => {

  const DARK_THEME_FLAG = 'coronaMapDarkTheme';
  const [darkTheme,setDarkTheme] = useState(false);


  useEffect(()=>{
    console.log('HEADER EFFECT');
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
    if(isDark){
      document.documentElement.setAttribute('data-theme','dark')
    } else {
      document.documentElement.removeAttribute('data-theme')
    }
    // isDark? : ;
  }

  return (
    <header>
      <Container type="content">
        <p>Coronavirus dashboard</p>
        <form>
          <input type="text" placeholder="enter country"></input>
        </form>
        <ToggleButton active={darkTheme} text="Dark Theme" buttonClick={changeTheme}></ToggleButton>
        {/* <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/page-2/">Page 2</Link>
          </li>
        </ul> */}
      </Container>
    </header>
  );
};

export default Header;
