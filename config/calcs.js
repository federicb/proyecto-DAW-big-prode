module.exports = {

    calculateResults(f_goal_local, f_goal_away, goals_home, goals_away) {
        let points = 0;
      
        if (f_goal_local === null || f_goal_local === undefined || f_goal_away === null || f_goal_away === undefined || 
          goals_home === null || goals_home === undefined || goals_away === null || goals_away === undefined) {
            // retorna 0 si f_goal_local o f_goal_away son null o undefined
            return 0; 
        }
      
        // local != visitantes (hay un ganador)
        if (goals_home != goals_away) {
          if (f_goal_local < f_goal_away && goals_home < goals_away) {
            // gana visitante
            points += 4;
            if (f_goal_local === goals_home && f_goal_away === goals_away) {
              // acierta el resultado completo (golazo)                  
              points += 5;
            } else if (f_goal_local === goals_home || f_goal_away === goals_away) {
              // acierta ganador y acierta uno de los resultados
              points += 2;
            } 
          } else if (f_goal_local > f_goal_away && goals_home > goals_away) {
            // gana local
            points += 4;
            if (f_goal_local === goals_home && f_goal_away === goals_away) {
              // acierta el resultado completo (golazo)   
              points += 5;
            } else if (f_goal_local === goals_home || f_goal_away === goals_away) {
              // acierta ganador y acierta uno de los resultados
              points += 2;
            }
          } else if (f_goal_local < f_goal_away && f_goal_local === goals_home) {
            points += 1;

          } else if (f_goal_local > f_goal_away && f_goal_away === goals_away) {
            points += 1;
          }      

        } else if (f_goal_local === f_goal_away && goals_home === goals_away) {
            // empate   
          points += 5;          
        } else if ( goals_home === goals_away ) {
            if ( f_goal_local === goals_home ) {
                // acierta empate y gol local
                points += 1;
            } else if ( f_goal_away === goals_away ) {
                // acierta empate y gol visitante
                points +=1;
            }
        }
        
        return points;
      }
        
      
};