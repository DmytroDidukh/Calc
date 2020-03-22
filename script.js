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
                if (btn.innerText === '.' && !this.input) break;
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
                if (/*this.isEqual ||*/ !this.input) break;

                if (this.isEqual) {
                    this.actionInner = '';
                    this.isEqual = false;
                }

                this.nextOperation ? this.actionInner : this.actionInner += inputArea.innerText + btn.innerText;
                this.nextOperation = true;

                this.actionInner = this.addActionInnerSpaces(this.actionInner, btn);

                break;
            case 'square':
                if (!this.input) break;
                this.actionInner = `sqr(${this.input})`;
                this.input = this.equal(`${this.input} * ${this.input}`);

                this.isEqual = true;
                break;
            case 'backspace':
                if (this.isEqual) break;
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


