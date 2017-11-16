import firebase from '../../firebase';
const db = firebase.database().ref();
const uploadTask = firebase.storage().ref();

export const SAVE_EVENT_SUCCESS = "SAVE_EVENT_SUCCESS";
export const TOOGLE_LOCK_SUCCESS = "TOOGLE_LOCK_SUCCESS";
export const RESET_EVENTS_SUCCESS = "RESET_EVENTS_SUCCESS";
export const UPDATE_EVENT_SUCCESS = "UPDATE_EVENT_SUCCESS";
export const NEW_EVENT_SUCCESS = "NEW_EVENT_SUCCESS";

export function saveEventSuccess(evento){
    return {type: SAVE_EVENT_SUCCESS, evento}
}
export function toogleLockSuccess(evento){
    return {type: TOOGLE_LOCK_SUCCESS, evento}
}

export function resetEventsSuccess() {
    return {type: RESET_EVENTS_SUCCESS}
}

export function updateEventSuccess(evento){
    return { type: UPDATE_EVENT_SUCCESS, evento };
}

export function newEventSuccess(event){
    return {type: NEW_EVENT_SUCCESS, event}
}

export const saveEvent = (event) => (dispatch, getState) => {
    let updates = {};
    let key;
    if(event.id) key = event.id;
    else key = db.push().key;

    let uid = getState().usuario.id;
    event['id'] = key;
    updates[`dev/events/${key}`] = event;
    updates[`dev/users/${uid}/eventsCreated/${event.id}`] = true;
    return db.update(updates)
        .then(snap=>{
            return Promise.resolve(snap)
        }).catch(error=>{
            console.log(error);
            return Promise.reject(error.message)
        })

};

export function toogleLock(evento){
    return function (dispatch) {
        dispatch(toogleLockSuccess(evento));
        return Promise.resolve();
    }
}

export function resetEventos() {
    return function (dispatch) {
        dispatch(resetEventsSuccess());
        return Promise.resolve();
    }
}

export function updateEvento(evento){
    return function (dispatch, getState) {
        dispatch(updateEventSuccess(evento));
        return Promise.resolve();
    }
}


export const  newEvent = () => (dispatch) => {
        return db.child('dev/events')
            .on('child_added', snap => {
                let evento = snap.val();
                dispatch(newEventSuccess(evento));
            });
};


export const uploadPhoto = (fileName, file)  => (dispatch, getState) => {
    return uploadTask.child('dev/'+ fileName).put(file);
};


export const waitForUploadListener = () => (dispatch,getState) =>  {
    uploadTask.on('state_changed', snapshot => {
        let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
    });
};