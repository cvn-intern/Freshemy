import React from "react";
import WarningIcon from "@src/components/icons/WarningIcon";
import { useAppDispatch } from "../../hooks/hooks";
import { courseActions } from "@redux/slice";
import toast, { Toaster } from "react-hot-toast";

type UnsubscribeModalProps = {
    handleCancel: () => void;
    course_id: number | undefined;
};

const UnsubscribeModal: React.FC<UnsubscribeModalProps> = (props: UnsubscribeModalProps) => {
    const course_id = props.course_id;
    const dispatch = useAppDispatch();
    const handleUnsubscribeCourse = () => {
        //@ts-ignore
        dispatch(courseActions.unsubcribeCourse({ course_id })).then((response) => {
            if (response.payload.status_code === 200) {
                toast.success("Unsubcribe Successfully");
                props.handleCancel();
            } else {
                toast.error("Unsubcribe Unsuccessfully");
            }
        });
    };
    return (
        <>
            <Toaster />
            <div className="fixed z-50 w-full h-full top-0 bottom-0 bg-black/50 flex justify-center items-center">
                <div className="bg-white p-4 w-[400px] flex flex-col items-center justify-center rounded-lg">
                    <div className="w-[60px] h-[60px] rounded-full border border-black bg-[#FFFF00] mb-4 flex justify-center items-center">
                        <WarningIcon />
                    </div>
                    <div className="mb-2 text-center">
                        <p className="text-3xl mb-1 font-medium">ARE YOU SURE?</p>
                        <span className="text-xl">Do you really want to unsubcribe this course</span>
                    </div>
                    <div className="">
                        <button className="text-white btn btn-error text-lg" onClick={handleUnsubscribeCourse}>
                            Yes, unsubcribe it
                        </button>
                        <button className="btn text-lg ml-2" onClick={props.handleCancel}>
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UnsubscribeModal;
