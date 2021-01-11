import React, { useCallback, useEffect, useState, useRef } from "react";

import { useKeyDownHandlers } from "@custom-hooks";
import { AlwaysFocusedConstants, Keys } from "@game/constants";

import { useAlwaysFocusedContext } from "@game/components/util/always-focused-context";


export const Type = {
    ALPHANUMERIC_WITH_UNDERSCORE: "ALPHANUMERIC_WITH_UNDERSCORE"
};

const Regex = {
    [Type.ALPHANUMERIC_WITH_UNDERSCORE]: /^\w*$/
};


function UnblurableAndSubmitableInput(props) {
    const { className, onSubmit, placeholder, defaultValue, type, maxLength } = props;

    const [value, setValue] = useState(defaultValue || "");
    const [keyHandlers, setKeyHandlers] = useState();

    // XXX: to have the updated value in handleSubmit without needing to change the
    //      memoized callback (and setting the key handlers) everytime value changes
    const valueRef = useRef(value);

    const registerElem = useAlwaysFocusedContext();

    function handleInputRef(elem) {
        registerElem(AlwaysFocusedConstants.ElemIds.PLAYER_NAME_INPUT, elem);
    }

    const memoizedHandleInputRef = useCallback(handleInputRef, []);

    function handleSubmit() {
        const finalValue = valueRef.current.trim();
        if (finalValue && onSubmit) {
            onSubmit(finalValue);
        }
    }

    const memoizedHandleSubmit = useCallback(handleSubmit, [onSubmit]);

    useEffect(() => {
        setKeyHandlers({
            [Keys.ENTER]: memoizedHandleSubmit
        })
    }, [memoizedHandleSubmit]);

    useKeyDownHandlers(keyHandlers);

    function validate(e) {
        const value = e.target.value;

        const isValid = (!type || !Regex[type] || Regex[type].test(value))
            && (!maxLength || value.length <= maxLength);

        if (isValid) {
            setValue(value);
            valueRef.current = value;
        }
    }

    return (
        <input
            className={className}
            ref={memoizedHandleInputRef}
            placeholder={placeholder || "Start typing"}
            value={value}
            onChange={validate}
        />
    );
}

export default UnblurableAndSubmitableInput;
