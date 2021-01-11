import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';

import { useHeightBasedOnWindow } from "@custom-hooks";
import { updateHeroPosition } from '@game/store/actions';

import AnimatedNinja, { State } from "@game/components/animated-characters/ninja";


function Ninja() {
    const dispatch = useDispatch();

    const height = useHeightBasedOnWindow(0.15);

    const heroRef = useRef();

    function dispatchHeroPosition() {
        const { top, left, width, height } = heroRef.current.getBoundingClientRect();
        const x = left + (width / 2);
        const y = top + (height / 2);
        dispatch(updateHeroPosition(x, y));
    }

    useEffect(dispatchHeroPosition, [height]);

    return (
        <NinjaContainer height={height}>
            <AnimatedNinja id="hero" ref={heroRef} state={State.IDLE} />
        </NinjaContainer>
    );
}


const NinjaContainer = styled.div`
    position: absolute;
    bottom: 0;
    left: 50%;
    height: ${props => props.height}px;
    transform: translateX(-50%);
`;

export default React.memo(Ninja);
