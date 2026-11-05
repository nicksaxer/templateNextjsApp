import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    outputFileTracingIncludes: {'/*': ['./src/backend/07_mailtemplates/**/*.html']},
    allowedDevOrigins: ['3000--main--seppos--nicksaxer.dev.guildmarket.net'],
};

export default nextConfig;
