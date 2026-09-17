'use client';

// Google Icon (Official multi-color)
export const GoogleIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

// Facebook Icon
export const FacebookIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
      fill="#1877F2"
    />
    <path
      d="M16.671 15.543l.532-3.47h-3.328v-2.25c0-.949.465-1.874 1.956-1.874h1.514V4.996s-1.374-.235-2.686-.235c-2.741 0-4.533 1.662-4.533 4.669v2.643H7.078v3.47h3.047v8.385a12.09 12.09 0 0 0 3.75 0v-8.385h2.796z"
      fill="#fff"
    />
  </svg>
);

// Apple Icon
export const AppleIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M17.05 12.536c-.03-2.918 2.385-4.318 2.494-4.386-1.358-1.987-3.475-2.26-4.228-2.29-1.803-.182-3.518 1.06-4.433 1.06-.914 0-2.32-1.034-3.816-1.006-1.96.029-3.77 1.14-4.779 2.895-2.037 3.535-.52 8.77 1.462 11.638.97 1.402 2.123 2.973 3.636 2.918 1.46-.06 2.012-.944 3.778-.944 1.766 0 2.26.944 3.81.916 1.575-.03 2.57-1.42 3.53-2.828 1.112-1.612 1.565-3.173 1.588-3.254-.034-.014-3.05-1.17-3.082-4.72zM14.129 3.983c.803-.972 1.342-2.322 1.192-3.67-1.157.047-2.556.77-3.386 1.744-.744.858-1.395 2.232-1.22 3.545 1.29.1 2.61-.66 3.414-1.62z"
      fill="#000"
    />
  </svg>
);

// Divider with text
export const SocialDivider = ({ text = 'OR' }: { text?: string }) => (
  <div className="relative my-6">
    <div className="absolute inset-0 flex items-center">
      <div className="w-full border-t border-surface-container-high"></div>
    </div>
    <div className="relative flex justify-center">
      <span className="px-3 bg-white text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
        {text}
      </span>
    </div>
  </div>
);