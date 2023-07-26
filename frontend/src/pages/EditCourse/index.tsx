import React, { useEffect, useState, useRef } from "react";
import Navbar from "../../components/Navbar";
import { Formik, ErrorMessage, Field, FormikProps } from "formik";
import { editCourseValidationSchema } from "../../validations/course";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { sectionActions } from "../../redux/slice";
import { useNavigate, useParams } from "react-router-dom";
import Accordion from "../../components/Accordion";
import { AddSection as AddSectionType, Section as SectionType } from "../../types/section";
import DeleteModal from "../../components/DeleteModal";
import PopupAddLesson from "../../components/PopupAddLesson";
import { courseActions } from "../../redux/slice";
import { Category as CategoryType, CourseChangeInformation as CourseChangeInformationType } from "../../types/course";
import { setMessageEmpty } from "../../redux/slice/auth.slice";
import slugify from "slugify";

import toast from "react-hot-toast";
import CustomeSelect from "../../components/Select";

type Options = {
    value: number;
    label: string;
};

const customStyles = {
    control: (styles: any) => ({
        ...styles,
        position: "static",
        transform: "none",
        borderRadius: "0.25rem",
        padding: "10px",
        boxShadow: "",
    }),
    option: (styles: any) => ({
        ...styles,
    }),
    menu: (styles: any) => ({
        ...styles,
        borderRadius: "0.25rem",
        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.1)",
    }),
};

