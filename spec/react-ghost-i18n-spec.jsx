import I18n from '../react-ghost-i18n';
import React from 'react';
import createComponent from 'react-unit';

describe('The <I18n> component', () => {
  it('can use a local translation map specified in the "locale" attribute',
    () => {

    const component = createComponent(
      <I18n locale={{ 'Hi!': 'Hola!'}}>
        Hi!
      </I18n>
    );

    expect(component.text).toBe("Hola!");
  });

  it('can use a local translation function specified in the "locale" attribute',
    () => {

    const component = createComponent(
      <I18n locale={key => key + "!!!"}>
        Hi
      </I18n>
    );

    expect(component.text).toBe("Hi!!!");
  });


  it('can be used to wrap the markup to be translated', () => {

    const component = createComponent(
      <I18n locale={{ 'Hi!': 'Hola!'}}>
        <span>Hi!</span>
      </I18n>
    );

    expect(component.text).toBe("Hola!");
  });

  it('can be used to wrap a component to be translated', () => {

    const HiJohn = React.createClass({
      render: () => <h1><span>Hi</span> <span>John</span>!</h1>
    });

    const component = createComponent(
      <I18n locale={{ 'Hi': 'Whassup', 'John': 'Johnny'}}>
        <HiJohn />
      </I18n>
    );

    expect(component.text).toBe("Whassup Johnny!");
  });

  it('will not try to translate tags marked with the "i18n-disabled" attribute',
    () => {

    const SayHi = React.createClass({
      render: function() {
        return <h1>
          <span>Hi</span> <span i18n-disabled>{this.props.name}</span>!
        </h1>;
      }
    });

    const component = createComponent(
      <I18n locale={{ 'Hi': 'Whassup', 'John': 'Johnny' }}>
        <SayHi name="John" />
      </I18n>
    );

    expect(component.text).toBe("Whassup John!");
  });

  it('will not try to translate components marked with the "noI18n" property',
    () => {

    var NotTranslated = React.createClass({
      noI18n: true,
      render: function() { return <span>Hello</span> }
    });

    const component = createComponent(
      <I18n locale={{ 'Hello': 'Whassup' }}>
        <NotTranslated />
      </I18n>
    );

    expect(component.text).toBe("Hello");
  });

  it('will honor the "noI18n" property even in mixins',
    () => {
    var DontTranslate = { I18n: false };
    var NotTranslated = React.createClass({
      mixins: [DontTranslate],
      render: function() { return <span>Hello</span> }
    });

    const component = createComponent(
      <I18n locale={{ 'Hello': 'Whassup' }}>
        <NotTranslated />
      </I18n>
    );

    expect(component.text).toBe("Hello");
  });

  it('will warn of missing translations and accepts a custom warning function' +
     ' specified in the "warn" attribute', () => {

    let warning = undefined;

    const component = createComponent(
      <I18n locale={{}} warn={ m => warning = m }>
        Hi!
      </I18n>
    );

    expect(warning).toBe("I18n: missing translation for: Hi!");
  });

  it('can use a translation prefix specified in the "prefix" attribute', () => {
    const component = createComponent(
      <I18n locale={{ 'greetings.Hi!': 'Heya!' }} prefix="greetings.">
        Hi!
      </I18n>
    );

    expect(component.text).toBe("Heya!");
  });

  it('will automatically try to translate the "title" attribute', () => {
    const component = createComponent(
      <I18n locale={{ 'Funny Monkey': 'Awesome Ape' }}>
        <img src="monkey.gif" title="Funny Monkey" />
      </I18n>
    );

    const img = component.findByQuery('img')[0];

    expect(img.prop('title')).toBe("Awesome Ape");
  });

  it('will automatically try to translate the "alt" attribute', () => {
    const component = createComponent(
      <I18n locale={{ 'Jumping Gorilla': 'Kickass Orangutan' }}>
        <img src="monkey2.gif" alt="Jumping Gorilla" />
      </I18n>
    );

    const img = component.findByQuery('img')[0];

    expect(img.prop('alt')).toBe("Kickass Orangutan");
  });

  it('will automatically try to translate the "placeholder" attribute', () => {
    const component = createComponent(
      <I18n locale={{ 'Query...': 'Question...' }}>
        <input placeholder="Query..." />
      </I18n>
    );

    const input = component.findByQuery('input')[0];

    expect(input.prop('placeholder')).toBe("Question...");
  });

  it('will automatically try to translate the "value" attribute for <input>s' +
    ' of type "button"', () => {
    const component = createComponent(
      <I18n locale={{ 'Punch': 'Kick' }}>
        <input type="button" value="Punch" />
      </I18n>
    );

    const input = component.findByQuery('input')[0];

    expect(input.prop('value')).toBe("Kick");
  });

  it('will automatically try to translate the "value" attribute for <input>s' +
    ' of type "submit"', () => {
    const component = createComponent(
      <I18n locale={{ 'Shout': 'Whisper' }}>
        <input type="submit" value="Shout" />
      </I18n>
    );

    const input = component.findByQuery('input')[0];

    expect(input.prop('value')).toBe("Whisper");
  });

  it('understands placeholders', () => {
    const SayHi = React.createClass({
      render: function() {
        return <h1>Hi <span i18n-disabled>{this.props.name}</span></h1>
      }
    });

    const component = createComponent(
      <I18n locale={{ 'Hi {0}': 'Ah {0}, we meet again!' }}>
        <SayHi name="Mr. Bond"/>
      </I18n>
    );

    expect(component.text).toBe("Ah Mr. Bond, we meet again!");
  });

  it('translates recursively', () => {
    const Hi = React.createClass({ render: () => <div>Hi</div> });
    const Hello = React.createClass({ render: () => <div>Hello</div> });
    const Whassup = React.createClass({ render: () => <div>Whassup</div> });
    const HW = React.createClass({ render: () => <div><Hello /> World</div> });
    const Greetings = React.createClass({
      render: function() {
        return <div>
          Greetings:
          <ul>
            <li><Hi /></li>
            <li><Hello /></li>
            <li><Whassup /></li>
            <li><HW /></li>
          </ul>
        </div>;
      }
    });

    const locale = {
      'Greetings:{0}' : 'Mumblings:{0}',
      'Hi': 'iH',
      'Hello': 'olleH',
      'Whassup': 'pussahW',
      '{0} World': 'dlroW {0}'
    };

    const component = createComponent(
      <I18n locale={locale}>
        <Greetings />
      </I18n>
    );

    expect(component.texts).toEqual([
      'Mumblings:',
      'iH',
      'olleH',
      'pussahW',
      'dlroW ',
      'olleH'
    ]);
  });

  it('can be configured globally by setting the attributes directly in the' +
    ' I18n object', () => {

    I18n.locale = {
      'Hi!': 'Hey!'
    };

    const component = createComponent(
      <I18n>
        Hi!
      </I18n>
    );

    expect(component.text).toBe('Hey!');
  });

  it('can be completely avoided by using the (default) implicit translation',
    () => {

    I18n.optIn(); // just in case we opted-out before this test
    var Hi = React.createClass({ render: () => <span>Hi!</span> });

    I18n.locale = {
      'Hi!': 'Hey!'
    };

    const component = createComponent(<Hi />);

    expect(component.text).toBe('Hey!');
  });

  it('will disable implicit translations if you opt-out with I18n.optOut()',
    () => {

    I18n.optOut();
    var Hi = React.createClass({ render: () => <span>Hi!</span> });

    I18n.locale = {
      'Hi!': 'This is a secret message, for your eyes only!'
    };

    const component = createComponent(<Hi />);

    expect(component.text).toBe('Hi!');
  });
});
