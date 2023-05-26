module.exports = {

    calculateResults(f_goal_local, f_goal_away, goals_home, goals_away) {

        const points = 0;

        // local != visitantes (hay un ganador)
        if ( f_goal_local != f_goal_away && goals_home != goals_away ) {
            if (f_goal_local < f_goal_away && goals_home < goals_away) {
                // gana visitancte
                points += 4;
                if ( f_goal_local == goals_home || f_goal_away == goals_away ) {
                    // acierta ganador y acierta uno de los resultados
                    points += 2;  
                } else if ( f_goal_local == goals_home && f_goal_away == goals_away ) {
                    // acierta el resultado completo (golazo)                  
                    points += 5;
                } 
            } else if (f_goal_local > f_goal_away && goals_home > goals_away) {
                // gana local
                points += 4;
                if ( f_goal_local == goals_home || f_goal_away == goals_away ) {
                    // acierta ganador y acierta uno de los resultados
                    points += 2;
                } else if ( f_goal_local == goals_home && f_goal_away == goals_away ) {
                    // acierta el resultado completo (golazo)   
                    points += 5;
                }
            } else if ( f_goal_local < f_goal_away && f_goal_local == goals_home ) {
                points += 1;
            } else if ( f_goal_local > f_goal_away && f_goal_away == goals_away ) {
                points += 1;
            }      
            // empate   
        } else  if ( f_goal_local == f_goal_away && goals_home == goals_away ) {
            points += 5;
        }
      
        return points;
    }     
      
};