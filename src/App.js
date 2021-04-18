import { Router, Route, Switch } from 'react-router-dom';
import Homepage from './pages/home';
import Vote from './pages/vote';
import { createBrowserHistory } from 'history';

const App = () => {
    const history = createBrowserHistory();
    return (
        <Router history={history}>
            <Switch>
                <Route exact path='/' component={Homepage} />
                <Route exact path='/vote' component={Vote} />
            </Switch>
        </Router>
    );
};

export default App;
