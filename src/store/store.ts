import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { rootReducer } from "./rootReducer";
import { rootSaga } from "./rootSaga";
// import sessionExpirationMiddleware from "./middlewares";

const persistConfig = {
  key: "root",
  storage,
  blacklist: [],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false,
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, REGISTER],
      },
    }).concat(sagaMiddleware)
    // .concat(sessionExpirationMiddleware)
    ,
    devTools:process.env.NODE_ENV !== 'production'
});


sagaMiddleware.run(rootSaga);
export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;

store.subscribe(()=>{
  const state = store.getState();
console.log("\nAuth slice", state.auth)  
// console.log("\n Toast slice", state.toast)  
})