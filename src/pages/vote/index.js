import { useEffect, useState } from 'react';
import ElectionContract from '../../contracts/Election.json';
import getWeb3 from '../../utils/getWeb3';
import { Table, Form, Input, Button, Checkbox } from 'antd';
import './style.scss';

const Vote = () => {
    const [accounts, setAccounts] = useState([]);
    const [ElectionInstance, setElectionInstance] = useState();
    const [web3, setWeb3] = useState();
    const [candidates, setCandidates] = useState([]);
    const [candidatesCount, setCandidatesCount] = useState([]);
    const [isCanVote, setIsCanVote] = useState(false);

    const init = async () => {
        var web3 = await getWeb3();
        const accounts = await web3.eth.getAccounts();
        const deployedNetwork = ElectionContract.networks['5777'];
        const instance = new web3.eth.Contract(
            ElectionContract.abi,
            deployedNetwork && deployedNetwork.address
        );

        setWeb3(web3);
        setElectionInstance(instance);
        setAccounts(accounts);
    };

    const getCandidates = async () => {
        var _candidates = [];
        for (var i = 1; i <= candidatesCount; i++) {
            const candidate = await ElectionInstance.methods
                .candidates(i)
                .call()
                .then((candidate) => {
                    return {
                        id: candidate[0],
                        name: candidate[1],
                        totalVote: candidate[2],
                        party: candidate[3],
                        key: candidate[0],
                    };
                });
            _candidates.push(candidate);
        }

        setCandidates(_candidates);
    };

    useEffect(() => {
        init();
        ElectionInstance && isVoting();
    }, []);

    useEffect(() => {
        getCandidates();
        ElectionInstance && isVoting();
    }, [candidatesCount]);

    useEffect(() => {
        ElectionInstance && getCandidatesCount();
        ElectionInstance && isVoting();
    }, [ElectionInstance]);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            sorter: (a, b) => a.id - b.id,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Party',
            dataIndex: 'party',
            key: 'party',
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.party.localeCompare(b.party),
        },
        {
            title: 'Total vote',
            dataIndex: 'totalVote',
            key: 'totalVote',
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.totalVote - b.totalVote,
        },
        {
            key: 'vote',
            render: (text, record) => (
                <Button
                    onClick={() => voteCandidate(record.id)}
                    disabled={isVoted() === true || !isCanVote}>
                    {isVoted() === true ? 'Voted' : 'Vote'}
                </Button>
            ),
        },
    ];

    const getCandidatesCount = async () => {
        const count = await ElectionInstance.methods.candidatesCount().call();

        setCandidatesCount(count);
    };

    const addCandidate = async (values) => {
        await ElectionInstance.methods
            .addCandidate(values.candidate, values.party)
            .send({ from: accounts[0] })
            .then((result) => {
                getCandidatesCount();
            })
            .catch((err) => console.log(err));
    };

    const voteCandidate = async (id) => {
        await ElectionInstance.methods
            .vote(id)
            .send({ from: accounts[0] })
            .then((result) => {
                getCandidates();
            })
            .catch((err) => console.log(err));
    };

    const onFinish = (values) => {
        addCandidate(values);
    };

    const isVoted = async () => {
        const _isVoted = await ElectionInstance.methods
            .voters(accounts[0])
            .call();
        console.log(_isVoted);
        return _isVoted;
    };

    const isVoting = async () => {
        const _isVoting = await ElectionInstance.methods.getIsVoting().call();
        setIsCanVote(_isVoting);
    };

    const startVoting = async () => {
        await ElectionInstance.methods
            .startVoting()
            .send({ from: accounts[0] });
    };

    if (accounts === []) return <div></div>;
    return (
        <div className='vote-page'>
            <div className='vote-box'>
                <Form
                    name='basic'
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    style={{
                        display: isCanVote ? 'none' : '',
                    }}
                    className='add-candidate'>
                    <Form.Item className='title'>
                        <div>Add at least 2 candidates to vote</div>
                    </Form.Item>
                    <Form.Item
                        label='Candidate'
                        name='candidate'
                        className='input-field'>
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label='Party'
                        name='party'
                        className='input-field'>
                        <Input />
                    </Form.Item>

                    <div className='buttons'>
                        <Form.Item>
                            <Button
                                type='primary'
                                htmlType='submit'
                                className='submit'>
                                Submit
                            </Button>
                        </Form.Item>
                        <Form.Item>
                            <Button
                                className='start'
                                onClick={() => startVoting()}>
                                Start Voting!
                            </Button>
                        </Form.Item>
                    </div>
                </Form>

                <Table
                    dataSource={candidates}
                    columns={columns}
                    className='table'></Table>
            </div>
        </div>
    );
};

export default Vote;
