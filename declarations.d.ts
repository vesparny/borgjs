interface RunParallel {
   (tasks: Array<Function>, callback: () => void): void
}

declare module 'run-parallel' {
	const run: RunParallel
  export = run
}



declare module 'execa' {
	function execa(command: string, options: string[]): Promise<void>
  export = execa
}

/*
declare module 'run-parallel' {
	function run(callbacks: Function[], callback: () => any): void;
  export = run
}
*/
