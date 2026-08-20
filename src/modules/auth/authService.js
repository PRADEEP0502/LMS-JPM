import { MOCK_USERS } from '../../data/mockUsers';

/**
 * Modular Authentication Service Interface
 * Designed for easy plug-and-play replacement with real API/backend endpoints.
 */
class AuthService {
  /**
   * Authenticate user credentials
   * @param {string} userId 
   * @param {string} password 
   * @returns {Promise<Object>} User session object
   */
  async login(userId, password) {
    // Simulate slight network latency for realistic UX feel
    await new Promise((resolve) => setTimeout(resolve, 300));

    const cleanUserId = userId ? userId.trim().toLowerCase() : '';
    
    const user = MOCK_USERS.find(
      (u) => u.userId.toLowerCase() === cleanUserId && u.password === password
    );

    if (!user) {
      throw new Error('Invalid User ID or Password. Please check your credentials and try again.');
    }

    // Exclude password from returned session user object
    const { password: _, ...userSession } = user;
    return userSession;
  }

  /**
   * Simulate Password Reset request
   * @param {string} userId 
   */
  async requestPasswordReset(userId) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const user = MOCK_USERS.find((u) => u.userId.toLowerCase() === userId.trim().toLowerCase());
    if (!user) {
      throw new Error('No user account found matching the provided User ID.');
    }
    return { success: true, message: `Password reset link has been dispatched to ${user.email}.` };
  }
}

export const authService = new AuthService();
