// Security utilities for encryption, hashing, and validation
// CRITICAL: All sensitive data must be encrypted before storage

import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto';
import bcrypt from 'bcryptjs';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || '';
const ALGORITHM = 'aes-256-gcm';

if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 64) {
    console.warn('⚠️  ENCRYPTION_KEY not properly configured. Generate with: openssl rand -hex 32');
}

/**
 * Encrypt sensitive data (API keys, tokens, etc.)
 * Uses AES-256-GCM for authenticated encryption
 */
export function encrypt(text: string): string {
    try {
        const iv = randomBytes(16);
        const salt = randomBytes(16);
        const key = scryptSync(ENCRYPTION_KEY, salt, 32);

        const cipher = createCipheriv(ALGORITHM, key, iv);
        const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
        const authTag = cipher.getAuthTag();

        // Format: salt:iv:authTag:encrypted
        return `${salt.toString('hex')}:${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`;
    } catch (error) {
        console.error('Encryption error:', error);
        throw new Error('Failed to encrypt data');
    }
}

/**
 * Decrypt sensitive data
 */
export function decrypt(encryptedText: string): string {
    try {
        const [saltHex, ivHex, authTagHex, encryptedHex] = encryptedText.split(':');

        if (!saltHex || !ivHex || !authTagHex || !encryptedHex) {
            throw new Error('Invalid encrypted data format');
        }

        const salt = Buffer.from(saltHex, 'hex');
        const iv = Buffer.from(ivHex, 'hex');
        const authTag = Buffer.from(authTagHex, 'hex');
        const encrypted = Buffer.from(encryptedHex, 'hex');

        const key = scryptSync(ENCRYPTION_KEY, salt, 32);
        const decipher = createDecipheriv(ALGORITHM, key, iv);
        decipher.setAuthTag(authTag);

        const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
        return decrypted.toString('utf8');
    } catch (error) {
        console.error('Decryption error:', error);
        throw new Error('Failed to decrypt data');
    }
}

/**
 * Hash password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(12);
    return bcrypt.hash(password, salt);
}

/**
 * Verify password against hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

/**
 * Generate secure random token
 */
export function generateToken(length: number = 32): string {
    return randomBytes(length).toString('hex');
}

/**
 * Generate API key with prefix
 */
export function generateApiKey(prefix: string = 'wos'): string {
    const token = randomBytes(32).toString('hex');
    return `${prefix}_${token}`;
}

/**
 * Hash API key for storage
 */
export async function hashApiKey(apiKey: string): Promise<string> {
    return hashPassword(apiKey);
}

/**
 * Verify API key against hash
 */
export async function verifyApiKey(apiKey: string, hash: string): Promise<boolean> {
    return verifyPassword(apiKey, hash);
}

/**
 * Sanitize user input to prevent XSS
 */
export function sanitizeInput(input: string): string {
    return input
        .replace(/[<>]/g, '')
        .trim();
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

/**
 * Generate webhook secret
 */
export function generateWebhookSecret(): string {
    return `whsec_${randomBytes(32).toString('hex')}`;
}

/**
 * Verify webhook signature
 */
export function verifyWebhookSignature(
    payload: string,
    signature: string,
    secret: string
): boolean {
    const crypto = require('crypto');
    const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(payload)
        .digest('hex');

    return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
    );
}
