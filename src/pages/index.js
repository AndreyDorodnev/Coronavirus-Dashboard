import React, {useEffect,useState} from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import L from 'leaflet';
import _ from "lodash";
import Layout from 'components/Layout';
import Container from 'components/Container';
import Map from 'components/Map';
import TotalInfo from '../components/main/TotalInfo';
import CountryInfo from '../components/main/CountryInfo';
import PopupMessage from '../components/ui/PopupMessage';

const LOCATION = {
  lat: 0,
  lng: 0,
};
const CENTER = [LOCATION.lat, LOCATION.lng];
const DEFAULT_ZOOM = 3;

let markers = null, currentMarker=null;
let currentMap = null;

const IndexPage = () => {

  const [totalData,setTotalData] = useState(null);
  const [currentCountry,setCurrentCountry] = useState(null);
  const [message,setMessage] = useState({text:'',time:''});

  useEffect(()=>{
    updateData();
  },[]);

  const updateData = () => {
    axios.get('https://corona.lmao.ninja/v2/all')
    .then(summaryData=>{
      axios.get('https://corona.lmao.ninja/v2/countries')
      .then(countryData=>{
        setTotalData({total:summaryData.data,countryData:countryData.data});
        showMessage('Data has been refresh');
      });
    });
  }
  /**
   * mapEffect
   * @description Fires a callback once the page renders
   */
  async function mapEffect({ leafletElement: map } = {}) {
    //save current map
    currentMap = map;
    clearLayers(markers,map);
    if(!totalData)
      return;
    const data = totalData.countryData;
    const geoJSON = getGeoJSON(data);
    const geoJsonLayers = getLeafletGeoJSON(geoJSON);
    //save current markers 
    markers = geoJsonLayers;
    geoJsonLayers.addTo(map).on('click',markerClick);
  }

  const clearLayers = (markers,map) => {
    //clear markers from map
    if(markers){
      map.removeLayer(markers);
    }
  }

  const getLeafletGeoJSON = geoJSON => {
    return new L.geoJSON(geoJSON,{
      pointToLayer: (feature={},latLng) =>{
        const { properties = {} } = feature;
        let updatedFormatted;
        let casesString;
        const {
          country,
          updated,
          cases,
          deaths,
          recovered
        } = properties;
        casesString = getShortNum(cases);
        updatedFormatted = getdateFromMilliseconds(updated);

        const html = `
          <span class="icon-marker">
            <span class="icon-marker-tooltip">
              <h2>${country}</h2>
              <ul>
                <li><strong>Confirmed:</strong> ${cases}</li>
                <li><strong>Deaths:</strong> ${deaths}</li>
                <li><strong>Recovered:</strong> ${recovered}</li>
                <li><strong>Last Update:</strong> ${updatedFormatted}</li>
              </ul>
            </span>
            ${ casesString }
          </span>
        `;

        return L.marker(latLng,{
          icon: L.divIcon({
            className: 'icon',
            html
          }),
          riseOnHover: true
        });

      }
    });
  }

  const showMessage = (msg) => {
    setMessage({text:msg,time:Date.now()});
  }

  const markerClick = (evt) => {
    const countryInfo = getCountryInfoByLatLng(evt.latlng,totalData);
    const {lng,lat} = evt.latlng;
    addMarker(lat,lng);
    if(countryInfo){
      setCurrentCountry(countryInfo); //show seleced country info
    }
  }

  const getShortNum = num => {
    return num>1000? `${String(num).slice(0,-3)}k` : `${num}`;
  }

  const getdateFromMilliseconds = milliseconds => {
    return milliseconds>0? new Date(milliseconds).toLocaleString() : '';  
  }

  const getGeoJSON = (data) => {
    //Specification:  https://geojson.org/
    if(Array.isArray(data)&&data.length>0){
      return {
        type: 'FeatureCollection',
        features: data.map(country=>{
          const { countryInfo = {} } = country;
          const { lat, long: lng } = countryInfo;
          return {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [ lng, lat ]
            },
            properties: {
              ...country
            }
          }
        })
      }
    } else return {};
  }

  const setCountry = country => {
      const countryInfo = getCountryInfoByName(country,totalData);
      if(countryInfo){
        const {long,lat} = countryInfo.countryInfo; //get coordinates
        currentMap.flyTo([lat,long],4); //fly to selected country
        addMarker(lat,long); //make new marker at selected country
        setCurrentCountry(countryInfo); //show country information
      } else {
      showMessage('No such country');
    }
  }

  const addMarker = (lat,lng)=>{
    //clear selected country marker if exists
    clearLayers(currentMarker,currentMap);
    //create new marker
    currentMarker = 
    L.marker({lat,lng},{
      icon: L.divIcon({
        className: 'icon',
        html: `<span class="icon-current-marker"></span>`
      })
    });
    //add to map
    currentMarker.addTo(currentMap);
  }

  const getCountryInfoByName = (country,data) => {
    if(data&&country){
      return data.countryData.find(element=>{
        return element.country.toLowerCase() === country.toLowerCase();
      })
    }
  }
  const getCountryInfoByLatLng = (latLng,data) => {
    if(data&&latLng){
      return data.countryData.find(element=>{
        return (element.countryInfo.lat === latLng.lat) && (element.countryInfo.long === latLng.lng) 
      })
    }
  }

  const getTotalCasesData = data => {
    if(data){
      return {
        caption: {
          text: 'Total Cases',
          value: data.total.cases
        },
        data: _.orderBy(data.countryData.map(element=>{
          return {
            text: element.country,
            value: element.cases
          }
        }),['value'],['desc']
        ) 
      }
    } else return null;
  }
  const getTotalDeathsData = data => {
    if(data){
      return {
        caption: {
          text: 'Total Deaths',
          value: data.total.deaths
        },
        data: _.orderBy(data.countryData.map(element=>{
          return {
            text: element.country,
            value: element.deaths
          }
        }),['value'],['desc'])
      }
    } else return null;
  }
  const getTotalRecoveredData = data => {
    if(data){
      return {
        caption: {
          text: 'Total Recovered',
          value: data.total.recovered
        },
        data: _.orderBy(data.countryData.map(element=>{
          return {
            text: element.country,
            value: element.recovered
          }
        }),['value'],['desc'])
      }
    } else return null;
  }

  const getLastUpdate = () => {
    return totalData? getdateFromMilliseconds(totalData.total.updated): null;
  }

  const getCountryList = (data) => {
    return data? data.countryData.map(element=>{
      return element.country;
    }) : null;    
  } 

  const mapSettings = {
    center: CENTER,
    defaultBaseMap: 'OpenStreetMap',
    zoom: DEFAULT_ZOOM,
    mapEffect,
  };

  return (
    <Layout 
      pageName="home" 
      refreshData={updateData} 
      updated={getLastUpdate()} 
      searchCountry={setCountry} 
      countryList={getCountryList(totalData)}
    >
      <Helmet>
        <title>Coronavirus map</title>
      </Helmet>

      <Map {...mapSettings}>
      </Map>

      <Container type="content" className="total-info">
        <TotalInfo data={getTotalCasesData(totalData)} itemClick={setCountry}></TotalInfo>
      </Container>
      <Container type="content" className="total-deaths">
        <TotalInfo data={getTotalDeathsData(totalData)}></TotalInfo>
      </Container>
      <Container type="content" className="total-recovered">
        <TotalInfo data={getTotalRecoveredData(totalData)}></TotalInfo>
      </Container>
      <Container type="content" className="country-info">
        <CountryInfo data={currentCountry}></CountryInfo>
      </Container>

      <PopupMessage message={message}></PopupMessage>
    </Layout>
  );
};

export default IndexPage;
