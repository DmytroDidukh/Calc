'use strict';

const inputArea = document.querySelector('.input-area'),
    // calc = document.querySelector('#calculator'),
    controlPanel = document.querySelector('.template'),
    actions = document.querySelector('.actions'),
    zeroBlock = document.querySelector('.zero'),
    header = document.querySelector('.header');


const calcData = {
    input: '',
    actionInner: '',
    minus: false,
    nextOperation: false,
    isEqual: false,


    calcActions(event) {
        zeroBlock.style.display = 'none';

        const btn = event.target.closest('.btn');
        const option = btn.dataset.opt;


        switch (option) {
            case 'number':
                if (this.nextOperation || this.isEqual) this.input = '';
                if (this.isEqual) {
                    this.actionInner = '';
                    this.isEqual = false;
                }

                this.nextOperation = false;

                if (this.input.length > 20) break;
                else this.input += btn.innerText;

                break;
            case 'minus':
                if (this.minus) {
                    this.input = this.input.slice(1);
                    this.minus = false;
                } else {
                    this.input = '-' + this.input;
                    this.minus = true;
                }
                break;
            case 'option':
                if (this.isEqual || !this.input) break;

                this.nextOperation ? this.actionInner : this.actionInner += inputArea.innerText + btn.innerText;
                this.nextOperation = true;

                this.actionInner = this.addActionInnerSpaces(this.actionInner, btn);

                break;
            case 'square':
                this.actionInner = `sqr(${this.input})`;
                this.input = this.equal(`${this.input} * 2`);

                this.isEqual = true;
                break;
            case 'backspace':
                this.input = this.input
                    .slice(0, this.input.length - 1)
                    .replace(/\.$/, '');
                break;
            case 'clear':
                this.input = '';
                this.actionInner = '';

                break;
            case 'equal':
                if (this.isEqual) break;

                this.isEqual = true;
                // edit this shit down here and at a row 52
                this.actionInner += inputArea.innerText + btn.innerText;
                this.input = this.equal(this.actionInner);


                this.actionInner = this.addActionInnerSpaces(this.actionInner, btn);
                break;
        }

        if (!this.input.length) zeroBlock.style.display = '';

        if (this.input.length > 9) inputArea.style.fontSize = '20px';
        else inputArea.style.fontSize = '';

        inputArea.innerText = this.addInputComas(this.input);
        actions.innerText = this.actionInner;
    },

    equal(inner) {
        let newInner = inner.replace(/\D/g, (m) => {
            switch (m.charCodeAt()) {
                case 32: // space
                    return '';
                case 247: // ÷
                    return '/';
                case 215: // ×
                    return '*';
                case 44: // coma ','
                    return '';
                case 61: // =
                    return ''
            }
            return m;
        });

        newInner = eval(newInner);
        return newInner + '';
    },

    addActionInnerSpaces(inner, btn) {
        return inner
            .replace(/(?<=\d)[^\d,\.](?=\d|$)/gi, (m) => ' ' + m + ' ')
            .replace(/\D(?=\s$)/, btn.innerText);
    },

    addInputComas(str) {
        return str
            .replace(/\,/i, '')
            .split('').reverse().join('')
            .replace(/(.*?\.)|(\d{3}(?=\d))/gi, (m, coma, dig) => coma ? coma : dig + ',')
            .split('').reverse().join('');
    },
};


header.addEventListener('mousedown', moveCalc);
controlPanel.addEventListener('click', calcData.calcActions.bind(calcData));


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


/*function calculate(event) {
    zero.style.display = 'none';
    const btn = event.target.closest('.btn');

    let strText = inputArea.innerText;
    if (strText.length + 1 > 17) return;
    if (event.shiftKey) return;

    if (event.keyCode >= 48 && event.keyCode <= 57) {
        inputValueChanger(event, strText, btn);
        return;
    }

    switch (btn.dataset.opt) {
        case 'number':
            inputValueChanger(event, strText, btn);
            break;
        case 'option':
            actionValueChanger(event)
            break;
        case 'backspace':
            inputArea.innerText = strText.slice(0, strText.length - 1);
            if (!inputArea.innerText.length) zero.style.display = '';
            break;
        case 'clear':
            actions.innerText = '';
            deleteInner()
            break;
        case 'equal':
            equal(event);
            break;
    }
}

function equal(event) {
    const target = event.target;

    if (inputArea.innerText.length) {
        actions.innerText += ' ' + inputArea.innerText + ' ' + ' ' + target.innerText;
        deleteInner()

    } else {
        actions.innerText = actions.innerText.slice(0, actions.innerText.length - 1) + target.innerText;
        deleteInner()
    }

    let inner = actions.innerText.split(' ');
    inner.pop();

    for (let i = 0; i < inner.length; i++) {
        switch (inner[i]) {
            case '×':
                inner.splice(i, 1, '*')
                break;
            case '÷':
                inner.splice(i, 1, '/') ;
                break;
        }
    }

    inputArea.innerText = eval(inner.join(''));
    zero.style.display = 'none'
    if (inputArea.innerText.length > 10) inputArea.style.fontSize = 30 + 'px';

}

function inputValueChanger(event, strText, btn) {
    inputArea.innerText += event.key || btn.innerText;
    inputArea.innerText = inputArea.innerText
                                    .replace(/\,/gi, '')
                                    .split('')
                                    .reverse()
                                    .join('')
                                    .replace(/\d{3}(?=\d)/gi, (m) => {
                                      return m + ','
                                    })
                                    .split('')
                                    .reverse()
                                    .join('');
    if (strText.length > 10) inputArea.style.fontSize = 30 + 'px';
}


function actionValueChanger(event) {
    const target = event.target;

    if (actions.innerText[actions.innerText.length - 1] == '=') actions.innerText = inputArea.innerText + target.innerText;

    if (!actions.innerText.length) {
        actions.innerText += ' ' + inputArea.innerText + ' ' + ' ' + target.innerText;
        deleteInner()
    }

    else {
        if (inputArea.innerText.length) {
            actions.innerText += ' ' + inputArea.innerText + ' ' + ' ' + target.innerText;
            deleteInner()

        } else {
            actions.innerText = actions.innerText.slice(0, actions.innerText.length - 1) + target.innerText;
            deleteInner()
        }
    }
}

function deleteInner() {
    zero.style.display = '';
    inputArea.innerText = '';
}

*/

