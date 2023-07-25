import React, { FC } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";

type SelectProps = {
    defautlValues: any;
    placeholder: any;
    handleOnchange: () => void;
    options: any;
    isMulti: boolean;
};

const CustomeSelect: FC<SelectProps> = (props) => {
    // debugger;

    const animatedComponents = makeAnimated();
    return (
        <Select
            closeMenuOnSelect={false}
            components={animatedComponents}
            defaultValue={props.defautlValues}
            placeholder={props.placeholder}
            isMulti={props.isMulti}
            onChange={props.handleOnchange}
            options={props.options}
        />
    );
};

export default CustomeSelect;
