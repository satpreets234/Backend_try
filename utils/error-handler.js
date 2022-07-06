const errorHandler=(err,req,res,next)=>{
    const statusCode=err.statusCode||500;
    res.status(statusCode).json({
        success:0,
        err:err.message,
        stack:err.stack
    })
}

module.exports=errorHandler;