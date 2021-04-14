import logo from './logo.svg';
import './App.css';
import Web3 from 'web3';
import { useEffect, useState } from 'react';

const App = () => {
    var web3 = new Web3(
        new Web3.providers.HttpProvider('http://127.0.0.1:8545')
    );

    const [accounts, setAccounts] = useState([]);
    useEffect(() => {
        const getAccount = async () => {
            const accounts = await web3.eth.getAccounts();
            setAccounts(accounts);
        };
        getAccount();
    }, []);

    if (accounts === []) return <div></div>;
    return (
        <div className='App'>
            <header className='App-header'>
                <img src={logo} className='App-logo' alt='logo' />
                <p>Your account:</p>
                {accounts[0]}
                <a
                    className='App-link'
                    href='https://reactjs.org'
                    target='_blank'
                    rel='noopener noreferrer'>
                    Learn React
                </a>
            </header>
        </div>
    );
};

export default App;
