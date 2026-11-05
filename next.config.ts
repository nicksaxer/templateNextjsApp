import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    outputFileTracingIncludes: {'/*': ['./src/backend/07_mailtemplates/**/*.html']}
};

export default nextConfig;
