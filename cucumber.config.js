const { defineConfig } = require('@badeball/cypress-cucumber-preprocessor');

module.exports = defineConfig({
  stepDefinitions: 'cypress/integration/step_definitions/**/*.js',
  
});


