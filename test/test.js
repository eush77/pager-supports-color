'use strict';

var pagerSupportsColor = require('..');

var test = require('tape'),
    Test = test.Test;


Test.prototype.assertColorSupport = function (status) {
  return function () {
    var message = ['(-) ', '(+) '][+status] + [].join.call(arguments, ' ');
    this[status](pagerSupportsColor.apply(null, arguments), message);
  };
};

Test.prototype.supportsColor = Test.prototype.assertColorSupport(true);
Test.prototype.doesntSupportColor = Test.prototype.assertColorSupport(false);


var withEnv = function (env, value, fn) {
  process.env[env] = value;
  fn();
  delete process.env[env];
};


test(function (t) {
  delete process.env.LESS;

  delete process.env.PAGER;
  t.doesntSupportColor();
  t.doesntSupportColor(['-R']);
  t.doesntSupportColor('gedit');
  t.doesntSupportColor('less');
  t.doesntSupportColor('less', ['-N']);
  t.supportsColor('less', ['-R']);

  withEnv('LESS', '-N', function () {
    t.doesntSupportColor('less');
  });

  withEnv('LESS', '-N -R', function () {
    t.doesntSupportColor();
    t.doesntSupportColor('gedit');
    t.supportsColor('less');
  });

  process.env.PAGER = 'gedit';
  t.doesntSupportColor();
  t.doesntSupportColor(['-R']);
  t.doesntSupportColor('less');
  t.supportsColor('less', ['-R']);

  process.env.PAGER = 'less';
  t.doesntSupportColor();
  t.doesntSupportColor('less');
  t.doesntSupportColor(['-N']);
  t.supportsColor(['-R']);
  t.supportsColor('less', ['-R']);

  withEnv('LESS', '-N', function () {
    t.doesntSupportColor();
    t.supportsColor(['-R']);
  });

  withEnv('LESS', '-N -R', function () {
    t.supportsColor();
  });

  t.end();
});
