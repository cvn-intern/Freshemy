import { EditSection as EditSectionType, Section } from "../types/section";
import apiCaller from "../api-config/apiCaller";

import i18n from "../utils/i18next";

const addSection = async (values: Section) => {
    const path = "/sections";

    const response = await apiCaller(i18n.t("HTTP_CALL.HTTP_POST"), path, values);

    return response;
};

const editSection = async (values: EditSectionType) => {
    const path = `/sections/${values.id}`;

    const response = await apiCaller(i18n.t("HTTP_CALL.HTTP_PUT"), path, { course_id: values.id, title: values.title });

    return response;
};

const deleteSection = async (id: number) => {
    const path = `/sections/${id}`;

    const response = await apiCaller(i18n.t("HTTP_CALL.HTTP_DELETE"), path);

    return response;
};

const getSectionByCourseId = async (values: number) => {
    const path = `/courses/${values}/section`;

    const response = await apiCaller(i18n.t("HTTP_CALL.HTTP_GET"), path);

    return response;
};

const SectionApis = {
    addSection,
    editSection,
    deleteSection,
    getSectionByCourseId,
};

export default SectionApis;
