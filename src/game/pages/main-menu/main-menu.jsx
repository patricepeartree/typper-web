import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import styled from "styled-components";

import { useKeyDownHandlers } from "@custom-hooks";

import { Routes, Keys, AlwaysFocusedConstants, ABOUT_URL } from "@game/constants";

import Leaderboard from "@game/pages/main-menu/leaderboard";
import GenericBackground, { ZIndexes as GenericBackgroundZIndexes } from "@game/components/generic-background";

import { AlwaysFocusedContextProvider } from "@game/components/util/always-focused-context";
import { FullScreenContainer, BlurredOverlay } from "@game/components/util/styled-components";
import AnimatedNinja, { State as NinjaState } from "@game/components/animated-characters/ninja"
import AnimatedZombie, { State as ZombieState } from "@game/components/animated-characters/zombie";


const ZIndexes = {
    CHARACTERS: GenericBackgroundZIndexes.CHARACTERS,
    BLURRED_OVERLAY: GenericBackgroundZIndexes.LAST_BACKGROUND_LAYER + 1,
    CONTENT: GenericBackgroundZIndexes.LAST_BACKGROUND_LAYER + 2
};

const MainMenuOptions = {
    PLAY: { id: "play", label: "Play" },
    LEADERBOARD: { id: "leaderboard", label: "Leaderboard" },
    ABOUT: { id: "about", label: "About" }
};

const MAIN_MENU_OPTIONS_COUNT = Object.keys(MainMenuOptions).length;

const NavigationInfo = {
    NORMAL: ["Arrow Keys = Up/Down", "SPACE = Select"],
    LEADERBOARD: ["ESC = Back"]
};


function MainMenu() {
    const [keyHandlers, seKeyHandlers] = useState();
    const [selectedOption, setSelectedOption] = useState(0);
    const [redirectToPlay, setRedirectToPlay] = useState(false);
    const [showLeaderboard, setShowLeaderboard] = useState(false);

    function handleNavigationUp() {
        setSelectedOption(selectedOption === 0 ? MAIN_MENU_OPTIONS_COUNT - 1 : selectedOption - 1)
    }

    function handleNavigationDown() {
        setSelectedOption(selectedOption === MAIN_MENU_OPTIONS_COUNT - 1 ? 0 : selectedOption + 1);
    }

    function handleSelectOption() {
        const menuOption = Object.values(MainMenuOptions)[selectedOption];
        switch (menuOption.id) {
            case MainMenuOptions.PLAY.id:
                setRedirectToPlay(true);
                break;
            case MainMenuOptions.LEADERBOARD.id:
                setShowLeaderboard(true);
                break;
            default:
                window.open(ABOUT_URL);
                break;
        }
    }

    // handle(...) methods do not need to be in the dependencies array because they only depend on selectedOption, which is added as a dependency
    useEffect(() => {
        const updatedKeyHandlers = showLeaderboard
            ? {
                [Keys.ESC]: () => setShowLeaderboard(false)

            } : {
                [Keys.ARROW_UP]: handleNavigationUp,
                [Keys.ARROW_DOWN]: handleNavigationDown,
                [Keys.SPACE]: handleSelectOption
            };

        seKeyHandlers(updatedKeyHandlers);
    }, [selectedOption, showLeaderboard]); // eslint-disable-line react-hooks/exhaustive-deps

    useKeyDownHandlers(keyHandlers);

    if (redirectToPlay) {
        return <Redirect to={Routes.RESET_GAME} />;
    }

    const navigationInfo = showLeaderboard ? NavigationInfo.LEADERBOARD : NavigationInfo.NORMAL;

    return (
        <AlwaysFocusedContextProvider value={AlwaysFocusedConstants.RouteElemHierarchy[Routes.MAIN_MENU]}>
            <GenericBackground navigationInfo={navigationInfo}>
                {showLeaderboard && <BlurredOverlay zIndex={ZIndexes.BLURRED_OVERLAY} />}
                <NinjaContainer>
                    <AnimatedNinja state={NinjaState.IDLE} />
                </NinjaContainer>
                <ZombieContainer>
                    <AnimatedZombie state={ZombieState.IDLE} invert />
                </ZombieContainer>
                <ContentContainer>
                    {/* <SwitchTransition>
                    <CSSTransition
                        key={contentKey}
                    > */}
                    <Title>Typper</Title>
                    {showLeaderboard ? (
                        <Leaderboard />
                    ) : (
                            <Menu>
                                {Object.values(MainMenuOptions).map(({ label }, index) => (
                                    <MenuOption key={label} isSelected={index === selectedOption}>
                                        {label}
                                    </MenuOption>
                                ))}
                            </Menu>
                        )
                    }
                    {/* </CSSTransition>
                </SwitchTransition> */}
                </ContentContainer>
            </GenericBackground>
        </AlwaysFocusedContextProvider>
    );
}

const NinjaContainer = styled.div`
    position: absolute;
    height: 63%;
    bottom: -3%;
    left: 0;
    transform: translateX(-15%);
    z-index: ${ZIndexes.CHARACTERS};
`;

const ZombieContainer = styled.div`
    position: absolute;
    height: 68%;
    bottom: -5%;
    right: 0;
    transform: translateX(28%);
    z-index: ${ZIndexes.CHARACTERS};
`;

const ContentContainer = styled(FullScreenContainer)`
    z-index: ${ZIndexes.CONTENT};
`;

const Title = styled.span`
    font-family: Badly Stamped;
    font-size: 80px;
    text-shadow: 10px 10px 5px purple, -10px -10px 5px #47705b;
    letter-spacing: 10px;
    position: absolute;
    left: 50%;
    top: 20%;
    transform: translateX(-50%);
`;

const Menu = styled.div`
    font-family: Zombie;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%);
    text-align: center;
`;

const MenuOption = styled.div`
    font-size: 65px;    
    color: white;
    opacity: 0.8;
    transition: font-size 400ms, color 400ms;
    
    ${props => props.isSelected && `
        font-size: 95px;
        color: #bd0000;
        opacity: 1;
        &:first-letter {
            color: #03ab03;
        }
    `}
`;

export default MainMenu;
