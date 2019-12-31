import React from 'react';

import GroomingMeter from 'components/Page';

import './App.css';

interface IProps {}

const App: React.FC<IProps> = () => {
    return (
        <div className="App">
            <div className="global-container">
                <div className="d-flex flex-row">
                    <nav className="sidebar">
                        <h1>GM</h1>
                    </nav>
                    <GroomingMeter />
                </div>
            </div>
        </div>
    );
};

export default App;
