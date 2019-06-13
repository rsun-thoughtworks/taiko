const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
let { openBrowser, goto, textBox, closeBrowser, write, into, setConfig} = require('../../lib/taiko');
let { createHtml, removeFile, openBrowserArgs } = require('./test-util');
let test_name = 'write';

describe(test_name, () => {
    let filePath;
    before(async () => {
        let innerHtml = '<div>' +
        '<form name="inputTypeText">' +
            //Read only input with type text
            '<div name="inputTypeTextWithInlineTextReadonly">' +
                '<input type="text" readonly>inputTypeTextWithInlineTextReadonly</input>' +
            '</div>' +
            '<div name="input-type-text">' +
                '<input type="text">input-type-text</input>' +
            '</div>' +
        '</form>';
        '</div>';
        filePath = createHtml(innerHtml, test_name);
        await openBrowser(openBrowserArgs);
        await setConfig({waitForNavigation:false});
        await goto(filePath);
    });

    after(async () => {
        removeFile(filePath);
        await setConfig({waitForNavigation:true});
        await closeBrowser();
    });

    it('into input field text', async () => {
        expect(await textBox('input-type-text').value()).to.equal('');
        await write('hello', into(textBox('input-type-text')));
        expect(await textBox('input-type-text').value()).to.equal('hello');
    });

    it('should fail for readonly feild', async () => {
        await expect(write('inputTypeTextWithInlineText', into(textBox('inputTypeTextWithInlineTextReadonly')))).to.eventually.be.rejected;
    });

});
