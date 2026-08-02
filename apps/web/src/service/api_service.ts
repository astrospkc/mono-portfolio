const BACKEND_DEV_URL = import.meta.env.VITE_BACKEND_URL
const BACKEND_PROD_URL = import.meta.env.VITE_BACKEND_PROD_URL

const getBaseUrl = () => {
    if (typeof window !== "undefined") {
        return window.location.hostname === "localhost" ? BACKEND_DEV_URL || "" : BACKEND_PROD_URL || ""
    }
    return BACKEND_PROD_URL || ""
}

const baseUrl = getBaseUrl()

console.log("base url: ", baseUrl)
export default baseUrl