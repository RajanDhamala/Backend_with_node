class ApiResponse{
    constructor (statusCode , message, data, success="true"){
        this.statusCode=statusCode;
        this.message=message;
        this.data=data;
        this.success=statusCode <400;
    }

}

export default {ApiResponse}