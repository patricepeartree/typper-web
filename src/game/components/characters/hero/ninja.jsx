import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';

import { useHeightBasedOnWindow, useSimpleTileAnimation } from '../../../../custom-hooks';
import { updateHeroPosition } from '../../../store/actions';

import HeroHealthBar from "./hero-health-bar";

import NinjaIdleTiles from '../../../../assets/ninja/idle';

const TIME_BETWEEN_TILES = 100;


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

    const tileSrc = useSimpleTileAnimation(NinjaIdleTiles, TIME_BETWEEN_TILES);

    return (
        <NinjaContainer>
            <NinjaTile id="hero" ref={heroRef} src={tileSrc} height={height} />
            <PositionedHeroHealthBar />
        </NinjaContainer>
    );
}


const NinjaContainer = styled.div`
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
`;

const NinjaTile = styled.img`
    ${props => `height: ${props.height}px;`}
`;

const PositionedHeroHealthBar = styled(HeroHealthBar)`
    position: absolute;
    left: 110%;
    bottom: 0;
    width: 180%;
    height: 12%;
`;

export default React.memo(Ninja);
