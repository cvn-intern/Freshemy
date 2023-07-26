import apiCaller from "../api-config/apiCaller";
import { Register as RegisterType, Login as LoginType, ResetPassword as ResetPasswordType } from "../types/auth";
import i18n from "../utils/i18next";

const login = async (values: LoginType) => {
    const path = "auth/login";
    const data = {
        email: values.email,
        password: values.password,
    };

    const response = await apiCaller(i18n.t("HTTP_CALL.HTTP_POST"), path, data);
    return response;
};

const register = async (values: RegisterType) => {
    const path = "/auth/signup";

    const data: RegisterType = {
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        password: values.password,
        confirm_password: values.confirm_password,
    };

    const response = await apiCaller(i18n.t("HTTP_CALL.HTTP_POST"), path, data);
    return response;
};

const getMe = async () => {
    const path = "auth/me";
    const response = await apiCaller(i18n.t("HTTP_CALL.HTTP_GET"), path);
    return response;
};

const forgotPassword = async (email: string) => {
    const path = "auth/forgot-password";
    const data = {
        email,
    };
    const response = await apiCaller(i18n.t("HTTP_CALL.HTTP_POST"), path, data);
    return response;
};

const resetPassword = async (values: ResetPasswordType) => {
    const path = `auth/reset-password`;
    const data = {
        confirmPassword: values.confirmPassword,
        password: values.password,
        token: values.token,
    };

    const response = await apiCaller(i18n.t("HTTP_CALL.HTTP_POST"), path, data);

    return response;
};

export const refreshToken = async () => {
    const path = "auth/refresh";

    const response = await apiCaller(i18n.t("HTTP_CALL.HTTP_GET"), path);

    return response;
};

const verifyEmail = async (token: string) => {
    const path = `auth/verify-email/${token}`;

    const response = await apiCaller(i18n.t("HTTP_CALL.HTTP_GET"), path);

    return response;
};

const AuthApis = {
    login,
    register,
    getMe,
    forgotPassword,
    resetPassword,
    refreshToken,
    verifyEmail,
};

export default AuthApis;
