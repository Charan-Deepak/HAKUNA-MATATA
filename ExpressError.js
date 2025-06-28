class ExpressError extends Error{
    constructor(status = 400, message = "Some error has occurred"){
        super();
        this.status=status;
        this.message=message;
    }
}

module.exports=ExpressError;