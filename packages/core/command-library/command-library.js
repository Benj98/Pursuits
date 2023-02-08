const commands = new Map();
const adminCommands = new Map();

console.log('command-library loaded')

class Command {
    constructor(name, description, usage, alias, callback) {
        this.name = name;
        this.description = description;
        this.usage = usage;
        this.alias = alias;
        this.callback = callback;
    }
}

class AdminCommand {
    constructor(name, description, usage, alias, callback, permissionLevel) {
      this.name = name;
      this.description = description;
      this.usage = usage;
      this.alias = alias;
      this.callback = callback;
      this.permissionLevel = permissionLevel;
    }
}

function registerCommand(name, description, usage, alias, callback) {
    if (!name || !callback) return;
    let command = new Command(name, description, usage, alias, callback);
    commands.set(name, command);
    if(alias) {
        for (const a of alias) {
            commands.set(a, command);
        }
    }
}

function registerAdminCommand(name, description, usage, alias, callback, permissionLevel) {
    if (!name || !callback) return;
    let command = new AdminCommand(name, description, usage, alias, callback, permissionLevel);
    adminCommands.set(name, command);
    if (alias) {
      for (const a of alias) {
        adminCommands.set(a, command);
      }
    }
}

function executeCommand(player, name, args) {
    let command = commands.get(name);
    if(!command) return;
    command.callback(player, args);
}

function executeAdminCommand(player, name, args) {
    let command = adminCommands.get(name);
    if (!command) return;
    if (player.getVariable('adminLevel') >= command.permissionLevel) {
      command.callback(player, args);
    } else {
      player.outputChatBox(`You do not not have sufficient permissions to execute the ${name} command.`);
    }
  }

function registerAllCommands() {
    for (const [key, value] of commands) {
      mp.events.addCommand(key, (player, fullText, ...args) => {
        executeCommand(player, key, args);
      });
    }
  
    for (const [key, value] of adminCommands) {
      mp.events.addCommand(key, (player, fullText, ...args) => {
        executeAdminCommand(player, key, args);
      });
    }
}

module.exports = {
    registerAdminCommand,
    registerCommand,
    registerAllCommands,
    adminCommands
}