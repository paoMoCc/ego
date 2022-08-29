const db = require('../db')

//添加分类
exports.addCate = (req, res) => {
    let cateInfo = req.body
    const checkSql = `select * from category where cateName=?`
    db.query(checkSql, cateInfo.cateName, (checkErr, checkRes) => {
        // sql语句执行失败
        if (checkErr) return res.cc(checkErr, 300)
        // 分类已存在
        if (checkRes.length > 0) return res.cc("分类已存在，请勿重复创建!", 500)
        const sql = `insert into category set cateName=?,rootId=?`
        db.query(sql, [cateInfo.cateName, cateInfo.rootId ? cateInfo.rootId : 0], (err, results) => {
            // sql语句执行失败
            if (err) return res.cc(err, 400)
            // sql执行成功，但影响的行数不为1
            if (results.affectedRows !== 1) res.cc("添加分类失败！", 500)
            res.cc("添加分类成功！", 200)
        })
    })
}
//获取所有分类
exports.getCate = (req,res) => {
    const sql = `select * from category where status=1`
    db.query(sql,(err,results)=>{
        // sql执行失败
        if (err) return res.cc(err)
        if (!results.length) return res.cc("获取分类失败！",500)
        res.send({
            status:200,
            message:'获取分类成功！',
            data:results
        })
    })
}