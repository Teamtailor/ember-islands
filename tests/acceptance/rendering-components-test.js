import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';

var application;

module('Acceptance: Rendering Components', {
  beforeEach: function() {
    // Put some static content on the page before the Ember application loads.
    // This mimics server-rendered content.
    document.getElementById('ember-testing').innerHTML = `
      <p>server-rendered content top</p>
      <div data-component='top-level-component' data-attrs='{"title": "Component Title"}'></div>
      <p>server-rendered content bottom</p>
    `;

    application = startApp();
    application.boot();
    Ember.run(application, 'advanceReadiness');
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
    document.getElementById('ember-testing').innerHTML = '';
  }
});

test('rendering a component with an attribute', function(assert) {
  assert.expect(2);

  assert.equal(find('p:contains(top level component)').length, 1, "The top level component was rendered");
  assert.equal(find('#component-title:contains(Component Title)').length, 1, "Passed in attributes can be used");
});

test('using component events', function(assert) {
  assert.expect(2);

  assert.equal(find("#expanded-content").length, 0, "Expanded content is hidden at first");

  click('#toggle-expanded').then(function() {
    assert.equal(find("#expanded-content").length, 1, "The expanded content is showing");
  });
});

test('using nested components', function(assert) {
  assert.expect(3);

  assert.equal(find('p:contains(A nested component)').length, 1, "The nested component was rendered");
  assert.equal(find("#expanded-content").length, 0, "Expanded content is hidden at first");

  click('#nested-component-toggle-expanded').then(function() {
    assert.equal(find("#expanded-content").length, 1, "The expanded content is showing");
  });
});

test('not rendering the application template', function(assert) {
  assert.equal(find("#application-template").length, 0, "Application template was not rendered");
});
