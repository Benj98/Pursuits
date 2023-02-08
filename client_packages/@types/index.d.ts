declare global {
	interface PlayerMp {
		customProperty: number;

		customMethod(): void;
	}

	interface Command {
		name: string;
		description: string;
		alias?: string;
		level: number;
		execute: (player: PlayerMp, args: string[]) => void;
	}

	interface CommandLibrary {
		registerCommand(command: Command): void;
		getCommands(): Command[];
		executeCommand(player: PlayerMp, command: string, args: string[]): void;
	}
}

export {};
