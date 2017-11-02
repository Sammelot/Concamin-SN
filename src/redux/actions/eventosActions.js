import firebase from '../../firebase';

export function createEvento(evento){
    return {type: "CREATE_EVENTO", evento}
}
export function toogleLockSuccess(evento){
    return {type: "TOOGLE_LOCK", evento}
}

export function toogleLock(evento){
    return function (dispatch) {
        dispatch(toogleLockSuccess(evento));
        return Promise.resolve();
    }
}


export function resetEventosSuccess() {
    return {type: "RESET_EVENTOS"}
}

export function resetEventos() {
    return function (dispatch) {
        dispatch(resetEventosSuccess());
        return Promise.resolve();
    }
}

export function loadEventosSuccess(eventos){
    return {type: "LOAD_EVENTOS_SUCCESS", eventos}
}

export function createEventoSuccess(evento){
    return {type: "SAVE_NEW_EVENTO_SUCCESS", evento}
}

export function updateEventoSuccess(evento){
    return { type: "UPDATE_EVENTO_SUCCESS", evento };
}

export function updateEvento(evento){
    return function (dispatch, getState) {
        dispatch(updateEventoSuccess(evento));
        return Promise.resolve();
    }
}


export function loadEventos(){
    return function (dispatch) {
        return firebase.database().ref('eventos')
            .once('value')
            .then(s => {
                let array = [];
                for (let k in s.val()){
                    let c = s.val()[k];
                    c['key'] = k;
                    array.push(c);
                }
                dispatch(loadEventosSuccess(array));
            }).catch(error =>{
                throw(error);
            });
    };
}


export function saveEvento(evento){
    return function (dispatch, getState){
        if(evento.key){
            let updates = {};
            updates['/eventos/' + evento.key] = evento;
            return firebase.database().ref().update(updates)
                .then(()=>{
                    return dispatch(updateEventoSuccess(evento));
                });
        }else{
            return firebase.database().ref('eventos/')
                .push(evento)
                .then(s =>{

                    evento['key'] = s.key;
                    return dispatch(createEventoSuccess(evento));
                })
                .catch(error => {
                    throw(error);
                });
        }


    };
}
