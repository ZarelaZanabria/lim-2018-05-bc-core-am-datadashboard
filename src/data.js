window.computeUsersStats = (users, progress, courses) => {

  let usersWithStats = users.map(usuario1 => {
    return NuevoUsuarioStats(usuario1, progress[usuario1.id], courses);

  });
  return usersWithStats;
}


const NuevoUsuarioStats = (usuarioS, progress, courses) => {
  let nameUser = usuarioS.name;
  let usersWithStats = {}
  usersWithStats.stats = {
    percent: computerUserPercent(progress, courses),
    exercises: computerExercises(progress, courses),
    reads: computerUsersRead(progress, courses),
    quizzes: computerUserQuizz(progress, courses),
  }
  usersWithStats.name = nameUser;
  return usersWithStats;
}
const computerUserPercent = (progress, courses) => {
  try {
    return progress[courses].percent;
  } catch (error) {
    return 0;
  }
}
const computerExercises = (progress, courses) => {
  let cont = 0;
  let contComplet = 0;
  try {
    courses.map((curso) => {
      const valorUnits = Object.keys(progress[curso].units);

      valorUnits.map((nombreUnits) => {

        const valorParts = Object.keys(progress[curso].units[nombreUnits].parts);

        valorParts.map((nombreParts) => {
          const valorExcercises = progress[curso].units[nombreUnits].parts[nombreParts];

          if (valorExcercises.hasOwnProperty('exercises')) {
            const nombreExercises = valorExcercises.exercises;
            cont += Object.keys(nombreExercises).length;

            const valorCompletado = Object.keys(valorExcercises.exercises);
            //console.log(valorCompletado) 
            valorCompletado.map((nombreExercises) => {
              //console.log (nombreExercises)
              const valorCompleted = progress[curso].units[nombreUnits].parts[nombreParts].exercises[nombreExercises].completed;
              //console.log (valorCompleted)
              if (valorCompleted == 1) {
                contComplet += valorCompleted;
              }
            });
          }
        });


      });
    });
  } catch (error) {
    let exercises = {
      total: 0,
      completed: 0,
      percent: 0,
    }

    return exercises;

  }

  let exercises = {
    total: cont,
    completed: contComplet,
    percent: (contComplet / cont) * 100,
  }
  return exercises;


};
const computerUsersRead = (progress, courses) => {
  let cont = 0;
  let contComplet = 0;
  try {
    courses.map((curso) => {
      const valorUnits = Object.keys(progress[curso].units);
      //console.log(valorUnits)
      valorUnits.map((nombreUnits) => {
        //console.log (nombreUnits);
        const valorParts = Object.keys(progress[curso].units[nombreUnits].parts);
        //console.log(valorParts)
        valorParts.map((nombreParts) => {
          //console.log (nombreParts)
          const valorType = progress[curso].units[nombreUnits].parts[nombreParts];
          //console.log(valorType);
          if (valorType.type == "read") {
            cont++;
          }
          if (valorType.type == "read" && valorType.completed == 1) {
            contComplet++;
          }
        });
      });
    });

  } catch (error) {
    let reads = {
      total: 0,
      completed: 0,
      percent: 0,
    }
    return reads;
  }

  let reads = {
    total: cont,
    completed: contComplet,
    percent: Math.round((contComplet / cont) * 100),
  }
  return reads;


}
const computerUserQuizz = (progress, courses) => {
  let cont = 0;
  let contComplet = 0;
  let contscoreAvg = 0
  try {
    courses.map((curso) => {
      const valorUnits = Object.keys(progress[curso].units);
      //console.log(valorUnits)
      valorUnits.map((nombreUnits) => {
        //console.log (nombreUnits);
        const valorParts = Object.keys(progress[curso].units[nombreUnits].parts);
        //console.log(valorParts)
        valorParts.map((nombreParts) => {
          //console.log (nombreParts)
          const valorType = progress[curso].units[nombreUnits].parts[nombreParts];
          //console.log(valorType);
          if (valorType.type == "quiz") {
            cont++;
          }
          if (valorType.type == "quiz" && valorType.completed == 1) {
            contComplet++;
          }

          if (valorType.type == "quiz" && valorType.completed == 1 && valorType.score) {
            contscoreAvg += valorType.score;
          }
        });
      });
    });

  } catch (error) {
    let quizzes = {
      total: 0,
      completed: 0,
      percent: 0,
      scoreSum: 0,
      scoreAvg: 0,
    }
    return quizzes;
  }

  let quizzes = {
    total: cont,
    completed: contComplet,
    percent: Math.round((contComplet / cont) * 100),
    scoreSum: contscoreAvg,
    scoreAvg: Math.round(contscoreAvg / contComplet),
  }
  return quizzes;
}

window.sortUsers = (users, orderBy, orderDirection) => {
  //esta funcion ordena por orden alfabetico a las alumnas
  if (orderBy == "Name") {
    return users.sort((a, b) => {
      if (orderDirection == "ASC") {
        //localCompare compara 2 strings que en este caso son los nombres de las alumnas
        return a.name.localeCompare(b.name);
      } else {
        //esto mostrara el ordenamiento en orden descendente
        return a.name.localeCompare(b.name) * -1;
      }
    });
  }
  if (orderBy == "Percent") {
    return users.sort((a, b) => {
      if (orderDirection == "ASC") {
        return a.stats.percent - b.stats.percent;
      } else {
        return (a.stats.percent - b.stats.percent) * -1;
      }
    });

  }
  if (orderBy == "ExcercisePercent") {
    return users.sort((a, b) => {
      if (orderDirection == "ASC") {
        return a.stats.exercises.percent - b.stats.exercises.percent;
      } else {
        return (a.stats.exercises.percent - b.stats.exercises.percent) * -1;
      }
    });
  } else if (orderBy == "QuizzesPercent") {
    return users.sort((a, b) => {
      if (orderDirection == "ASC") {
        return a.stats.quizzes.percent - b.stats.quizzes.percent;
      } else {
        return (a.stats.quizzes.percent - b.stats.quizzes.percent) * -1;
      }
    });
  } else if (orderBy == "QuizzesScoreAvg") {
    return users.sort((a, b) => {
      if (orderDirection == "ASC") {
        return a.stats.quizzes.scoreAvg - b.stats.quizzes.scoreAvg;
      } else {
        return (a.stats.quizzes.scoreAvg - b.stats.quizzes.scoreAvg) * -1;
      }
    });
  } else if (orderBy == "ReadsPercent") {
    return users.sort((a, b) => {
      if (orderDirection == "ASC") {
        return a.stats.reads.percent - b.stats.reads.percent;
      } else {
        return (a.stats.reads.percent - b.stats.reads.percent) * -1;
      }
    });
  } else {
    // alert('Error al seleccionar el selector');
  }
};
window.filterUsers = (users, search) => {
  if (search) {
    if (users) {
      search = search.toLowerCase();
      return users.filter(user => user &&
        user.name && user.name.toLowerCase().indexOf(search) >= 0);
    }
    return users;
  }
}

window.processCohortData = (options) => {
  let courses = Object.keys(options.cohort.coursesIndex);
  let students = computeUsersStats(options.cohortData.users, options.cohortData.progress, courses);
  students = sortUsers(students, options.orderBy, options.orderDirection);

  if (options.search !== '') {
    students = filterUsers(students, options.search);
  }

  return students;

}