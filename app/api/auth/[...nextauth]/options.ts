import type { NextAuthOptions } from 'next-auth';
// eslint-disable-next-line import/no-extraneous-dependencies
import CredentialsProvider from 'next-auth/providers/credentials';

export const options: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: 'credentials',
            name: 'Credentials',
            credentials: {
                email: {
                    label: 'Email:',
                    type: 'text',
                    placeholder: 'Email',
                },
                password: {
                    label: 'Password:',
                    type: 'password',
                    placeholder: 'Password',
                },
            },
            async authorize(credentials) {
                const { email, password } = credentials || {};
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include',
                        body: JSON.stringify({ email, password }),
                    }
                );
                const data = await response.json();

                if (data.status === 'success') {
                    return {
                        id: data.data.id,
                        name: data.data.name,
                        email: data.data.email,
                        role: data.data.role,
                        schoolId: data.data.schoolId,
                        accessToken: data.data.accessToken,
                    };
                }
                return null;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user, trigger, session }: any) {
            if (trigger === 'update') {
                if (session.user) {
                    token.user = { ...session.user };
                }
                return {
                    ...token,
                    ...session.user,
                };
            }
            if (user) {
                token.user = { ...user };
            }
            return token;
        },
        async session({ session, token }: any) {
            session.user = token;
            return { ...session, ...token };
        },
    },
    session: {
        maxAge: 1 * 60 * 60,
    },
    secret: process.env.NEXTAUTH_SECRET as string,
};
