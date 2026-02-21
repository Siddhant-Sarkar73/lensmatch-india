module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js', '**/*.test.js'],
  testTimeout: 30000,
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['services/**/*.js', 'routes/**/*.js', '!**/node_modules/**']
};
