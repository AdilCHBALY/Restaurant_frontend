import { Rating, useTheme } from '@mui/material'
import{styled} from '@mui/material/styles'
import React, { useEffect, useState } from 'react'
import { tokens } from '../theme'
import { useParams , Link} from 'react-router-dom'
import { restaurant_data } from '../data/restaurants'
import { MapContainer, TileLayer, Marker,Popup } from 'react-leaflet'
import L from 'leaflet'
import ImageSlider from '../components/ImageSlider'
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import CircleIcon from '@mui/icons-material/Circle';
import PanoramaFishEyeIcon from '@mui/icons-material/PanoramaFishEye';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios'


function Restaurant() {
    const {city_id} = useParams()
    const [restaurant,setRestaurant]=useState([])
    const [name,setName]=useState("")
    const [searchBar,setSearchBar] = useState(false)
    const searchBarStyle = searchBar ? {
        width : "100%",
        opacity : "1"
    } : {
        width : "0%",
        opacity : "0"
    }
    const handleClickSearchBar=()=>{
        setSearchBar(!searchBar)
    }
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
    const LoadData=(city_id)=>{
        const restaurants = restaurant_data.find(restaurant=>{
            return restaurant.id==city_id
        })
        setRestaurant(restaurants.restaurants)
        setName(restaurants.name.split(" ")[0])
    }
    const handleNavigate=()=>{
        window.history.go(-1)
    }

    const LoadDataAPI = async (city_id)=>{
        const data = await axios.get("http://localhost:8000/city/"+city_id)
        setRestaurant(data)
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
        LoadData(city_id)
    },[city_id])
  return (
    <div className='Restaurant'>
        <div onClick={handleNavigate} className="links">
            Previous <KeyboardDoubleArrowLeftIcon className='link' />
        </div>
      <div className="Restaurant__title">
        Best Restaurants in {name}
       <div className="Restaurant__row">
       <div className="Restaurant__search">
            <input type="text" placeholder='Search' style={searchBarStyle}/>
        </div>
        <SearchIcon className='searchicon' onClick={handleClickSearchBar} />
       </div>
      </div>
      <div className="restaurants">
     {restaurant.map((resto)=>{
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

export default Restaurant
