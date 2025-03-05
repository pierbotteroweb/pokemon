import { Navigate, Outlet } from "react-router-dom"

const checkUserAuth = function(){
    return sessionStorage.getItem("token") !== null
}

const RouteGuard = function(){
    return checkUserAuth() ? <Outlet /> : <Navigate to="login" />
}

export default RouteGuard