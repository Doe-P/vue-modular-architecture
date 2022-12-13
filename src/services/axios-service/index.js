import axios from "axios";

/**
 * clean token
 */
const headerCharRegex = /[^\t\x20-\x7e\x80-\xff]/;

function checkInvalidHeaderChar(val) {
    return headerCharRegex.test(val);
}

/**
 *
 Same logic as checkInvalidHeaderChar, which removes all invalid chars
 */
function cleanHeaderValue(val) {
    const nVal = String(val);
    return nVal.replace(new RegExp(headerCharRegex, "g"), "");
}

function getToken(tn) {
    if (checkInvalidHeaderChar(tn)) {
        return cleanHeaderValue(tn);
    }
    return tn;
}

const apiUrl = import.meta.env.VITE_APP_BASE_API_URL;
const config = {
    addHeader(k, v) {
        this.headers[k] = v;
        return this.getHeaders();
    },
    getHeaders() {
        return {headers: this.headers};
    },
    addTokenHeader(token, isMultipart = false) {
        if (isMultipart) {
            this.addHeader("Content-Type", "multipart/form-data");
        } else {
            this.addHeader("Content-Type", "application/json");
        }
        this.addHeader("Authorization", `Bearer ${getToken(token)}`);
        return this.getHeaders();
    },

    headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
        "Content-Language": "la",
    }
};
export {
    apiUrl,
    axios,
    config,
};