import Home from "./pages/Home";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const App = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Home />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default App;
