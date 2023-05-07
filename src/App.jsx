import { ColorModeContext,useMode } from "./theme";
import { CssBaseline , ThemeProvider } from "@mui/material";
import './stylesheet/Main.scss'
import ToggleBar from "./components/ToggleBar";
import Main from "./pages/Main";
import Restaurant from "./pages/Restaurant";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Single_Restaurant from "./pages/Single_Restaurant";
import Nearme from "./pages/Nearme";

function App() {
  const [theme,colorMode]=useMode()
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <div className="content">    
            <BrowserRouter>
              <ToggleBar />
              <Routes>
                <Route path="/" element={<Main />}/>
                <Route path="city/:city_id" element={<Restaurant />} />
                <Route path="restaurant/:resto_id" element={<Single_Restaurant />}/>
                <Route path="Nearme" element={<Nearme />}/>
              </Routes>
            </BrowserRouter>
          </div>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
