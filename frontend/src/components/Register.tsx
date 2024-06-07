import React, {useState} from 'react'
import { registerUser } from '../api/ContactService'
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [user, setUser] = useState({
        username: "",
        password: ""
    }); 
    const navigate = useNavigate();

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => { 
        event.preventDefault();
        try{
            await registerUser(user.username, user.password);
            navigate('/login');
        }catch(error){
            console.log(error);
        }
    };

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target;
        setUser({...user, [name]: value});
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    name="username"
                    value={user.username}
                    onChange={onChange}
                    required
                />
                </div>
                <div className="form-group">
                <label>Password:</label>
                <input
                    type="password"
                    name="password"
                    value={user.password}
                    onChange={onChange}
                    required
                />
                </div>
                <div className="button-container">
                <button onClick={() => navigate('/register')} className="register-btn">Register</button>
                </div>
            </form>
        </div> 
    )
}

export default Register