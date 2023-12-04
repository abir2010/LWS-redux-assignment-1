// constants
const INC = "increment",
    DEC = "decrement",
    UPDATE = "UPDATE_STATE",
    RESET = "RESET_STATE",
    DELETE = "DELETE_STATE";

// Initial State - no changes here
const iState = [
    {
        id: 0,
        value: 0,
    },
];

// action creators
const increment = (value, id) => {
    return {
        type: INC,
        payload: parseInt(value),
        id: id,
    };
};
const decrement = (value, id) => {
    return {
        type: DEC,
        payload: parseInt(value),
        id: id,
    };
};
const updateStatus = (newMatch) => {
    return {
        type: UPDATE,
        payload: newMatch,
        id: null,
    };
};
const resetState = () => {
    return {
        type: RESET,
        payload: 0,
        id: null,
    };
};
const deleteState = (id) => {
    return {
        type: DELETE,
        payload: null,
        id: id,
    };
};

// Reducer function - returns a new State
function scoreReducer(state = iState, action) {
    if (action.type === INC) {
        for (let i = 0; i < state.length; i++) {
            if (state[i].id === action.id) {
                const copyState = JSON.parse(JSON.stringify(state));
                copyState[i].value = state[i].value + action.payload;
                console.log(copyState);
                return copyState;
            }
        }
    } else if (action.type === DEC) {
        for (let i = 0; i < state.length; i++) {
            if (state[i].id === action.id) {
                const copyState = JSON.parse(JSON.stringify(state));
                const upValue = state[i].value - action.payload;
                copyState[i].value = upValue >= 0 ? upValue : 0;
                console.log(copyState);
                return copyState;
            }
        }
    } else if (action.type === UPDATE) {
        const copyState = JSON.parse(JSON.stringify(state));
        copyState.push(action.payload);
        return copyState;
    } else if (action.type === RESET) {
        const copyState = JSON.parse(JSON.stringify(state));
        for (let i = 0; i < copyState.length; i++) {
            copyState[i].value = action.payload;
        }
        return copyState;
    } else if (action.type === DELETE) {
        let copyState = JSON.parse(JSON.stringify(state));
        copyState = copyState.filter((item) => item.id !== action.id);
        console.log(copyState);
        return copyState;
    } else {
        return state;
    }
}

// Redux Store
const store = Redux.createStore(scoreReducer);

const render = () => {
    const currentState = store.getState();
    console.log(currentState);
    for (let i = 0; i < currentState?.length; i++) {
        const resElement = document.getElementById(`res-${currentState[i].id}`);
        resElement.innerText = currentState[i].value;
    }
};

render();

store.subscribe(render);

// action dispatch on input
function incField(element) {
    if (event.key === "Enter") {
        const elementString = element.id;
        const elementId = parseInt(elementString[elementString.length - 1]);
        store.dispatch(increment(element.value, elementId));
        element.value = "";
    }
}
function decField(element) {
    if (event.key === "Enter") {
        const elementString = element.id;
        const elementId = parseInt(elementString[elementString.length - 1]);
        store.dispatch(decrement(element.value, elementId));
        element.value = "";
    }
}

// form validation control
function validateForm() {
    return false;
}

// add another match function
let i = 1;
function addMatch() {
    const allMatchContainer = document.getElementById("all-matches");

    var singleMatch = `
    <div id=${i} class="match">
        <div class="wrapper">
            <button onclick="deleteMatch(${i})" class="lws-delete">
                <img src="./image/delete.svg" alt="" />
            </button>
            <h3 class="lws-matchName">Match ${i + 1}</h3>
        </div>

        <div class="inc-dec">
            <form
                class="incrementForm"
                onsubmit="return validateForm()"
            >
                <h4>Increment</h4>
                <input
                    onkeydown="incField(this)"
                    id=inc-${i}
                    type="number"
                    name="increment"
                    class="lws-increment"
                />
            </form>
            <form
                class="decrementForm"
                onsubmit="return validateForm()"
            >
                <h4>Decrement</h4>
                <input
                    onkeydown="decField(this)"
                    id=dec-${i}
                    type="number"
                    name="decrement"
                    class="lws-decrement"
                />
            </form>
        </div>

        <div class="numbers">
            <h2 id=res-${i} class="lws-singleResult"></h2>
        </div>
    </div>
    `;

    allMatchContainer.insertAdjacentHTML("beforeend", singleMatch);

    const newMatch = {
        id: i,
        value: 0,
    };
    i++;
    console.log(i);

    store.dispatch(updateStatus(newMatch));
    // i++;
}

// delete single match function
function deleteMatch(id) {
    const container = document.getElementById(id);
    const allMatches = document.getElementById("all-matches");
    if (allMatches && container) {
        store.dispatch(deleteState(parseInt(id)));
        allMatches.removeChild(container);
    }
}

// reset value function
function resetValue() {
    store.dispatch(resetState());
}
