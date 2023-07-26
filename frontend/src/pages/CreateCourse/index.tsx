import React, { FC, useEffect, useRef, useState } from "react";
import { Formik, ErrorMessage, Field, FormikProps } from "formik";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { setMessageEmpty } from "../../redux/slice/auth.slice";
import { NewCourse as CreateCourseType, Category as CategoryType } from "../../types/course";
import { courseActions } from "../../redux/slice";
import { createValidationSchema } from "../../validations/course";
import slugify from "slugify";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
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

const CreateCourse: FC = () => {
    const dispatch = useAppDispatch();
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const isLoading = useAppSelector((state) => state.courseSlice.isLoading);
    const categories: CategoryType[] = useAppSelector((state) => state.courseSlice.categories) ?? [];
    const formikRef = useRef(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const navigate = useNavigate();
    const categoriesOptions: Options[] = [];
    const statusOptions = [
        {
            value: 1,
            label: "Completed",
        },
        {
            value: 0,
            label: "Uncomplete",
        },
    ];
    useEffect(() => {
        categories.forEach((category: CategoryType) => {
            const temp: Options = {
                value: category.id,
                label: category.title,
            };
            categoriesOptions.push(temp);
        });
    }, [categories, categoriesOptions]);
    useEffect(() => {
        dispatch(setMessageEmpty());
        //@ts-ignore
        dispatch(courseActions.getCategories());
        dispatch(courseActions.reset());

        setThumbnail(null);
    }, [dispatch]);

    const initialValues: CreateCourseType = {
        title: "",
        categories: [],
        status: 0,
        summary: "",
        description: "",
        thumbnail: null,
    };

    const handleOnSubmit = async (values: CreateCourseType) => {
        const slug = slugify(values.title.toLowerCase());
        let formData = new FormData();
        formData.append("title", values.title);
        formData.append("description", values.description);
        formData.append("slug", slug);
        formData.append("thumbnail", thumbnail as File);
        formData.append("summary", values.summary);
        formData.append("status", values.status.toString());
        // formData.append("upload_preset", "Freshemy");

        values.categories.forEach((item: number) => {
            formData.append("categories[]", item.toString());
        });
        // @ts-ignore
        dispatch(courseActions.createCourses(formData)).then((response) => {
            if (response.payload.status_code === 201) {
                toast.success(response.payload.message);
                navigate("/my-courses");
            } else {
                toast.error(response.payload.message);
            }
        });
    };

    const handleChangeCategories = (event: Options[], formik: FormikProps<CreateCourseType>) => {
        formik.setFieldValue("categories", [...formik.values.categories, event[event.length - 1].value]);
    };

    const handleChangeStatus = (event: Options[], formik: FormikProps<CreateCourseType>) => {
        formik.setFieldValue("status", event);
    };

    const onChangeInputFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        setThumbnail(event.currentTarget.files![0]);
        const thumbnail = event.currentTarget.files![0];
        if (thumbnail && thumbnail.type.includes("image/")) {
            var reader = new FileReader();
            reader.onload = function (e) {
                if (imageRef.current) {
                    imageRef.current.src = e.target?.result as string;
                }
            };
            reader.readAsDataURL(thumbnail);
            return;
        } else {
            if (imageRef.current) {
                imageRef.current.src = "";
            }
        }
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen h-full px-4 tablet:px-[60px]">
                <h1 className="text-center text-[32px] py-4 font-bold text-title">CREATE COURSE</h1>
                <div className="w-full flex justify-center items-center shrink-0">
                    <div className="m-4 rounded-xl border border-black w-full max-w-[982px] bg-background">
                        <Formik
                            initialValues={initialValues}
                            validationSchema={createValidationSchema}
                            onSubmit={handleOnSubmit}
                            innerRef={formikRef}
                        >
                            {(formik: FormikProps<CreateCourseType>) => (
                                <form onSubmit={formik.handleSubmit} className="p-4">
                                    <div className="flex">
                                        <div className="flex rounded-lg items-start">
                                            <img
                                                ref={imageRef}
                                                alt="Thumbnail"
                                                className="w-32 h-32 rounded-lg mr-3 outline-none border border-dashed border-black tablet:w-60 tablet:h-60"
                                            />
                                            <div className="flex flex-col gap-3">
                                                <div className="">
                                                    <p className="text-lg font-medium">Upload thumbnail</p>
                                                    <p className="italic">Size of the image is less than 4MB</p>
                                                </div>
                                                <Field
                                                    name="thumbnail"
                                                    type="file"
                                                    value={undefined}
                                                    className="file-input file-input-bordered file-input-primary w-full max-w-xs"
                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                        formik.setFieldValue(
                                                            "thumbnail",
                                                            event.currentTarget.files![0]
                                                        );
                                                        formik.setFieldError("thumbnail", undefined);
                                                        onChangeInputFile(event);
                                                    }}
                                                />
                                                <ErrorMessage
                                                    name="thumbnail"
                                                    component="span"
                                                    className="text-[14px] text-error font-medium"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-row gap-4 my-3">
                                        <div className="flex-1 flex flex-col gap-3">
                                            <div className="flex flex-col">
                                                <label
                                                    htmlFor="title"
                                                    className="text-sm mb-1 font-medium tablet:text-xl"
                                                >
                                                    Title
                                                </label>
                                                <Field
                                                    type="text"
                                                    name="title"
                                                    className={`${
                                                        formik.errors.title && formik.touched.title
                                                            ? "border-error"
                                                            : ""
                                                    } px-2 py-4 rounded-lg border-[1px] outline-none max-w-lg`}
                                                />
                                                <ErrorMessage
                                                    name="title"
                                                    component="span"
                                                    className="text-[14px] text-error font-medium"
                                                />
                                            </div>
                                            <div>
                                                <label
                                                    htmlFor="title"
                                                    className="text-sm mb-1 font-medium tablet:text-xl"
                                                >
                                                    Categories
                                                </label>
                                                <div
                                                    className={`${
                                                        formik.errors.categories && formik.touched.categories
                                                            ? "border-error"
                                                            : ""
                                                    } border-[1px]`}
                                                >
                                                    <Field
                                                        name="categories"
                                                        component={CustomeSelect}
                                                        handleOnchange={(e: Options[]) =>
                                                            handleChangeCategories(e, formik)
                                                        }
                                                        options={categoriesOptions}
                                                        isMulti={true}
                                                        defautlValues={""}
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
                                                <label
                                                    htmlFor="title"
                                                    className="text-sm mb-1 font-medium tablet:text-xl"
                                                >
                                                    Status
                                                </label>
                                                <Field
                                                    className="custom-select"
                                                    name="status"
                                                    component={CustomeSelect}
                                                    handleOnchange={(e: Options[]) => handleChangeStatus(e, formik)}
                                                    options={statusOptions}
                                                    isMulti={false}
                                                    placeholder="Uncompleted"
                                                    styles={customStyles}
                                                />
                                                <ErrorMessage
                                                    name="status"
                                                    component="span"
                                                    className="text-[14px] text-error font-medium"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex-1 flex flex-col">
                                            <label
                                                htmlFor="description"
                                                className="text-sm mb-1 font-medium tablet:text-xl"
                                            >
                                                Description
                                            </label>
                                            <Field
                                                as="textarea"
                                                name="description"
                                                placeholder="Description about your course..."
                                                className={`${
                                                    formik.errors.description && formik.touched.description
                                                        ? "border-error"
                                                        : ""
                                                } flex-1 w-full resize-none rounded-md border border-[#e0e0e0] py-3 px-4  outline-none focus:shadow-md1`}
                                            />
                                            <ErrorMessage
                                                name="description"
                                                component="span"
                                                className="text-[14px] text-error font-medium"
                                            />
                                        </div>
                                    </div>
                                    <div className="sumary mt-4">
                                        <label htmlFor="summary" className="text-sm mb-1 font-medium tablet:text-xl">
                                            Summary
                                        </label>
                                        <Field
                                            type="text"
                                            name="summary"
                                            className={`${
                                                formik.errors.summary && formik.touched.summary ? "border-error" : ""
                                            } w-full h-[68px] rounded-[8px] px-[8px] border-[1px] outline-none`}
                                        />
                                        <ErrorMessage
                                            name="summary"
                                            component="span"
                                            className="text-[14px] text-error font-medium"
                                        />
                                    </div>

                                    <div className="py-[12px] flex justify-end">
                                        <button
                                            disabled={isLoading ? true : false}
                                            type="submit"
                                            className="btn btn-primary text-lg"
                                        >
                                            {isLoading ? "Loading..." : "Save"}
                                        </button>
                                        <button
                                            type="button"
                                            className="btn text-lg ml-2"
                                            onClick={() => {
                                                console.log(formik.values);
                                                formik.resetForm(initialValues);
                                            }}
                                        >
                                            <Link to={`/my-courses`}>Cancel</Link>
                                        </button>
                                    </div>
                                </form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CreateCourse;
