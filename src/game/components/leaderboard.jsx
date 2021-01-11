import React, { useCallback, useEffect, useState } from "react";
import styled, { css, keyframes } from "styled-components";

import Medal1 from "@assets/medal_1.png";
import Medal2 from "@assets/medal_2.png";
import Medal3 from "@assets/medal_3.png";
import ArrowUp from "@assets/arrow-up.png";
import Error from "@assets/error.png";

import { AlwaysFocusedConstants, NUM_LEADERBOARD_ENTRIES, MAX_PLAYER_NAME_CHARACTERS } from "@game/constants";

import UnblurableAndSubmitableInput, { Type as UnblurableAndSubmitableInputType } from "@game/components/util/unblurable-and-submitable-input";
import { useAlwaysFocusedContext } from "@game/components/util/always-focused-context";
import Loading from "@game/components/util/loading";

function Leaderboard(props) {
    const { className, isLoading, error, leaderboard, idToRequestName, onNameSubmit, defaultName } = props;

    const [fullLeaderboard, setFullLeaderboard] = useState([]);
    const [hasScrollTop, setHasScrollTop] = useState(false);
    const [hasScrollBottom, setHasScrollBottom] = useState(true);

    const registerElem = useAlwaysFocusedContext();

    function handleLeaderboardRef(elem) {
        registerElem(AlwaysFocusedConstants.ElemIds.LEADERBOARD, elem);

        if (elem) {
            // disable wheel scroll
            elem.onwheel = () => false;

            elem.onscroll = () => {
                setHasScrollTop(elem.scrollTop > 0);
                setHasScrollBottom(elem.offsetHeight + elem.scrollTop < elem.scrollHeight)
            };
        }
    }

    const memoizedHandleLeaderboardRef = useCallback(handleLeaderboardRef, []);

    useEffect(() => {
        // XXX: if this is done during render, the leaderboard scrolls down, don't know why...
        setFullLeaderboard(Array(NUM_LEADERBOARD_ENTRIES).fill().map((_, i) => {
            return (leaderboard || [])[i] || {
                id: `dummy-${i}`,
                name: "-",
                score: "-"
            }
        }));
    }, [leaderboard])

    return (
        <LeaderboardContainer className={className}>
            {isLoading && <Loading />}
            {error
                ? (
                    <ErrorContainer>
                        <img src={Error} alt="" />
                        <div>Oops,<br />something went wrong...</div>
                    </ErrorContainer>
                ) : (
                    <>
                        <LeaderboardHeader>
                            <div></div>
                            <div>Player</div>
                            <div>Score</div>
                        </LeaderboardHeader >
                        <LeaderboardEntries tabIndex="0" ref={memoizedHandleLeaderboardRef}>
                            {fullLeaderboard.map((entry, i) => (
                                <LeaderboardEntry key={entry.id} isPlayerNameInput={entry.id === idToRequestName}>
                                    <div>
                                        {i === 0 && <Medal src={Medal1} />}
                                        {i === 1 && <Medal src={Medal2} />}
                                        {i === 2 && <Medal src={Medal3} />}
                                        {i > 2 && `${i < 9 ? "0" : ""}${i + 1}`}
                                    </div>
                                    <div>
                                        {entry.id === idToRequestName
                                            ? (
                                                <PlayerNameInput
                                                    placeholder="Enter Your Name"
                                                    defaultValue={defaultName}
                                                    type={UnblurableAndSubmitableInputType.ALPHANUMERIC_WITH_UNDERSCORE}
                                                    maxLength={MAX_PLAYER_NAME_CHARACTERS}
                                                    onSubmit={onNameSubmit}
                                                />
                                            ) : (
                                                entry.name ? <span title={entry.name}>{entry.name}</span>
                                                    : <EmptyPlayerName>ANONYMOUS</EmptyPlayerName>
                                            )}
                                    </div>
                                    <div>
                                        {entry.score}
                                    </div>
                                </LeaderboardEntry>
                            ))}
                        </LeaderboardEntries>
                        {hasScrollTop && <Arrow src={ArrowUp} />}
                        {hasScrollBottom && <Arrow src={ArrowUp} isDown />}
                    </>
                )
            }
        </LeaderboardContainer >
    )
};

