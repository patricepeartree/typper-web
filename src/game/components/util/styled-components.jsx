import styled from "styled-components";

export const FullScreenContainer = styled.div`
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
`;

export const BlurredOverlay = styled(FullScreenContainer)`
    backdrop-filter: blur(5px);
    ${props => props.zIndex !== undefined && `z-index: ${props.zIndex};`}
`;
