import React, {useState} from 'react';
import { registerUser } from '../api/ContactService';
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [user, setUser] = useState({
        username: "",
        password: "",
        confirmPassword: ""
    }); 
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => { 
        event.preventDefault();
        setError("");

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,23}$/;

        if (!passwordRegex.test(user.password)) {
            setError("Password must be at least 4 characters long and include at least one letter and one number.");
            return;
        }

        if (user.password !== user.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            await registerUser(user.username, user.password);
            navigate('/login');
        } catch (error) {
            console.log(error);
        }
    };

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setUser({ ...user, [name]: value });
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
                <div className="form-group">
                    <label>Confirm Password:</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={user.confirmPassword}
                        onChange={onChange}
                        required
                    />
                </div>
                {error && <p className="error-message">{error}</p>}
                <div className="button-container">
                    <button type="submit" className="register-btn">Register</button>
                </div>
            </form>
        </div> 
    )
}

export default Register;
