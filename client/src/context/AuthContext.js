import { createContext, useEffect, useReducer } from "react";
import AuthReducer from "./AuthReducer";

const INITIAL_STATE = {
  token:JSON.parse(localStorage.getItem("token")) || null,
  username:JSON.parse(localStorage.getItem("username")) || null,
  email:JSON.parse(localStorage.getItem("email")) || null,
  profilePicture:JSON.parse(localStorage.getItem("profilePicture")) || null,
  userId:JSON.parse(localStorage.getItem("userId")) || null,
  isFetching: false,
  error: false,
};


export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);
  
  useEffect(()=>{
    localStorage.setItem("token", JSON.stringify(state.token))
  },[state.token])

  useEffect(()=>{
    localStorage.setItem("username", JSON.stringify(state.username))
  },[state.username])

  useEffect(()=>{
    localStorage.setItem("email", JSON.stringify(state.email))
  },[state.email])

  useEffect(()=>{
    localStorage.setItem("profilePicture", JSON.stringify(state.profilePicture))
  },[state.profilePicture])

  useEffect(()=>{
    localStorage.setItem("userId", JSON.stringify(state.userId))
  },[state.userId])
  
  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        username: state.username,
        email: state.email,
        profilePicture: state.profilePicture,
        userId: state.userId,
        isFetching: state.isFetching,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
