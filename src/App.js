import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import EditorPage from "./Pages/EditorPage";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      {/* toast conntainer for showing toast */}
      <div>
        <Toaster
          position="top-center"
          toastOptions={{
            success: {
              theme: {
                primary: 'green',
              },
            },
          }}
        ></Toaster>
      </div>

      <BrowserRouter>
        <Routes>
          {/* path define konse page pr jana h 
          element tell konsa element render krna h */}
          <Route path="/" element={<Home />}></Route>
          <Route path="/editor/:roomId" element={<EditorPage />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
