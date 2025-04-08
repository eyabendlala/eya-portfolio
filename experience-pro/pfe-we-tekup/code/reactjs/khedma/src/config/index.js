//export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
import { useMemo } from "react";
import { useLocation } from "react-router";

export const API_URL="http://localhost:8000";


export const useQuery=()=>{
    const { search } = useLocation();

    return useMemo(() => new URLSearchParams(search), [search]);
}