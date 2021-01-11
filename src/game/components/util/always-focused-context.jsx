import React, { useCallback, useContext, useRef } from "react";

const ElemHierarchyContext = React.createContext([]);

export const AlwaysFocusedContextProvider = (props) => {
    const { value: elemHierarchy, children } = props;

    const registeredElems = useRef({});
    const unregisterActiveCallback = useRef();

    function processRegisteredElems() {
        if (unregisterActiveCallback.current) {
            unregisterActiveCallback.current();
            unregisterActiveCallback.current = null;
        }

        const elemId = elemHierarchy.find(elemId => registeredElems.current[elemId]);

        if (elemId) {
            const elem = registeredElems.current[elemId];
            const onblur = () => elem.focus();
            elem.addEventListener("blur", onblur);
            unregisterActiveCallback.current = () => elem.removeEventListener("blur", onblur);
            elem.focus();
        }
    }

    function registerElem(elemId, elem) {
        registeredElems.current[elemId] = elem;
        processRegisteredElems();
    }

    const memoizedRegisterElem = useCallback(registerElem, [elemHierarchy]);

    return (
        <ElemHierarchyContext.Provider value={memoizedRegisterElem}>
            {children}
        </ElemHierarchyContext.Provider>
    );
};

export const useAlwaysFocusedContext = () => useContext(ElemHierarchyContext);
