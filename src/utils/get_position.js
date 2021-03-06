/**
 * @module
 * @export {Function} getPosition
 */

import { getPointerData } from './get_pointer_data';

/**
 * Get pointer/finger position
 * @param {Object} evt: event object
 *
 * @return {Object}: position{x, y}
 */
export let getPosition = (evt) => {
    const data = getPointerData(evt);

    return {
        x: data.clientX,
        y: data.clientY
    };
};
