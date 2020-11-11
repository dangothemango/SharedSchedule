const CronJob = require('cron').CronJob;
const express = require('express');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const schedulerDataService = require('./data-services/scheduler-data-service.js');

function initializeCron(io) {
  const job = new CronJob('0 0 0 1 * *', function() {
    schedulerDataService.nextMonth();
    io.emit('weeks', schedulerDataService.get().weeks);
  }, null, true, 'America/New_York');
  job.start();
}

function initializeSchedulerSocket() {
  const schedulerIO = io.of('/scheduler');
  schedulerIO.on('connection', function(socket) {
    socket.on('weeks', function(weeks) {
      schedulerDataService.setWeeks(weeks).then(function() {
        schedulerIO.emit('weeks', schedulerDataService.get().weeks);
      });
    });
    socket.on('init-scheduler', function() {
      schedulerIO.emit('weeks', schedulerDataService.get().weeks);
    });
  });
  return schedulerIO;
}

async function main() {
  app.use(express.static('app'));
  app.get('/', (req, res) => {
    res.redirect('/scheduler.html');
  });

  await schedulerDataService.initialize();

  const schedulerIO = initializeSchedulerSocket();
  initializeCron(schedulerIO);

  http.listen(3000, function() {
    console.log('listening on port: 3000');
  });
}

main();

process.on('SIGINT', function() {
  http.close();
});
