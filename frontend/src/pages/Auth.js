import React, { Fragment, useState, useContext } from "react";
import {useHistory} from 'react-router-dom'
import AuthContext from "../context/auth-context";

import "../assets/scss/Auth.scss";

const Auth = () => {
  const history = useHistory();
  const [isLogin, setLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const context = useContext(AuthContext);
  const  GRAPHQL_URL = '/graphql';

  const submitHandler = (e) => {
    e.preventDefault();
    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }
    let requestBody = {
      query: `
        query Login($email:String!,$password:String!){
          login(email:$email, password:$password){
            userId
            token
            tokenExpiration
          }
        }
      `,
      variables:{
        email: email,
        password: password
      }
    };
    if (!isLogin) {
      requestBody = {
        query: `
          mutation CreateUser($email:String!,$password:String!){
            createUser(userInput:{email:$email, password:$password}){
              _id
              email
            }
          }
        `,
        variables:{
          email:email,
          password:password
        }
      };
    }

    fetch(GRAPHQL_URL, {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed");
        }
        return res.json();
      })
      .then((resData) => {
        if(isLogin){
          if (resData.data.login.token) {
            context.login(
              resData.data.login.token,
              resData.data.login.userId,
              resData.data.login.tokenExpiration
            );
            history.push("/events");
          }
        }else{
          const email = resData.data.createUser.email;
          setLogin(true);
          setEmail(email);
        }
        
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const switchModeHandler = () => {
    setLogin(!isLogin);
  };

  return (
    <Fragment>
      <form className="auth-form" onSubmit={submitHandler}>
        <div className="form-control">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-actions">
          <button className="btn mr-1" type="submit">Submit</button>
          <button className="btn" type="button" onClick={switchModeHandler}>
            Switch to {isLogin ? "Signup" : "Login"}
          </button>
        </div>
      </form>
    </Fragment>
  );
};

export default Auth;
