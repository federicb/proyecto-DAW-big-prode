const {Router} = require('express');

const {conex_mail} = require ("../config/contact.js");

const router = Router();

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/contact', (req, res) => {
    res.render('contact');
});

router.post("/contact", (req,res) => {
    console.log(req.body);
    // desestructuración objeto
    const { name, email, message } = req.body;
    //envio de correo
    conex_mail(name, email, message);

    res.redirect("/");
});

module.exports = router;