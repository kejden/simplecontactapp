import React, {useState} from 'react'
import { Navigate, useNavigate } from 'react-router-dom';
import { loginUser } from '../api/ContactService';

const Login = () => {
    const [user, setUser] = useState({
        username: "",
        password: ""
    });
    const navigate = useNavigate();

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => { 
        event.preventDefault();
        try{
            await loginUser(user.username, user.password);
            navigate('/contacts');
        }catch(error){
            console.error(error);
        }
        
    }

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target;
        setUser({...user, [name]:value});
    }


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
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={user.password}
              onChange={onChange}
            />
          </div>
          <div className="button-container">
            <button type="submit" className="login-btn">Login</button>
            <button onClick={() => navigate('/register')} className="register-btn">Register</button>
          </div>
          </form>
        </div>
      );
}

export default Login