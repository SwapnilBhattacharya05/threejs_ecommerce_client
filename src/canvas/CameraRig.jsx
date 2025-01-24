import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { easing } from 'maath';
import { useSnapshot } from 'valtio';
import state from '../store';


const CameraRig = ({ children }) => {
    const group = useRef();
    const snap = useSnapshot(state);

    // ?THIS HOOK ALLOWS TO EXECUTE CODE ON EVERY RENDERED FRAME
    useFrame((state, delta) => {

        // FOR RESPONSIVE
        const isBreakpoint = window.innerWidth < 1260;
        const isMobile = window.innerWidth < 600;

        // SET INITIAL POSITION OF THE MODEL
        let targetPosition = [-0.4, 0, 2];
        if (snap.intro) {
            if (isBreakpoint) targetPosition = [0, 0, 2];
            if (isMobile) targetPosition = [0, 0.2, 2.5];
        } else {
            if (isMobile) targetPosition = [0, 0, 2.5];
            else targetPosition = [0, 0, 2];
        }

        // !SET MODEL CAMERA POSITON
        easing.damp3(
            state.camera.position,
            targetPosition,
            0.25,
            delta
        );

        // *SET MODEL ROTATION SMOOTHLY
        // *delta -> DIFFERENCE FROM LAST FRAME THAT HAPPENED
        easing.dampE(
            group.current.rotation,
            [state.pointer.y / 10, -state.pointer.x / 5, 0],
            0.25,
            delta
        );
    });

    return (
        <group ref={group}>
            {children}
        </group>
    );
};

export default CameraRig;