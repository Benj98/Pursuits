const { registerAllCommands } = require('../command-library/command-library');

require('./admin')
require('./player')
require('./chat');
require('./round');

registerAllCommands();