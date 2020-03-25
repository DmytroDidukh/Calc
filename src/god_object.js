'use strict';

const calcData = {
    input: '',
    actionInner: '',
    nextOperation: false,
    isEqual: false,
    preEqual: true,
    isSquare: false,
    temporaryInput: '',


    calcActions(event) {
        zeroBlock.style.display = 'none';

        const btn = event.target.closest('.btn');

        let option;
        try {
            option = btn.dataset.opt || '';
        } catch (e) {
            console.log('Move placement at the top')
        }

        switch (option) {
            case 'number':
                if ((btn.innerText === '.' && !this.input) || (this.input.match(/\./) && btn.innerText === '.') || (btn.innerText === '0' && this.input === '0') || (/\d/.test(btn.innerText) && this.input === '0')) break;
                if (this.nextOperation || this.isEqual) {
                    this.temporaryInput = this.input;
                    this.input = '';
                }
                if (btn.innerText === '.' && !this.input) {
                    this.input = this.temporaryInput;
                    break;
                }
                if (this.isEqual) {
                    this.actionInner = '';
                    this.isEqual = false;
                }


                this.nextOperation = false;

                if (this.input.length > 20) break;
                else this.input += btn.innerText;

                this.nextOperation = false;
                this.preEqual = false;
                this.isSquare = false;

                break;
            case 'minus':
                this.input = /-/.test(this.input) ? this.input.slice(1) : '-' + this.input;
                break;
            case 'option':
                if (!this.input || this.input === 'Cannot divide by zero') break;

                if (this.isEqual) {
                    this.actionInner = '';
                    this.isEqual = false;
                }

                this.nextOperation ? this.actionInner : this.actionInner += inputArea.innerText + btn.innerText;

                this.nextOperation = true;
                this.preEqual = true;
                this.isSquare = false;

                this.actionInner = this.addActionInnerSpaces(this.actionInner, btn);
                this.zeroDivideCheck();

                break;
            case 'square':
                if (!this.input || this.isSquare || this.input === 'Cannot divide by zero') break;
                this.actionInner = `sqr(${this.input})`;
                this.input = this.equal(`${this.input} * ${this.input}`);

                this.isEqual = true;
                this.isSquare = true;
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
                if (this.isEqual || this.preEqual || !/\D/.test(this.actionInner)) break;

                this.preEqual = true;
                this.isEqual = true;

                // edit this shit down here and at a row 70
                this.actionInner += inputArea.innerText + btn.innerText;

                let temporaryEqual = this.equal(this.actionInner);
                let isPointInResult = /\./.test(temporaryEqual);
                this.input = !(isPointInResult && temporaryEqual.match(/\.\d+/)[0].length > 10) ? temporaryEqual : (+temporaryEqual).toFixed(10);

                this.zeroDivideCheck();

                this.actionInner = this.addActionInnerSpaces(this.actionInner, btn);
                break;
        }

        if (!this.input.length) zeroBlock.style.display = '';

        if (this.input.length > 9) inputArea.style.fontSize = '20px';
        else inputArea.style.fontSize = '';

        inputArea.innerText = this.addInputComas(this.input);
        actions.innerText = this.actionInner.replace(/(\.0+\s|$)|(?<=\.\d+?)0+(?=\s|$)/gi, ' ');
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

    zeroDivideCheck() {
        if ((/÷\s0[^\.]/).test(this.actionInner)) this.input = 'Cannot divide by zero';
    },
};
