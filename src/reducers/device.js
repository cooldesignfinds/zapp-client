const initialState = {
  macAddress: '',
  serialNumber: ''
};

function deviceReducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_DEVICE': {
      return {
        ...state,
        macAddress: action.macAddress,
        serialNumber: action.serialNumber
      };
    }
    default: {
      return state;
    }
  }
}

export default deviceReducer;
