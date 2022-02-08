import jwt from 'jwt-decode'


const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        token: null,
        username: null,
        profilePicture: null,
        email: null,
        userId: null,
        isFetching: true,
        error: false,
      };
    case "LOGIN_SUCCESS":
      const user = action.payload ? jwt(action.payload): null
      let username = user ? user.username : null;
      let email = user ? user.email : null;
      let profilePicture = user ? user.profilePicture : null;
      let userId = user ? user._id : null;
      return {
        token: action.payload,
        username: username,
        profilePicture: profilePicture,
        email: email,
        userId: userId,
        isFetching: false,
        error: false,
      };
    case "LOGIN_FAILURE":
      return {
        token: null,
        username: null,
        profilePicture: null,
        userId: null,
        email: null,
        isFetching: false,
        error: true,
      };
    default:
      return state;
  }
};

export default AuthReducer;
