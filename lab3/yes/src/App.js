import { BrowserRouter } from "react-router-dom";
import "./App.css";
import AllContentMain from "./ComponentsMain/AllContentMain";
import Header from "./ComponentsMain/Header";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <BrowserRouter>
      <Header></Header>
    </BrowserRouter>
  );
}

export default App;
