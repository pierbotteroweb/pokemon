import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function Login(){

    const [loginData, setLoginData] = useState({
        username:"",
        password:""
    })

    const [viewPassword, setViewPassword] = useState(false)

    const navigate = useNavigate()

    const handleInputChange = function(event){
        event.preventDefault()
        setLoginData({...loginData, [event.target.name]: event.target.value})

    }

    const handleSubmit = function(event){
        event.preventDefault()
        if(loginData.username === "admin" && loginData.password === "admin"){
            sessionStorage.setItem("token","loginOk")
            navigate("/")
        } else {
            alert("Username or Password Invalid. Please Try Again")
            sessionStorage.clear("token")
        }
    }
    return (

        <div className="card" style={{width:"18rem", margin:"auto", marginTop:"50px"}} >
            <div className="card-header">
                Login
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit} >
                    <div className="mb-3">
                        <label for="username" className="form-label"> Username </label>
                        <input
                            type="text"
                            name="username"
                            className="form-control"
                            id="username"
                            aria-describedby="usernameHelp"
                            value={loginData.username}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label for="password" className="form-label" > Password </label>
                        <div style={{display:"flex", gap:"5px", marginBottom:"0"}} >
                            <input
                                type={viewPassword ? "text" : "password"}
                                name="password"
                                className="form-control"
                                id="password"
                                value={loginData.password}
                                onChange={handleInputChange}
                                required
                            />
                            <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={() => setViewPassword(!viewPassword)}
                            >
                            <i className={`bi ${viewPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                            </button>
                        </div>
                    </div>
                    <button type="submitt" className="btn btn-primary" style={{marginTop:"10px"}} >Submit</button>
                </form>
            </div>
            <div className="row align-items-center">
  </div>
        </div>
    )

}