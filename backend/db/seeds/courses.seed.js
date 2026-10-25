async function seedCourses(connection) {
  console.log('📚 Seeding LLC Courses and Batches...');

  const sampleCourses = [
    {
      name: 'Diploma in English & Communication Skills',
      description: 'Comprehensive 6-month diploma covering English grammar, vocabulary, business writing, public speaking, and presentation skills designed for higher education and career development.',
      duration: '6 Months',
      batches: [
        {
          batch_name: 'Batch 2026-A (Weekend Morning)',
          start_date: '2026-11-15',
          schedule: 'Saturdays & Sundays 8:30 AM - 12:30 PM',
          is_registration_open: true,
        },
        {
          batch_name: 'Batch 2026-B (Weekday Evening)',
          start_date: '2026-11-17',
          schedule: 'Tuesdays & Thursdays 5:00 PM - 7:30 PM',
          is_registration_open: true,
        },
      ],
    },
    {
      name: 'Spoken English & Fluency Workshop',
      description: 'An interactive speaking-intensive program focusing on pronunciation, accent reduction, conversational confidence, everyday dialogues, and group discussions.',
      duration: '3 Months',
      batches: [
        {
          batch_name: 'Batch 2026-A (Weekend Afternoon)',
          start_date: '2026-11-20',
          schedule: 'Saturdays & Sundays 1:30 PM - 4:30 PM',
          is_registration_open: true,
        },
        {
          batch_name: 'Batch 2026-B (Weekday Morning)',
          start_date: '2026-12-01',
          schedule: 'Mondays & Wednesdays 9:00 AM - 12:00 PM',
          is_registration_open: true,
        },
      ],
    },
    {
      name: 'IELTS Academic & General Training Masterclass',
      description: 'Targeted test preparation for IELTS candidates aiming for Band 7.0+. Thorough training in Listening, Reading, Academic Writing, and one-on-one Mock Speaking sessions.',
      duration: '2 Months',
      batches: [
        {
          batch_name: 'Batch 2026-FastTrack',
          start_date: '2026-11-10',
          schedule: 'Monday to Thursday 6:00 PM - 8:30 PM',
          is_registration_open: true,
        },
        {
          batch_name: 'Batch 2026-Weekend',
          start_date: '2026-12-05',
          schedule: 'Sundays 9:00 AM - 3:00 PM',
          is_registration_open: true,
        },
      ],
    },
    {
      name: 'Sinhala for Everyday Communication',
      description: 'Practical spoken and written Sinhala course designed for professionals, students, and community members in the Eastern Province to communicate effectively.',
      duration: '3 Months',
      batches: [
        {
          batch_name: 'Batch 2026-A',
          start_date: '2026-11-25',
          schedule: 'Fridays 3:00 PM - 6:00 PM',
          is_registration_open: true,
        },
      ],
    },
    {
      name: 'Tamil Language & Literacy for Beginners',
      description: 'Foundational Tamil course covering alphabet script, essential spoken phrases, and day-to-day conversation skills in local and professional settings.',
      duration: '3 Months',
      batches: [
        {
          batch_name: 'Batch 2026-A',
          start_date: '2026-12-01',
          schedule: 'Saturdays 9:00 AM - 12:00 PM',
          is_registration_open: true,
        },
      ],
    },
    {
      name: 'Business English & Workplace Communication',
      description: 'Tailored for working executives, accountants, and IT professionals: business email etiquette, negotiations, report writing, and meeting moderation.',
      duration: '6 Weeks',
      batches: [
        {
          batch_name: 'Batch 2026-Executive',
          start_date: '2026-11-18',
          schedule: 'Wednesdays & Fridays 6:30 PM - 8:30 PM',
          is_registration_open: true,
        },
      ],
    },
  ];

  for (const c of sampleCourses) {
    // 1. Check or Insert Course
    const [existingCourse] = await connection.query(
      'SELECT id FROM courses WHERE name = ?',
      [c.name]
    );

    let courseId;
    if (existingCourse.length > 0) {
      courseId = existingCourse[0].id;
      console.log(`  ℹ️  Course "${c.name}" already exists.`);
    } else {
      await connection.query(
        'INSERT INTO courses (name, description, duration, is_active) VALUES (?, ?, ?, TRUE)',
        [c.name, c.description, c.duration]
      );
      const [newCourse] = await connection.query(
        'SELECT id FROM courses WHERE name = ?',
        [c.name]
      );
      courseId = newCourse[0].id;
      console.log(`  ✅ Added Course: "${c.name}" (${courseId})`);
    }

    // 2. Check or Insert Batches for this Course
    for (const b of c.batches) {
      const [existingBatch] = await connection.query(
        'SELECT id FROM batches WHERE course_id = ? AND batch_name = ?',
        [courseId, b.batch_name]
      );

      if (existingBatch.length > 0) {
        console.log(`     ℹ️  Batch "${b.batch_name}" already exists.`);
      } else {
        await connection.query(
          `INSERT INTO batches (course_id, batch_name, start_date, schedule, is_registration_open)
           VALUES (?, ?, ?, ?, ?)`,
          [courseId, b.batch_name, b.start_date, b.schedule, b.is_registration_open]
        );
        console.log(`     ✅ Added Batch: "${b.batch_name}"`);
      }
    }
  }

  console.log('🎉 Course and Batch seeding completed successfully!');
}

module.exports = seedCourses;
