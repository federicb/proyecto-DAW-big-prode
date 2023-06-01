
const groupLinks = document.querySelectorAll('.group__name');
const groupInfo = document.querySelector('.groups__info');
const invitationLink = document.querySelector('.group__link .link');


groupLinks.forEach(link => {
    link.addEventListener('click', async (event) => {
        event.preventDefault();
        const groupId = link.getAttribute('data-groupid');

        try {
           
            const response = await fetch(`/get_invitation?id_group=${groupId}`);
            const data = await response.json();
            
            // actualiza contenido .link
            invitationLink.textContent = data.invitation || 'Invitación no disponible';

            } catch (error) {
            console.log('Error al obtener la invitación:', error);
            invitationLink.textContent = 'Error al obtener la invitación';
            }
        
        // oculta filas
        const groupMemberRows = document.querySelectorAll('.group-member-row');
        groupMemberRows.forEach(row => {
            row.style.display = 'none';
        });
        
        // muestra solo filas de miembros del grupo seleccionado
        const matchingMemberRows = document.querySelectorAll(`.group-member-row[data-groupid="${groupId}"]`);
        matchingMemberRows.forEach(row => {
        row.style.display = 'flex';
        });

        // muestra el grupo_info
        groupInfo.style.display = 'flex';

        // cambia fondo de .groups__card
        const groupCards = document.querySelectorAll('.groups__card');
        groupCards.forEach(card => {
            card.style.backgroundColor = '';
        });
        const currentCard = link.closest('.groups__card');
        currentCard.style.backgroundColor = '#cef5ce';
    });
});