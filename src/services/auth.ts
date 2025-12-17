
export const clerkConfig = {
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY || 'pk_test_YOUR_KEY_HERE',
};

export const oauthCallbacks = {
    github: 'cyberrisk://oauth-callback/github',
    google: 'cyberrisk://oauth-callback/google',
};

export const authConfig = {
    providers: ['github', 'google', 'email'],

    redirectAfterSignIn: '/dashboard',
    redirectAfterSignUp: '/dashboard',

    sessionTimeout: 3600, // 1 hora

    autoRefreshToken: true,
};

export default clerkConfig;
