const initialState = {
  avatarUrl: '',
  email: '',
  error: '',
  favorites: [],
  firstName: '',
  lastName: '',
  id: '',
  isComplete: false,
  isLoading: false,
  isLoggedIn: false,
  projects: [],
  team: '',
  uid: '',
  username: ''
};

function userReducer(state = initialState, action) {
  switch (action.type) {
    case 'AUTOLOGIN_REQ': {
      return {
        ...state,
        avatarUrl: '',
        email: '',
        error: '',
        favorites: [],
        firstName: '',
        lastName: '',
        id: '',
        isComplete: false,
        isLoading: true,
        isLoggedIn: false,
        projects: [],
        team: '',
        uid: '',
        username: ''
      };
    }
    case 'AUTOLOGIN_RES': {
      return {
        ...state,
        avatarUrl: action.avatarUrl,
        email: action.email,
        error: '',
        favorites: action.favorites,
        firstName: action.firstName,
        lastName: action.lastName,
        id: action.id,
        isComplete: true,
        isLoading: false,
        isLoggedIn: true,
        projects: action.projects,
        team: action.team,
        uid: action.uid,
        username: action.username
      };
    }
    case 'AUTOLOGIN_RES_GUEST': {
      return {
        ...state,
        avatarUrl: '',
        email: '',
        error: '',
        favorites: [],
        firstName: '',
        lastName: '',
        id: '',
        isComplete: true,
        isLoading: false,
        isLoggedIn: false,
        projects: [],
        team: '',
        uid: '',
        username: ''
      };
    }
    case 'AUTOLOGIN_ERR': {
      return {
        ...state,
        avatarUrl: '',
        email: '',
        error: '',
        favorites: [],
        firstName: '',
        lastName: '',
        id: '',
        isComplete: true,
        isLoading: false,
        isLoggedIn: false,
        projects: [],
        team: '',
        uid: '',
        username: ''
      };
    }
    case 'LIST_PROJECTS_RES': {
      return {
        ...state,
        projects: action.projects
      };
    }
    case 'LOGIN_REQ': {
      return {
        ...state,
        avatarUrl: '',
        email: '',
        error: '',
        favorites: [],
        firstName: '',
        lastName: '',
        id: '',
        isComplete: false,
        isLoading: true,
        isLoggedIn: false,
        projects: [],
        team: '',
        uid: '',
        username: ''
      };
    }
    case 'LOGIN_RES': {
      return {
        ...state,
        avatarUrl: action.avatarUrl,
        email: action.email,
        error: '',
        favorites: action.favorites,
        firstName: action.firstName,
        lastName: action.lastName,
        id: action.id,
        isComplete: true,
        isLoading: false,
        isLoggedIn: true,
        projects: action.projects,
        team: action.team,
        uid: action.uid,
        username: action.username
      };
    }
    case 'LOGIN_ERR': {
      return {
        ...state,
        avatarUrl: '',
        email: '',
        error: action.error,
        favorites: [],
        firstName: '',
        lastName: '',
        id: '',
        isComplete: true,
        isLoading: false,
        isLoggedIn: false,
        projects: [],
        team: '',
        uid: '',
        username: ''
      };
    }
    case 'LOGOUT_REQ': {
      return {
        ...state,
        avatarUrl: '',
        email: '',
        error: '',
        favorites: [],
        firstName: '',
        lastName: '',
        id: '',
        isLoading: true,
        isLoggedIn: false,
        projects: [],
        team: '',
        uid: '',
        username: ''
      };
    }
    case 'LOGOUT_RES': {
      return {
        ...state,
        avatarUrl: '',
        email: '',
        error: '',
        favorites: [],
        firstName: '',
        lastName: '',
        id: '',
        isLoading: false,
        isLoggedIn: false,
        projects: [],
        team: '',
        uid: '',
        username: ''
      };
    }
    case 'LOGOUT_ERR': {
      return {
        ...state,
        avatarUrl: '',
        email: '',
        error: action.error,
        favorites: [],
        firstName: '',
        lastName: '',
        id: '',
        isLoading: false,
        isLoggedIn: false,
        projects: [],
        team: '',
        uid: '',
        username: ''
      };
    }
    case 'SIGNUP_REQ': {
      return {
        ...state,
        avatarUrl: '',
        email: '',
        error: '',
        favorites: [],
        firstName: '',
        lastName: '',
        id: '',
        isLoading: true,
        isLoggedIn: false,
        projects: [],
        team: '',
        uid: '',
        username: ''
      };
    }
    case 'SIGNUP_RES': {
      return {
        ...state,
        avatarUrl: action.avatarUrl,
        email: action.email,
        error: '',
        favorites: action.favorites,
        firstName: action.firstName,
        lastName: action.lastName,
        id: action.id,
        isLoading: false,
        isLoggedIn: true,
        projects: [],
        team: action.team,
        uid: action.uid,
        username: action.username
      };
    }
    case 'SIGNUP_ERR': {
      return {
        ...state,
        avatarUrl: '',
        email: '',
        error: action.error,
        favorites: [],
        firstName: '',
        lastName: '',
        id: '',
        isLoading: false,
        isLoggedIn: false,
        projects: [],
        team: '',
        uid: '',
        username: ''
      };
    }
    default: {
      return state;
    }
  }
}

export default userReducer;
