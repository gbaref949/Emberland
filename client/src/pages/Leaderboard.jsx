import React from 'react';

const Leaderboard = () => {
    const players = [
        { username: 'Player1', bestScore: 120, overallScore: 500 },
        { username: 'Player2', bestScore: 150, overallScore: 450 },
        { username: 'Player3', bestScore: 100, overallScore: 550 }
    ];

    return (
        <div className="leaderboard-container">
            <h2>Leaderboard</h2>
            <table>
                <thead>
                    <tr>
                        <th className='usernameTitle'>Username</th>
                        <th>Best Score</th>
                        <th>Overall Score</th>
                    </tr>
                </thead>
                <tbody>
                    {players.map((player, index) => (
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
