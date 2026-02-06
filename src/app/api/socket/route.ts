
import { NextRequest } from 'next/server'
import { Server as SocketIOServer } from 'socket.io'
import { NextApiResponse } from 'next'

/**
 * Route: GET /api/socket
 * Initialize Socket.io server.
 */
export async function GET(req: NextRequest & { socket: any }, res: NextApiResponse & { socket: any }) {
    if (res.socket.server.io) {
        // Socket is already running
        return new Response('Socket is already running', { status: 200 })
    }

    const io = new SocketIOServer(res.socket.server, {
        path: '/api/socket',
        addTrailingSlash: false,
    })

    res.socket.server.io = io

    io.on('connection', (socket) => {
        socket.on('join-room', (room) => {
            socket.join(room)
        })
    })

    return new Response('Socket is initializing', { status: 200 })
}
