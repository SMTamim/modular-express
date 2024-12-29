import fs from 'fs-extra';
import * as path from 'path';
import { exec } from 'child_process';
import * as vscode from 'vscode';
import AdmZip from 'adm-zip';

export const createNewExpressProject = vscode.commands.registerCommand('modular-express.createNewExpressProject', async () => {
  // Prompt for project name
  const projectName = await vscode.window.showInputBox({
    prompt: 'Enter the project name',
    validateInput: (input) => input ? null : 'Project name cannot be empty',
  });

  if (!projectName) { return; }

  // Prompt for project description
  const projectDescription = await vscode.window.showInputBox({
    prompt: 'Enter the project description (optional)',
  });

  // Ask for folder to create project
  const folderUri = await vscode.window.showOpenDialog({
    canSelectFolders: true,
    canSelectFiles: false,
    canSelectMany: false,
    openLabel: 'Select folder for the project',
  });

  if (!folderUri || folderUri.length === 0) {
    vscode.window.showErrorMessage('No folder selected.');
    return;
  }

  const projectPath = path.join(folderUri[0].fsPath, projectName);
  if (fs.existsSync(projectPath)) {
    vscode.window.showErrorMessage('A project with this name already exists in the selected folder.');
    return;
  }

  fs.mkdirSync(projectPath);

  vscode.window.showInformationMessage(`Creating project ${projectName}...`);

  // Initialize the package.json file
  const packageJson = {
    name: projectName,
    version: '1.0.0',
    description: projectDescription || '',
    main: 'index.js',
    scripts: {
      build: 'tsc',
      prod: 'node ./dist/server.js',
      dev: 'ts-node-dev --respawn --transpile-only src/server.ts',
      lint: 'eslint src',
      format: 'prettier --ignore-path .gitignore --write "**/*.+(js|ts|json)"',
      'format:fix': 'npx prettier --write src',
      test: 'echo "Error: no test specified" && exit 1',
    },
    dependencies: {},
    devDependencies: {},
  };

  fs.writeFileSync(path.join(projectPath, 'package.json'), JSON.stringify(packageJson, null, 2));

  // Extract templates/src.zip into projectPath
  const zipFilePath = path.join(__dirname, 'templates', 'src.zip');

  try {
    const zip = new AdmZip(zipFilePath);
    zip.extractAllTo(projectPath, true);
    vscode.window.showInformationMessage('Project template extracted successfully!');
  } catch (error) {
    if (error instanceof Error) {
      vscode.window.showErrorMessage(`Error extracting template: ${error.message}`);
    }
  }

  // Install dependencies and devDependencies after opening the project
  const installDependencies = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      const dependencies = ['express', 'cors', 'mongoose', 'zod', 'dotenv', 'cookie-parser', 'http-status@1.6.2'];
      const devDependencies = ['typescript', 'ts-node-dev', 'prettier', 'eslint', 'typescript-eslint', 'eslint-plugin-prettier', 'eslint-config-prettier', '@types/node', '@types/express', '@types/cors'];

      // Install regular dependencies
      exec(`npm install ${dependencies.join(' ')}`, { cwd: projectPath }, (err, stdout, stderr) => {
        if (err) {
          vscode.window.showErrorMessage('Failed to install dependencies');
          console.error(stderr);
          reject(err);
          return;
        }
        vscode.window.showInformationMessage('Project dependencies installed successfully. Installing devDependencies...');
        // Install dev dependencies after regular dependencies complete
        exec(`npm install -D ${devDependencies.join(' ')}`, { cwd: projectPath }, (err, stdout, stderr) => {
          if (err) {
            vscode.window.showErrorMessage('Failed to install devDependencies');
            console.error(stderr);
            reject(err);
            return;
          }
          vscode.window.showInformationMessage('All Dependencies installed successfully');
          resolve();
        });
      });
    });
  };

  vscode.window.showInformationMessage('Installing dependencies. This might take a while...');

  // Wait for dependencies to be installed
  await installDependencies();


  // Generate additional config files
  const tsConfig = {
    compilerOptions: {
      outDir: './dist',
      module: 'commonjs',
      target: 'ES6',
      esModuleInterop: true,
      strict: true,
      baseUrl: './',
    },
    include: ['src/**/*'],
  };
  fs.writeFileSync(path.join(projectPath, 'tsconfig.json'), JSON.stringify(tsConfig, null, 2));

  vscode.window.showInformationMessage(`Project ${projectName} created successfully!`);

  // Open project in a new VS Code window
  await vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(projectPath), true);
});
