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

const LOCATION = {
  lat: 0,
  lng: 0,
};
const CENTER = [LOCATION.lat, LOCATION.lng];
const DEFAULT_ZOOM = 2;

let markers = null;
let currentMap = null;

const IndexPage = () => {

  const [totalData,setTotalData] = useState(null);
  const [currentCountry,setCurrentCountry] = useState(null);

  useEffect(()=>{
    console.log('USe effect');  
    updateData();
  },[]);

  const updateData = () => {
    axios.get('https://corona.lmao.ninja/v2/all')
    .then(totalData=>{
      axios.get('https://corona.lmao.ninja/v2/countries')
      .then(countryData=>{
        setTotalData({total:totalData.data,countryData:countryData.data});
        // console.log(getTotalCasesData({total:totalData.data,countryData:countryData.data}));
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
    console.log('Map effect');  
    clearLayers(markers,map);
    if(!totalData)
      return;
    const data = totalData.countryData;
    const geoJSON = getGeoJSON(data);
    const geoJsonLayers = getLeafletGeoJSON(geoJSON);
    //save current markers 
    markers = geoJsonLayers;
    geoJsonLayers.addTo(map);
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
    const countryInfo = getCountryInfo(country,totalData);
    const {long,lat} = countryInfo.countryInfo;
    currentMap.flyTo([lat,long],8);
    setCurrentCountry(countryInfo);
  }

  const getCountryInfo = (country,data) => {
    if(data&&country){
      return data.countryData.find(element=>{
        return element.country === country;
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

  const mapSettings = {
    center: CENTER,
    defaultBaseMap: 'OpenStreetMap',
    zoom: DEFAULT_ZOOM,
    mapEffect,
  };

  return (
    <Layout pageName="home">
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
    </Layout>
  );
};

export default IndexPage;
