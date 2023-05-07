import React, { useCallback, useEffect, useState } from 'react'
import { restaurant_data } from '../data/restaurants'
import axios from 'axios'
import ImageSlider from '../components/ImageSlider'
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import CircleIcon from '@mui/icons-material/Circle';
import PanoramaFishEyeIcon from '@mui/icons-material/PanoramaFishEye';
import { MapContainer, TileLayer, Marker,Popup } from 'react-leaflet'
import L from 'leaflet'
import { Rating, useTheme } from '@mui/material'
import {Link} from 'react-router-dom'
import { tokens } from '../theme'
import{styled} from '@mui/material/styles'


const Nearme = () => {
    const [city,setCity]=useState("")
    const [restaurant,setRestaurant]=useState([])
    const [latitude,setLatitude]=useState()
    const [longtitude,setLongtitude]=useState()
    const StyledRating = styled(Rating)({
      '& .MuiRating-iconFilled': {
        color: "#fff44f",
      },
      '& .MuiRating-iconHover': {
        color: '#ff3d47',
      },
    });
    const theme = useTheme()
    const settings = {
        lazyLoad: true,
        infinite: true,
        speed: 500,
        autoplay: true,
        autoplaySpeed: 5000,
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: 0
      };
    const colors = tokens(theme.palette.mode)
    const DegreetoRadius=(degrees)=>{
      return degrees*Math.PI/180
    }
    const DistanceBetweentwoCoords=(user_lat,user_long,restaurant_lat,restaurant_long)=>{
      var EarthRadius=6371
      var dlat = DegreetoRadius(restaurant_lat-user_lat)
      var dlong = DegreetoRadius(restaurant_long-user_long)

      user_lat = DegreetoRadius(user_lat);
      restaurant_lat = DegreetoRadius(restaurant_lat);

      var a = Math.sin(dlat/2) * Math.sin(dlat/2) +Math.sin(dlong/2) * Math.sin(dlong/2) * Math.cos(user_lat) * Math.cos(restaurant_lat);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      return Math.trunc(EarthRadius*c);
  }

  const getCity=useCallback(async ()=>{
    const data = await axios.get("https://api.bigdatacloud.net/data/reverse-geocode-client?latitude="+latitude+"&longitude="+longtitude+"&localityLanguage=fr").then(function(res){
      setCity(res.data.city)
    })    
  })

  const loadData=()=>{
    const restaurants = restaurant_data.find(restaurant=>{
      return restaurant.name.split(" ")[0]===city
    })

    const nearme_restaurants=restaurants?.restaurants.filter(resto=>{
      return DistanceBetweentwoCoords(latitude,longtitude,resto.lat,resto.long)<=5
    })
    setRestaurant(nearme_restaurants)
  }

  const handleNavigate=()=>{
    window.history.go(-1)
}

  
    useEffect(()=>{
      navigator.geolocation.getCurrentPosition((pos)=>{
        setLatitude(pos.coords.latitude)
        setLongtitude(pos.coords.longitude)
    })
    getCity()
    loadData()
    },[getCity])
  return (
    <div className='Restaurant'>
        <div onClick={handleNavigate} className="links">
            Previous <KeyboardDoubleArrowLeftIcon className='link' />
        </div>
      <div className="restaurants">
     {restaurant?.map((resto)=>{
        return(
            <div className="restaurant" style={{backgroundColor : colors.yellowAccent[500]}}>
            <div className="restaurant__img">
                 <ImageSlider slides={resto.img} settings={settings}/>
            </div>
            <div className="restaurant__content">
                 <div className="restaurant__content__name">
                     <Link style={{color : colors.grey[100]}} className='linkCss' to={'../restaurant/'+resto.id}>{resto.name}</Link>
                 </div>
                 <div className="restaurant__content__review">
                     {resto.review}
                     </div>
                 <div className="restaurant__content__rating">
                 <StyledRating 
                 value={resto.rating} 
                 precision={0.5} 
                 readOnly 
                 size='medium'
                 icon={<CircleIcon fontSize="inherit" />}
                 emptyIcon={<PanoramaFishEyeIcon fontSize="inherit" />}
             />
             {resto.rating} 
                 </div>
                 <div className="restaurant__content__details">
                 <div className="restaurant__content__pricing">
                     {resto.pricing} -
                 </div>
                 <div className="restaurant__content__status">
                     {resto.status}
                 </div>
                 </div>
                 <div className="restaurant__content__status">
                     {DistanceBetweentwoCoords(latitude,longtitude,resto.lat,resto.long)<1?DistanceBetweentwoCoords(latitude,longtitude,resto.lat,resto.long)*100+" m away":DistanceBetweentwoCoords(latitude,longtitude,resto.lat,resto.long)+" km away"}
                 </div>
            </div>
           <div className="restaurant__map" >
           <MapContainer center={[resto.lat, resto.long]} zoom={15} scrollWheelZoom={false}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[resto.lat, resto.long]}>
                    <Popup>
                        <div className="pop_up">
                            <img src={resto.img[1]} alt="" />
                            <div className="pop_up__content">
                            <div className="name">
                                {resto.name}
                            </div>
                            <div className="rating">
                            <Rating 
                                value={resto.rating} 
                                precision={0.5} 
                                readOnly 
                                size='small'
                            />

                            {resto.review.split(" ")[0]}
                            </div>
                            </div>
                        </div>
                    </Popup>
                </Marker>
            </MapContainer>
           </div>
         </div>
        )
     })}
      </div>
    </div>
  )
}
let DefaultIcon = L.icon({
  iconUrl : "https://cdn3.iconfinder.com/data/icons/yumminky-restaurant/100/yumminky-restaurant-64-512.png",
  iconSize:  [30, 30],
  popupAnchor: [0, -16],
})

L.Marker.prototype.options.icon = DefaultIcon
export default Nearme