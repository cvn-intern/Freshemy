import { configureStore } from "@reduxjs/toolkit";
import { ToolkitStore } from "@reduxjs/toolkit/dist/configureStore";
import authSlice from "./slice/auth.slice";
import sectionSlice from "./slice/section.slice";
import userSlice from "./slice/user.slice";
import courseSlice from "./slice/course.slice";
import lessonSlice from "./slice/lesson.slice";

const store: ToolkitStore = configureStore({
    reducer: {
        authSlice: authSlice,
        userSlice: userSlice,
        sectionSlice: sectionSlice,
        courseSlice: courseSlice,
        lessonSlice: lessonSlice,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
