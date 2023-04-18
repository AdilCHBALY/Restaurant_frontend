import React from 'react'
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

function ImageSlider({slides,settings}) {
   return(
    <>
         <Slider className='Slider' {...settings}>
            {slides?.map((img)=>{
                return (
                    <div key={img} className='slide'>
                        <img src={img} alt="" className='slide-image' />
                    </div>
                )
            })}
        </Slider>
    </>
   )
}

export default ImageSlider
