import { useEffect, useState } from "react";
import ReactDOM from "react-dom";

export const Portal = ({ children }) => {
    const [mounted, setMounted] = useState(false);
  
    useEffect(() => {
      setMounted(true);
      return () => setMounted(false);
    }, []);
  
    return mounted
      ? ReactDOM.createPortal(children, document.body)
      : null;
  };