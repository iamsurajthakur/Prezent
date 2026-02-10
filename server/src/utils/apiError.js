class ApiError extends Error{
    constructor(
        statusCode,
        message = 'Something went wrong',
        errors = [],
        stack = ''
    ){
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = this.success
        this.errors = errors

        if(stack){
            this.stack = stack
        }else{
            if(Error.captureStackTrace){
                Error.captureStackTrace(this, this.constructor)
            }
        }
    }
}

export default ApiError