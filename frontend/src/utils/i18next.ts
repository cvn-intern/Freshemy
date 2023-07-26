import i18n from "i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { errorMessages, successMessages, HTTP_CALL } from "../utils/contants";

i18n.use(Backend)
    .use(LanguageDetector)
    .init({
        fallbackLng: "vn",
        debug: true,
        resources: {
            vn: {
                translation: {
                    errorMessages,
                    successMessages,
                    HTTP_CALL,
                },
            },
        },
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
