import apiCaller from "../api-config/apiCaller";
import { ChangePassword as ChangePasswordType } from "../types/user";

import i18n from "../utils/i18next";

const changePassword = async (values: ChangePasswordType) => {
    const path = "/users/change-password";

    const response = await apiCaller(i18n.t("HTTP_CALL.HTTP_PATCH"), path, values);

    return response;
};

const UserApis = {
    changePassword,
};

export default UserApis;
