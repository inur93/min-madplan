import Router from 'next/router'
import nextCookie from 'next-cookies'

export const auth = ctx => {
    const { jwt: token } = nextCookie(ctx)

    if (ctx.req && !token) {
        ctx.res.writeHead(302, { Location: '/login' })
        ctx.res.end()
        return
    }

    if (!token) {
        Router.push('/login')
    }

    return token
}