'use strict';

var React = require("react");
/// Copyright (c) 2015 Patricio Zavolinsky
var I18n = function () {
  var I18n = React.createClass({
    displayName: 'I18n',

    noI18n: true,
    prop: function prop(name) {
      return this.props.i18n && this.props.i18n[name] || this.props[name] || I18n[name];
    },
    warn: function warn(s) {
      s = 'I18n: ' + s;
      var warn = this.prop('warn');
      if (warn) warn(s);
    },
    translateString: function translateString(s) {
      var locale = this.prop('locale');
      var key = (this.prop('prefix') || '') + s;
      var translation = typeof locale === 'function' ? locale(key) : locale && locale[key];
      if (translation) return translation;
      if (s && s.match(/[a-z]/i)) this.warn('missing translation for: ' + key);
      return s;
    },
    translateProps: function translateProps(comp, index) {
      var _this = this;

      var newProps = { key: index };
      var tx = function tx(name) {
        if (comp.props[name]) {
          newProps[name] = _this.translateString(comp.props[name]);
        }
      };
      if (typeof comp.type == 'string') {
        tx('title');
        tx('alt');
        tx('placeholder');
        if (comp.type == 'input' && (comp.props.type == 'button' || comp.props.type == 'submit')) tx('value');
      }

      var i18nProps = comp.type == I18n ? comp : newProps.i18n = {};
      var copyProp = function copyProp(name) {
        i18nProps[name] = comp.props[name] || _this.prop(name);
      };
      copyProp('warn');
      copyProp('locale');
      copyProp('prefix');
      return newProps;
    },
    translateChildren: function translateChildren(comp) {
      if (!comp.props || !comp.props.children) return null;
      if (comp.type == I18n && comp != this || comp.props['i18n-disabled'] !== undefined) return comp.props.children;

      // === Map : [elements] -> string ======================================= //
      var texts = [];
      var oldChildren = [];
      React.Children.forEach(comp.props.children, function (c, i) {
        if (c.props) {
          texts.push('{' + oldChildren.length + '}');
          oldChildren.push(c);
        } else {
          texts.push(c);
        }
      });

      // === Translate ======================================================== //
      var text = texts.join('');
      var translation = texts.length == oldChildren.length ? text : this.translateString(text);

      // === Map : string -> [elements] ======================================= //
      var newChildren = [];
      function addChild(c) {
        if (c) newChildren.push(c);
      }

      var pos = 0;
      var re = new RegExp(/\{(\d+)\}/g);
      var r;
      var matches = 0;
      while (r = re.exec(translation)) {
        ++matches;
        addChild(translation.substring(pos, r.index));
        var index = parseInt(r[1]);
        var child = oldChildren[index];
        var newChild = React.cloneElement(child, this.translateProps(child, index), this.translateChildren(child));
        addChild(newChild);
        pos = re.lastIndex;
      }

      addChild(translation.substring(pos));

      if (matches != oldChildren.length) {
        this.warn("incorrect number of arguments in translation for " + "'" + text + "' -> '" + translation + "'");
      }

      return newChildren.length == 1 ? newChildren[0] : newChildren;
    },
    render: function render() {
      return React.createElement(
        'span',
        null,
        this.translateChildren(this)
      );
    }
  });

  I18n.warn = function (s) {
    console.warn(s);
  };

  // Wrap every component with an <I18n> unless the component opts-out with
  // React.createClass({ noI18n: true, ... }).
  var filter = Array.prototype.filter || function (fn) {
    var r = [];
    for (var i in this) {
      var e = this[i];
      if (fn(e)) r.push(e);
    }
    return r;
  };
  function disabledByMixin(c) {
    if (!c.mixins) return;
    return filter.call(c.mixins, function (m) {
      return m.noI18n;
    });
  }

  I18n.wrap = function (render) {
    return function (props) {
      return React.createElement(
        I18n,
        props,
        render(props)
      );
    };
  };

  I18n.optIn = function () {
    if (I18n.originalCreateClass) return;
    I18n.originalCreateClass = React.createClass;
    React.createClass = function (c) {
      if (c.noI18n || disabledByMixin(c)) return I18n.originalCreateClass(c);
      c.renderWithoutI18n = c.render;
      c.render = function () {
        return React.createElement(
          I18n,
          this.props,
          this.renderWithoutI18n()
        );
      };
      return I18n.originalCreateClass(c);
    };
  };
  I18n.optOut = function () {
    React.createClass = I18n.originalCreateClass || React.createClass;
    delete I18n.originalCreateClass;
  };

  I18n.optIn();

  return I18n;
}();

module.exports = I18n;