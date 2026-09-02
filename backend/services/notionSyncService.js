const Task = require('../models/Task');
const Integration = require('../models/Integration');
const calculatePriority = require('../utils/priority');

const NOTION_API_HEADER = {
  'Notion-Version': '2022-06-28',
  'Content-Type': 'application/json'
};

const fetchNotionDatabases = async (accessToken) => {
  const response = await fetch('https://api.notion.com/v1/search', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      ...NOTION_API_HEADER
    },
    body: JSON.stringify({
      filter: {
        value: 'database',
        property: 'object'
      }
    })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch databases from Notion API');
  }

  return (data.results || []).map((db) => {
    const titleText = db.title?.[0]?.plain_text || db.title?.[0]?.text?.content || 'Untitled Database';
    return {
      id: db.id,
      title: titleText,
      url: db.url
    };
  });
};

const parseNotionPageToTask = (page) => {
  const props = page.properties || {};

  // Extract Subject / Title
  let subject = 'Notion Task';
  for (const key of Object.keys(props)) {
    const prop = props[key];
    if (prop.type === 'title' && Array.isArray(prop.title) && prop.title.length > 0) {
      subject = prop.title.map(t => t.plain_text || t.text?.content || '').join('').trim() || 'Notion Task';
      break;
    }
  }

  // Extract Deadline / Date
  let deadline = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // default 7 days from now
  for (const key of Object.keys(props)) {
    const prop = props[key];
    if (prop.type === 'date' && prop.date?.start) {
      deadline = new Date(prop.date.start);
      break;
    }
  }

  // Extract Type (enum: Exam, Assignment, Lab, Quiz)
  let type = 'Assignment';
  const allowedTypes = ['Exam', 'Assignment', 'Lab', 'Quiz'];
  for (const key of Object.keys(props)) {
    const prop = props[key];
    if (prop.type === 'select' && prop.select?.name) {
      const val = prop.select.name;
      const matched = allowedTypes.find(t => t.toLowerCase() === val.toLowerCase());
      if (matched) {
        type = matched;
        break;
      }
    }
  }

  // Extract Weightage (Number)
  let weightage = 10;
  for (const key of Object.keys(props)) {
    const prop = props[key];
    if (prop.type === 'number' && typeof prop.number === 'number') {
      if (key.toLowerCase().includes('weight')) {
        weightage = prop.number;
        break;
      }
    }
  }

  // Extract Difficulty (1-5)
  let difficulty = 3;
  for (const key of Object.keys(props)) {
    const prop = props[key];
    if (prop.type === 'number' && typeof prop.number === 'number') {
      if (key.toLowerCase().includes('diff')) {
        difficulty = Math.min(Math.max(prop.number, 1), 5);
        break;
      }
    }
  }

  // Extract Study Hours (Number >= 0.1)
  let studyHours = 1;
  for (const key of Object.keys(props)) {
    const prop = props[key];
    if (prop.type === 'number' && typeof prop.number === 'number') {
      if (key.toLowerCase().includes('hour') || key.toLowerCase().includes('study')) {
        studyHours = Math.max(prop.number, 0.1);
        break;
      }
    }
  }

  // Extract Status
  let status = 'Pending';
  for (const key of Object.keys(props)) {
    const prop = props[key];
    if (prop.type === 'status' && prop.status?.name) {
      if (prop.status.name.toLowerCase().includes('done') || prop.status.name.toLowerCase().includes('complete')) {
        status = 'Completed';
      }
    } else if (prop.type === 'select' && prop.select?.name) {
      if (prop.select.name.toLowerCase().includes('done') || prop.select.name.toLowerCase().includes('complete')) {
        status = 'Completed';
      }
    } else if (prop.type === 'checkbox') {
      if (prop.checkbox === true) {
        status = 'Completed';
      }
    }
  }

  return {
    subject,
    type,
    deadline,
    weightage,
    difficulty,
    studyHours,
    status,
    integrationEventId: page.id
  };
};

const fetchNotionDatabasePages = async (accessToken, databaseId) => {
  let url = `https://api.notion.com/v1/databases/${databaseId}/query`;
  let body = {};

  if (!databaseId) {
    url = 'https://api.notion.com/v1/search';
    body = {
      filter: {
        value: 'page',
        property: 'object'
      }
    };
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      ...NOTION_API_HEADER
    },
    body: JSON.stringify(body)
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch pages from Notion API');
  }

  return data.results || [];
};

const syncNotionTasks = async (userId, databaseId) => {
  const integration = await Integration.findOne({ userId, platform: 'notion', connected: true });
  if (!integration) {
    throw new Error('Notion integration is not connected');
  }

  const accessToken = integration.getDecryptedAccessToken();
  const pages = await fetchNotionDatabasePages(accessToken, databaseId);

  const syncedTasks = [];
  for (const page of pages) {
    const parsed = parseNotionPageToTask(page);
    const priority = calculatePriority({
      type: parsed.type,
      weightage: parsed.weightage,
      difficulty: parsed.difficulty,
      deadline: parsed.deadline,
      status: parsed.status
    });

    let task = await Task.findOne({ userId, integrationEventId: page.id });
    if (task) {
      task.subject = parsed.subject;
      task.type = parsed.type;
      task.deadline = parsed.deadline;
      task.weightage = parsed.weightage;
      task.difficulty = parsed.difficulty;
      task.studyHours = parsed.studyHours;
      task.status = parsed.status;
      task.priority = priority;
      await task.save();
    } else {
      task = new Task({
        userId,
        ...parsed,
        priority
      });
      await task.save();
    }
    syncedTasks.push(task);
  }

  return syncedTasks;
};

module.exports = {
  fetchNotionDatabases,
  fetchNotionDatabasePages,
  parseNotionPageToTask,
  syncNotionTasks
};
