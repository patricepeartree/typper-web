import React, { useState, useCallback, useEffect } from "react";
import styled from "styled-components";

import { useAnimationFrame } from "@custom-hooks";


function Countdown(props) {
    const { isPaused, onFinish } = props;

    const [count, setCount] = useState(3);

    function handleCountdown(deltaT) {
        setCount(previousCount => previousCount - (deltaT / 1000));
    }

    const memoizedHandleCountdown = useCallback(handleCountdown, []);
    useAnimationFrame(memoizedHandleCountdown, isPaused);

    useEffect(() => {
        if (count <= -1) {
            onFinish();
        }
    }, [count, onFinish]);

    return (
        <Count>{count > 0 ? Math.ceil(count) : "GO!"}</Count>
    );
};

const Count = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 99;
    font-family: Zombie;
    font-size: 110px;
    text-shadow: -5px 0 white, 0 5px white, 5px 0 white, 0 -5px white;
`;

export default Countdown;
