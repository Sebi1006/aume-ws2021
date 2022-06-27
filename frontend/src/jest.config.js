module.exports = {
  roots: ['<rootDir>'],
  modulePaths: ['<rootDir>'],
  moduleDirectories: ['node_modules', 'src'],
  setupFiles: ['jest-canvas-mock', '<rootDir>/src/__tests__/testSetup/setEnv.js'],
  moduleNameMapper: { '\\.(css|less|sass|scss)$': 'identity-obj-proxy' },
  modulePathIgnorePatterns: ['testSetup'],
}
