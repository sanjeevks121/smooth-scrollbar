/**
 * @module
 * @prototype {Function} __initScrollbar
 */

import { SmoothScrollbar } from '../smooth_scrollbar';

export { SmoothScrollbar };


/**
 * @method
 * @internal
 * initialize scrollbar
 *
 * This method will attach several listeners to elements
 * and create a destroy method to remove listeners
 *
 * @param {Object} option: as is explained in constructor
 */
function __initScrollbar() {
    // update sync, see react-smooth-scrollbar#5
    this.update(false); // initialize thumb position

    this.__keyboardHandler();
    this.__resizeHandler();
    this.__selectHandler();
    this.__mouseHandler();
    this.__touchHandler();
    this.__wheelHandler();
    this.__dragHandler();

    this.__render();
};

Object.defineProperty(SmoothScrollbar.prototype, '__initScrollbar', {
    value: __initScrollbar,
    writable: true,
    configurable: true
});
