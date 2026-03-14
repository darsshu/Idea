const storage = require('./server/services/storage');
const fs = require('fs');
const path = require('path');

// Mock data
const testMonitor = { url: 'https://test.com', email: 'test@test.com' };

console.log('--- Deletion Logic Test ---');

// 1. Add a monitor
const added = storage.addMonitor(testMonitor);
console.log('Added monitor:', added.id);

// 2. Verify it exists
let monitors = storage.getMonitors();
const existsBefore = monitors.some(m => m.id === added.id);
console.log('Exists before delete:', existsBefore);

// 3. Delete it
const deleted = storage.deleteMonitor(added.id);
console.log('Deleted result:', deleted);

// 4. Verify it's gone
monitors = storage.getMonitors();
const existsAfter = monitors.some(m => m.id === added.id);
console.log('Exists after delete:', existsAfter);

if (existsBefore && deleted && !existsAfter) {
    console.log('SUCCESS: Deletion logic is working correctly locally.');
} else {
    console.log('FAILURE: Deletion logic is broken.');
}
