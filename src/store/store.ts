// src/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";

import authReducer from "./slice/auth";
import serviceProviderReducer from "./slice/serviceProvider";

import messageReducer from "./slice/message";
import userReducer from "./slice/user";
import serviceCategoryReducer from "./slice/serviceCategory";
import serviceListReducer from "./slice/serviceList";
import adminDashboardReducer from "./slice/adminDashboard";

import roleReducer from "./slice/role";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
};

const rootReducer = combineReducers({
  auth: authReducer,
  message: messageReducer,
  user: userReducer,
  role: roleReducer,
  serviceCategory: serviceCategoryReducer,
  serviceProvider: serviceProviderReducer,
  serviceList: serviceListReducer,
  adminDashboard: adminDashboardReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
