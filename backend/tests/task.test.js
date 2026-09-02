const Task = require('../models/Task');

describe('Task Model and Validator Unit Tests', () => {
  test('Task model accepts optional notes field', () => {
    const taskData = {
      userId: 'user-123',
      subject: 'CS101 Midterm',
      type: 'Exam',
      deadline: new Date('2026-09-15'),
      weightage: 30,
      difficulty: 4,
      studyHours: 10,
      notes: 'Focus on Chapter 3-5, study algorithms section thoroughly'
    };

    const task = new Task(taskData);
    expect(task.subject).toBe('CS101 Midterm');
    expect(task.notes).toBe('Focus on Chapter 3-5, study algorithms section thoroughly');
    expect(task.status).toBe('Pending');
    expect(task.priority).toBe(0);
  });

  test('Task model sets default empty notes when not provided', () => {
    const taskData = {
      userId: 'user-123',
      subject: 'CS101 Midterm',
      type: 'Exam',
      deadline: new Date('2026-09-15'),
      weightage: 30,
      difficulty: 4,
      studyHours: 10
    };

    const task = new Task(taskData);
    expect(task.notes).toBe('');
  });

  test('Task model preserves all fields during create and read cycle', () => {
    const taskData = {
      userId: 'user-123',
      subject: 'Database Project',
      type: 'Assignment',
      deadline: new Date('2026-10-20'),
      weightage: 25,
      difficulty: 3,
      studyHours: 15,
      notes: 'Implement normalization and indexing strategies'
    };

    const task = new Task(taskData);
    expect(task.subject).toBe(taskData.subject);
    expect(task.type).toBe(taskData.type);
    expect(task.deadline.getTime()).toBe(taskData.deadline.getTime());
    expect(task.weightage).toBe(taskData.weightage);
    expect(task.difficulty).toBe(taskData.difficulty);
    expect(task.studyHours).toBe(taskData.studyHours);
    expect(task.notes).toBe(taskData.notes);
  });

  test('Task model allows updating notes field', () => {
    const task = new Task({
      userId: 'user-123',
      subject: 'Quiz 1',
      type: 'Quiz',
      deadline: new Date('2026-09-10'),
      weightage: 5,
      difficulty: 1,
      studyHours: 1,
      notes: 'Initial note'
    });

    task.notes = 'Updated note with more details';
    expect(task.notes).toBe('Updated note with more details');
  });

  test('Task model does not require notes field for backward compatibility', () => {
    const minimalTaskData = {
      userId: 'user-123',
      subject: 'Lab 3',
      type: 'Lab',
      deadline: new Date('2026-09-08'),
      weightage: 15,
      difficulty: 2,
      studyHours: 3
    };

    const task = new Task(minimalTaskData);
    expect(task.subject).toBe('Lab 3');
    expect(task.notes).toBe('');
  });
});
