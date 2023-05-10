const {Router} = require('express');

const router = Router();

router.get('/', (req, res) => {
    res.render('index');
});

// router.get('/contact', (req, res) => {
//     res.render('contact');
// });

// router.post("/contact_user", (req,res) => {
//     console.log(req.body);

//     //desestructuramos el objeto x comodidad
//     let {phone,name,email,message} = req.body;

//     //envio de correo
//     conexion(name,email,phone,message);


//     res.redirect("/");
// });

module.exports = router;