module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: ['server.js'],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
};
