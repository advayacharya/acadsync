const User = require('../models/User');

describe('User Model Unit Tests', () => {
  test('User model sets name and email correctly', () => {
    const user = new User({
      name: 'Test Student',
      email: 'student@example.com',
      password: 'password123'
    });
    expect(user.name).toBe('Test Student');
    expect(user.email).toBe('student@example.com');
  });
});
