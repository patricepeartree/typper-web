import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

function EnemyWord(props) {
    const { word, nextIndex, isActive, isDisabled } = props;

    const [wordBreakdown, setWordBreakdown] = useState({
        typed: "",
        todo: ""
    });

    useEffect(() => {
        setWordBreakdown({
            typed: word.substring(0, nextIndex),
            todo: word.substring(nextIndex)
        });
    }, [word, nextIndex]);

    return (
        <Word isDisabled={isDisabled}>
            <PartialWord isTyped>
                {wordBreakdown.typed}
            </PartialWord>
            <PartialWord isActive={isActive}>
                {wordBreakdown.todo}
            </PartialWord>
        </Word>
    );
}

const Word = styled.span`
    letter-spacing: 1px;
    ${props => props.isDisabled && "opacity: 0.5;"}
`;

const PartialWord = styled.span`
    font-family: Zombie;
    font-size: 36px;
    text-shadow: -3px 0 white, 0 3px white, 3px 0 white, 0 -3px white;
    ${props => {
        if (props.isTyped) {
            return "color: #03ab03;";
        }
        if (props.isActive) {
            return "color: #bd0000;";
        }
    }}
`;

export default EnemyWord;
