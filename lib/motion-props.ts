import type { MotionProps } from "motion/react";

export const motionProps: MotionProps = {
    layout: "position",
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.1 },
};
