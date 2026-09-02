const integrationController = require('../controllers/integrationController');
const notionSyncService = require('../services/notionSyncService');

describe('Integration Controller Unit Tests', () => {
  test('Exports all eight required controller functions', () => {
    expect(typeof integrationController.createConnectTicket).toBe('function');
    expect(typeof integrationController.connectGoogle).toBe('function');
    expect(typeof integrationController.callbackGoogle).toBe('function');
    expect(typeof integrationController.syncGoogle).toBe('function');
    expect(typeof integrationController.connectNotion).toBe('function');
    expect(typeof integrationController.callbackNotion).toBe('function');
    expect(typeof integrationController.getNotionDatabases).toBe('function');
    expect(typeof integrationController.syncNotion).toBe('function');
  });

  test('notionSyncService parses page properties correctly into Task format', () => {
    const mockPage = {
      id: 'notion-page-123',
      properties: {
        Title: {
          type: 'title',
          title: [{ plain_text: 'CS101 Final Exam' }]
        },
        Deadline: {
          type: 'date',
          date: { start: '2026-10-15T10:00:00.000Z' }
        },
        Type: {
          type: 'select',
          select: { name: 'Exam' }
        },
        Weightage: {
          type: 'number',
          number: 30
        },
        Difficulty: {
          type: 'number',
          number: 4
        },
        StudyHours: {
          type: 'number',
          number: 10
        },
        Status: {
          type: 'status',
          status: { name: 'In Progress' }
        }
      }
    };

    const parsed = notionSyncService.parseNotionPageToTask(mockPage);
    expect(parsed.subject).toBe('CS101 Final Exam');
    expect(parsed.type).toBe('Exam');
    expect(parsed.weightage).toBe(30);
    expect(parsed.difficulty).toBe(4);
    expect(parsed.studyHours).toBe(10);
    expect(parsed.status).toBe('Pending');
    expect(parsed.integrationEventId).toBe('notion-page-123');
  });

  test('filters recurring birthday Google calendar events from sync imports', () => {
    const recurringBirthday = {
      id: 'birthday-annual-1',
      summary: 'Happy Birthday Alex',
      eventType: 'default',
      recurrence: ['RRULE:FREQ=YEARLY;COUNT=5'],
      start: { dateTime: '2026-09-02T09:00:00-04:00' },
      organizer: { email: 'someone@gmail.com' }
    };

    expect(integrationController.shouldImportGoogleCalendarEvent(recurringBirthday)).toBe(false);

    const validExam = {
      id: 'exam-1',
      summary: 'CS101 Midterm',
      eventType: 'default',
      start: { dateTime: '2026-09-10T10:00:00-04:00' },
      organizer: { email: 'student@gmail.com' }
    };

    expect(integrationController.shouldImportGoogleCalendarEvent(validExam)).toBe(true);
  });

  test('allows valid all-day Google calendar events to import as tasks', () => {
    const allDayEvent = {
      id: 'all-day-1',
      summary: 'Infosys',
      eventType: 'default',
      start: { date: '2026-09-18' },
      organizer: { email: 'student@gmail.com' }
    };

    expect(integrationController.shouldImportGoogleCalendarEvent(allDayEvent)).toBe(true);
  });
});
