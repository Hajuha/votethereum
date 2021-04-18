import { Button, Col, Row } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import ethereumicon from '../../assets/ethereum.png';
import './style.scss';
const Home = () => {
    const welcomeTitle = 'Votethereum';
    const welcomeDesc =
        'A blockchain-based voting website built by Ethereum smart contracts and ReactJS ';
    return (
        <div className='homepage'>
            <Row>
                <Col xs={0} lg={15} xl={14}>
                    <div className='welcome-box'>
                        <div className='welcome-content'>
                            <div className='logo-box'>
                                <img className='img' src={ethereumicon} />

                                <div className='title'>{welcomeTitle}</div>
                            </div>

                            <div className='welcome-desc'>{welcomeDesc}</div>
                        </div>
                    </div>
                </Col>

                <Col xs={24} lg={{ span: 8, offset: 1 }} xl={7}>
                    <div className='right'>
                        <Link to='/vote'>
                            <Button className='button'>Let's get started !</Button>
                        </Link>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default Home;
