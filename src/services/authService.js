import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config/env.js';
import store from '../models/index.js';
import { writeCSV } from '../utils/csvLoader.js';

export const authService = {
  /**
   * Validate credentials and return JWT pair.
   */
  async login(username, password) {
    const user = store.users.find(
      u => u.username === username && String(u.isActive) === 'true'
    );
    if (!user) return null;

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return null;

    // Update lastLogin in store
    user.lastLogin = new Date().toISOString();
    writeCSV('users.csv', store.users);

    const payload = {
      userId: user.userId,
      username: user.username,
      role: user.role,
      provinceId: user.provinceId || null,
      districtId: user.districtId || null,
      stationId: user.stationId || null,
      linkedTukTukId: user.linkedTukTukId || null,
    };

    const accessToken = jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });
    const refreshToken = jwt.sign(
      { userId: user.userId },
      config.jwt.secret,
      { expiresIn: config.jwt.refreshExpiresIn }
    );

    return { accessToken, refreshToken, user: payload };
  },

  /**
   * Refresh access token using a valid refresh token.
   */
  refreshToken(token) {
    const decoded = jwt.verify(token, config.jwt.secret);
    const user = store.users.find(u => u.userId === decoded.userId);
    if (!user || String(user.isActive) !== 'true') return null;

    const payload = {
      userId: user.userId,
      username: user.username,
      role: user.role,
      provinceId: user.provinceId || null,
      districtId: user.districtId || null,
      stationId: user.stationId || null,
      linkedTukTukId: user.linkedTukTukId || null,
    };
    return jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
  },

  /**
   * Create a new user (HQ admin only).
   */
  async createUser(data) {
    const existing = store.users.find(u => u.username === data.username);
    if (existing) throw new Error('Username already exists');

    const passwordHash = await bcrypt.hash(data.password, 12);
    const newUser = {
      id: String(store.users.length + 1),
      userId: uuidv4(),
      username: data.username,
      passwordHash,
      role: data.role,
      provinceId: data.provinceId || '',
      districtId: data.districtId || '',
      stationId: data.stationId || '',
      linkedTukTukId: data.linkedTukTukId || '',
      isActive: true,
      lastLogin: '',
      createdAt: new Date().toISOString(),
    };
    store.users.push(newUser);
    writeCSV('users.csv', store.users);

    const { passwordHash: _, ...safe } = newUser;
    return safe;
  },
};
