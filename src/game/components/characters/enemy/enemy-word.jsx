import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

function EnemyWord(props) {
    const { word, nextIndex } = props;

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
        <>
            <PartialWord typed>
                {wordBreakdown.typed}
            </PartialWord>
            <PartialWord>
                {wordBreakdown.todo}
            </PartialWord>
        </>
    );
}

const PartialWord = styled.span`
    font-family: Zombie;
    font-size: 36px;
    text-shadow: -1px 0 white, 0 1px white, 1px 0 white, 0 -1px white;
    ${props => props.typed && "color: #bd0000;"}
`;

export default EnemyWord;
