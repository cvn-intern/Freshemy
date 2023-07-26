import AuthService from "./auth.service";
import UserService from "./user.service";
import SectionService from "./section.service";
import CategoryService from "../services/category.service";
import CourseService from "./course.service";
import LessonService from "./lesson.service";
import FileStorageService from "./filestorage.service";

const services = {
    AuthService,
    UserService,
    CourseService,
    SectionService,
    LessonService,
    CategoryService,
    FileStorageService
};

export default services;
