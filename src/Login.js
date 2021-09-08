import React, { useState } from "react";
import Axios from "axios";
import { useHistory } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button, Form} from "react-bootstrap";
import "./App.css"

export default function Login()
{
    var history = useHistory();
    const[userName, setUsername] = useState("");
    const[password, setPassword] = useState("");
    const[errorMessage, setErrorMessage] = useState("");
    const onUserNameChange = (event) =>
    {
        setUsername(event.target.value);
    }

    const onPasswordChange = (event) =>
    {
        setPassword(event.target.value);
    }

    const handleLogin = () =>
    {
        const path = "http://localhost:8002/api/syllabus/signIn";
        Axios.post(path,  {
            "userName": userName,
            "password": password
        }).then((result) =>
        {
            if(result.status === 200)
            {
                const data = result.data[0]
                const token = data.token;
                const userName = data.userName;
                console.log(token.token);
                window.sessionStorage.setItem("token", token);
                window.sessionStorage.setItem("userName", userName);
                history.push("/Course");
            }
        }).catch((error) =>
        {
            console.log(error, error.response);
            if(error.response.status === 404)
            {
                setErrorMessage("Incorrect username/password.");
            }
        })
    }
    
    return(
        <>
           <h1 align="center" style={{"marginTop":"29px", "marginBottom":"-95px"}}>Sasi Junior College</h1>
        <div id="loginBlock">
            <h3 align="center" style={{"fontFamily":"fantasy", "color":"white"}}>Admin Login</h3>
            <Form style={{"marginLeft":"60px"}}>
                <Form.Group className="mb-3">
                    <Form.Control type="email" placeholder="Enter E-mail" style={{"width": "400px"}} onChange={onUserNameChange}/>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Control type="password" placeholder="Password" style={{"width": "400px"}} onChange={onPasswordChange} />
                </Form.Group>
                <label style={{"color":"white"}}>{errorMessage}</label>
                <br></br>
                <Button id="loginBtn" onClick={handleLogin}>
                    Login
                </Button>
            </Form>
        </div>
        </>
    )
}
