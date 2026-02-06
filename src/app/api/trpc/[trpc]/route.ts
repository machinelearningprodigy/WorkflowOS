
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { appRouter } from '@/server/api/root'
import { createContext } from '@/server/api/context'

/**
 * Route: GET/POST /api/trpc/[trpc]
 * tRPC API handler.
 */
const handler = (req: Request) =>
    fetchRequestHandler({
        endpoint: '/api/trpc',
        req,
        router: appRouter,
        createContext: () => createContext({ req: req as any, resHeaders: new Headers() }),
        onError:
            process.env.NODE_ENV === 'development'
                ? ({ path, error }) => {
                    console.error(
                        `❌ tRPC failed on ${path ?? '<no-path>'}: ${error.message}`
                    )
                }
                : undefined,
    })

export { handler as GET, handler as POST }
