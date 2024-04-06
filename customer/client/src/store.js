import { configureStore } from "@reduxjs/toolkit";

import UserSlice from "./slices/UserSlice";
import { combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer,persistStore } from "redux-persist";
import PageSlice from "./slices/PageSlice";
import ProductSlice from "./slices/ProductSlice";
const persistConfig={
    key:'root',
    storage
}


const rootReducer=combineReducers({
    user:UserSlice,
    page:PageSlice,
    product:ProductSlice
})

const persistedReducer=persistReducer(persistConfig,rootReducer);

export const store=configureStore({
    reducer:persistedReducer
})


export const persistor=persistStore(store);