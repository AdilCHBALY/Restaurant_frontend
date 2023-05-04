import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { restaurant_data } from '../data/restaurants'
import { Rating, styled, useTheme } from '@mui/material'
import RoomIcon from '@mui/icons-material/Room';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ImageSlider from '../components/ImageSlider';
import { tokens } from '../theme';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import CircleIcon from '@mui/icons-material/Circle';
import PanoramaFishEyeIcon from '@mui/icons-material/PanoramaFishEye';
import axios from 'axios'




function Single_Restaurant() {
    const theme=useTheme()
    const colors = tokens(theme.palette.mode)
    const {resto_id} = useParams()
    const [loading,setLoading] = useState(false)
    const [single,setSingle]=useState({
        id:'',
        address : '',
        rating : '',
        review : '',
        lat : 0,
        long : 0,
        img : [],
        status : '',
        details : []
    })


    const LoadDataAPI = async (resto_id)=>{
        setLoading(true)
        const data = await axios.get("http://localhost:8000/restaurant/"+resto_id)
        setSingle(data)
        setLoading(false)
    }
    

    const settings = {
        lazyLoad: true,
        infinite: true,
        speed: 500,
        autoplay: true,
        autoplaySpeed: 5000,
        slidesToShow: 3,
        slidesToScroll: 1,
        initialSlide: 0
      };

    const LoadData=(resto_id)=>{
        setLoading(true)
        const restaurants=[]

        restaurant_data.forEach((resto)=>{
            resto.restaurants.forEach(single_resto =>{
                restaurants.push(single_resto)
            })
        })

        const data = restaurants.find(restaurant=>{
            return restaurant.id==resto_id
        })
        setSingle(data)
        setLoading(false)
    }

    const handleNavigate=()=>{
        window.history.go(-1)
    }

    const StyledRating = styled(Rating)({
        '& .MuiRating-iconFilled': {
          color: "#fff44f",
        },
        '& .MuiRating-iconHover': {
          color: '#ff3d47',
        },
      });
    
    useEffect(()=>{
        LoadData(resto_id)
    },[resto_id])
    const center = [single.lat,single.long]

    
  return (
    <div className='SingleRestaurant'>
        <div className="links" onClick={handleNavigate}>
            Previous <KeyboardDoubleArrowLeftIcon className='link' />
        </div>
        {loading ? "LOADING" :
        <div>
        <div className="SingleRestaurant__top">
            <div className="row">
            <div className="SingleRestaurant__top__name">
                {single.name}
            </div>
            <div className="SingleRestaurant__top__rating">
                <span style={{color : colors.greenAccent[500]}}>{single.rating}</span>
                <StyledRating 
                 value={single.rating} 
                 precision={0.5} 
                 readOnly 
                 size='medium'
                 icon={<CircleIcon fontSize="inherit" />}
                 emptyIcon={<PanoramaFishEyeIcon fontSize="inherit" />}
             />
             {single.review}
            </div>
            </div>
            <div className="row">
            <div className="SingleRestaurant__top__pricing">
                {single.pricing}
            </div>
            <div className="SingleRestaurant__top__detail">
                {single.details ? single.details[1] : ''}
            </div>
            </div>
            <div className="row">
            <div className="SingleRestaurant__top__address">
                <RoomIcon /> 
                {single.address}
            </div>
            <div className="SingleRestaurant__top__phone">
                <LocalPhoneIcon /> 
                {single.phone}
            </div>
            <div style={{color : colors.redAccent[300]}} className="SingleRestaurant__top__access">
                <AccessTimeIcon /> 
                {single.status}
            </div> 
            </div>
        </div>
        <ImageSlider slides={single.img} settings={settings}/>
        <div className="SingleRestaurant__bot">
            <div className="SingleRestaurant__bot__details">
                <div style={{backgroundColor : colors.primary[400] ,border : '1px solid '+colors.grey[400]}} className="SingleRestaurant__bot__detail">
                    <div className="SingleRestaurant__bot__detail__title">
                        Food and ambience
                    </div>
                    <div className="food_detail">
                        {single.details[0]}
                    </div>
                    <div className="food_detail">
                        {single.details[1]}
                    </div>
                    <div className="food_detail">
                        {single.details[2]}
                    </div>
                </div>
                <div style={{backgroundColor : colors.primary[400] ,border : '1px solid '+colors.grey[400]}} className="SingleRestaurant__bot__detail">
                <div className="SingleRestaurant__bot__detail__title">
                        Location Map
                    </div>
                    <div className="map" id='map'>
                    <MapContainer center={center} zoom={14} scrollWheelZoom={false}>
                        <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={center}>
                        <Popup>
                            <div className="pop_up">
                                <img src={single.img[0]} alt="" />
                                <div className="pop_up__content">
                                <div className="name">
                                    {single.name}
                                </div>
                                <div className="rating">
                                <Rating
                                    value={single.rating} 
                                    precision={0.5} 
                                    readOnly 
                                    size='small'
                                />

                                {single.review.split(" ")[0]}
                                </div>
                                </div>
                            </div>
                        </Popup>
                        </Marker>
                    </MapContainer>
                    </div>
                </div>
                <div style={{backgroundColor : colors.primary[400] ,border : '1px solid '+colors.grey[400]}} className="SingleRestaurant__bot__detail">
                    <div className="SingleRestaurant__bot__detail__title">
                        Location and Contact 
                    </div>
                    <div className="SingleRestaurant__top__address">
                        <RoomIcon /> 
                        {single.address}
                    </div>
                    <div className="SingleRestaurant__top__phone">
                        <LocalPhoneIcon /> 
                        {single.phone}
                    </div>
                </div>
            </div>
        </div>
            </div>}
    </div>
  )
}

export default Single_Restaurant
