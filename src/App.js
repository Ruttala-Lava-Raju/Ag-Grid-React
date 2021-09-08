import Login from './Login';
import Course from './Course';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
function App()
{
	return (
		<Router>
			<Switch>
				<Route exact path="/">
					<Login/>
				</Route>
				<Route exact path="/Course">
					<Course />
				</Route>
			</Switch>
		</Router>
	)
}


export default App;
