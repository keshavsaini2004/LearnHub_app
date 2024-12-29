const jwt = require('jsonwebtoken');

class AuthService {
  constructor() {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not set in environment variables');
    }
    this.secret = process.env.JWT_SECRET;
  }

  async getUserIdFromToken(authorizationHeader) {
    if (!authorizationHeader) {
      throw new Error('Token Not Found');
    }
  
    const parts = authorizationHeader.split(' ');
    if (parts.length !== 2) {
      throw new Error('Unauthorized: Token format is invalid');
    }
  
    const token = parts[1];
    if (!token) {
      throw new Error('Unauthorized: Token is missing');
    }
  
    try {
      const decoded = jwt.verify(token, this.secret);
      console.log("Decoded Token Payload:", decoded);
  
      if (!decoded.user_id) {
        throw new Error('Invalid Token: user_id missing');
      }
  
      return decoded.user_id;
    } catch (error) {
      throw new Error(`Unauthorized: Invalid token - ${error.message}`);
    }
  }
}

module.exports = new AuthService();
