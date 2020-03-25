'use strict';

function moveCalc(event) {
    const calc = event.target.closest('#calculator');
    const docEl = document.documentElement;

    let shiftX = event.clientX - calc.getBoundingClientRect().left;
    let shiftY = event.clientY - calc.getBoundingClientRect().top;

    calc.style.position = 'absolute';

    moveAt(event.pageX, event.pageY);

    function moveAt(pageX, pageY) {
        let calcCoords = {
            top: pageY - shiftY,
            left: pageX - shiftX
        };

        if (calcCoords.top < 0) calcCoords.top = 0;

        if (calcCoords.left < 0) calcCoords.left = 0;

        if (calcCoords.left + calc.clientWidth > docEl.clientWidth) {
            calcCoords.left = docEl.clientWidth - calc.clientWidth;
        }

        if (calcCoords.top + calc.clientHeight > docEl.clientHeight) {
            calcCoords.top = docEl.clientHeight - calc.clientHeight;
        }

        calc.style.left = calcCoords.left + 'px';
        calc.style.top = calcCoords.top + 'px';
    }

    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY)
    }

    function mouseUp() {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', mouseUp);
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', mouseUp);
}

document.ondragstart = function () {
    return false;
};