import { useEffect } from "react";

// set the name of the hidden property and the change event for visibility (multiple browser support)
// Source: Page Visibility API - Web APIs | MDN (https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API)
let hidden, visibilityChange;
if (typeof document.hidden !== "undefined") {
    hidden = "hidden";
    visibilityChange = "visibilitychange";
} else if (typeof document.msHidden !== "undefined") {
    hidden = "msHidden";
    visibilityChange = "msvisibilitychange";
} else if (typeof document.webkitHidden !== "undefined") {
    hidden = "webkitHidden";
    visibilityChange = "webkitvisibilitychange";
}

function useWindowVisibility(callback) {
    useEffect(() => {
        function handleVisibilityChange() {
            callback(!!document[hidden]);
        }
    
        function handleFocus() {
            callback(false);
        }
    
        function handleBlur() {
            callback(true);
        }
    
        window.addEventListener(visibilityChange, handleVisibilityChange);
        window.addEventListener("focus", handleFocus);
        window.addEventListener("blur", handleBlur);

        return () => {
            window.removeEventListener(visibilityChange, handleVisibilityChange);
            window.removeEventListener("focus", handleFocus);
            window.removeEventListener("blur", handleBlur);
        };
    }, [callback]);
}

export default useWindowVisibility;
