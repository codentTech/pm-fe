'use client';

import ROLES from '../constants/role.constant';

/**
 * Retrive access token from local storage
 * @returns string | undefined
 */

export const getUser = () => {
  if (typeof window === 'object' && window?.localStorage?.getItem('user')) {
    return JSON.parse(localStorage.getItem('user'));
  }
  return undefined;
};

/**
 * Get the actual user object for display (handles { user, token } structure from login)
 * @returns {{ FullName?, fullName?, Email?, email?, Id? } | undefined}
 */
export const getDisplayUser = () => {
  const stored = getUser();
  if (!stored) return undefined;
  const actualUser = stored.user ?? stored;
  return actualUser;
};

/**
 * Remove the user from local storage
 */
export const removeUser = () => {
  if (typeof window === 'object' && window.localStorage) {
    localStorage.removeItem('user');
    localStorage.removeItem('isOtpVerify');
    localStorage.removeItem('userId');
    localStorage.removeItem('phone');
    localStorage.removeItem('userProfile');
  }
};

/**
 * Retrive isPhoneVerified from local storage
 * @returns bool
 */

export const isPhoneVerified = (data) => {
  if ((typeof window === 'object' && window?.localStorage?.getItem('user')) || data) {
    const user = data ?? getUser();
    return user.isPhoneVerified;
  }
  return false;
};

/**
 * Retrive isEmailVerified from local storage
 * @returns bool
 */

export const isEmailVerified = (data) => {
  if ((typeof window === 'object' && window?.localStorage?.getItem('user')) || data) {
    const user = data ?? getUser();
    return user.isEmailVerified;
  }
  return false;
};

export const isProfileCreated = (data) => {
  if ((typeof window === 'object' && window?.localStorage?.getItem('user')) || data) {
    const user = data ?? getUser();
    return user.currentBusinessId;
  }
  return false;
};

export const is2FAEnabled = (data) => {
  if ((typeof window === 'object' && window?.localStorage?.getItem('user')) || data) {
    const user = data ?? getUser();
    return user.isTwoFactorAuth;
  }
  return false;
};

export const isSuperAdmin = (data) => {
  if ((typeof window === 'object' && window?.localStorage?.getItem('user')) || data) {
    const user = data ?? getUser();
    return user.role === ROLES.SUPER_ADMIN.toString();
  }
  return false;
};

export const getEmailForURL = (email) => {
  // comment condition for production
  if (email?.includes('+')) return email.replace('+', '%2B');
  return email;
};
