const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const {createRoot} = require('react-dom/client');

const handleLogin = (e) => {
    e.preventDefault();
    helper.hideError();

    const username = e.target.querySelector('#user').value;
    const pass = e.target.querySelector('#pass').value;

    if(!username || !pass) {
        helper.handleError('Username or password is empty!');
        return false;
    }

    helper.sendPost(e.target.action, {username, pass});
    return false;
}

const handleSignup = (e, onUserAdded) => {
    e.preventDefault();
    helper.hideError();

    const username = e.target.querySelector('#user').value;
    const pass = e.target.querySelector('#pass').value;
    const pass2 = e.target.querySelector('#pass2').value;

    if(!username || !pass || !pass2) {
        helper.handleError('All fields are required');
        return false;
    }

    if(pass !== pass2) {
        helper.handleError('Passwords do not match!');
        return false;
    }

    helper.sendPost(e.target.action, {username, pass, pass2}, onUserAdded);

    return false;
}

const LoginWindow = (props) => {
    return (
        <form id="loginForm"
            name="loginForm"
            onSubmit={handleLogin}
            action="/login"
            method="POST"
            className="mainForm"
        >
            <label htmlFor="username">Username: </label>
            <input id="user" type="text" name="username" placeholder="username" />
            <label htmlFor="pass">Password: </label>
            <input id="pass" type="password" name="pass" placeholder="password" />
            <input className="formSubmit" type="submit" value="Sign in" />
        </form>
    );
};

const SignupWindow = (props) => {
    return (
        <form id="signupForm"
            name="signupForm"
            onSubmit={(e) => handleSignup(e, props.triggerReload)}
            action="/signup"
            method="POST"
            className="mainForm"
        >
            <label htmlFor="username">Username: </label>
            <input id="user" type="text" name="username" placeholder="username" />
            <label htmlFor="pass">Password: </label>
            <input id="pass" type="password" name="pass" placeholder="password" />
            <label htmlFor="pass">Password: </label>
            <input id="pass2" type="password" name="pass2" placeholder="retype password" />
            <input className="formSubmit" type="submit" value="Sign up" />
        </form>
    );
};

const GetUsers = (props) => {
    const [users, setUsers] = useState(props.users);
    console.log(users);
    useEffect(() => {
        const loadUsersFromServer = async () => {
            const response = await fetch('/getAccounts');
            const data = await response.json();
            setUsers(data);
        };
        loadUsersFromServer();
    }, [props.reloadUsers]);

    if(users.length === 0) {
        return (
            <div className="userList">
                <h3 className="emptyDomo">No Logins Yet!</h3>
            </div>
        );
    }

    const userNodes = users.map(account => {
        return (
            <div className="users">
                <h3 className="user">Username: {account.username}</h3>
            </div>
        );
    });

    return (
        <div className="userList">
            {userNodes}
        </div>
    );
}

const AdminWindow = () => {
    const [reloadUsers, setReloadUsers] = useState(false);

    return (
        <div id="users">
            <p>This is a list of all usernames that have logged into this system.</p>
            <GetUsers users={[]} reloadUsers={reloadUsers} />
        </div>
    );
}

const init = () => {
    const loginButton = document.getElementById('loginButton');
    const signupButton = document.getElementById('signupButton');
    const adminButton = document.getElementById('adminButton');

    const root = createRoot(document.getElementById('content'));

    loginButton.addEventListener('click', (e) => {
        e.preventDefault();
        root.render( <LoginWindow /> );
        return false;
    });

    signupButton.addEventListener('click', (e) => {
        e.preventDefault();
        root.render( <SignupWindow /> );
        return false;
    });

    adminButton.addEventListener('click', (e) => {
        e.preventDefault();
        root.render( <AdminWindow /> );
        return false;
    })

    root.render( <LoginWindow /> );
};

window.onload = init;