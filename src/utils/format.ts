import { format as dfFormat, formatDistanceToNow } from "date-fns"

export const format = {
    date: (date: Date | string | number) => {
        const d = new Date(date)
        return dfFormat(d, "MMM dd, yyyy")
    },
    dateTime: (date: Date | string | number) => {
        const d = new Date(date)
        return dfFormat(d, "MMM dd, yyyy HH:mm")
    },
    relative: (date: Date | string | number) => {
        const d = new Date(date)
        return formatDistanceToNow(d, { addSuffix: true })
    },
    currency: (amount: number, currency: string = "USD") => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency,
        }).format(amount)
    },
    number: (num: number) => {
        return new Intl.NumberFormat("en-US").format(num)
    },
    duration: (ms: number) => {
        if (ms < 1000) return `${ms}ms`
        if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`
        return `${(ms / 60000).toFixed(1)}m`
    }
}
