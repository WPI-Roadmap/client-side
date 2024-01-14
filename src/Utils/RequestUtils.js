class RequestUtils {

    static getDomain() {
       //return "https://mams-siso.wpi.edu/api";
       return "http://localhost:8000";
    }

    /**
     * Make a GET request to the specified URL
     * @param {String} url
     * @returns 
     */
    static get(url, token) {
        let response = null;
         response = fetch(this.getDomain() + url, {
            method: "get",
            headers: {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"}
        }).catch((e) => {
            return e;
        });
    return response;
    }

    /**
     * Make a POST request to the specified URL with given JSON body
     * @param {String} url 
     * @param {JSONObject} object 
     * @returns 
     */
    static post(url, object) {

        return fetch(this.getDomain() + url, {
            method: "post",
            headers: {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"}, 
            body: JSON.stringify(object)
        });
    }
}

export default RequestUtils;