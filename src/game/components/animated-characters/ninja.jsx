import React, { forwardRef } from "react";

import AnimatedCharacter from "./animated-character";

import * as Ninja from "@assets/ninja";

export const State = Ninja.State;

export default forwardRef((props, ref) => <AnimatedCharacter ref={ref} character={Ninja}  {...props} />);
