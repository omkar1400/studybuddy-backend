const pool = require('./db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Create test user
    const hashedPassword = await bcrypt.hash('password123', 12);
    
    const userResult = await pool.query(
      `INSERT INTO users (name, email, password)
       VALUES ($1, $2, $3)
       RETURNING *`,
      ['Test Student', 'student@studybuddy.com', hashedPassword]
    );
    
    const userId = userResult.rows[0].id;
    console.log('✅ Test user created:', userResult.rows[0].email);

    // Create test subjects
    const subjects = [
      { name: 'Mathematics', description: 'Calculus, Algebra, and Geometry' },
      { name: 'Physics', description: 'Classical and Modern Physics' },
      { name: 'Chemistry', description: 'Organic and Inorganic Chemistry' },
      { name: 'Computer Science', description: 'Data Structures and Algorithms' },
      { name: 'English Literature', description: 'Classic and Contemporary Works' }
    ];

    const subjectIds = [];
    for (const subject of subjects) {
      const result = await pool.query(
        `INSERT INTO subjects (user_id, name, description)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [userId, subject.name, subject.description]
      );
      subjectIds.push(result.rows[0].id);
      console.log('✅ Subject created:', subject.name);
    }

    // Create test study sessions
    const now = new Date();
    const sessions = [
      {
        subject_id: subjectIds[0],
        title: 'Calculus Chapter 5 Review',
        description: 'Review derivatives and applications',
        start_time: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        end_time: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 2 hours session
        status: 'completed'
      },
      {
        subject_id: subjectIds[1],
        title: 'Physics: Motion and Forces',
        description: 'Study mechanics problems',
        start_time: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        end_time: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000 + 1.5 * 60 * 60 * 1000),
        status: 'completed'
      },
      {
        subject_id: subjectIds[2],
        title: 'Chemistry Lab Report',
        description: 'Prepare lab report for experiment',
        start_time: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
        end_time: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
        status: 'pending'
      },
      {
        subject_id: subjectIds[3],
        title: 'Data Structures Quiz Prep',
        description: 'Prepare for weekly quiz',
        start_time: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), // In 2 days
        end_time: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000 + 1 * 60 * 60 * 1000),
        status: 'pending'
      },
      {
        subject_id: subjectIds[4],
        title: 'Shakespeare Essay Writing',
        description: 'Draft essay on Hamlet',
        start_time: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // Yesterday
        end_time: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000 + 2.5 * 60 * 60 * 1000),
        status: 'completed'
      },
      {
        subject_id: subjectIds[0],
        title: 'Integration Problem Set',
        description: 'Complete problem set 12',
        start_time: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), // In 5 days
        end_time: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000 + 1.5 * 60 * 60 * 1000),
        status: 'pending'
      }
    ];

    for (const session of sessions) {
      await pool.query(
        `INSERT INTO study_sessions (user_id, subject_id, title, description, start_time, end_time, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [userId, session.subject_id, session.title, session.description, session.start_time, session.end_time, session.status]
      );
      console.log('✅ Session created:', session.title);
    }

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📝 Test Credentials:');
    console.log('   Email: student@studybuddy.com');
    console.log('   Password: password123');
    console.log('\n✅ You now have:');
    console.log('   - 1 test user');
    console.log('   - 5 subjects');
    console.log('   - 6 study sessions (3 completed, 3 pending)');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    process.exit();
  }
};

seedDatabase();
