import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import { ToastContext } from "./MyContext";

const Toast = (props) => {
  const success = (msg) =>
    Toastify({
      text: msg,
      className: "success",
      position: "center",
      style: {
        color:"white",
        background: "#10d52a",
        fontFamily: "'Roboto Slab', serif",
        fontSize: "20px",
        textAlign: "center",
        borderRadius: "3px",
      },
    }).showToast();
    
  const error = (msg) =>
    Toastify({
      text: msg,
      className: "warning",
      position: "center",
      style: {
        background: "#fc1111",
        fontFamily: "'Roboto Slab', serif",
        fontSize: "20px",
        textAlign: "center",
        borderRadius: "3px",
      },
    }).showToast();

  return (
    <ToastContext.Provider value={{success,error}}>
        {props.children}
    </ToastContext.Provider>
  );
};

export default Toast;
