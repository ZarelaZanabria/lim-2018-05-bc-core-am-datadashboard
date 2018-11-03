describe('data', () => {

  it('debería exponer función computeUsersStats en objeto global', () => {
    assert.isFunction(computeUsersStats);
  });

  it('debería exponer función sortUsers en objeto global', () => {
    assert.isFunction(sortUsers);
  });

  it('debería exponer función filterUsers en objeto global', () => {
    assert.isFunction(filterUsers);
  });

  it('debería exponer función processCohortData en objeto global', () => {
    assert.isFunction(processCohortData);
  });

  describe('computeUsersStats(users, progress, courses)', () => {

    const cohort = fixtures.cohorts.find(item => item.id === 'lim-2018-03-pre-core-pw');
    const courses = Object.keys(cohort.coursesIndex);
    const { users, progress } = fixtures;

    it('debería retornar arreglo de usuarios con propiedad stats', () => {
      const processed = computeUsersStats(users, progress, courses);

      assert.equal(users.length, processed.length);

      processed.forEach(user => {
        assert.ok(user.hasOwnProperty('stats'));
        assert.isNumber(user.stats.percent);
        assert.isObject(user.stats.exercises);
        assert.isObject(user.stats.quizzes);
        assert.isObject(user.stats.reads);
      });
    });

    describe('user.stats para el primer usuario en data de prueba - ver carpeta data/', () => {

      const processed = computeUsersStats(users, progress, courses);

      it(
        'debería tener propiedad percent con valor 53',
        () => assert.equal(processed[0].stats.percent, 53)
      );

      it('debería tener propiedad exercises con valor {total: 2, completed: 0, percent: 0}', () => {
        assert.deepEqual(processed[0].stats.exercises, {
          total: 2,
          completed: 0,
          percent: 0,
        });
      });

      it('debería tener propiedad quizzes con valor {total: 3, completed: 2, percent: 67, scoreSum: 57, scoreAvg: 29}', () => {
        assert.deepEqual(processed[0].stats.quizzes, {
          total: 3,
          completed: 2,
          percent: 67,
          scoreAvg: 29,
          scoreSum: 57,

        });
      });

      it('debería tener propiedad reads con valor {total: 11, completed: 6, percent: 55}', () => {
        assert.deepEqual(processed[0].stats.reads, {
          total: 11,
          completed: 6,
          percent: 55,
        });
      });

    });

  });

  describe('sortUsers(users, orderBy, orderDirection)', () => {
    const studentA = {
      name: "Zarela Zanabria",
      stats: {
        reads: {
          total: 10,
          completed: 5,
          percent: 50
        },
        quizzes: {
          total: 10,
          completed: 5,
          percent: 50,
          scoreSum: 50,
          scoreAvg: 10
        },
        percent: 50,
        exercises: {
          total: 10,
          completed: 5,
          percent: 50
        },
      }
    }
    const studentB = {
      name: "Melodie Ayala",
      stats: {
        reads: {
          total: 10,
          completed: 10,
          percent: 100
        },
        quizzes: {
          total: 10,
          completed: 10,
          percent: 100,
          scoreSum: 1000,
          scoreAvg: 100
        },
        percent: 100,
        exercises: {
          total: 10,
          completed: 10,
          percent: 100
        },
      }
    }
    const studentC = {
      name: "Ailim Moscoso",
      stats: {
        reads: {
          total: 10,
          completed: 0,
          percent: 0
        },
        quizzes: {
          total: 10,
          completed: 0,
          percent: 0,
          scoreSum: 0,
          scoreAvg: 0
        },
        percent: 0,
        exercises: {
          total: 10,
          completed: 0,
          percent: 0
        },
      }
    }
    let students = [studentA, studentB, studentC];

    it('debería retornar arreglo de usuarios ordenado por nombre ASC', () => {
      assert.deepEqual(sortUsers(students, "Name", "ASC"), [studentC, studentB, studentA])
    });
    it('debería retornar arreglo de usuarios ordenado por nombre DESC', () => {
      assert.deepEqual(sortUsers(students, "Name", "DESC"), [studentA, studentB, studentC])
    });
    it('debería retornar arreglo de usuarios ordenado por porcentaje general ASC', () => {
      assert.deepEqual(sortUsers(students, "Percent", "ASC"), [studentC, studentA, studentB])
    });
    it('debería retornar arreglo de usuarios ordenado por porcentaje general DESC', () => {
      assert.deepEqual(sortUsers(students, "Percent", "DES"), [studentB, studentA, studentC])
    });
    it('debería retornar arreglo de usuarios ordenado por ejercicios completados ASC', () => {
      assert.deepEqual(sortUsers(students, "ExcercisePercent", "ASC"), [studentC, studentA, studentB])

    });
    it('debería retornar arreglo de usuarios ordenado por ejercicios completados DESC', () => {
      assert.deepEqual(sortUsers(students, "ExcercisePercent", "DES"), [studentB, studentA, studentC])
    });
    it('debería retornar arreglo de usuarios ordenado por quizzes completados ASC', () => {
      assert.deepEqual(window.sortUsers(students, "QuizzesPercent", "ASC"), [studentC, studentA, studentB])

    });
    it('debería retornar arreglo de usuarios ordenado por quizzes completados DESC', () => {
      assert.deepEqual(sortUsers(students, "QuizzesPercent", "DES"), [studentB, studentA, studentC])
    });
    it('debería retornar arreglo de usuarios ordenado por score promedio en quizzes completados ASC', () => {
      assert.deepEqual(window.sortUsers(students, "QuizzesScoreAvg", "ASC"), [studentC, studentA, studentB])
    });
    it('debería retornar arreglo de usuarios ordenado por score promedio en quizzes completados DESC', () => {
      assert.deepEqual(window.sortUsers(students, "QuizzesScoreAvg", "DES"), [studentB, studentA, studentC])
    });
    it('debería retornar arreglo de usuarios ordenado por lecturas (reads) completadas ASC', () => {
      assert.deepEqual(window.sortUsers(students, "ReadsPercent", "ASC"), [studentC, studentA, studentB])
    });
    it('debería retornar arreglo de usuarios ordenado por lecturas (reads) completadas DESC', () => {
      assert.deepEqual(window.sortUsers(students, "ReadsPercent", "DES"), [studentB, studentA, studentC])
    });

  });

  describe('filterUsers(users, filterBy)', () => {

    it('debería retornar nuevo arreglo solo con usuarios con nombres que contengan string (case insensitive)', () => {
      let array = [{
        "id": "LZZiC91B4NddpaPTBJ1XpT9Ox8V2",
        "name": "Dorelly", "locale": "es-PE",
        "timezone": "America/Lima", "role": "student"
      },
      {
        "id": "mIyuhjFX4uhASyDcWReNE5dcd2I2",
        "github": "",
        "locale": "es-ES",
        "timezone": "America/Lima",
        "name": "Fiorella S",
        "linkedin": "", "role": "student"
      },
      {
        "id": "pHuZDr9WjBV1qrU66QZlq2yhGmC2",
        "timezone": "America/Lima",
        "name": "Dory",
        "locale": "es-PE", "role": "student"
      },
      {
        "id": "rosNOO9dNQQDo4TlClcMiFHEIfy2",
        "name": "Dalia", "locale": "es-PE",
        "timezone": "America/Lima", "role": "student"
      }]
      const dorelly = [{
        "id": "LZZiC91B4NddpaPTBJ1XpT9Ox8V2",
        "name": "Dorelly", "locale": "es-PE",
        "timezone": "America/Lima", "role": "student"
      }
      ];
      const dalia = [
        {
          "id": "rosNOO9dNQQDo4TlClcMiFHEIfy2",
          "name": "Dalia", "locale": "es-PE",
          "timezone": "America/Lima", "role": "student"
        }
      ]
      assert.deepEqual(window.filterUsers(array, "Dorelly"), dorelly);
      assert.deepEqual(window.filterUsers(array, "Dalia"), dalia);
    });

  });

  describe('processCohortData({ cohortData, orderBy, orderDirection, filterBy })', () => {

    const cohort = fixtures.cohorts.find(item => item.id === 'lim-2018-03-pre-core-pw');
    const { users, progress } = fixtures;
    let options = {
      cohort: cohort,
      cohortData: {
        users: users,
        progress: progress
      },
      orderBy: 'Name',
      orderDirection: 'ASC',
      search: ''
    }

    it('debería retornar arreglo de usuarios con propiedad stats y aplicar sort y filter', () => {

      const processed = processCohortData(options);
      assert.deepEqual(processed[0].name, 'adriana vizcarra paitán');
      options.search = 'zarela';
      assert.deepEqual(processCohortData(options)[0].name, 'Elizabeth Zarela');
      options.orderBy = 'Name';
      options.orderDirection = 'DES';
      assert.deepEqual(processCohortData(options)[0].name, 'Elizabeth Zarela')
    });

  });

});