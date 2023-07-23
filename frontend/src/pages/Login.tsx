import { FC, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Formik, ErrorMessage, Field, Form } from "formik";
import { Login as LoginType } from "../types/auth";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { authActions } from "../redux/slice/index";
import { Navigate } from "react-router-dom";
import Skeleton from "../assets/images/Skeleton.png";
import { setMessageEmpty } from "../redux/slice/auth.slice";
import { loginValidationSchema } from "../validations/auth";

import toast from "react-hot-toast";

const Login: FC = () => {
    const dispatch = useAppDispatch();

    const isLogin: boolean = useAppSelector((state) => state.authSlice.isLogin);
    const isLoading: boolean = useAppSelector((state) => state.authSlice.isLoading);

    let error: string = useAppSelector((state) => state.authSlice.error) ?? "";

    const formikRef = useRef(null);

    useEffect(() => {
        dispatch(setMessageEmpty());
    }, [dispatch]);

    if (isLogin) return <Navigate to={"/"} />;

    const initialValue: LoginType = {
        email: "",
        password: "",
    };

    const handleOnSubmit: (values: LoginType) => void = (values: LoginType) => {
        // @ts-ignore
        dispatch(authActions.login(values)).then((response) => {
            if (response.payload.status_code === 200) {
                toast.success(response.payload.message);
                //@ts-ignore
                dispatch(authActions.getMe());
            } else {
                toast.error(response.payload.message);
            }
        });
    };

    const handleChange: () => void = () => {
        error = "";
    };

    return (
        <>
            <div className="container mx-auto">
                <div className="min-h-screen h-full  flex items-center justify-center mt-[100px]">
                    <div className="bg-primary m-4 rounded-xl shadow-lg">
                        <Formik
                            initialValues={initialValue}
                            validationSchema={loginValidationSchema}
                            onSubmit={handleOnSubmit}
                            innerRef={formikRef}
                        >
                            {(formik) => (
                                <Form className="p-4" onSubmit={formik.handleSubmit} onChange={handleChange}>
                                    <h1 className="font-bold text-[32px] text-center text-title">LOGIN TO FRESHEMY</h1>
                                    <form className="">
                                        <div className="flex flex-col mb-3">
                                            <label htmlFor="email" className="text-sm mb-1 tablet:text-xl">
                                                Email
                                            </label>
                                            <Field
                                                id="email"
                                                name="email"
                                                type="text"
                                                className={`px-2 py-4 rounded-lg border-[1px] outline-none max-w-sm ${
                                                    formik.errors.email && formik.touched.email ? "border-error" : ""
                                                }`}
                                            />
                                            <ErrorMessage
                                                name="email"
                                                component="span"
                                                className="text-[14px] text-error font-medium"
                                            />
                                        </div>
                                        <div className="flex flex-col mb-3">
                                            <label htmlFor="password" className="text-sm mb-1 tablet:text-xl">
                                                Password
                                            </label>
                                            <Field
                                                id="password"
                                                name="password"
                                                type="password"
                                                className={`px-2 py-4 rounded-lg border-[1px] outline-none max-w-sm ${
                                                    formik.errors.password && formik.touched.password
                                                        ? "border-error"
                                                        : ""
                                                }`}
                                            />
                                            <ErrorMessage
                                                name="password"
                                                component="span"
                                                className="text-[14px] text-error font-medium"
                                            />
                                        </div>
                                        {error !== "" && (
                                            <span className="text-[14px] text-error font-medium">{error}</span>
                                        )}
                                    </form>
                                    <button
                                        className="btn btn-primary w-full text-lg"
                                        type="submit"
                                        disabled={(error !== "" ? true : false) || isLoading}
                                    >
                                        Login
                                    </button>
                                    <p className="block mt-3 mb-2 text-center text-lg">
                                        Don't have an account?{" "}
                                        <span className="font-medium hover:opacity-80">
                                            <Link to={"/register"}>Signup</Link>
                                        </span>
                                    </p>
                                    <span className="block mt-3 mb-2 text-center font-medium text-lg hover:opacity-80">
                                        <Link to={"/forgot-password"}>Forgot Password?</Link>
                                    </span>
                                </Form>
                            )}
                        </Formik>
                    </div>
                    <div className="hidden tablet:block transition ease-in-out hover:scale-110 duration-200">
                        <img src={Skeleton} alt="Freshemy" />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
