import React from "react";
import styled from "styled-components";

import { ZIndexes } from "@game/constants";


//TODO: does this need to be a react component?
// for now yes, because of the id for collision detection
function ShootZone() {
    return <ShootZoneElem id="shoot-zone" />;
};

const ShootZoneElem = styled.div`
    position: absolute;
    bottom: 0;
    transform: translateY(50%);
    width: 100%;
    height: 50%;
    border-radius: 50%;
    z-index: ${ZIndexes.SHOOTING_ZONE};  
`;

export default React.memo(ShootZone);
