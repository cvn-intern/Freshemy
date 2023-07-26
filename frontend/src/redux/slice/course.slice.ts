import { PayloadAction, createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Response } from "../../types/response";

import {
    NewCourse,
    Category,
    Course,
    Course as CourseType,
    PagingCourse,
    GetMyCourses as GetMyCoursesType,
    CourseDetail as CourseDetailType,
    ChangeThumbnail as ChangeThumbnailType,
    CourseChangeInformation as CourseChangeInformationType,
} from "../../types/course";

import CourseApis from "../../apis/course";

type CourseSlice = {
    selectCategories: Category[];
    categories: Category[];
    courses: CourseType[];
    error: string;
    message: string;
    isLoading: boolean;
    totalPage: number;
    courseDetail: CourseDetailType;
    courseChangeDetail: CourseChangeInformationType;
};

export const createCourses = createAsyncThunk<Response<null>, NewCourse, { rejectValue: Response<null> }>(
    "course/createCourse",
    async (body, ThunkAPI) => {
        try {
            const response = await CourseApis.createCourse(body);
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    }
);

export const getCategories = createAsyncThunk<Response<Category[]>, null, { rejectValue: Response<null> }>(
    "course/getCategories",
    async (body, ThunkAPI) => {
        try {
            const response = await CourseApis.getCategories();
            return response.data.data as Response<Category[]>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    }
);

export const getMyCourses = createAsyncThunk<Response<PagingCourse>, GetMyCoursesType, { rejectValue: Response<null> }>(
    "course/getMyCourses",
    async (body, ThunkAPI) => {
        try {
            const response = await CourseApis.getMyCourses(body);
            return response.data as Response<PagingCourse>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    }
);

export const getCourseDetail = createAsyncThunk<Response<CourseDetailType>, string, { rejectValue: Response<null> }>(
    "course/getCourseDetail",
    async (body, ThunkAPI) => {
        try {
            const response = await CourseApis.getCourseDetail(body);
            return response.data as Response<CourseDetailType>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    }
);

export const getCourseDetailById = createAsyncThunk<
    Response<CourseChangeInformationType>,
    number,
    { rejectValue: Response<null> }
>("course/getCourseDetailById", async (body, ThunkAPI) => {
    try {
        const response = await CourseApis.getCourseDetailById(body);
        return response.data as Response<CourseChangeInformationType>;
    } catch (error: any) {
        return ThunkAPI.rejectWithValue(error.data as Response<null>);
    }
});

export const deleteCourse = createAsyncThunk<Response<null>, number, { rejectValue: Response<null> }>(
    "course/deleteCourse",
    async (body, ThunkAPI) => {
        try {
            const response = await CourseApis.deleteCourse(body);
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    }
);

export const changeThumbnail = createAsyncThunk<Response<null>, ChangeThumbnailType, { rejectValue: Response<null> }>(
    "course/changeThumbnail",
    async (body, ThunkAPI) => {
        try {
            const response = await CourseApis.changeThumbnail(body);
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    }
);

export const changeInformation = createAsyncThunk<
    Response<null>,
    CourseChangeInformationType,
    { rejectValue: Response<null> }
>("course/changeInformation", async (body, ThunkAPI) => {
    try {
        const response = await CourseApis.changeInformation(body);
        return response.data as Response<null>;
    } catch (error: any) {
        return ThunkAPI.rejectWithValue(error.data as Response<null>);
    }
});

export const getTop10Courses = createAsyncThunk<Response<CourseType[]>, string, { rejectValue: Response<null> }>(
    "course/getTop10Courses",
    async (body, ThunkAPI) => {
        try {
            const response = await CourseApis.getTop10Courses();
            return response.data as Response<CourseType[]>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    }
);

const initialState: CourseSlice = {
    selectCategories: [],
    categories: [],
    courses: [],
    courseDetail: {
        id: undefined,
        slug: "",
        title: "",
        categories: [],
        summary: "",
        author: {
            id: undefined,
            first_name: "",
            last_name: "",
        },
        ratings: undefined,
        description: "",
        sections: [],
        created_at: "",
        updated_at: "",
        thumbnail: "",
        status: false,
    },
    courseChangeDetail: {
        id: undefined,
        slug: "",
        title: "",
        categories: [],
        summary: "",
        status: false,
        description: "",
        thumbnail: "",
    },

    error: "",
    message: "",
    isLoading: false,
    totalPage: 1,
};

export const courseSlice = createSlice({
    name: "course",
    initialState: initialState,
    reducers: {
        setError: (state, payload: PayloadAction<string>) => {
            state.error = payload.payload;
        },
        setMessage: (state, payload: PayloadAction<string>) => {
            state.message = payload.payload;
        },
        setMessageEmpty: (state) => {
            state.error = "";
            state.message = "";
        },
        setCategories: (state, payload: PayloadAction<Category[]>) => {
            state.categories = payload.payload;
        },
        reset: (state) => {
            state.categories = [...state.categories, ...state.selectCategories];
            state.selectCategories = [];
        },
        setDeleteCourse: (state, action: PayloadAction<number>) => {
            state.courses = state.courses.filter((course: CourseType) => course.id !== action.payload);
        },
    },
    extraReducers: (builder) => {
        builder.addCase(createCourses.pending, (state) => {
            state.error = "";
            state.message = "";
            state.isLoading = true;
        });
        builder.addCase(createCourses.fulfilled, (state, action) => {
            state.message = action.payload.message;
            state.isLoading = false;
        });
        builder.addCase(createCourses.rejected, (state, action) => {
            state.error = action.payload?.message as string;
            state.isLoading = false;
        });

        builder.addCase(getCategories.pending, (state) => {
            state.error = "";
            state.message = "";
        });
        builder.addCase(getCategories.fulfilled, (state, action) => {
            state.categories = action.payload.data as Category[];
        });
        builder.addCase(getCategories.rejected, (state, action) => {
            state.error = action.payload?.message as string;
        });

        builder.addCase(getMyCourses.pending, (state) => {
            state.message = "";
            state.error = "";
            state.isLoading = true;
        });

        builder.addCase(getMyCourses.fulfilled, (state, action) => {
            state.courses = action.payload.data?.courses as Course[];
            state.totalPage = action.payload.data?.total_page as number;
            state.isLoading = false;
        });

        builder.addCase(getMyCourses.rejected, (state, action) => {
            state.message = action.payload?.message as string;
            state.isLoading = false;
        });

        builder.addCase(deleteCourse.pending, (state) => {
            state.message = "";
            state.error = "";
            state.isLoading = true;
        });

        builder.addCase(deleteCourse.fulfilled, (state, action) => {
            state.isLoading = false;
        });

        builder.addCase(deleteCourse.rejected, (state, action) => {
            state.error = action.error as string;
            state.isLoading = false;
        });

        builder.addCase(getCourseDetail.pending, (state) => {
            state.message = "";
            state.error = "";
            state.isLoading = true;
        });

        builder.addCase(getCourseDetail.fulfilled, (state, action) => {
            state.courseDetail = action.payload.data as CourseDetailType;
            state.isLoading = false;
        });

        builder.addCase(getCourseDetail.rejected, (state, action) => {
            state.error = action.error as string;

            state.isLoading = false;
        });

        builder.addCase(getCourseDetailById.pending, (state) => {
            state.message = "";
            state.error = "";
            state.isLoading = true;
        });

        builder.addCase(getCourseDetailById.fulfilled, (state, action) => {
            state.courseChangeDetail = action.payload.data as CourseChangeInformationType;
            state.selectCategories = action.payload.data?.categories as Category[];

            // state.selectCategories.forEach((category) => {
            //     const index = state.categories.findIndex((item) => item.title === category.title);
            //     if (index >= 0) {
            //         state.categories.splice(index, 1);
            //     }
            // });
            state.isLoading = false;
        });

        builder.addCase(getCourseDetailById.rejected, (state, action) => {
            state.error = action.error as string;
            state.isLoading = false;
        });

        builder.addCase(changeThumbnail.pending, (state) => {
            state.message = "";
            state.error = "";
            state.isLoading = true;
        });

        builder.addCase(changeThumbnail.fulfilled, (state, action) => {
            state.message = action.payload.message;
            state.isLoading = false;
        });

        builder.addCase(changeThumbnail.rejected, (state, action) => {
            state.error = action.error as string;
            state.isLoading = false;
        });

        builder.addCase(changeInformation.pending, (state) => {
            state.message = "";
            state.error = "";
            state.isLoading = true;
        });

        builder.addCase(changeInformation.fulfilled, (state, action) => {
            state.message = action.payload.message;
            state.isLoading = false;
        });

        builder.addCase(changeInformation.rejected, (state, action) => {
            state.error = action.error as string;
            state.isLoading = false;
        });

        builder.addCase(getTop10Courses.pending, (state) => {
            state.message = "";
            state.error = "";
            state.isLoading = true;
        });

        builder.addCase(getTop10Courses.fulfilled, (state, action) => {
            state.message = action.payload.message;
            state.courses = action.payload.data as Course[];
            state.isLoading = false;
        });

        builder.addCase(getTop10Courses.rejected, (state, action) => {
            state.error = action.error as string;
            state.isLoading = false;
        });
    },
});

export const { setError, setCategories, reset, setDeleteCourse } = courseSlice.actions;

export default courseSlice.reducer;