const EditCourse: React.FC = () => {
    const [section, setSection] = useState<string>("");
    const [isDisplayDeleteModal, setIsDisplayDeleteModal] = useState<boolean>(false);
    const [isDisplayEditModal, setIsDisplayEditModal] = useState<boolean>(false);
    const [isDisplayAddLessonModal, setIsDisplayAddLessonModal] = useState<boolean>(false);
    const [idItem, setIdItem] = useState<number>(-1);
    const [itemTitle, setItemTitle] = useState<string>("");
    const [isDisplaySaveImg, setIsDisplaySaveImg] = useState<boolean>(false);
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [errorImage, setErrorImage] = useState<boolean>(false);
    const categoriesSelector = useAppSelector((state) => state.courseSlice.categories);
    const createCategoriesSelector = useAppSelector((state) => state.courseSlice.selectCategories);
    const isLoading = useAppSelector((state) => state.courseSlice.isLoading);
    const [categoriesOptions, setcategoriesOptions] = useState<Options[]>(categoriesSelector);
    const navigate = useNavigate();

    const courseChangeDetail: CourseChangeInformationType = useAppSelector(
        (state) => state.courseSlice.courseChangeDetail
    );
    const sectionOfCourse: SectionType[] = useAppSelector((state) => state.sectionSlice.sectionList);

    const { course_id } = useParams();

    const createCategories: any = [];
    createCategoriesSelector.forEach((category: CategoryType) => {
        const temp: Options = {
            value: category.id,
            label: category.title,
        };
        createCategories.push(temp);
    });

    const initialValue: CourseChangeInformationType = {
        title: courseChangeDetail.title,
        summary: courseChangeDetail.summary,
        categories: createCategories,
        status: courseChangeDetail.status,
        description: courseChangeDetail.description,
        id: Number(course_id),
        slug: courseChangeDetail.slug,
    };
    const courseStatus: string = courseChangeDetail.status ? "Completed" : "Uncomplete";
    const dispatch = useAppDispatch();
    const statusOptions: Options[] = [
        {
            value: 0,
            label: "Completed",
        },
        {
            value: 1,
            label: "Uncomplete",
        },
    ];
    useEffect(() => {
        dispatch(setMessageEmpty());
        //@ts-ignore
        dispatch(courseActions.getCategories());
        //@ts-ignore
        dispatch(courseActions.getCourseDetailById(course_id));
        //@ts-ignore
        dispatch(sectionActions.getSectionByCourseId(course_id));
    }, [dispatch, course_id]);

    useEffect(() => {
        let createTemp = [...createCategoriesSelector];
        let cateTemp = [...categoriesSelector];
        const cateOptionsTemp: Options[] = [];
        createTemp.forEach((category: any) => {
            const index = cateTemp.findIndex((item: any) => item.id === category.id);
            if (index >= 0) {
                cateTemp.splice(index, 1);
            }
        });
        cateTemp.forEach((category: CategoryType) => {
            const temp: Options = {
                value: category.id,
                label: category.title,
            };
            cateOptionsTemp.push(temp);
        });
        setcategoriesOptions(cateOptionsTemp);
    }, [createCategoriesSelector]);

    const handleAddSection = () => {
        const values: AddSectionType = {
            course_id: Number(course_id),
            title: section,
        };
        // @ts-ignore
        dispatch(sectionActions.addSection(values)).then((response) => {
            if (response.payload.status_code === 201) {
                toast.success(response.payload.message);
                // @ts-ignore
                dispatch(sectionActions.getSectionByCourseId(course_id));
            } else {
                toast.error(response.payload.message);
            }
        });
    };

    const handleDisplayDeleteModal = (id: number) => {
        setIdItem(id);
        setIsDisplayDeleteModal(!isDisplayDeleteModal);
    };

    const handleDisplayAddSectionModal = (id: number) => {
        setIdItem(id);
        setIsDisplayAddLessonModal(!isDisplayAddLessonModal);
    };

    const handleDeleteSection = () => {
        //@ts-ignore
        dispatch(sectionActions.deleteSection(idItem)).then((response) => {
            if (response.payload.status_code === 200) {
                toast.success(response.payload.message);
                dispatch(sectionActions.setDeleteSection(idItem));
            } else {
                toast.error(response.payload.message);
            }
        });
        setIsDisplayDeleteModal(!isDisplayDeleteModal);
    };

    const handleEditSection = (id: number, title: string) => {
        // @ts-ignore
        dispatch(sectionActions.editSection({ id, title })).then((response) => {
            if (response.payload.status_code === 200) {
                toast.success(response.payload.message);
                dispatch(sectionActions.setEditSection({ id, title }));
            } else {
                toast.error(response.payload.message);
            }
        });
        setIsDisplayEditModal(!isDisplayEditModal);
    };

    const handleCancelModal = () => {
        setIsDisplayDeleteModal(!isDisplayDeleteModal);
    };

    const handleCancelModalAddLesson = () => {
        setIsDisplayAddLessonModal(!isDisplayAddLessonModal);
    };

    const handleDisplayEditModal = (id: number, title: string) => {
        setIdItem(id);
        setItemTitle(title);
        setIsDisplayEditModal(!isDisplayEditModal);
    };
    const handleChangeCategories = (event: Options[], formik: FormikProps<CourseChangeInformationType>) => {
        let createTemp = JSON.parse(JSON.stringify(event));
        let cateTemp = JSON.parse(JSON.stringify(categoriesSelector));
        const cateOptionsTemp: any = [];
        createTemp.forEach((category: any) => {
            const index = cateTemp.findIndex((item: any) => item.id === category.value);
            if (index >= 0) {
                cateTemp.splice(index, 1);
            }
        });
        cateTemp.forEach((category: CategoryType) => {
            const temp: Options = {
                value: category.id,
                label: category.title,
            };
            cateOptionsTemp.push(temp);
        });
        setcategoriesOptions(cateOptionsTemp);
        formik.setFieldValue("categories", event);
    };

    const imageRef = useRef<HTMLImageElement>(null);

    const onChangeInputFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.currentTarget.files![0]) {
            if (event.currentTarget.files![0].size > 1024 * 1024 * 4) {
                setErrorImage(true);
            } else {
                setErrorImage(false);
                setThumbnail(event.currentTarget.files![0]);
                const thumbnail = event.currentTarget.files![0];
                if (thumbnail && thumbnail.type.includes("image/")) {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        if (imageRef.current) {
                            imageRef.current.src = e.target?.result as string;
                            setIsDisplaySaveImg(!isDisplaySaveImg);
                        }
                    };
                    reader.readAsDataURL(thumbnail);
                    return;
                }
            }
        } else {
            if (imageRef.current) {
                imageRef.current.src = courseChangeDetail.thumbnail as string;
            }
        }
    };
    const handleChangeStatus = (event: Options[], formik: FormikProps<CourseChangeInformationType>) => {
        formik.setFieldValue("status", event);
    };
    const handleChangeThumbnail = () => {
        const formData = new FormData();
        formData.append("thumbnail", thumbnail as File);
        formData.append("course_id", course_id as string);

        //@ts-ignore
        dispatch(courseActions.changeThumbnail(formData)).then((response) => {
            if (response.payload.status_code === 200) {
                if (thumbnail) {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        if (imageRef.current) {
                            imageRef.current.src = e.target?.result as string;
                            setIsDisplaySaveImg(!isDisplaySaveImg);
                        }
                    };
                    reader.readAsDataURL(thumbnail);
                    return;
                }
            }
        });
    };

    const handleSave = (values: CourseChangeInformationType) => {
        const categories = values.categories.map((item: any) => item.value);
        const data = {
            ...values,
            categories: categories,
            slug: slugify(values.title),
        };
        if (thumbnail && !errorImage) {
            handleChangeThumbnail();
            //@ts-ignore
            dispatch(courseActions.changeInformation(data)).then((response) => {
                if (response.payload.status_code === 200) {
                    toast.success(response.payload.message);
                    // @ts-ignore
                    dispatch(courseActions.getCourseDetailById(values.id));
                } else {
                    toast.error(response.payload.message);
                }
            });
        } else {
            //@ts-ignore
            dispatch(courseActions.changeInformation(data)).then((response) => {
                if (response.payload.status_code === 200) {
                    toast.success(response.payload.message);
                    // @ts-ignore
                    dispatch(courseActions.getCourseDetailById(values.id));
                } else {
                    toast.error(response.payload.message);
                }
            });
        }
    };

    return (
        <>
            {isLoading !== true && (
                <>
                    <Navbar />
                    <div className="min-h-screen h-full px-4 tablet:px-[60px]">
                        <div className="flex-1 p-4 laptop:flex laptop:gap-4">
                            <div className="flex flex-col justify-center items-center gap-4 laptop:items-start laptop:justify-start">
                                <div className="">
                                    <img
                                        ref={imageRef}
                                        src={`${courseChangeDetail.thumbnail}`}
                                        alt={courseChangeDetail.title}
                                        className="w-60 h-60 rounded-lg outline-none border border-dashed border-black tablet:w-80 tablet:h-80 laptop:h-96 laptop:w-96"
                                    />
                                </div>
                                <div className="flex flex-col gap-3">
                                    <div className="text-center tablet:text-start">
                                        <p className="text-lg font-medium">Upload thumbnail</p>
                                        <p className={`${errorImage ? "text-red-500" : ""}  italic`}>
                                            Size of the image is less than 4MB
                                        </p>
                                    </div>
                                    <input
                                        name="thumbnail"
                                        type="file"
                                        accept=".png, .jpg"
                                        className="file-input file-input-bordered file-input-primary w-full max-w-xs"
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                            onChangeInputFile(event);
                                        }}
                                    />
                                </div>
                            </div>
                            <Formik
                                initialValues={initialValue}
                                validationSchema={editCourseValidationSchema}
                                onSubmit={handleSave}
                            >
                                {(formik) => (
                                    <form
                                        onSubmit={formik.handleSubmit}
                                        className="mt-4 laptop:mt-0 flex-1 flex flex-col border border-dashed border-black rounded-lg p-4 bg-background shadow-lg"
                                    >
                                        <div className="flex flex-col gap-2 shrink-0 mb-2 tablet:flex-row tablet:gap-0">
                                            <div className="flex-1 flex flex-col tablet:mr-8">
                                                <label
                                                    htmlFor="title"
                                                    className="text-sm mb-1 font-medium tablet:text-xl"
                                                >
                                                    Title
                                                </label>
                                                <Field
                                                    id="title"
                                                    name="title"
                                                    type="text"
                                                    className={`px-2 py-4 rounded-lg border-[1px] outline-none w-full  ${
                                                        formik.errors.title && formik.touched.title
                                                            ? "border-error"
                                                            : ""
                                                    }`}
                                                />
                                                <ErrorMessage
                                                    name="title"
                                                    component="span"
                                                    className="text-[14px] text-error font-medium"
                                                />
                                            </div>
                                            <div className="flex-1 flex flex-col">
                                                <label
                                                    htmlFor="summary"
                                                    className="text-sm mb-1 font-medium tablet:text-xl"
                                                >
                                                    Summary
                                                </label>
                                                <Field
                                                    id="summary"
                                                    name="summary"
                                                    type="text"
                                                    className={`px-2 py-4 rounded-lg border-[1px] outline-none w-full ${
                                                        formik.errors.summary && formik.touched.summary
                                                            ? "border-error"
                                                            : ""
                                                    }`}
                                                />
                                                <ErrorMessage
                                                    name="summary"
                                                    component="span"
                                                    className="text-[14px] text-error font-medium"
                                                />
                                                {/* {error !== "" && (
                                    <span className="text-[14px] text-error font-medium">{error}</span>
                                )} */}
                                            </div>
                                        </div>
                                        <div>
                                            <label htmlFor="title" className="text-sm mb-1 font-medium tablet:text-xl">
                                                Categories
                                            </label>
                                            <div
                                                className={`${
                                                    formik.errors.categories && formik.touched.categories
                                                        ? "border-error"
                                                        : ""
                                                }`}
                                            >
                                                <Field
                                                    name="categories"
                                                    component={CustomeSelect}
                                                    handleOnchange={(e: any) => handleChangeCategories(e, formik)}
                                                    options={categoriesOptions}
                                                    isMulti={true}
                                                    defautlValues={createCategories}
                                                    styles={customStyles}
                                                />
                                            </div>
                                            <ErrorMessage
                                                name="categories"
                                                component="span"
                                                className="text-[14px] text-error font-medium"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="status" className="text-sm mb-1 font-medium tablet:text-xl">
                                                Status
                                            </label>
                                            <Field
                                                className="w-full"
                                                name="status"
                                                component={CustomeSelect}
                                                handleOnchange={(e: any) => handleChangeStatus(e, formik)}
                                                options={statusOptions}
                                                isMulti={false}
                                                placeholder={`${courseStatus}`}
                                                styles={customStyles}
                                            />
                                            <ErrorMessage
                                                name="status"
                                                component="span"
                                                className="text-[14px] text-error font-medium"
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col">
                                            <label
                                                htmlFor="description"
                                                className="text-sm mb-1 font-medium tablet:text-xl"
                                            >
                                                Description
                                            </label>
                                            <Field
                                                id="description"
                                                as="textarea"
                                                name="description"
                                                type="text"
                                                className={`flex-1 w-full resize-none rounded-md border border-[#e0e0e0] py-3 px-4  outline-none ${
                                                    formik.errors.description && formik.touched.description
                                                        ? "border-error"
                                                        : ""
                                                }`}
                                            />
                                            <ErrorMessage
                                                name="description"
                                                component="span"
                                                className="text-[14px] text-error font-medium"
                                            />
                                        </div>
                                        <div className="flex justify-end mt-4">
                                            <button
                                                className="btn btn-primary text-lg"
                                                type="submit"
                                                // disabled={error !== "" ? true : false}
                                            >
                                                Save
                                            </button>
                                            <button
                                                className="btn text-lg ml-2"
                                                type="submit"
                                                onClick={() => navigate("/my-courses")}
                                                // disabled={error !== "" ? true : false}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </Formik>
                        </div>

                        <div className="flex-1 p-4 flex flex-col border border-dashed border-black rounded-lg m-4">
                            <div className="flex flex-col gap-4 tablet:flex-row tablet:justify-between">
                                <input
                                    type="text"
                                    className="px-2 py-2 rounded-lg border-[1px] outline-none flex-1 max-w-2xl"
                                    placeholder="Name's section"
                                    value={section}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        setSection(e.target.value);
                                    }}
                                />
                                <button className="btn btn-primary text-lg flex-2" onClick={handleAddSection}>
                                    Add section
                                </button>
                            </div>
                            {/* handle list lesson */}
                            <div className="mt-2">
                                {sectionOfCourse.length <= 0 ? (
                                    <h1 className="text-center text-2xl text-error">There are no sections yet!</h1>
                                ) : (
                                    sectionOfCourse.map((section, index) => (
                                        <Accordion
                                            key={index}
                                            section={section}
                                            handleDeleteSection={handleDeleteSection}
                                            handleDisplayEditModal={handleDisplayEditModal}
                                            handleDisplayDeleteModal={handleDisplayDeleteModal}
                                            handleDisplayAddSectionModal={handleDisplayAddSectionModal}
                                            isDisplayBtn={true}
                                        />
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                    {/* POPUP DELETE */}
                    {isDisplayDeleteModal && (
                        <DeleteModal handleDelete={handleDeleteSection} handleCancel={handleCancelModal} />
                    )}
                    {/* POPUP EDIT */}
                    {isDisplayEditModal && (
                        <div className="fixed z-50 w-full h-full top-0 bottom-0 bg-black/50 flex justify-center items-center shadow-lg">
                            <div className="bg-[#F8FFF8] p-4 w-[400px] flex flex-col items-center justify-center rounded-lg ">
                                <h1 className="text-3xl mb-1 font-bold text-center text-title">EDIT SECTION</h1>

                                <form className="flex flex-col gap-1 w-full">
                                    <div className="text-sm mb-1 tablet:text-xl font-medium">Section title</div>
                                    <input
                                        type="text"
                                        value={itemTitle}
                                        className="px-2 py-4 rounded-lg border-[1px] outline-none max-w-lg"
                                        onChange={(e) => setItemTitle(e.target.value)}
                                    />
                                </form>
                                <div className="mt-2 flex justify-end w-full">
                                    <button
                                        className="btn btn-primary text-lg"
                                        onClick={() => handleEditSection(idItem, itemTitle)}
                                    >
                                        Save
                                    </button>
                                    <button
                                        className="btn text-lg ml-2"
                                        onClick={() => setIsDisplayEditModal(!isDisplayEditModal)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* POPUP ADD LESSON */}
                    {isDisplayAddLessonModal && (
                        <PopupAddLesson
                            handleDelete={handleDeleteSection}
                            handleCancel={handleCancelModalAddLesson}
                            id={idItem}
                        />
                    )}
                </>
            )}
        </>
    );
};

export default EditCourse;
