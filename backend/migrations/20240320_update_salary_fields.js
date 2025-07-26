'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 首先添加新列
    await queryInterface.addColumn('job_position', 'min_salary', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
    await queryInterface.addColumn('job_position', 'max_salary', {
      type: Sequelize.INTEGER,
      allowNull: true
    });

    // 更新现有数据
    const jobs = await queryInterface.sequelize.query(
      'SELECT job_id, salary_range FROM job_position WHERE salary_range IS NOT NULL',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    for (const job of jobs) {
      if (job.salary_range) {
        const [min, max] = job.salary_range.split('-').map(s => {
          const num = parseInt(s.replace(/[^0-9]/g, ''));
          return isNaN(num) ? 0 : num;
        });

        await queryInterface.sequelize.query(
          'UPDATE job_position SET min_salary = ?, max_salary = ? WHERE job_id = ?',
          {
            replacements: [min, max, job.job_id],
            type: queryInterface.sequelize.QueryTypes.UPDATE
          }
        );
      }
    }

    // 修改列属性为不允许为空
    await queryInterface.changeColumn('job_position', 'min_salary', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    });
    await queryInterface.changeColumn('job_position', 'max_salary', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    });

    // 删除旧列
    await queryInterface.removeColumn('job_position', 'salary_range');
  },

  down: async (queryInterface, Sequelize) => {
    // 添加回旧列
    await queryInterface.addColumn('job_position', 'salary_range', {
      type: Sequelize.STRING(50),
      allowNull: true
    });

    // 更新数据
    const jobs = await queryInterface.sequelize.query(
      'SELECT job_id, min_salary, max_salary FROM job_position',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    for (const job of jobs) {
      const salaryRange = `${job.min_salary}k-${job.max_salary}k`;
      await queryInterface.sequelize.query(
        'UPDATE job_position SET salary_range = ? WHERE job_id = ?',
        {
          replacements: [salaryRange, job.job_id],
          type: queryInterface.sequelize.QueryTypes.UPDATE
        }
      );
    }

    // 删除新列
    await queryInterface.removeColumn('job_position', 'min_salary');
    await queryInterface.removeColumn('job_position', 'max_salary');
  }
}; 