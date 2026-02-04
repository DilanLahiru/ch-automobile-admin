import { StrictMode } from "react";
// Packages
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
// Components
import "./index.css";
import App from "./App.jsx";
// Slices
import { store } from "./store/store.js";

// Packages
import { ToastContainer } from 'react-toastify';

// Render the App component to the DOM
createRoot(document.getElementById("root")).render(
  // Wrap the App component in the Provider component to provide the store to the children
  <Provider store={store}>
    <StrictMode>
      <App />
      <ToastContainer />
    </StrictMode>
  </Provider>
);
