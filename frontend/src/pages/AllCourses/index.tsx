import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
// import CourseCard from "./CourseCard";
import { Pagination } from "@src/components";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { Category, Course, SelectCourse } from "../../types/course";
import { courseActions } from "@redux/slice";
import { eveluateList, sortingBy } from "../../utils/helper";
import useQueryParams from "../../hooks/useQueryParams";

const AllCourses: React.FC = () => {
    const { keyword, rating } = useQueryParams();

    const [evaluate, setEvaluate] = useState<number | undefined>(Number(rating));
    const [categories, setCategories] = useState<string[]>([]);
    const [pageIndex, setPageIndex] = useState<number>(1);

    const dispatch = useAppDispatch();

    let courseList: Course[] = useAppSelector((state) => state.courseSlice.courses) ?? [];
    let totalPage: number = useAppSelector((state) => state.courseSlice.totalPage) ?? 1;
    let totalRecord: number = useAppSelector((state) => state.courseSlice.totalRecord) ?? 1;
    const categoriesList: Category[] = useAppSelector((state) => state.courseSlice.categories) ?? [];

    const handleSingleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = event.target;
        if (checked) {
            setCategories((pre) => [...pre, value]);
        } else {
            setCategories((pre) => [...pre.filter((category) => category !== value)]);
        }
    };

    const handleFilterCourse = () => {
        const query: SelectCourse = {
            page_index: pageIndex,
            keyword: keyword as string,
            sort_by: "",
            rating: 5,
            category: [],
        };
        // @ts-ignore
        dispatch(courseActions.selectCourses(query));
    };

    const handleSortingCourse = (sortBy: string) => {};

    const handleChangePageIndex = () => {};

    useEffect(() => {
        // @ts-ignore
        dispatch(courseActions.getCategories());

        const query: SelectCourse = {
            page_index: pageIndex,
            keyword: keyword,
            sort_by: "",
            rating: 5,
            category: [],
        };
        // @ts-ignore
        dispatch(courseActions.selectCourses(query));
        setPageIndex(1);
    }, [dispatch, categories, keyword, pageIndex]);

    return (
        <>
            <Navbar />
            <div className="container mx-auto p-4">
                <div className="">
                    <h1 className="text-2xl">{totalRecord} results have been found </h1>
                    <div className="flex flex-col gap-4 laptop:flex-row">
                        <div className="w-full tablet:w-[300px] mt-4">
                            <div className="">
                                <button className="btn btn-secondary text-lg mr-4" onClick={handleFilterCourse}>
                                    Filter
                                </button>
                                <div className="dropdown dropdown-bottom">
                                    <label
                                        tabIndex={0}
                                        className="btn btn-outline hover:bg-backgroundHover hover:text-black text-lg m-1"
                                    >
                                        Sorting by
                                    </label>
                                    <ul
                                        tabIndex={0}
                                        className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box min-w-[150px]"
                                    >
                                        {sortingBy.map((item, index) => {
                                            return (
                                                <li
                                                    key={index}
                                                    className="p-2 hover:bg-backgroundHover rounded-lg cursor-pointer"
                                                    onClick={() => handleSortingCourse(item.value)}
                                                >
                                                    {item.title}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            </div>
                            <div className="mt-3">
                                <h2 className="text-2xl font-bold mb-2">Evaluate</h2>
                                {eveluateList.map((evaluateItem, index) => {
                                    return (
                                        <div className="flex items-center gap-2 mb-1" key={index}>
                                            <input
                                                type="radio"
                                                className="radio radio-info"
                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                    setEvaluate(Number(event.target.value));
                                                }}
                                                name="evaluate"
                                                value={evaluateItem.value}
                                                id={evaluateItem.title}
                                                checked={evaluate === evaluateItem.value}
                                            />
                                            <span className="text-xl">{evaluateItem.title}</span>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="divider"></div>
                            <div className="mt-3">
                                <h2 className="text-2xl font-bold mb-2">Category</h2>
                                {categoriesList.length > 0 &&
                                    categoriesList.map((category) => {
                                        return (
                                            <div className="flex items-center gap-2 mb-1" key={category.id}>
                                                <input
                                                    type="checkbox"
                                                    className="checkbox checkbox-info"
                                                    name={category.title}
                                                    value={category.title}
                                                    onChange={handleSingleCategoryChange}
                                                />
                                                <span className="text-xl">{category.title}</span>
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>
                        <div className="flex-1">
                            {/* {courseList.map((course) => (
                                <CourseCard
                                    key={course.id}
                                    id={course.id}
                                    isOwner={course.isOwner}
                                    title={course.title}
                                    thumbnail={course.thumbnail}
                                    rating={course.rating}
                                    status={course.status}
                                    numberOfSection={course.numberOfSection}
                                    slug={course.slug}
                                    summary={course.summary}
                                    author={course.author}
                                    handleGetCourse={handleGetCourse}
                                />
                            ))} */}
                        </div>
                    </div>
                </div>
                {courseList.length > 0 ? (
                    <div className="flex justify-end my-4">
                        <Pagination
                            handleChangePageIndex={handleChangePageIndex}
                            totalPage={totalPage}
                            currentPage={pageIndex}
                        />
                    </div>
                ) : (
                    <></>
                )}
            </div>
        </>
    );
};

export default AllCourses;
