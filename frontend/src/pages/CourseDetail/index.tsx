import React, { useEffect, useState } from "react";
import { Navbar, Accordion, DeleteModal, Spin } from "@src/components";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { useNavigate, useParams } from "react-router-dom";
import { Section } from "../../types/section";
import { CourseDetail as CourseDetailType, GetRating, RatingResponse as RatingResponseType } from "../../types/course";
//import { Section as SectionType } from "../../types/section";
import { Link } from "react-router-dom";
import NotFound from "../NotFound";
import { courseActions } from "@redux/slice";
import PopupRating from "./PopupRating";

import { TotalRating, Pagination } from "@src/components";
import toast from "react-hot-toast";
import AuthorButton from "./AuthorButton";
import GuestButton from "./GuestButton";
import SubscribeUserButton from "./SubscribeUserButton";
import UnsubscribeModal from "./UnsubcribeModal";
import CommentSection from "./CommentSection";
import i18n from "../../utils/i18next";
import { orderLesson } from "../../types/lesson";
type CourseDetailProps = {
    isLogin: boolean;
};

const CourseDetail: React.FC<CourseDetailProps> = ({ isLogin }) => {
    let { slug } = useParams();
    const dispatch = useAppDispatch();
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState<boolean>(false);
    const [isOpenPopupRating, setIsOpenPopupRating] = useState<boolean>(false);
    const [isOpenUnsubscribeModal, setIsOpenUnsubscribeModal] = useState<boolean>(false);
    const [isNotFound, setIsNotFound] = useState<boolean>(false);
    const [idItem, setIdItem] = useState<number>(-1);
    const [pageIndex, setPageIndex] = useState<number>(Number(i18n.t("PAGE_INDEX.FIRST_PAGE")));
    const navigate = useNavigate();
    //const sectionOfCourse: SectionType[] = useAppSelector((state) => state.sectionSlice.sectionList);
    const courseDetail: CourseDetailType = useAppSelector((state) => state.courseSlice.courseDetail) ?? {};
    const ratings: RatingResponseType[] = useAppSelector((state) => state.courseSlice.ratings) ?? [];
    const totalRatingPage: number =
        useAppSelector((state) => state.courseSlice.totalRatingPage) ?? Number(i18n.t("PAGE_INDEX.FIRST_PAGE"));

    const orderLesson: orderLesson[] = useAppSelector((state) => state.courseSlice.orderLesson);
    const role: string = useAppSelector((state) => state.courseSlice.role) ?? "";
    const isGetLoading: boolean = useAppSelector((state) => state.courseSlice.isGetLoading) ?? false;
    const handleChangePageIndex = (pageIndex: number) => {
        if (pageIndex < Number(i18n.t("PAGE_INDEX.FIRST_PAGE"))) {
            setPageIndex(totalRatingPage);
        } else if (pageIndex > totalRatingPage) setPageIndex(Number(i18n.t("PAGE_INDEX.FIRST_PAGE")));
        else {
            setPageIndex(pageIndex);
        }
        return;
    };

    const handleDeleteCourse = () => {
        //@ts-ignore
        dispatch(courseActions.deleteCourse(idItem)).then((response) => {
            if (response.payload) {
                if (response.payload.status_code === 200) {
                    toast.success(response.payload.message);
                    navigate("/my-courses");
                } else {
                    toast.error(response.payload.message);
                }
            }
        });
        setIsOpenDeleteModal(!isOpenDeleteModal);
    };

    const handleCancelModal = () => {
        setIsOpenDeleteModal(!isOpenDeleteModal);
    };
    const handleTogglePopupRating = () => {
        setIsOpenPopupRating(!isOpenPopupRating);
    };
    const handleToggleUnsubcribeCourse = () => {
        setIsOpenUnsubscribeModal(!isOpenUnsubscribeModal);
    };
    const handleAfterVote = () => {
        // @ts-ignore
        dispatch(courseActions.getCourseDetail(slug));
        const values: GetRating = {
            slug: slug as string,
            page_index: pageIndex,
        };
        //@ts-ignore
        dispatch(courseActions.getListRatingsOfCourseBySlug(values));
    };
    useEffect(() => {
        // @ts-ignore
        dispatch(courseActions.getCourseDetail(slug)).then((response) => {
            if (response.payload && response.payload.status_code !== 200) {
                setIsNotFound(true);
            }
        });
    }, [dispatch, slug, isNotFound]);
    useEffect(() => {
        if (courseDetail.id && isLogin) {
            //@ts-ignore
            dispatch(courseActions.getRightOfCourse(courseDetail.id));
        }
    }, [dispatch, courseDetail.id, isLogin]);
    useEffect(() => {
        const values: GetRating = {
            slug: slug as string,
            page_index: pageIndex,
        };
        //@ts-ignore
        dispatch(courseActions.getListRatingsOfCourseBySlug(values));
    }, [dispatch, slug, pageIndex]);

    if (isNotFound) return <NotFound />;

    return (
        <>
            {isOpenPopupRating && (
                <PopupRating
                    handleAfterVote={handleAfterVote}
                    handleCancel={handleTogglePopupRating}
                    course_id={courseDetail.id}
                />
            )}
            {isOpenDeleteModal && <DeleteModal handleDelete={handleDeleteCourse} handleCancel={handleCancelModal} />}
            {isOpenUnsubscribeModal && (
                <UnsubscribeModal handleCancel={handleToggleUnsubcribeCourse} course_id={courseDetail.id} />
            )}
            <Navbar />
            {isGetLoading && <Spin />}
            <div className="container mx-auto mt-[100px] laptop:mt-0">
                <div className="min-h-screen h-full px-4 tablet:px-[60px]">
                    <div className="mt-4 container mx-auto p-4">
                        <div className="flex flex-col gap-4 laptop:flex-row shadow-xl bg-primary rounded-lg">
                            <div className=" flex-1 w-full laptop:max-w-[600px] max-h-[400px] bg-gray-600 rounded-lg">
                                <img
                                    src={courseDetail.thumbnail}
                                    alt={courseDetail.title}
                                    className="h-[300px] w-full m-auto rounded-lg tablet:h-[400px] object-cover"
                                />
                            </div>
                            <div className=" flex-1 object-right flex flex-col gap-4 px-3 pb-3 laptop:pt-3">
                                <div className="flex-1">
                                    <h2 className="text-2xl laptop:text-3xl font-bold text-title mb-3 tablet:w-[300px] xl:w-[600px] truncate ...">
                                        {courseDetail.title}
                                    </h2>
                                    <p className="text-xl laptop:text-2xl font-medium italic mb-3">
                                        {courseDetail.summary}
                                    </p>

                                    <div className=" mb-3">
                                        <span className="text-xl laptop:text-2xl font-bold">Author: </span>
                                        <Link
                                            to={`/profile/${courseDetail.author.id}`}
                                            className="text-xl laptop:text-2xl underline font-medium text-blue-600"
                                        >
                                            {courseDetail.author?.first_name}
                                            <span> {courseDetail.author?.last_name} </span>
                                        </Link>
                                    </div>
                                    <div className="flex items-center text-xl laptop:text-3xl font-medium mb-3">
                                        <span className="text-xl laptop:text-2xl font-bold mr-2">Ratings:</span>
                                        <TotalRating
                                            ratingId={0}
                                            totalScore={Number(courseDetail.rating)}
                                            isForCourse={true}
                                        />
                                        <p className="italic text-xl laptop:text-2xl ml-2 ">{courseDetail.rating}</p>
                                    </div>
                                    <div className="flex items-center text-xl laptop:text-2xl font-bold">
                                        <span className="mr-2">Status:</span>
                                        <p className="font-normal">
                                            {courseDetail.status === false ? "Incompleted" : " Completed"}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex-1 flex items-end gap-2 flex-wrap">
                                    {isLogin && role === i18n.t("ROLE.AUTHOR") && (
                                        <AuthorButton
                                            handleDelete={() => {
                                                setIsOpenDeleteModal(!isOpenDeleteModal);
                                                setIdItem(courseDetail.id as number);
                                            }}
                                            courseDetail={courseDetail}
                                        />
                                    )}
                                    {isLogin && role === i18n.t("ROLE.ENROLLED") && (
                                        <SubscribeUserButton
                                            handleTogglePopupRating={handleTogglePopupRating}
                                            handleToggleUnsubscribeCourse={handleToggleUnsubcribeCourse}
                                            courseDetail={courseDetail}
                                        />
                                    )}
                                    {(!isLogin || role === i18n.t("ROLE.UNENROLLED")) && (
                                        <GuestButton isLogin={isLogin} course_id={courseDetail.id} />
                                    )}
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="description my-4">
                                <h2 className="text-xl tablet:text-3xl font-bold mb-3">Description</h2>
                                <span className="w-[60px] h-1 bg-black block"></span>
                                <p className="mt-2 text-[20px]">{courseDetail.description}</p>
                            </div>

                            <div className="table-of-content my-4">
                                <h2 className="text-xl tablet:text-3xl font-bold mb-3">Table of Content</h2>
                                <span className="w-[60px] h-1 bg-black block mb-4"></span>
                                {courseDetail.sections.map((section: Section, index: number) => {
                                    return (
                                        <Accordion
                                        orderLesson={orderLesson}
                                            disable={true}
                                            key={index}
                                            isDisplayBtn={false}
                                            section={section}
                                            redirectToWatchVideo={isLogin && !(role === i18n.t("ROLE.UNENROLLED"))}
                                        />
                                    );
                                })}
                            </div>
                            {isGetLoading ? (
                                <p className="mt-4 text-2x text-center font-bold">Loading</p>
                            ) : (
                                <CommentSection ratings={ratings} />
                            )}
                            {ratings.length > 10 ? (
                                <div className="flex justify-end my-4">
                                    <Pagination
                                        handleChangePageIndex={handleChangePageIndex}
                                        totalPage={totalRatingPage}
                                        currentPage={pageIndex}
                                    />
                                </div>
                            ) : (
                                <></>
                            )}
                            {ratings.length === 0 && (
                                <p className="mt-4 text-2xl text-error text-center font-bold">Such empty</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CourseDetail;
