import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { IoIosArrowBack } from "react-icons/io";

const Leaderboard = () => {
    const navigate = useNavigate();
    let signedIn = sessionStorage.getItem('authenticated') || false;
    const [people, setPeople] = useState([]);

    useEffect(()=>{
        if(signedIn == 'false'){
            console.log('navigating')
            navigate('/login');
        }
        fetch('http://localhost:5000/').then(response =>{
            return response.json();
        }).then(res=>{
            setPeople(res);
        });
    }, [])

    people.sort((a, b) => b.bestScore - a.bestScore);

    return (
        <div className="leaderboard-container">
            <h2>Leaderboard</h2>
            <Link to={'/dashboard'} className='backBtn'><IoIosArrowBack />Dashboard</Link>
            <table>
                <thead>
                    <tr>
                        <th className='usernameTitle'>Username</th>
                        <th>Best Score</th>
                        <th>Overall Score</th>
                    </tr>
                </thead>
                <tbody>
                    {people.map((player, index) => (
                        <tr key={index}>
                            <td>{player.username}</td>
                            <td>{player.bestScore}</td>
                            <td>{player.overallScore}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Leaderboard;
