import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Messenger from "./pages/messenger/messenger"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

function App() {
  const { token } = useContext(AuthContext);
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          {token ? <Messenger /> : <Login />}
        </Route>
        <Route path="/login">{token ? <Redirect to="/" /> : <Login />}</Route>
        <Route path="/register">
          {token ? <Redirect to="/login" /> : <Register />}
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
