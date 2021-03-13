import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Signup from "./components/Authentication/Signup";
import Login from "./components/Authentication/Login";
import ForgotPassword from "./components/Authentication/ForgotPassword";
import Feed from "./components/Feed/Feed";
import Profile from "./components/Profile/Profile";
import LikedPosts from "./components/Profile/Posts/LikedPosts";
import NotFoundPage from "./components/Miscellaneous/NotFoundPage";
import PostById from "./components/Posts/PostById";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/" component={Feed} />
          <Route path="/signup" component={Signup} />
          <Route path="/login" component={Login} />
          <Route path="/reset" component={ForgotPassword} />
          <Route path="/post/:id" component={PostById} />
          <Route path="/users/:usernameL/liked" component={LikedPosts} />
          <Route exact path="/users/:username" component={Profile} />
          <Route path="*" component={NotFoundPage} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
