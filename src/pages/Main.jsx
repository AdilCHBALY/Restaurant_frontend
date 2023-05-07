import React, { useState } from 'react'
import { useTheme } from '@mui/material'
import {  tokens } from '../theme'
import {restaurant_data} from '../data/restaurants'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'



function Main() {
    const navigate = useNavigate()
    const [data,setData]=useState([])

    const handleClick=(city_id)=>{
        navigate("../city/"+city_id)
    }

    const LoadData=async ()=>{
        const data = await axios.get("http://localhost:8000/city/")
        setData(data)
    }

    const theme = useTheme()
    const colors = tokens(theme.palette.mode)
  return (
    <div className='Main'>
        <div className="title" style={{color : colors.yellowAccent[100]}}>
            Restaurants in Morroco
        </div>
        <div className="cities">
            {restaurant_data.map((city)=>{
                return(
                    <div className="city" 
                    onClick={()=>handleClick(city.id)}
                    style={{backgroundColor : colors.yellowAccent[500]}}>
                <div className="city__img">
                    <img src={city.img} alt="" />
                </div>
                <div className="city__details">
                    <div className="city__name" style={{color : colors.yellowAccent[100]}}>{city.id}.{city.name}</div>
                </div>
            </div>
                )
            })}
        </div>
    </div>
  )
}

export default Main
