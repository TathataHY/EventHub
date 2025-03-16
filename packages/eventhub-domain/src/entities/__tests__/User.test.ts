import { User } from '../User';
import { Role } from '../../value-objects/Role';
import { UserCreateException } from '../../exceptions/UserCreateException';
import { UserUpdateException } from '../../exceptions/UserUpdateException';

describe('User Entity', () => {
  describe('Creation', () => {
    it('should create a valid user', () => {
      const user = new User({
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: Role.USER
      });

      expect(user.id).toBe('1');
      expect(user.name).toBe('John Doe');
      expect(user.email).toBe('john@example.com');
      expect(user.password).toBe('password123');
      expect(user.role).toBe(Role.USER);
      expect(user.isActive).toBe(true);
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toBeInstanceOf(Date);
    });

    it('should create a user with a random UUID if id is not provided', () => {
      const user = new User({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      });

      expect(user.id).toBeDefined();
      expect(user.id.length).toBeGreaterThan(0);
    });

    it('should assign USER role by default', () => {
      const user = new User({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      });

      expect(user.role).toBe(Role.USER);
    });

    it('should throw an error if name is not provided', () => {
      expect(() => {
        new User({
          name: '',
          email: 'john@example.com',
          password: 'password123'
        });
      }).toThrow(UserCreateException);
      
      expect(() => {
        new User({
          name: '   ',
          email: 'john@example.com',
          password: 'password123'
        });
      }).toThrow(UserCreateException);
    });

    it('should throw an error if email is not provided', () => {
      expect(() => {
        new User({
          name: 'John Doe',
          email: '',
          password: 'password123'
        });
      }).toThrow(UserCreateException);
    });

    it('should throw an error if email format is invalid', () => {
      expect(() => {
        new User({
          name: 'John Doe',
          email: 'invalid-email',
          password: 'password123'
        });
      }).toThrow(UserCreateException);
    });

    it('should throw an error if password is not provided', () => {
      expect(() => {
        new User({
          name: 'John Doe',
          email: 'john@example.com',
          password: ''
        });
      }).toThrow(UserCreateException);
    });

    it('should throw an error if password is too short', () => {
      expect(() => {
        new User({
          name: 'John Doe',
          email: 'john@example.com',
          password: '123'
        });
      }).toThrow(UserCreateException);
    });

    it('should throw an error if name is too long', () => {
      const longName = 'a'.repeat(51);
      expect(() => {
        new User({
          name: longName,
          email: 'john@example.com',
          password: 'password123'
        });
      }).toThrow(UserCreateException);
    });
  });

  describe('Update', () => {
    let user: User;

    beforeEach(() => {
      user = new User({
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: Role.USER
      });
    });

    it('should update user properties', () => {
      user.update({
        name: 'Jane Doe',
        email: 'jane@example.com',
        role: Role.ADMIN
      });

      expect(user.name).toBe('Jane Doe');
      expect(user.email).toBe('jane@example.com');
      expect(user.role).toBe(Role.ADMIN);
    });

    it('should only update provided properties', () => {
      user.update({
        name: 'Jane Doe'
      });

      expect(user.name).toBe('Jane Doe');
      expect(user.email).toBe('john@example.com');
      expect(user.role).toBe(Role.USER);
    });

    it('should throw an error if updated name is invalid', () => {
      expect(() => {
        user.update({
          name: ''
        });
      }).toThrow(UserUpdateException);
    });

    it('should throw an error if updated email is invalid', () => {
      expect(() => {
        user.update({
          email: 'invalid-email'
        });
      }).toThrow(UserUpdateException);
    });

    it('should throw an error when updating an inactive user', () => {
      user.deactivate();
      
      expect(() => {
        user.update({
          name: 'Jane Doe'
        });
      }).toThrow(UserUpdateException);
    });
  });

  describe('Activation and Deactivation', () => {
    let user: User;

    beforeEach(() => {
      user = new User({
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      });
    });

    it('should deactivate an active user', () => {
      expect(user.isActive).toBe(true);
      
      user.deactivate();
      
      expect(user.isActive).toBe(false);
    });

    it('should not change state when deactivating an already inactive user', () => {
      user.deactivate();
      expect(user.isActive).toBe(false);
      
      user.deactivate();
      expect(user.isActive).toBe(false);
    });

    it('should activate an inactive user', () => {
      user.deactivate();
      expect(user.isActive).toBe(false);
      
      user.activate();
      
      expect(user.isActive).toBe(true);
    });

    it('should not change state when activating an already active user', () => {
      expect(user.isActive).toBe(true);
      
      user.activate();
      expect(user.isActive).toBe(true);
    });
  });

  describe('Password Management', () => {
    let user: User;

    beforeEach(() => {
      user = new User({
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      });
    });

    it('should change password successfully', () => {
      const newPassword = 'newPassword123';
      
      user.changePassword(newPassword);
      
      expect(user.password).toBe(newPassword);
    });

    it('should throw an error when changing password for inactive user', () => {
      user.deactivate();
      
      expect(() => {
        user.changePassword('newPassword123');
      }).toThrow(UserUpdateException);
    });

    it('should throw an error if new password is too short', () => {
      expect(() => {
        user.changePassword('123');
      }).toThrow(UserUpdateException);
    });

    it('should throw an error if new password is empty', () => {
      expect(() => {
        user.changePassword('');
      }).toThrow(UserUpdateException);
    });
  });

  describe('Role Management', () => {
    it('should correctly identify user roles', () => {
      const adminUser = new User({
        name: 'Admin',
        email: 'admin@example.com',
        password: 'password123',
        role: Role.ADMIN
      });
      
      expect(adminUser.hasRole(Role.ADMIN)).toBe(true);
      expect(adminUser.hasRole(Role.USER)).toBe(false);
      expect(adminUser.isAdmin()).toBe(true);
      
      const regularUser = new User({
        name: 'User',
        email: 'user@example.com',
        password: 'password123',
        role: Role.USER
      });
      
      expect(regularUser.hasRole(Role.USER)).toBe(true);
      expect(regularUser.hasRole(Role.ADMIN)).toBe(false);
      expect(regularUser.isAdmin()).toBe(false);
    });
  });
}); 