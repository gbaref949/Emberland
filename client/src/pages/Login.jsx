import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    let signedIn = sessionStorage.getItem('authenticated') || false;
    if(signedIn == 'true'){
        navigate('/dashboard');
    }

    const taken = useRef(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [people, setPeople] = useState([]);

    // gets all the users
    useEffect(()=>{  
        fetch('http://localhost:5000/').then(response =>{
            return response.json();
        }).then(res=>{
            setPeople(res);
        });
    }, []);

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
        people.map(person=>{
            if(formData.email === person.email || formData.password === person.password){
                sessionStorage.setItem('authenticated', true);
                navigate('/dashboard');
            }
        })
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
                <div className='registerLink'>
                    <p>Don't have an account? <Link to={'/'}>Register</Link></p>
                </div>
            </form>
        </div>
    );
};

export default Login;
