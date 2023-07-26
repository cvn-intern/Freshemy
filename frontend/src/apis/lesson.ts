import apiCaller from "../api-config/apiCaller";
import { AddLesson as AddLessonType } from "../types/lesson";

import i18n from "../utils/i18next";

const addLesson = async (values: AddLessonType) => {
    const path = "/lessons";

    const response = await apiCaller(i18n.t("HTTP_CALL.HTTP_POST"), path, values);

    return response;
};

const LessonApis = {
    addLesson,
};

export default LessonApis;
