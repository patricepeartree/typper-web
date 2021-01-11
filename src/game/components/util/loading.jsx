import React from "react";
import styled, { keyframes } from "styled-components";

import { BlurredOverlay } from "@game/components/util/styled-components";

export default () => (
    <BlurredOverlay zIndex="9999">
        <Spinner />
    </BlurredOverlay>
);

const spinnerAnimation = keyframes`
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
`;

const Spinner = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    &::after {
        content: " ";
        display: block;
        width: 64px;
        height: 64px;
        margin: 8px;
        border-radius: 50%;
        border: 6px solid #fff;
        border-color: #fff transparent #fff transparent;
        animation: ${spinnerAnimation} 1.2s linear infinite;
    }
`;
