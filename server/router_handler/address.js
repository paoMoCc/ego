const db = require("../db")

// 增加地址
exports.addAddress = (req, res) => {
    let addInfo = req.body
    const checksql = `select * from address where userId=? and name=? and phone=? and area=? and detailAdd=? and status=1`
    db.query(checksql, [req.auth.userId, addInfo.name, addInfo.phone, addInfo.area, addInfo.detailAdd], (checkErr, checkRes) => {
        if (checkErr) return res.cc(checkErr)
        if (checkRes.length > 0) {
            return res.cc("已存在该地址，请勿重复添加！", 501)
        }
        const sql = `insert into address set ?`
        addInfo.userId = req.auth.userId
        delete addInfo.address;
        db.query(sql, addInfo, (err, results) => {
            if (err) return res.cc(err)
            if (results.affectedRows !== 1) return res.cc("添加地址失败！", 502)
            res.cc("添加地址成功！", 200)
        })
    })
}
// 删除地址
exports.deleteAddress = (req,res) => {
    const sql = `update address set status=-1 where userId=? and addressId=?`
    db.query(sql,[req.auth.userId,req.body.addressId],(err,results)=>{
        if(err) return res.cc(err)
        if(results.affectedRows !== 1) return res.cc("删除地址失败！",500)
        res.cc("删除地址成功！",200)
    })
}
// 修改地址
exports.updateAddress = (req,res) =>{
    const updateInfo = req.body
    const sql = `update address set ? where addressId=${updateInfo.addressId} and userId=${req.auth.userId}`
    // 删除updateInfo多余的属性
    delete updateInfo.addressId
    delete updateInfo.address;
    db.query(sql,updateInfo,(err,results)=>{
        if(err) return res.cc(err)
        if(results.affectedRows !== 1) return res.cc("修改地址失败！",500)
        res.cc("修改地址成功！",200)
    })
}
// 获取所有地址
exports.getAddress = (req,res) =>{
    const sql = `select * from address where userId=${req.auth.userId} and status=1`
    db.query(sql,(err,results)=>{
        if(err) return res.cc(err)
        if(results.length < 1) return res.cc("获取地址失败！什么都没有呢~~",201)
        res.send({
            status:200,
            message:'获取地址成功！',
            data:results
        })
    })
}