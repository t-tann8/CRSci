/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname:
                    'crs-data-storage-bucket.s3.ap-southeast-2.amazonaws.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'crsbuck.s3.us-east-2.amazonaws.com',
                pathname: '/**',
            },
        ],
    },
    webpack: (config) => {
        config.resolve = {
            ...config.resolve,
            fallback: {
                fs: false,
                path: false,
                os: false,
            },
        };
        return config;
    },
    async rewrites() {
        return [
            {
                source: '/:path*',
                destination: '/:path*',
            },
        ];
    },
};

module.exports = nextConfig;
