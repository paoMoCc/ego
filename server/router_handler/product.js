const db = require("../db")

// 添加商品 见../router/product.js

// 根据分类id获取商品
exports.getPro = (req, res) => {
    let proInfo = req.body
    const sql = `select * from product where cateId=? and status=1 and stock>0`
    db.query(sql, [proInfo.cateId], (err, results) => {
        if (err) return res.cc(err)
        if (results.length < 1) return res.cc("哎呀！该分类还没有在售的商品哦！", 201)
        res.send({
            status: 200,
            message: '获取商品成功！',
            data: results
        })
    })
}

// 获取所有有库存的上架商品
exports.getAllPro = (req, res) => {
    const sql = `select * from product where status=1 and stock>0`
    db.query(sql, (err, results) => {
        if (err) return res.cc(err)
        if (results.length < 1) return res.cc("哎呀！没有在售的商品哦！", 500)
        res.send({
            status: 200,
            message: '获取全部商品成功！',
            data: results
        })
    })
}

// 获取我的商品(不含删除)
exports.getMyPro = (req, res) => {
    const sql = `select * from product where userId=? and stock>0 and not status=-1`
    console.log(req.auth);
    db.query(sql, req.auth.userId ,(err, results) => {
        if (err) return res.cc(err)
        if (results.length < 1) return res.cc("哎呀！你还没有出售过商品哦！", 500)
        res.send({
            status: 200,
            message: '获取我的商品成功！',
            data: results
        })
    })
}

// 搜索商品
exports.searchPro = (req,res) => {
    const keyWord = req.body.keyWord
    const sql = `select * from product where (proName like ? or subTitle like ?) and status=1 and stock>0`
    db.query(sql,[`%${keyWord}%`,`%${keyWord}%`],(err,results)=>{
        if (err) return res.cc(err)
        if (results.length < 1) return res.cc("什么都没找到啊T T",500)
        res.send({
            status:200,
            message:'为您找到以下结果：',
            data:results
        })
    })
}

// 下架或重新上架我的商品
exports.changeProStatus = (req,res) => {
    const sql = `update product set status=? where userId=? and proId=?`
    db.query(sql,[(req.body.status == 0 ? 0:1),req.auth.userId,req.body.proId],(err,results)=>{
        if(err) return res.cc(err)
        if(results.affectedRows !== 1 ) return req.body.status == 0 ? res.cc("下架商品失败！",500): res.cc("重新上架商品失败！",500)
        req.body.status ==0 ? res.cc("下架商品成功！",200): res.cc("重新上架商品成功！",200)
    })    
}

// 删除商品
exports.deletePro = (req,res) => {
    const sql = `update product set status=-1 where userId=? and proId=?`    
    db.query(sql,[req.auth.userId,req.body.proId],(err,results)=>{
        if(err) return res.cc(err)
        if(results.affectedRows !== 1) return res.cc("删除商品失败！",500)
        res.cc("删除商品成功！",200)
    })
}

