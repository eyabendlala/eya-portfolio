import React,{useEffect} from "react";
import { load_user } from "../../actions/auth";
function Cc({load_user,user}){
    useEffect(() => {
      load_user()
    }, [load_user]);
    const id= user && user.id;
    return id 
  };
export default Cc;