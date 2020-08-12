import { useState, useEffect } from "react";

//TODO: also listen to window resize
function useHeightBasedOnWindow(ratio) {
    const [height, setHeight] = useState();

    useEffect(() => {
        setHeight(window.innerHeight * ratio);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return height;
}

export default useHeightBasedOnWindow;
