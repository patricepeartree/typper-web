import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

function useCollisionDetection(elemRef, collisionId, onCollision) {
    const heroPosX = useSelector(state => (state.heroPosition || {}).x);

    const [collided, setCollided] = useState(false);

    // XXX: setCollided won't cause an infinite chain of updates because collided is checked in the beginning of useEffect
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { 
        if (!collided && elemRef.current) {
            const { width, left, right, bottom } = elemRef.current.getBoundingClientRect();
            const pointX = left + width / 2 <= heroPosX ? right - 1 : left;
            const elemsAtPosition = document.elementsFromPoint(pointX, bottom - 1);
            //FIXME: find a better way of comparing element
            const updatedCollided = elemsAtPosition.some(elem => elem.id === collisionId);
            setCollided(updatedCollided);
            if (updatedCollided) {
                onCollision();
            }
        }
    });

    return collided;
}

export default useCollisionDetection;
