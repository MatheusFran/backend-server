
import express from 'express';
import mssql from 'mssql';
import moment from 'moment';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
dotenv.config();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json())
app.use(cors({ credentials: true, origin: process.env.ORIGIN_URL }));

const conexaoBanco = mssql.connect({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    options: { encrypt: true, trustServerCertificate: true },

})





app.get('/double-catalogador', (req, res) => {
    conexaoBanco
    const hoje = moment().format('YYYY-MM-DD')
    const sql = `select top 60 numero,horario,cor from dbo.resultados  where data= '${hoje}' order by horario desc`

    mssql.query(sql).then(
        (result) => {
            res.send(JSON.stringify(result.recordsets[0]))
            console.log('Sucesso na requisição pro Catalogador Double')
        }
    ).catch(
        (err) => {
            console.log('Erro durante a requisição pro catalogador Double')
            res.send(err)
        }
    )

})




app.get('/radar-branco', (req, res) => {
    conexaoBanco
    const dt1 = moment().subtract(1, "days").format('YYYY-MM-DD')
    const dt2 = moment().subtract(3, "days").format('YYYY-MM-DD')
    const hragora = moment().format('HH:mm:ss')
    const sql = `select top 1 horario from dbo.resultados where data between '${dt2}' and '${dt1}' and numero = 0 and horario > '${hragora}'`
    mssql.query(sql).then(
        (result) => {
            res.send(result.recordset)
        }
    ).catch(
        (err) => {
            console.log('Erro durante a requisição pro RadarBranco')
            res.send(err)
        }
    )
})

app.get('/brancos-ultimahora', (req, res) => {
    conexaoBanco
    const hoje = moment().format('YYYY-MM-DD')
    const hratual = moment().format('HH:mm:ss')
    const ultimahr = moment().subtract(1, "hours").format('HH:mm:ss')
    const sql = `select  count(id) as Brancos from dbo.resultados where data = '${hoje}' and numero = 0 and horario between '${ultimahr}' and '${hratual}'`

    mssql.query(sql).then(
        (result) => {
            res.send(result.recordset)
        }
    ).catch(
        (err) => {
            console.log('Erro durante a requisição pra Quantidade de Branco na ultima hr')
            res.send(err)
        }
    )
})

app.get('/radar-cores', (req, res) => {
    conexaoBanco
    const hoje = moment().format('YYYY-MM-DD')
    const sql = `select top 3 cor from dbo.resultados where data = '${hoje}' order by horario desc;`

    mssql.query(sql).then(
        (result) => {
            res.send(result.recordset)
        }
    ).catch(
        (err) => {
            console.log('Erro durante a requisição pra Quantidade de Branco na ultima hr')
            res.send(err)
        }
    )
})



app.listen(process.env.PORT, console.log('ESCUTANDO NA PORT:' + process.env.PORT))