const LeaderboardContainer = styled.div`
    background-color: rgba(37, 0, 36, 0.6);
    border-style: solid;
    border-image-slice: 1;
    border-width: 3px;
    border-image-source: linear-gradient(to bottom, #603058, rgba(132, 168, 79, 0.5));
    display: flex;
    flex-direction: column;
    padding: 0 15px;
    font-family: Zombie;
    font-size: 30px;
`;

const LeaderboardRow = styled.div`
    display: flex;
    align-items: center;

    & > div {
        &:first-child {
            flex-shrink: 0;
            flex-basis: 100px;
            text-align: center;
        }

        &:nth-child(2) {
            flex-grow: 1;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        &:last-child {
            flex-shrink: 0;
            flex-basis: 25%;
            text-align: center;
        }
    }
`;

const LeaderboardHeader = styled(LeaderboardRow)`
    flez-shrink: 0;
    width: 100%;
    padding: 10px 0;
    color: rgb(132, 168, 79);
    text-shadow: 5px 5px 5px rgb(0, 0, 0, 50%);
`;

const LeaderboardEntries = styled.div`
    flex-grow: 1;
    overflow-y: scroll;
    outline: none;
    
    /* Hide scrollbar for Chrome, Safari and Opera */
    &::-webkit-scrollbar {
        display: none;
    }
    /* Hide scrollbar for IE, Edge and Firefox */
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
`;

const requestNameEntryAnimation = keyframes`
    0% {
        background-color: #250024;
    }
    100% {
        background-color: #003614;
    }
`;

const LeaderboardEntry = styled(LeaderboardRow)`
    margin-bottom: 15px;
    background-color: #250024;
    color: white;
    border-style: solid;
    border-width: 1px;
    border-image-slice: 1;
    border-image-source: linear-gradient(to bottom, #ffffff, rgba(266, 266, 266, 0.0));

    ${props => props.isPlayerNameInput && css`
    animation: ${requestNameEntryAnimation} 700ms ease-in-out infinite alternate;
    `}
    
    & > div {
        padding: 15px 0;

        &:first-child {
            position: relative;
        }

        &:nth-child(2) {
            border-style: solid;
            border-width: 1px;
            border-image-slice: 0 0 1 0;
            border-image-source: linear-gradient(to right, #84A84F, rgba(132, 168, 79, 0.0));
        }

        &:last-child {
            color: #c2a6de;
            border-style: solid;
            border-width: 1px;
            border-image-slice: 0 0 1 0;
            border-image-source: linear-gradient(to right, rgba(132, 168, 79, 0), rgb(132, 168, 79), rgba(132, 168, 79, 0));
        }
    }
`;

const Medal = styled.img`
    height: 60px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -40%);
`;

const PlayerNameInput = styled(UnblurableAndSubmitableInput)`
    font-family: Zombie;
    font-size: 30px;    
    color: #ffdd00;
    background-color: transparent;
    border: none;
    outline: none;                                        
`;

const EmptyPlayerName = styled.span`
    opacity: 0.5;
`;

const arrowAnimation = (isDown) => keyframes`
    0% {
        ${isDown ? "margin-bottom: 0;" : "margin-top: 0;"}
    }
    100% {
        ${isDown ? "margin-bottom: -15px;" : "margin-top: -15px;"
    }
`;

const Arrow = styled.img` 
    position: absolute;
    ${props => props.isDown ? "bottom: -2px;" : "top: 48px;"}
    left: 50%;
    transform: translateX(-50%) ${props => props.isDown && "rotate(180deg)"};
    height: 60px;
    animation: ${props => arrowAnimation(props.isDown)} 700ms ease-in infinite alternate;
`;

const ErrorContainer = styled.div`
    margin: auto;
    text-align: center;
    color: white;

    & > img {
        height: 120px;
        width: 120px;
        margin-bottom: 30px;
        filter: saturate(2);
    }
`;

export default Leaderboard;
