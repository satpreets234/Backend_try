const express=require('express');
const app=express();
const errorHandler=require('./utils/error-handler');
const indexRouter=require('./routers/index-router');
app.use('/',indexRouter);

app.use(express.json());

app.all('*',(req,res,next)=>{
    const err=new Error('Invalid Url');
    err.statusCode=404;
    next(err);
})

app.use(errorHandler);
app.listen(9870,()=>{
    console.log('app is listening at port 9870');
})