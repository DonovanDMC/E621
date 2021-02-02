"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.E621 = exports.APIError = void 0;
const https = __importStar(require("https"));
const package_json_1 = __importDefault(require("../package.json"));
class APIError extends Error {
    constructor(code, message, method, endpoint) {
        super(`Unexpected ${code} ${message} on ${method} ${endpoint}`);
        this.name = "APIError";
        this.code = code;
        this.errmessage = message;
        this.method = method;
        this.endpoint = endpoint;
        switch (code) {
            case 400:
                this.name = "APIError[BadRequest]";
                break;
            case 401:
                this.name = "APIError[Unauthorized]";
                break;
            case 403:
                this.name = "APIError[Forbidden]";
                break;
            case 404:
                this.name = "APIError[NotFound]";
                break;
            case 429:
                this.name = "APIError[RateLimited]";
                break;
        }
    }
}
exports.APIError = APIError;
class E621 {
    constructor(apiKey, blacklist, userAgent, fixNullURLs) {
        this.apiKey = apiKey || null;
        this.blacklist = blacklist || [];
        this.userAgent = userAgent || `E621/${package_json_1.default.version} (https://github.com/FurryBotCo/E621)`;
        this.fixNullURLs = fixNullURLs !== null && fixNullURLs !== void 0 ? fixNullURLs : true;
    }
    async getPosts(tags, limit, page) {
        if (tags && tags.length > 40)
            throw new TypeError("You may only supply up to 40 tags.");
        if (limit && limit > 320)
            throw new TypeError("You may only request up to 320 posts at a time.");
        return new Promise((a, b) => https
            .request({
            method: "GET",
            host: "e621.net",
            path: `/posts.json?${tags ? `tags=${encodeURIComponent(tags.join(" "))}&` : ""}${limit ? `limit=${limit}&` : ""}${page ? `page=${page}&` : ""}`,
            headers: Object.assign({ "User-Agent": this.userAgent }, (this.apiKey ? {
                "Authorization": this.apiKey
            } : {}))
        }, (res) => {
            const data = [];
            res
                .on("data", (d) => data.push(d))
                .on("error", b)
                .on("end", () => {
                if (res.statusCode === undefined)
                    throw new Error("recieved undefined statusCode");
                if (res.statusCode !== 200) {
                    throw new APIError(res.statusCode, res.statusMessage, "GET", "/posts.json");
                }
                else {
                    if (this.fixNullURLs)
                        return a(this.filterPosts(JSON.parse(Buffer.concat(data).toString()).posts).map(this.fixURL.bind(this)));
                    else
                        return a(this.filterPosts(JSON.parse(Buffer.concat(data).toString()).posts));
                }
            });
        })
            .end());
    }
    async getPostById(id) {
        if (isNaN(id) || id < 1 || !id)
            throw new TypeError("Invalid id provided.");
        return new Promise((a, b) => https
            .request({
            method: "GET",
            host: "e621.net",
            path: `/posts/${id}.json`,
            headers: Object.assign({ "User-Agent": this.userAgent }, (this.apiKey ? {
                "Authorization": this.apiKey
            } : {}))
        }, (res) => {
            const data = [];
            res
                .on("data", (d) => data.push(d))
                .on("error", b)
                .on("end", () => {
                if (res.statusCode === undefined)
                    throw new Error("recieved undefined statusCode");
                if (res.statusCode !== 200) {
                    throw new APIError(res.statusCode, res.statusMessage, "GET", "/posts.json");
                }
                else {
                    if (this.fixNullURLs)
                        return a(this.fixURL(JSON.parse(Buffer.concat(data).toString()).post));
                    else
                        return a(JSON.parse(Buffer.concat(data).toString()).post);
                }
            });
        })
            .end());
    }
    async getPostByMD5(md5) {
        // md5 hashes are always 32 characters
        if (!md5 || md5.length !== 32)
            throw new TypeError("Invalid md5 provided.");
        return new Promise((a, b) => https
            .request({
            method: "GET",
            host: "e621.net",
            path: `/posts.json?md5=${md5}`,
            headers: Object.assign({ "User-Agent": this.userAgent }, (this.apiKey ? {
                "Authorization": this.apiKey
            } : {}))
        }, (res) => {
            const data = [];
            res
                .on("data", (d) => data.push(d))
                .on("error", b)
                .on("end", () => {
                if (res.statusCode === undefined)
                    throw new Error("recieved undefined statusCode");
                if (res.statusCode !== 200) {
                    throw new APIError(res.statusCode, res.statusMessage, "GET", "/posts.json");
                }
                else {
                    if (this.fixNullURLs)
                        return a(this.fixURL(JSON.parse(Buffer.concat(data).toString()).post));
                    else
                        return a(JSON.parse(Buffer.concat(data).toString()).post);
                }
            });
        })
            .end());
    }
    filterPosts(p) {
        return p.filter(v => !this.blacklist.some(bl => Object.values(v.tags).reduce((a, b) => a.concat(b), []).includes(bl)));
    }
    /**
     * Convert null urls on a post into proper urls.
     * @param {NullableURLPost} p - The post to fix
     * @returns {Post}
     */
    fixURL(p) {
        if (p.file.url === null)
            p.file.url = this.constructURLFromMD5(p.file.md5, p.file.ext, false);
        if (p.preview.url === null)
            p.preview.url = this.constructURLFromMD5(p.file.md5, p.file.ext, true);
        if (p.sample.url === null)
            p.sample.url = this.constructURLFromMD5(p.file.md5, p.file.ext, false);
        return p;
    }
    /**
     * Construct a url from its md5 counterpart
     * @param {string} md5 - the md5
     * @param {string} [ext="png"] - The extension, assumed png if not provided
     * @param {boolean} [preview=false]
     */
    constructURLFromMD5(md5, ext = "png", preview = false) {
        return `https://static1.e621.net/data${preview ? "/preview" : ""}/${md5.slice(0, 2)}/${md5.slice(2, 4)}/${md5}.${ext}`;
    }
}
exports.E621 = E621;
exports.default = E621;
module.exports = E621;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDZDQUErQjtBQUMvQixtRUFBa0M7QUFFbEMsTUFBYSxRQUFTLFNBQVEsS0FBSztJQUtsQyxZQUFZLElBQVksRUFBRSxPQUFlLEVBQUUsTUFBYyxFQUFFLFFBQWdCO1FBQzFFLEtBQUssQ0FBQyxjQUFjLElBQUksSUFBSSxPQUFPLE9BQU8sTUFBTSxJQUFJLFFBQVEsRUFBRSxDQUFDLENBQUM7UUFDaEUsSUFBSSxDQUFDLElBQUksR0FBRyxVQUFVLENBQUM7UUFDdkIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLFVBQVUsR0FBRyxPQUFPLENBQUM7UUFDMUIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFDekIsUUFBUSxJQUFJLEVBQUU7WUFDYixLQUFLLEdBQUc7Z0JBQUUsSUFBSSxDQUFDLElBQUksR0FBRyxzQkFBc0IsQ0FBQztnQkFBQyxNQUFNO1lBQ3BELEtBQUssR0FBRztnQkFBRSxJQUFJLENBQUMsSUFBSSxHQUFHLHdCQUF3QixDQUFDO2dCQUFDLE1BQU07WUFDdEQsS0FBSyxHQUFHO2dCQUFFLElBQUksQ0FBQyxJQUFJLEdBQUcscUJBQXFCLENBQUM7Z0JBQUMsTUFBTTtZQUNuRCxLQUFLLEdBQUc7Z0JBQUUsSUFBSSxDQUFDLElBQUksR0FBRyxvQkFBb0IsQ0FBQztnQkFBQyxNQUFNO1lBQ2xELEtBQUssR0FBRztnQkFBRSxJQUFJLENBQUMsSUFBSSxHQUFHLHVCQUF1QixDQUFDO2dCQUFDLE1BQU07U0FDckQ7SUFDRixDQUFDO0NBQ0Q7QUFwQkQsNEJBb0JDO0FBeUdELE1BQU0sSUFBSTtJQUtULFlBQVksTUFBZSxFQUFFLFNBQW9CLEVB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