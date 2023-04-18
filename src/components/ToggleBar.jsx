import { useTheme } from '@mui/material'
import React, { useContext } from 'react'
import { ColorModeContext, tokens } from '../theme'
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import NightlightIcon from '@mui/icons-material/Nightlight';
import { useNavigate } from 'react-router-dom';


function ToggleBar() {
    const theme = useTheme()
    const colors = tokens(theme.palette.mode)
    const colorMode=useContext(ColorModeContext)
    const navigate = useNavigate()

    const handleNavigate=()=>{
      navigate("/")
    }
  return (
    <div className='toggleBar' style={{backgroundColor : colors.primary[400]}}>
      <div className="logo" onClick={handleNavigate}>
        Restaurant <span style={{color : colors.greenAccent[500]}}>NearMe</span>
      </div>

      <div className='toggleMode' onClick={colorMode.toggleColorMode}>{theme.palette.mode === 'dark' ? <WbSunnyIcon style={{fontSize : 24}} className='toggle'/> : <NightlightIcon style={{fontSize : 24}} className=''/>}</div>
    </div>
  )
}

export default ToggleBar
