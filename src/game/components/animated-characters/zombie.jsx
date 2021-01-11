import React, { forwardRef } from "react";

import AnimatedCharacter from "./animated-character";

import { MaleZombie } from "@assets/zombie";

export const State = MaleZombie.State;

export default forwardRef((props, ref) => <AnimatedCharacter ref={ref} character={MaleZombie} {...props} />);
