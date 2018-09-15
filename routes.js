const router = require('koa-router')()
const mssql = require('mssql')

const { MSSQL_DB, MSSQL_HOST, MSSQL_PORT, MSSQL_USER, MSSQL_PASSWORD } = process.env
const mssqlConfig = {
  user: MSSQL_USER,
  password: MSSQL_PASSWORD,
  server: MSSQL_HOST,
  port: MSSQL_PORT,
  database: MSSQL_DB
}

/**
* 查询用户信息
* @param {String} bh 学号
*/
router.get('/user/detail', async ctx => {
  const BH = ctx.query.bh || ctx.query.BH

  return new mssql.ConnectionPool(mssqlConfig).connect().then(pool => {
    return pool.request().query(`
      SELECT
        CardId, CardNo, BH, Name, Sex, Department
      FROM
        T_Card
      WHERE
        BH = CONVERT(VARCHAR(100), ${BH})
    `)
  })
  .then(res => {
    const { recordset } = res
    mssql.close()
    ctx.body = recordset
  })
  .catch(err => {
    console.log(err)
    mssql.close()
    ctx.status = 500
  })
})

/**
* 更新学生信息
* @param {INTEGER} CardId 索引号
* @param {String} CardNo 卡号
* @param {String} BH 学号
* @param {String} Name 姓名
* @param {String} Sex 性别 男/女
* @param {String} Department 详细信息
*/
router.put('/user/:CardId', async ctx => {
  const { CardId } = ctx.params
  const { CardNo, BH, Name, Sex, Department } = ctx.request.body

  for (let key in ctx.request.body) {
    if (!ctx.request.body[key]) {
      ctx.status = 400
      ctx.body = {
        msg: '请补充完整参数'
      }
      return
    }
  }

  return new mssql.ConnectionPool(mssqlConfig).connect().then(pool => {
    return pool.request().query(`
      UPDATE
        T_Card
      SET
        CardNo = '${CardNo}',
        BH = '${BH}',
        Name = N'${Name}',
        Sex = N'${Sex}',
        Department = N'${Department}'
      WHERE
        CardId = ${CardId}
    `)
  })
  .then(res => {
    console.log(res)
    mssql.close()
    ctx.status = 200
  })
  .catch(err => {
    console.log(err)
    mssql.close()
    ctx.status = 500
  })

  ctx.body = res
})

/**
* 更新学生信息
* @param {String} CardNo 卡号
* @param {String} BH 学号
* @param {String} Name 姓名
* @param {String} Sex 性别 男/女
* @param {String} Department 详细信息
*/
router.post('/users', async ctx => {
  const { CardNo, BH, Name, Sex, Department } = ctx.request.body
  console.log(ctx.request.body)
  for (let key in ctx.request.body) {
    if (!ctx.request.body[key]) {
      ctx.status = 400
      ctx.body = {
        msg: '请补充完整参数'
      }
      return
    }
  }

  return new mssql.ConnectionPool(mssqlConfig).connect().then(pool => {
    return pool.request().query(`
      INSERT INTO
        T_Card
        (CardNo, BH, Name, Sex, Department)
      VALUES
        (
          '${CardNo}', '${BH}', N'${Name}', N'${Sex}', N'${Department}'
        )
    `)
  })
  .then(res => {
    mssql.close()
    ctx.status = 201
  })
  .catch(err => {
    console.log(err)
    mssql.close()
    ctx.status = 500
  })

  ctx.body = res
})
module.exports = router
