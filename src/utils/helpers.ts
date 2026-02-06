/**
 * General purpose helper functions.
 */

/**
 * Generate a random ID (useful for mock data)
 */
export const generateId = (prefix: string = "") => {
    const id = Math.random().toString(36).substring(2, 11)
    return prefix ? `${prefix}_${id}` : id
}

/**
 * Delay execution for a specified time
 */
export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Capitalize first letter of a string
 */
export const capitalize = (str: string) => {
    if (!str) return ""
    return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Truncate a string with ellipses
 */
export const truncate = (str: string, length: number) => {
    if (!str || str.length <= length) return str
    return str.substring(0, length) + "..."
}

/**
 * Get initials from a name
 */
export const getInitials = (name: string) => {
    if (!name) return "OS"
    const parts = name.split(" ")
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

/**
 * Safely parse JSON
 */
export const safeParse = <T>(json: string, fallback: T): T => {
    try {
        return JSON.parse(json) as T
    } catch {
        return fallback
    }
}
