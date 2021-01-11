import React, { useRef } from 'react';
import styled from 'styled-components';
import { useSelector } from "react-redux";

import Heart from "@assets/heart.png";


const HealthBarDescriptor = Object.freeze({
    COLOR: (heroLife) => {
        if (heroLife < 20) {
            return "#cc0000";
        }
        if (heroLife < 50) {
            return "#ffaa00";
        }
        return "#007f00";
    },
    DURATION: 500
});

const DamageShadowDescriptor = Object.freeze({
    COLOR: "#ff4545",
    DURATION: 700
});

const HealShadowDescriptor = Object.freeze({
    COLOR: "#3bd3df",
    DURATION: 300
});


function HeroHealthBar(props) {
    const heroLife = useSelector(state => state.heroLife);

    const previousHeroLifeRef = useRef(heroLife);

    const isDamage = previousHeroLifeRef.current > heroLife;
    const healthBarShadowDescriptor = isDamage ? DamageShadowDescriptor : HealShadowDescriptor;
    previousHeroLifeRef.current = heroLife;

    return (
        <HealthBarWrapper className={props.className}>
            <HealthBar
                width={heroLife}
                duration={HealthBarDescriptor.DURATION}
                color={HealthBarDescriptor.COLOR(heroLife)}
                animateColor
            />
            <HealthBarShadow
                width={heroLife}
                duration={healthBarShadowDescriptor.DURATION}
                color={healthBarShadowDescriptor.COLOR}
            />
            <PositionedHeart src={Heart} />
        </HealthBarWrapper>
    );
}

const HealthBarWrapper = styled.div`
    border: 2px solid black;
    border-radius: 5px;
    background-color: lightgrey;
`;

const GenericHealthBar = styled.div`
    position: absolute;
    height: 100%;
    max-width: 100%;
    
    ${props => `
    background-color: ${props.color};
    width: ${props.width}%;
    transition: width ${props.duration}ms${props.animateColor ? `, background-color ${props.duration}ms` : ""};
    `}
`;

const HealthBar = styled(GenericHealthBar)`
    z-index: 2;
`;

const HealthBarShadow = styled(GenericHealthBar)`
    z-index: 1;
`;

const PositionedHeart = styled.img`
    position: absolute;
    height: 250%;
    transform: translate(-70%, -50%);
    top: 50%;
    z-index: 3;
    filter: saturate(1.5) contrast(1.5);
`;

export default React.memo(HeroHealthBar);
