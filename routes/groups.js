const {Router} = require('express');
const router = Router();
const { isLoggedIn } = require('../config/auth');
const pool = require('../connection');
const { v4: uuidv4 } = require('uuid');
const joinGroup = require('../config/join_group');


router.get('/groups', isLoggedIn, async (req, res) => {
  
    try {

        const [groups_members2] = await pool.query('SELECT users.fullname, users.total_points, `groups`.group_name, `groups`.invitation, users_groups.id_user, users_groups.id_group FROM users INNER JOIN users_groups ON users_groups.id_user = users.id INNER JOIN `groups` ON `groups`.id = users_groups.id_group ORDER BY users.total_points DESC');
        // console.log(groups_members2)

        const [totalMembers2] = await pool.query('SELECT `groups`.id, `groups`.group_name, `groups`.invitation, COUNT(*) AS total_integrantes FROM users INNER JOIN users_groups ON users_groups.id_user = users.id INNER JOIN `groups` ON `groups`.id = users_groups.id_group GROUP BY `groups`.group_name ORDER BY total_integrantes DESC')
        // console.log(totalMembers2)

        const [groups_user2] = await pool.query('SELECT users.fullname, users.total_points, `groups`.group_name, `groups`.invitation, users_groups.id_user, users_groups.id_group FROM users INNER JOIN users_groups ON users_groups.id_user = users.id INNER JOIN `groups` ON `groups`.id = users_groups.id_group WHERE users_groups.id_user = ? ORDER BY users.total_points DESC', [req.user.id]);
        // console.log(groups_user2)      

        const joinLink = req.session.joinLink;

    // console.log(groups_members);
    // res.json({ 
    //      groups_user2,
    //     totalMembers2,
    //     groups_members2
    // });

    res.render('groups', {
        totalMembers2,
        groups_members2,
        groups_user2,
        joinLink
    });
  
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al obtener los datos');
    }
});
  

router.get('/new_group', isLoggedIn, (req, res) => {
    res.render('auth/new_group')
});


router.post('/create_group', isLoggedIn, async (req, res) => {
    const  group_name  = req.body.group_name; 
  
    // genera un UUID para el grupo
    const groupId = uuidv4();

    // genera el enlace para unirse al grupo
    const joinLink = `http://localhost:3000/join/${groupId}`;
    // const joinLink = `http://proyecto-daw-big-prode.onrender.com/join/${groupId}`;
    req.session.joinLink = joinLink;
  
    const newGroup = {
        group_name, 
        id: groupId,
        user_creator: req.user.id,
        invitation: joinLink
    }
    await pool.query('INSERT INTO `groups` SET ?', [newGroup]);

    const userId = req.user.id;

    // creador miembro
    const membership = {
        id_user: userId,
        id_group: groupId
    };
    await pool.query('INSERT INTO users_groups SET ?', [membership]);

    req.flash('success', 'Link saved successfully') 
  
    // res.json({ joinLink });
    res.redirect('/groups');
  });


router.get('/leave_group/:id', isLoggedIn, async (req, res) => {
    const id_group  = req.params.id;
    const id_user = req.user.id;

    await pool.query('DELETE FROM users_groups WHERE id_user = ? AND id_group = ?', [id_user, id_group])

    req.flash('success', 'Link deleted successfully')
    res.redirect('/groups')
});


router.get('/join/:groupId', async (req, res) => {
    const groupId = req.params.groupId;
    const userId = req.user ? req.user.id : null;
  
    try {
      // redirige al usuario a iniciar sesión
      if (!userId) {
        // req.session.joinGroupId = groupId; // almacena groupId en sesion 
        return res.redirect('/login'); 
      }
  
      // comprueba si usuario ya es miembro del grupo
      const [existingMembership] = await pool.query('SELECT * FROM users_groups WHERE id_user = ? AND id_group = ?', [userId, groupId]);
  
      if (existingMembership.length > 0) {
        req.flash('info', 'Ya eres miembro de este grupo');
        return res.redirect('/groups');
      }
  
      // inserta usuario en grupo
      await joinGroup.insertUserInGroup(userId, groupId);
  
      req.flash('success', 'Te has unido al grupo exitosamente');
      res.redirect('/groups');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al unirse al grupo');
    }
  });
  
  
router.get('/get_invitation', async (req, res) => {
    const groupId = req.query.id_group;
  
    try {
        const [result] = await pool.query('SELECT invitation FROM `groups` WHERE id = ?', [groupId]);
        const invitation = result[0].invitation;
        // console.log(invitation);
    
        // envio respuesta
        res.json({ invitation });
      } catch (error) {
        console.log('Error al obtener la invitación:', error);
        res.status(500).json({ error: 'Error al obtener la invitación' });
      }
  });
  

module.exports = router;