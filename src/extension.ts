// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { createNewExpressProject } from './createNewExpressProject/createNewExpressProject';
import { createNewModule } from './createNewModule/createNewModule';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log('"modular-express" is now active!');

	context.subscriptions.push(createNewExpressProject, createNewModule);
}

// This method is called when your extension is deactivated
export function deactivate() { }
