import 'leaflet/dist/leaflet.css';
import L from 'leaflet'
import icon from '../images/icon-location.svg';

import { validateIp, addOffset } from './helpers';

export {validateIp} from './helpers'

const IpInput = document.querySelector('.search-bar__input');
const btn = document.querySelector('button');

const ipInfo = document.querySelector('#IP');
const locationInfo = document.querySelector('#location');
const timezonaInfo = document.querySelector('#timezone');
const ispInfo = document.querySelector('#isp');

btn.addEventListener('click', getData);
IpInput.addEventListener('keydown', handleKey);

const markerIcon = L.icon({
    iconUrl: icon,
    iconSize: [30,40],
})

const mapArea = document.querySelector('.map');
const map = L.map(mapArea, {   
    center: [51.505, -0.09],
    zoom: 11,
});

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>' 
}).addTo(map);

// L.marker([51.505, -0.09], {icon: markerIcon}).addTo(map);

function getData(){
    if (validateIp(IpInput.value)){
        fetch(`https://ipgeolocation.abstractapi.com/v1/?api_key=87de8de0a73048988af91a645c481846&ip_address=${IpInput.value}`)
            .then(response => response.json())
            .then(setInfo)
    }    
}


function handleKey(e){
    if (e.key === 'Enter'){
        getData();
    }
}

function setInfo(mapData){
    ipInfo.innerText = mapData.ip_address;
    locationInfo.innerText = mapData.country + ' ' + mapData.city;
    timezonaInfo.innerText = mapData.timezone.gmt_offset;
    ispInfo.innerText = mapData.connection.isp_name;

    map.setView([mapData.latitude, mapData.longitude]);
    L.marker([mapData.latitude, mapData.longitude],{icon: markerIcon}).addTo(map)

    if(matchMedia('(max-width: 1023px)').matches){
        addOffset(map)
    }
}