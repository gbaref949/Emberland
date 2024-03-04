import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();
    let signedIn = sessionStorage.getItem('authenticated') || false;
    if(signedIn == 'true'){
        navigate('/dashboard');
    }

    const taken = useRef(false);
    const [formData, setFormData] = useState({
        username: '',
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
        // You can perform validation here before submitting the form
        // For simplicity, I'm just logging the form data
        people.map(person=>{
            if(formData.email === person.email){
                taken.current = true;
            }
        })

        // if email is not already taken, create a new user
        if(taken.current == true){
            alert('Email is already taken')
        }else{
            let username = formData.username;
            let email = formData.email;
            let password = formData.password;
            fetch('http://localhost:5000/',{
                method: 'POST',
                body: JSON.stringify({username, email, password}),
                headers: {'Content-Type': 'application/json'},
            })
            navigate('/login');
        }
    };

    return (
        <div className="register-container">
            <h2>Register</h2>
            <form onSubmit={handleSubmit} className="form">
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input 
                        type="text" 
                        name="username" 
                        id="username"
                        value={formData.username} 
                        onChange={handleChange} 
                        required 
                        className="input"
                    />
                </div>
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
                <button type="submit" className="submit-button">Register</button>
                <div className='loginLink'>
                    <p>Already have an account? <Link to={'/Login'}>Login</Link></p>
                </div>
            </form>
        </div>
    );
};

export default Register;
