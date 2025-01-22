import { connectDatabase } from "../database/database.js";
import sql from 'mssql';

export const addReservation = async (req, res) => {
    console.log(req.body); 
    const { id_pelicula, correo_electronico, asientos, combos, precio_total, codigo } = req.body;
    if (!id_pelicula || !correo_electronico || !asientos || !combos || !precio_total || !codigo) {
        return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    const pool = await connectDatabase();
    const transaction = new sql.Transaction(pool);

    try {
        const asientosJSON = JSON.stringify(asientos);
        const combosJSON = JSON.stringify(combos);
        const fechaReserva = new Date().toISOString(); 


        const userId = await pool
            .request()
            .input('correo_electronico', sql.VarChar, correo_electronico)
            .query('SELECT id_usuario FROM Administrador.Usuario WHERE correo_electronico = @correo_electronico');

        if (userId.recordset.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const id = userId.recordset[0].id_usuario;

        await transaction.begin();
        const requestReservacion = new sql.Request(transaction);

        await requestReservacion
            .input('id_pelicula', sql.Int, id_pelicula)
            .input('id_usuario', sql.Int, parseInt(id))
            .input('total', sql.Decimal(10, 2), precio_total)
            .input('asientos', sql.NVarChar, asientosJSON)
            .input('fecha_reserva', sql.Date, fechaReserva)
            .input('combos', sql.NVarChar, combosJSON)
            .input('codigo',sql.VarChar(),codigo)
            .query(`
                INSERT INTO Administrador.Reservacion (id_pelicula, id_usuario, fecha_reserva, total, asientos, combos,codigo)
                VALUES (@id_pelicula, @id_usuario, @fecha_reserva, @total, @asientos, @combos,@codigo)
            `);

        await transaction.commit();
        res.status(200).json({ message: 'Reserva realizada con éxito' });

    } catch (error) {
        await transaction.rollback();
        console.error('Error al reservar:', error);
        res.status(500).json({ error: 'Error interno del servidor al reservar' });
    }
};


export const getSeatReservated = async (req,res) =>{
    const {id} = req.params
    console.log(id)
    try{
        const pool = await connectDatabase()
        const result = await pool 
        .request()
        .input('id_pelicula',sql.Int,id)
        .query('SELECT asientos FROM Administrador.Reservacion WHERE id_pelicula = @id_pelicula')
        return res.json({data:result.recordset})
    }catch(error){
        console.error(error)
    }
}

export const getOrderReservated = async (req,res) =>{
   const {code} = req.body

   try{
    const pool = await connectDatabase()
    const result = await pool
    .request()
    .input('codigo',sql.VarChar,code)
    .query('SELECT * FROM Administrador.Reservacion WHERE codigo = @codigo')

    if(result.recordset.length > 0){
        return res.json({data:result.recordset})
    }
    return res.json({error:'No existe el codigo.'})
   }catch(error){
    return res.json({error:'Error al obtener la orden.'})
   }
    
}

export const updateOrdenReservated = async(req,res)=>{
 const {confirmado,codigo} = req.body
 try{
    const pool = await connectDatabase()
    const result = await pool
    .request()
    .input('confirmado',sql.Bit,confirmado)
    .input('codigo',sql.VarChar,codigo)
    .query('UPDATE Administrador.Reservacion  SET confirmado = @confirmado WHERE codigo = @codigo')
    if(result.rowsAffected > 0){
        return res.json({data:'Orden confirmada.'})
    }
    return res.status(400).json({error:'Error al confirmar la compra.'})
 }catch(error){
    console.error(error)
 }
}

export const getOrdenConfirmated = async(req,res) =>{
    try{
        const pool = await connectDatabase()
        const result = await pool
        .request()
        .query('SELECT * FROM Administrador.Reservacion WHERE confirmado = 1')
        res.json({data:result})
    }catch(error){
        console.error(error)
    }
}

