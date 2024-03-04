import React, { useState } from 'react';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // You can perform login logic here
        console.log(formData); // For demo purpose
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit} className="form">
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input 
                        type="email" 
                        name="email" 
                        id="email"
                        value={formData.email} 
                        onChange={handleChange} 
                        required 
                        className="input"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input 
                        type="password" 
                        name="password" 
                        id="password"
                        value={formData.password} 
                        onChange={handleChange} 
                        required 
                        className="input"
                    />
                </div>
                <button type="submit" className="submit-button">Login</button>
            </form>
        </div>
    );
};

export default Login;
