import { useEffect, useState } from 'react';
import ElectionContract from './contracts/Election.json';
import getWeb3 from './getWeb3';
import { Table, Form, Input, Button, Checkbox } from 'antd';

const App = () => {
    const [accounts, setAccounts] = useState([]);
    const [ElectionInstance, setElectionInstance] = useState();
    const [web3, setWeb3] = useState();
    const [candidates, setCandidates] = useState([]);
    const [candidatesCount, setCandidatesCount] = useState([]);

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
    }, []);

    useEffect(() => {
        getCandidates();
    }, [candidatesCount]);

    useEffect(() => {
        ElectionInstance && getCandidatesCount();
    }, [ElectionInstance]);

    const columns = [
        {
            title: 'id',
            dataIndex: 'id',
            key: 'id',
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
                console.log('loading');
                getCandidatesCount();
            });
    };

    const onFinish = (values) => {
        addCandidate(values);
    };

    if (accounts === []) return <div></div>;
    return (
        <div className='App'>
            <Table dataSource={candidates} columns={columns}></Table>
            <Form
                name='basic'
                initialValues={{ remember: true }}
                onFinish={onFinish}>
                <Form.Item label='Candidate' name='candidate'>
                    <Input />
                </Form.Item>

                <Form.Item label='Party' name='party'>
                    <Input />
                </Form.Item>

                <Form.Item>
                    <Button type='primary' htmlType='submit'>
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default App;
