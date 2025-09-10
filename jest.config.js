module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@api/(.*)$': '<rootDir>/app/api/$1',
    // add other aliases if needed
  },
  testMatch: ['**/__tests__/**/*.test.(ts|js)'],
};
