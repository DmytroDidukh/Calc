'use strict';


const inputArea = document.querySelector('.input-area'),
    actions = document.querySelector('.actions'),

    movementPlace = document.querySelector('.move-place'),
    controlPanel = document.querySelector('.template'),

    zeroBlock = document.querySelector('.zero');

movementPlace.addEventListener('mousedown', moveCalc);
controlPanel.addEventListener('click', calcData.calcActions.bind(calcData));





