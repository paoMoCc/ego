const db = require("../db")

// 添加商品 见../router/product.js

// 根据分类id获取商品
exports.getPro = (req, res) => {
    let proInfo = req.body
    const sql = `select * from product where cateId=? and status=1 and stock>0 and isPassed=1`
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
    const sql = `select * from product where status=1 and stock>0 and isPassed=1`
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

// 搜索商品
exports.searchPro = (req,res) => {
    const keyWord = req.body.keyWord
    const sql = `select * from product where proName like ? and status=1 and stock>0 and isPassed=1`
    db.query(sql,`%${keyWord}%`,(err,results)=>{
        if (err) return res.cc(err)
        if (results.length < 1) return res.cc("什么都没找到啊T T",201)
        res.send({
            status:200,
            message:'为您找到以下结果：',
            data:results
        })
    })
}



